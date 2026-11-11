import type { PageServerLoad } from './$types';
import { getAllPairs } from '$lib/services/pair.service';
import { parsePairCode } from '$lib/utils/pairs';
import { pairLabel, sortPairs, currencyName, type MarketCard } from '$lib/utils/marketPairs';
import {
	SITE,
	DEFAULT_OG_IMAGE,
	breadcrumbJsonLd,
	collectionPageJsonLd,
	itemListJsonLd,
	type SeoMeta
} from '$lib/utils/seo';

/**
 * The markets hub: every pair with a live rate, as a grid. Reads the same pairs
 * list the /markets/[code] switcher does (one request, public providers only).
 */
export const load: PageServerLoad = async ({ fetch }) => {
	const res = await getAllPairs(fetch, undefined, 1, 200).catch(() => null);
	const raw: any[] = Array.isArray(res?.result) ? res.result : [];

	const cards: MarketCard[] = sortPairs(
		raw
			// Active, with a public provider, as the switcher requires; and with a rate,
			// since a card without one has nothing to show (AUD/NGN and JPY/NGN have
			// providers listed but no rate yet).
			.filter((p) => p?.code && p.is_active !== false && p.changers?.length > 0 && Number(p.price?.current) > 0)
			.map((p): MarketCard => {
				const code = String(p.code).toLowerCase();
				const { base, quote } = parsePairCode(code);
				const prev = Number(p.price_24hr) || 0;
				return {
					code,
					base: base.toUpperCase(),
					quote: quote.toUpperCase(),
					rate: Number(p.price.current),
					change24h: prev > 0 ? Number(p.price_change_percent_24hr) || 0 : null,
					providers: p.changers.length,
					updatedAt: p.updatedAt ?? null
				};
			})
	);

	const updatedAt = cards.reduce<string | null>(
		(latest, c) => (c.updatedAt && (!latest || c.updatedAt > latest) ? c.updatedAt : latest),
		null
	);

	const title = `Currency Markets: ${cards.length} Exchange Rate Pairs | Monierate`;
	const description =
		'Live exchange rates for every currency pair Monierate tracks, across the naira, rand, shilling, cedi and CFA franc. Compare dollar, stablecoin and crypto rates from exchanges, P2P desks and money transfer apps.';
	const canonical = `${SITE}/markets`;

	const seo: SeoMeta = {
		title,
		description,
		canonical,
		ogImage: DEFAULT_OG_IMAGE,
		jsonLd: [
			collectionPageJsonLd({ name: 'Currency Markets', description, url: canonical, modified: updatedAt ?? undefined }),
			breadcrumbJsonLd([], { name: 'Markets', path: '/markets' }),
			itemListJsonLd(
				'Currency pairs tracked by Monierate',
				cards.map((c) => ({
					name: `${pairLabel(c)} (${currencyName(c.base)} to ${currencyName(c.quote)})`,
					url: `${SITE}/markets/${c.code}`
				}))
			)
		]
	};

	return { cards, updatedAt, seo };
};
