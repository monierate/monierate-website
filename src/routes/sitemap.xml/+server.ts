import type { RequestHandler } from './$types';
import { serverApiRequest } from '$lib/api/server';
import * as CountriesData from '$data/countries.json';
import blogPosts from '$lib/blog/posts.json';
import { getPublishedCollections } from '$lib/server/collections';
import { isRenderablePair, isUsableQuote, parsePairCode } from '$lib/utils/pairs';
import { getLatestRates } from '$lib/api/accountApi';
import { conversionPath } from '$lib/utils/conversionSlug';
import { LADDER_AMOUNTS } from '$lib/utils/amountLadder';

/**
 * Dynamic, SEO- and AI-SEO-friendly sitemap.
 *
 * Design goals:
 *  - Only canonical, indexable URLs (no query parameters, no duplicates).
 *  - Accurate <lastmod> where we know it (blog posts, rate pages).
 *  - Deliberately EXCLUDES rate-comparison pages ("/compare", "/buy|sell|send|card")
 *    and price-alert pages ("/alerts*"), which are interactive/thin and not meant
 *    for organic discovery.
 *
 * Served as a Cloudflare worker route so <lastmod> is always current.
 */

const SITE = 'https://monierate.com';

/**
 * Held back on request: the provider profile, spread, and history pages stay out
 * of the sitemap until their public clones ship, so only /markets/:pair,
 * /markets/:pair/insight, and /markets/:pair/:provider are submitted. Flip to
 * true to include them — the pages themselves are indexable either way (no
 * noindex tag).
 */
const SUBMIT_SECONDARY_MARKETS_PAGES = false;

/**
 * Sitemaps must stay under 50,000 URLs. We emit a few hundred (see docs/seo.md),
 * so a single file is correct; this guard surfaces the day that stops being true.
 */
const MAX_URLS_PER_SITEMAP = 50_000;

type ChangeFreq =
	| 'always'
	| 'hourly'
	| 'daily'
	| 'weekly'
	| 'monthly'
	| 'yearly'
	| 'never';

interface Entry {
	path: string;
	lastmod?: string;
	changefreq?: ChangeFreq;
	priority?: number;
}

/* Eagerly bundle the bank datasets so enumeration needs no filesystem/network. */
const bankCodeFiles = import.meta.glob('/src/data/bank-codes/*-bank-codes.json', {
	eager: true,
	import: 'default'
}) as Record<string, Record<string, { ussd?: unknown; swift?: unknown[] }>>;

const bankFiles = import.meta.glob('/src/data/banks/*-banks.json', {
	eager: true,
	import: 'default'
}) as Record<string, Record<string, unknown>>;

const countries = CountriesData as unknown as Record<string, string>;

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

/** Extract the ISO country code from a glob key like `/src/data/bank-codes/ng-bank-codes.json`. */
function countryCodeFromKey(key: string, suffix: string): string {
	const file = key.split('/').pop() ?? '';
	return file.replace(suffix, '');
}

async function fetchChangerCodes(): Promise<
	{ code: string; lastmod?: string; ownPairCodes: string[] }[]
> {
	try {
		const res = await serverApiRequest<{ result?: any[]; count?: number }>(
			'/changers/get_all_changers',
			{ params: { page: 1, limit: 500 }, timeoutMs: 8000, retries: 1 }
		);

		if (!res.success || !res.data?.result) return [];

		return res.data.result
			.filter((c) => c?.is_active && typeof c.code === 'string')
			.map((c) => ({
				code: c.code as string,
				lastmod: c.updatedAt ? new Date(c.updatedAt).toISOString() : undefined,
				ownPairCodes: Object.entries(c.pairs ?? {})
					.filter(([, p]: [string, any]) => isUsableQuote(p))
					.map(([code]) => code)
			}));
	} catch {
		return [];
	}
}

