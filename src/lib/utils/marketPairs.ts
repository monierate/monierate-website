import currencies from '$data/currencies.json';

/**
 * Ordering, grouping and search for lists of pairs: the /markets grid and the
 * pair switcher on /markets/[code]. Both list every live pair, so they share one
 * order (majors first) and one search, and a visitor who searches "rand" in one
 * finds the same pairs in the other.
 */

export interface MarketPair {
	/** Lowercase pair code, e.g. `usdtzar`. */
	code: string;
	/** Uppercase currency codes, e.g. `USDT` / `ZAR`. */
	base: string;
	quote: string;
}

/** A pair as the /markets grid shows it. */
export interface MarketCard extends MarketPair {
	/** Monierate's current rate for the pair. */
	rate: number;
	/** Percent move over 24 hours; null when there is no rate from 24 hours ago to compare with. */
	change24h: number | null;
	/** Providers whose rate for the pair is public. */
	providers: number;
	updatedAt: string | null;
}

export interface MarketGroup {
	key: string;
	label: string;
	/** Quote currencies the group holds. Empty on the catch-all group. */
	quotes: string[];
}

/**
 * Groups by quote currency, the market a visitor is pricing in. The CFA francs
 * share a group (XAF and XOF are pegged to each other at par); anything else
 * falls into the last group.
 */
export const MARKET_GROUPS: MarketGroup[] = [
	{ key: 'NGN', label: 'Nigerian Naira', quotes: ['NGN'] },
	{ key: 'ZAR', label: 'South African Rand', quotes: ['ZAR'] },
	{ key: 'KES', label: 'Kenyan Shilling', quotes: ['KES'] },
	{ key: 'GHS', label: 'Ghanaian Cedi', quotes: ['GHS'] },
	{ key: 'CFA', label: 'CFA Franc', quotes: ['XAF', 'XOF'] },
	{ key: 'OTHER', label: 'Stablecoins & other', quotes: [] }
];

const OTHER_GROUP = MARKET_GROUPS[MARKET_GROUPS.length - 1];

/** Bases in the order a reader looks for them: the dollar, its stablecoins, the majors, crypto. */
const BASE_RANK = ['USD', 'USDT', 'EUR', 'GBP', 'USDC', 'BTC', 'ETH', 'CAD', 'AUD', 'JPY', 'CNY', 'AED'];

const NAMES: Record<string, string> = {
	...currencies.fiat,
	...currencies.coins,
	CNGN: 'Naira Stablecoin'
};

export const currencyName = (code: string): string => NAMES[code.toUpperCase()] ?? code.toUpperCase();

/** How a currency code is written on screen. cNGN's lowercase `c` is part of its name. */
export const displayCode = (code: string): string => (code.toUpperCase() === 'CNGN' ? 'cNGN' : code.toUpperCase());

export const pairLabel = (p: MarketPair): string => `${displayCode(p.base)}/${displayCode(p.quote)}`;

export function groupFor(quote: string): MarketGroup {
	const q = quote.toUpperCase();
	return MARKET_GROUPS.find((g) => g.quotes.includes(q)) ?? OTHER_GROUP;
}

const rank = (list: string[], value: string) => {
	const i = list.indexOf(value);
	return i === -1 ? list.length : i;
};

/**
 * Majors first: by group, then by base (USD, USDT, EUR, GBP, …), then
 * alphabetically. `firstGroup` moves one group to the top, for a visitor viewing
 * the site in that currency.
 */
export function sortPairs<T extends MarketPair>(pairs: T[], firstGroup?: string): T[] {
	const groupKeys = MARKET_GROUPS.map((g) => g.key);
	const groupRank = (p: MarketPair) => {
		const key = groupFor(p.quote).key;
		return key === firstGroup ? -1 : groupKeys.indexOf(key);
	};
	return [...pairs].sort(
		(a, b) =>
			groupRank(a) - groupRank(b) ||
			rank(BASE_RANK, a.base) - rank(BASE_RANK, b.base) ||
			a.base.localeCompare(b.base) ||
			a.quote.localeCompare(b.quote)
	);
}

/** Splits an already-sorted list into its groups, keeping the list's order. Empty groups are dropped. */
export function groupPairs<T extends MarketPair>(pairs: T[]): { group: MarketGroup; pairs: T[] }[] {
	const out: { group: MarketGroup; pairs: T[] }[] = [];
	for (const p of pairs) {
		const group = groupFor(p.quote);
		const last = out[out.length - 1];
		if (last?.group.key === group.key) last.pairs.push(p);
		else out.push({ group, pairs: [p] });
	}
	return out;
}

/**
 * Whether a pair matches a search. Takes the forms people type: a code with or
 * without a separator (`usdtzar`, `USDT/ZAR`, `usdt zar`, `usdt-zar`) or a
 * currency name (`rand`, `tether kenya`). Every word has to match.
 */
export function matchesPair(p: MarketPair, query: string): boolean {
	const q = query.trim().toLowerCase();
	if (!q) return true;

	if (p.code.includes(q.replace(/[\s/_-]+/g, ''))) return true;

	const haystack = [p.code, p.base, p.quote, currencyName(p.base), currencyName(p.quote)].join(' ').toLowerCase();
	return q.split(/[\s/_-]+/).filter(Boolean).every((word) => haystack.includes(word));
}

/** Pairs matching a search, an exact code match first, otherwise in the list's order. */
export function searchPairs<T extends MarketPair>(pairs: T[], query: string): T[] {
	const compact = query.trim().toLowerCase().replace(/[\s/_-]+/g, '');
	const matches = pairs.filter((p) => matchesPair(p, query));
	const exact = matches.findIndex((p) => p.code === compact);
	if (exact > 0) matches.unshift(...matches.splice(exact, 1));
	return matches;
}
