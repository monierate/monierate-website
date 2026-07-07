import type { RequestHandler } from './$types';
import { serverApiRequest } from '$lib/api/server';
import * as CountriesData from '$data/countries.json';
import blogPosts from '$lib/blog/posts.json';

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

async function fetchChangerCodes(): Promise<{ code: string; lastmod?: string }[]> {
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
				lastmod: c.updatedAt ? new Date(c.updatedAt).toISOString() : undefined
			}));
	} catch {
		return [];
	}
}

function buildEntries(changers: { code: string; lastmod?: string }[]): Entry[] {
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

	/* --- Discover rate pages --- */
	for (const seg of [
		'bank-rates',
		'money-transfer-rate',
		'offramp-rates',
		'usd-accounts-rates',
		'virtualcard-rates',
		'highlights'
	]) {
		entries.push({ path: `/${seg}`, changefreq: 'daily', priority: 0.7, lastmod: now });
	}

	/* --- Per-exchange landing pages (canonical, no query params) --- */
	for (const { code, lastmod } of changers) {
		entries.push({
			path: `/converter/${code}`,
			changefreq: 'daily',
			priority: 0.7,
			lastmod: lastmod ?? now
		});
		entries.push({
			path: `/exchanges/${code}`,
			changefreq: 'weekly',
			priority: 0.6,
			lastmod
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
	const changers = await fetchChangerCodes();
	const xml = renderXml(buildEntries(changers));

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			// Cache at the edge for an hour; crawlers still get fresh lastmod hourly.
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
};