async function fetchPairs(): Promise<{
	codes: string[];
	/** Active and actually priced — the corridors the converter can lead with. */
	liveCodes: string[];
	changerPairs: Map<string, string[]>;
}> {
	const empty = { codes: [], liveCodes: [], changerPairs: new Map<string, string[]>() };

	try {
		const res = await serverApiRequest<{ result?: any[] }>('/pairs/get_all_pairs', {
			params: { page: 1, limit: 200 },
			timeoutMs: 8000,
			retries: 1
		});

		if (!res.success || !res.data?.result) return empty;

		const changerPairs = new Map<string, string[]>();

		for (const pair of res.data.result) {
			for (const changer of pair?.changers ?? []) {
				if (!changer?.is_public || !isUsableQuote(changer)) continue;
				changerPairs.set(changer.changer_code, [
					...(changerPairs.get(changer.changer_code) ?? []),
					pair.code
				]);
			}
		}

		const named = res.data.result.filter((p) => typeof p?.code === 'string');

		return {
			codes: named.map((p) => p.code as string),
			liveCodes: named
				.filter((p) => p?.is_active === true && Number(p?.price?.current) > 0)
				.map((p) => p.code as string),
			changerPairs
		};
	} catch {
		return empty;
	}
}

/**
 * Currencies the mid market can actually quote against USD.
 *
 * The converter's global reach is exactly this set — a corridor outside it renders
 * a noindexed "no rate" state, and listing those would fill the sitemap with soft
 * 404s. An empty set means the lookup failed or no key is configured; the caller
 * then falls back to the corridors it knows from the pairs feed rather than
 * dropping every converter URL.
 */
async function fetchMidQuoteCodes(): Promise<Set<string>> {
	try {
		const rates = await getLatestRates('USD', 'mid');
		if (!rates?.rates) return new Set();

		return new Set(
			Object.entries(rates.rates)
				.filter(([, value]) => Number(value) > 0)
				.map(([code]) => code.toLowerCase())
		);
	} catch {
		return new Set();
	}
}

async function fetchCurrencyCodes(): Promise<Set<string>> {
	try {
		const res = await serverApiRequest<any[]>('/currencies/get_all_currencies', {
			params: { page: 1, limit: 100 },
			timeoutMs: 8000,
			retries: 1
		});

		if (!res.success || !Array.isArray(res.data)) return new Set();

		return new Set(res.data.map((c: any) => String(c?.code ?? '').toLowerCase()));
	} catch {
		return new Set();
	}
}

interface PairProviderCombo {
	pair: string;
	providerCode: string;
	lastmod?: string;
}

/**
 * Enumerate live pair × provider combinations from the v1 rates API — the
 * same source /markets/:pair/:provider reads from. Scoped to the
 * last 30-minute window (the endpoint's own freshness bar) so every listed
 * URL is guaranteed to resolve rather than 404 on a long-stale pair.
 */
async function fetchPairProviderCombos(): Promise<PairProviderCombo[]> {
	try {
		const res = await serverApiRequest<{ rates?: any[] }>('/v1/rates/current', {
			params: { limit: 1000 },
			timeoutMs: 8000,
			retries: 1
		});

		if (!res.success || !res.data?.rates) return [];

		return res.data.rates
			.filter((r) => typeof r?.pair === 'string' && typeof r?.provider_id === 'string')
			.map((r) => ({
				pair: r.pair as string,
				providerCode: r.provider_id as string,
				lastmod: r.timestamp ? new Date(r.timestamp).toISOString() : undefined
			}));
	} catch {
		return [];
	}
}

/**
 * Currencies the global converter matrix is built from, most-searched first.
 *
 * Deliberately a hand-picked list rather than "every currency we can quote": the
 * mid market can price hundreds of combinations, and submitting the cross product
 * would be tens of thousands of near-identical pages competing with each other.
 * These are the ones with real search demand, and each is intersected with what
 * the mid market actually holds before it is listed.
 */
const CONVERTER_MAJORS = [
	'usd', 'eur', 'gbp', 'ngn', 'cad', 'aud', 'jpy', 'cny', 'chf', 'inr',
	'aed', 'zar', 'ghs', 'kes', 'brl', 'sgd', 'egp', 'xof', 'xaf', 'usdt'
];

