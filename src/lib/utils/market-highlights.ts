import type { ProviderRate } from '$lib/types';
import type { ChangerMeta } from '$lib/types/pairMarket';
import type { CurrentRate } from '$lib/services/currency/v1/rates';
import { toProviderRateFromCurrent } from '$lib/utils/pairs';

// 'sell'/'buy' show a single headline rate; 'card' shows Deposit/Withdrawal columns.
export type HighlightMode = 'sell' | 'buy' | 'card';

// Default number of rows shown on the overview card (the "View all" page is unbounded).
export const HIGHLIGHT_PREVIEW_LIMIT = 5;

// A quote older than this is considered stale and is ranked below fresh quotes.
const FRESH_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

// Build the ProviderRate set from current rates + changer metadata. Mirrors the
// filtering the overview previously did inline: drop empty quotes and non-public
// providers, then map to the UI ProviderRate shape.
export function buildProviders(
	currentRates: CurrentRate[],
	changerMap: Map<string, ChangerMeta>
): ProviderRate[] {
	return currentRates
		.filter((r) => r.rate_buy > 0 || r.rate_sell > 0)
		.filter((r) => changerMap.get(r.provider_id)?.is_public !== false)
		.map((r) => toProviderRateFromCurrent(r, changerMap.get(r.provider_id)));
}

export interface RankOptions {
	// Cap the returned list (0/undefined = full list).
	limit?: number;
	// Index contributors are pinned to the top for quality, ahead of everyone
	// else regardless of rate — see the ordering in rankProviders.
	contributorIds?: Set<string>;
}

// Rank providers by, in order of precedence:
//   1. index contributors first (quality gate — even if a non-contributor's rate is better),
//   2. fresh quotes (updated within FRESH_WINDOW_MS) ahead of stale ones, so the
//      section never shows a lagging rate at the top when a fresh one exists,
//   3. the supplied rate comparator (best rate first).
// Quotes with no timestamp are treated as fresh.
export function rankProviders(
	list: ProviderRate[],
	cmp: (a: ProviderRate, b: ProviderRate) => number,
	opts: RankOptions = {}
): ProviderRate[] {
	const { limit, contributorIds } = opts;
	const cutoff = Date.now() - FRESH_WINDOW_MS;
	const isFresh = (p: ProviderRate) => p.lastUpdated === 0 || p.lastUpdated >= cutoff;
	const contribRank = (p: ProviderRate) => (contributorIds?.has(p.id) ? 0 : 1);
	const freshRank = (p: ProviderRate) => (isFresh(p) ? 0 : 1);

	const ranked = [...list].sort((a, b) => {
		const c = contribRank(a) - contribRank(b);
		if (c !== 0) return c;
		const f = freshRank(a) - freshRank(b);
		if (f !== 0) return f;
		return cmp(a, b);
	});
	return limit && limit > 0 ? ranked.slice(0, limit) : ranked;
}

const norm = (t: string) => t.toLowerCase().replace(/[-_\s]/g, '');

function byTag(
	providers: ProviderRate[],
	wanted: string[],
	rateKey: 'buy' | 'sell',
	opts?: RankOptions
): ProviderRate[] {
	const want = new Set(wanted.map(norm));
	const cmp =
		rateKey === 'sell'
			? (a: ProviderRate, b: ProviderRate) => b.sell - a.sell
			: (a: ProviderRate, b: ProviderRate) => a.buy - b.buy;
	const matched = providers.filter((p) => p.tags.some((t) => want.has(norm(t))) && p[rateKey] > 0);
	return rankProviders(matched, cmp, opts);
}

export interface HighlightDef {
	slug: string;
	title: string;
	sublabel: string;
	mode: HighlightMode;
	// When true, the highlight is only shown for crypto/stablecoin bases.
	cryptoOnly?: boolean;
	compute: (providers: ProviderRate[], opts?: RankOptions) => ProviderRate[];
}

export const HIGHLIGHT_DEFS: Record<string, HighlightDef> = {
	'best-to-sell': {
		slug: 'best-to-sell',
		title: 'Best to sell',
		sublabel: 'Best buying providers · highest rate',
		mode: 'sell',
		compute: (p, opts) => rankProviders(p.filter((x) => x.sell > 0), (a, b) => b.sell - a.sell, opts),
	},
	'best-to-buy': {
		slug: 'best-to-buy',
		title: 'Best to buy',
		sublabel: 'Best selling providers · lowest rate',
		mode: 'buy',
		compute: (p, opts) => rankProviders(p.filter((x) => x.buy > 0), (a, b) => a.buy - b.buy, opts),
	},
	offramp: {
		slug: 'offramp',
		title: 'Offramp',
		sublabel: 'Crypto → fiat · highest sell rate',
		mode: 'sell',
		cryptoOnly: true,
		compute: (p, opts) => byTag(p, ['offramp'], 'sell', opts),
	},
	onramp: {
		slug: 'onramp',
		title: 'Onramp',
		sublabel: 'Fiat → crypto · lowest buy rate',
		mode: 'buy',
		cryptoOnly: true,
		compute: (p, opts) => byTag(p, ['onramp'], 'buy', opts),
	},
	remittance: {
		slug: 'remittance',
		title: 'Remittance',
		sublabel: 'Cross-border money transfer',
		mode: 'sell',
		compute: (p, opts) => byTag(p, ['remittance', 'money-transfer'], 'sell', opts),
	},
	'virtual-card': {
		slug: 'virtual-card',
		title: 'Virtual Card',
		sublabel: 'Card funding & withdrawal',
		mode: 'card',
		compute: (p, opts) => {
			const want = new Set(['virtualcard', 'virtual-card'].map(norm));
			const matched = p.filter((x) => x.tags.some((t) => want.has(norm(t))) && (x.buy > 0 || x.sell > 0));
			return rankProviders(matched, (a, b) => (b.sell || b.buy) - (a.sell || a.buy), opts);
		},
	},
};

export const DIRECTION_SLUGS = ['best-to-sell', 'best-to-buy'] as const;
export const CATEGORY_SLUGS = ['offramp', 'onramp', 'remittance', 'virtual-card'] as const;