/** Bases the matrix radiates from — where the "convert X to anything" demand sits. */
const CONVERTER_MATRIX_BASES = ['usd', 'eur', 'gbp'];

/**
 * Converter URLs.
 *
 * Three tiers, narrowing as cardinality grows:
 *
 * 1. Every live corridor, both directions — the pages that carry an exchange
 *    comparison table and so show something no other converter can.
 * 2. A curated global matrix, intersected with what the mid market can price.
 * 3. Ladder amounts, but only on tier 1. `/converter/500-usd-to-ngn` is a real
 *    query; `/converter/500-gbp-to-xaf` is not, and amount pages multiply by 11.
 *
 * Only ladder amounts are listed, because `converterSeo` noindexes every other
 * amount — advertising a page we ask Google to drop is worse than not listing it.
 */
function converterEntries(
	livePairCodes: string[],
	currencyCodes: Set<string>,
	midQuoteCodes: Set<string>,
	now: string
): Entry[] {
	const entries: Entry[] = [];
	const seen = new Set<string>();

	const push = (path: string, priority: number, changefreq: ChangeFreq) => {
		if (seen.has(path)) return;
		seen.add(path);
		entries.push({ path, changefreq, priority, lastmod: now });
	};

	/* --- Tier 1: live corridors, both directions --- */
	const corridors: { from: string; to: string }[] = [];

	for (const code of livePairCodes) {
		if (currencyCodes.size > 0 && !isRenderablePair(code, currencyCodes)) continue;

		const { base, quote } = parsePairCode(code);
		if (!base || !quote || base === quote) continue;

		corridors.push({ from: base, to: quote }, { from: quote, to: base });
	}

	for (const { from, to } of corridors) {
		push(conversionPath(1, from, to), 0.8, 'hourly');
	}

	/* --- Tier 2: the global matrix, only where the mid market can price it --- */
	if (midQuoteCodes.size > 0) {
		for (const base of CONVERTER_MATRIX_BASES) {
			for (const quote of CONVERTER_MAJORS) {
				if (base === quote) continue;
				// USD is the pivot the mid document is stored against, so it never
				// appears as one of its own quotes — but it is always priceable.
				if (quote !== 'usd' && !midQuoteCodes.has(quote)) continue;
				if (base !== 'usd' && !midQuoteCodes.has(base)) continue;

				push(conversionPath(1, base, quote), 0.7, 'daily');
				push(conversionPath(1, quote, base), 0.6, 'daily');
			}
		}
	}

	/* --- Tier 3: ladder amounts on the live corridors only --- */
	for (const { from, to } of corridors) {
		for (const amount of LADDER_AMOUNTS) {
			// 1 is the corridor page itself, already listed above.
			if (amount === 1) continue;
			push(conversionPath(amount, from, to), 0.5, 'daily');
		}
	}

	return entries;
}

function buildEntries(
	changers: { code: string; lastmod?: string; hasRate: boolean }[],
	pairProviderCombos: PairProviderCombo[],
	pairCodes: string[],
	livePairCodes: string[],
	collectionSlugs: string[],
	currencyCodes: Set<string>,
	midQuoteCodes: Set<string>
): Entry[] {
	const now = new Date().toISOString();
	const entries: Entry[] = [];

	/* --- Core hub pages --- */
	entries.push(
		{ path: '/', changefreq: 'daily', priority: 1.0, lastmod: now },
		{ path: '/converter', changefreq: 'daily', priority: 0.9, lastmod: now },
		{ path: '/blog', changefreq: 'daily', priority: 0.7 },
		{ path: '/api', changefreq: 'monthly', priority: 0.6 },
		{ path: '/pricing', changefreq: 'monthly', priority: 0.6 },
		{ path: '/bank-codes', changefreq: 'weekly', priority: 0.6 },
		{ path: '/bank-codes/ussd', changefreq: 'weekly', priority: 0.5 },
		{ path: '/tools/banking/nuban-validation', changefreq: 'monthly', priority: 0.5 }
	);

	/* --- FX / market rate pages (rates refresh frequently) --- */
	for (const seg of ['parallel', 'official', 'global']) {
		entries.push({
			path: `/fx/${seg}`,
			changefreq: 'hourly',
			priority: 0.9,
			lastmod: now
		});
	}

	/* --- Stablecoin Spread Index + exchange rate history hubs --- */
	if (SUBMIT_SECONDARY_MARKETS_PAGES) {
		entries.push({ path: '/markets/spread', changefreq: 'hourly', priority: 0.8, lastmod: now });
		entries.push({ path: '/markets/history', changefreq: 'daily', priority: 0.75, lastmod: now });
	}

	/* --- Discover rate pages --- */
	for (const seg of [
		'bank-rates',
		'money-transfer-rate',
		'offramp-rates',
		'usd-accounts-rates',
		'virtualcard-rates',
		'liquidity-rates',
		'highlights'
	]) {
		entries.push({ path: `/${seg}`, changefreq: 'daily', priority: 0.7, lastmod: now });
	}

	/* --- Exchange directory: the index and every collection that clears the
	   thin-page threshold. Combos below it 404 by design, so listing them here
	   would submit dead URLs.

	   The index entry is commented out while the directory layer is disabled
	   (COLLECTIONS_ENABLED) — the page itself 404s under the same flag, so
	   submitting it would submit a dead URL. Uncomment it with the flag. The
	   per-changer profiles below are unaffected, and collectionSlugs is empty
	   while the flag is off. --- */
	// entries.push({ path: '/exchanges', changefreq: 'weekly', priority: 0.7, lastmod: now });

	for (const slug of collectionSlugs) {
		entries.push({
			path: `/exchanges/${slug}`,
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: now
		});
	}

	/* --- Currency converter: corridors, the global matrix, and ladder amounts --- */
	entries.push(...converterEntries(livePairCodes, currencyCodes, midQuoteCodes, now));

	/* --- Per-exchange landing pages (canonical, no query params) --- */
	for (const { code, lastmod, hasRate } of changers) {
		// Without a live quote the converter page renders a noindexed "no rate" state,
		// so don't advertise it. The exchange profile still stands on its own.
		if (hasRate) {
			entries.push({
				path: `/converter/${code}`,
				changefreq: 'daily',
				priority: 0.7,
				lastmod: lastmod ?? now
			});
		}
		entries.push({
			path: `/exchanges/${code}`,
			changefreq: 'weekly',
			priority: 0.6,
			lastmod
		});
		if (SUBMIT_SECONDARY_MARKETS_PAGES) {
			entries.push({
				path: `/markets/providers/${code}`,
				changefreq: 'hourly',
				priority: 0.6,
				lastmod
			});
		}
	}

	/* --- Per-pair OHLC hub pages (one per supported pair) --- */
	for (const code of pairCodes) {
		entries.push({
			path: `/markets/${code}`,
			changefreq: 'hourly',
			priority: 0.65,
			lastmod: now
		});
		entries.push({
			path: `/markets/${code}/insight`,
			changefreq: 'hourly',
			priority: 0.6,
			lastmod: now
		});
	}

	/* --- Per-pair × per-provider long-tail pages (high cardinality; SSR on demand, not prerendered) --- */
	for (const { pair, providerCode, lastmod } of pairProviderCombos) {
		entries.push({
			path: `/markets/${pair}/${providerCode}`,
			changefreq: 'hourly',
			priority: 0.5,
			lastmod: lastmod ?? now
		});
	}

	/* --- Country bank pages: USSD + SWIFT hubs and long-tail per-bank pages --- */
	for (const key of Object.keys(bankCodeFiles)) {
		const cc = countryCodeFromKey(key, '-bank-codes.json');
		if (!countries[cc.toUpperCase()]) continue;

		const bankCodes = bankCodeFiles[key] ?? {};
		const banks = bankFiles[`/src/data/banks/${cc}-banks.json`] ?? {};

		// Country hub pages
		entries.push(
			{ path: `/${cc}/ussd-codes`, changefreq: 'weekly', priority: 0.6 },
			{ path: `/${cc}/ussd-codes/banks`, changefreq: 'weekly', priority: 0.5 },
			{ path: `/${cc}/swift-codes`, changefreq: 'weekly', priority: 0.6 },
			{ path: `/${cc}/swift-codes/providers`, changefreq: 'weekly', priority: 0.5 }
		);

		for (const [bankId, data] of Object.entries(bankCodes)) {
			if (!banks[bankId]) continue; // page 404s without matching bank record

			const hasUssd = data?.ussd && Object.keys(data.ussd).length > 0;
			const hasSwift = Array.isArray(data?.swift) && data.swift.length > 0;

			if (hasUssd) {
				entries.push({
					path: `/${cc}/ussd-codes/banks/${bankId}`,
					changefreq: 'monthly',
					priority: 0.5
				});
			}
			if (hasSwift) {
				entries.push({
					path: `/${cc}/swift-codes/providers/${bankId}`,
					changefreq: 'monthly',
					priority: 0.5
				});
			}
		}
	}

	/* --- Blog posts (accurate lastmod from post metadata) --- */
	for (const post of blogPosts as any[]) {
		if (!post?.published || !post?.slug) continue;
		entries.push({
			path: `/blog/${post.slug}`,
			changefreq: 'monthly',
			priority: 0.6,
			lastmod: new Date(post.updatedAt ?? post.createdAt ?? now).toISOString()
		});
	}

	/* --- Policy / legal pages --- */
	for (const slug of ['add-your-rate', 'data']) {
		entries.push({ path: `/policy/${slug}`, changefreq: 'yearly', priority: 0.3 });
	}

	return entries;
}

function renderXml(entries: Entry[]): string {
	const urls = entries
		.map((e) => {
			const parts = [`    <loc>${escapeXml(SITE + e.path)}</loc>`];
			if (e.lastmod) parts.push(`    <lastmod>${e.lastmod}</lastmod>`);
			if (e.changefreq) parts.push(`    <changefreq>${e.changefreq}</changefreq>`);
			if (e.priority !== undefined)
				parts.push(`    <priority>${e.priority.toFixed(1)}</priority>`);
			return `  <url>\n${parts.join('\n')}\n  </url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export const GET: RequestHandler = async () => {
	const [changers, pairProviderCombos, pairs, currencyCodes, collections, midQuoteCodes] =
		await Promise.all([
			fetchChangerCodes(),
			fetchPairProviderCombos(),
			fetchPairs(),
			fetchCurrencyCodes(),
			getPublishedCollections().catch(() => []),
			fetchMidQuoteCodes()
		]);

	// Mirrors what /converter/:changer will actually render: a quote in either source,
	// on a pair whose currencies we can name. A failed currency fetch fails open, so a
	// flaky call drops coverage rather than silently deleting every converter URL.
	const canRender = (pairCode: string) =>
		currencyCodes.size === 0 || isRenderablePair(pairCode, currencyCodes);

	const hasRate = (c: { code: string; ownPairCodes: string[] }) =>
		[...c.ownPairCodes, ...(pairs.changerPairs.get(c.code) ?? [])].some(canRender);

	const entries = buildEntries(
		changers.map((c) => ({ ...c, hasRate: hasRate(c) })),
		pairProviderCombos,
		pairs.codes,
		pairs.liveCodes,
		collections.map(({ collection }) => collection.slug),
		currencyCodes,
		midQuoteCodes
	);

	if (entries.length > MAX_URLS_PER_SITEMAP) {
		// Split into a sitemap index before shipping past this; a truncated sitemap
		// silently drops URLs, so make the cause loud rather than lose coverage.
		console.error(
			`sitemap.xml: ${entries.length} URLs exceeds the ${MAX_URLS_PER_SITEMAP} limit — split into a sitemap index.`
		);
	}

	const xml = renderXml(entries);

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			// Cache at the edge for an hour; crawlers still get fresh lastmod hourly.
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
};
