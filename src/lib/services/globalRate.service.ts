import { clientApiFetch } from '$lib/api/client';
import type { LatestRates, RateMarket } from '$lib/api/accountApi';

/**
 * The converter's headline rate.
 *
 * Two markets, and which one answers is the thing the page is actually about:
 *
 * - **parallel** — what desks quote. Built upstream from the pairs feed, and it
 *   inverts but never crosses, so it covers the corridors we actually track
 *   (USD/NGN, GHS/NGN, USDT/KES …) and their inverses, and nothing else.
 * - **mid** — the interbank snapshot. Complete enough to cross, so it answers any
 *   pair, which is what makes a *global* converter possible.
 *
 * Parallel wins where it exists because it is the rate a visitor can transact at;
 * mid is the fallback that keeps the page from being empty for EUR/JPY. The page
 * labels which one it is quoting — a parallel rate presented as interbank, or the
 * reverse, is worse than no rate.
 */

export type MarketName = Extract<RateMarket, 'parallel' | 'mid'>;

/** The base every mid document is stored against, and so the one always available. */
const PIVOT_BASE = 'USD';

export interface RateSnapshot {
	/** Uppercase. */
	base: string;
	parallel: Record<string, number> | null;
	mid: Record<string, number> | null;
	/** Epoch millis of the market's own stamp, where we have one. */
	parallelUpdatedAt: number | null;
	midUpdatedAt: number | null;
}

export interface ResolvedRate {
	/** 1 `base` = `rate` quote. */
	rate: number;
	market: MarketName;
	updatedAt: number | null;
}

/**
 * A quote of 0 means "we hold no rate", not "this rate is zero" — the upstream
 * seeds currencies at 0 and leaves a currency its feed omits untouched. Same rule
 * as the account API's own `usable_quote`, applied again here because a zero that
 * slips through renders as a free trade.
 */
const usable = (value: unknown): boolean => {
	const rate = Number(value);
	return Number.isFinite(rate) && rate > 0;
};

async function fetchMarket(
	fetch: typeof globalThis.fetch,
	base: string,
	market: MarketName
): Promise<LatestRates | null> {
	const result = await clientApiFetch<LatestRates>(
		'/rates/latest',
		{ params: { base, market } },
		fetch
	);

	return result?.rates ? result : null;
}

/**
 * Both markets for one base, in one round trip each.
 *
 * Whole maps rather than single quotes: the page needs the headline, its inverse,
 * and a handful of popular targets off the same snapshot, and the upstream call is
 * metered per request rather than per quote.
 *
 * Never throws. A market that is missing, unconfigured or down comes back null and
 * the page degrades to whatever the other one can answer.
 */
export async function getRateSnapshot(
	fetch: typeof globalThis.fetch,
	base: string
): Promise<RateSnapshot> {
	const upper = base.toUpperCase();

	const [parallel, mid] = await Promise.all([
		fetchMarket(fetch, upper, 'parallel').catch(() => null),
		fetchMarket(fetch, upper, 'mid').catch(() => null)
	]);

	return {
		base: upper,
		parallel: parallel?.rates ?? null,
		mid: mid?.rates ?? null,
		parallelUpdatedAt: parallel?.timestamp ?? null,
		midUpdatedAt: mid?.timestamp ?? null
	};
}

/** Parallel first, mid as the fallback. Null when neither market carries the quote. */
export function resolveConversion(snapshot: RateSnapshot, to: string): ResolvedRate | null {
	const quote = to.toUpperCase();

	const parallel = snapshot.parallel?.[quote];
	if (usable(parallel)) {
		return { rate: Number(parallel), market: 'parallel', updatedAt: snapshot.parallelUpdatedAt };
	}

	const mid = snapshot.mid?.[quote];
	if (usable(mid)) {
		return { rate: Number(mid), market: 'mid', updatedAt: snapshot.midUpdatedAt };
	}

	return null;
}

/**
 * Last resort: the pair document's own aggregate price.
 *
 * Not a different rate — the parallel market is *built* from `pair.price.current`
 * upstream, so this is the same number reached without going through the account
 * API. Which makes it the right fallback for the two cases where that call comes
 * back empty: no `ACCOUNT_API_KEY` configured yet, or the rates service having a
 * bad minute. Either way the corridors we care most about keep answering, and the
 * label stays honest because the provenance really is the parallel market.
 *
 * Only ever reached after both markets miss — a live account-API rate always wins,
 * since it is the one that gets rebased and cross-checked upstream.
 */
export function pairFallbackRate(
	pair: { code?: string; price?: { current?: number }; updatedAt?: string } | null,
	from: string,
	to: string
): ResolvedRate | null {
	const price = Number(pair?.price?.current);
	if (!usable(price)) return null;

	const code = String(pair?.code ?? '').toLowerCase();
	const direct = `${from}${to}`.toLowerCase();
	const inverse = `${to}${from}`.toLowerCase();

	// A pair document that is neither direction of what was asked cannot answer it.
	if (code !== direct && code !== inverse) return null;

	const rate = code === direct ? price : 1 / price;
	const updatedAt = pair?.updatedAt ? Date.parse(pair.updatedAt) : null;

	return {
		rate,
		market: 'parallel',
		updatedAt: Number.isFinite(updatedAt as number) ? (updatedAt as number) : null
	};
}

/** Every quote code the snapshot can actually answer for, uppercase. */
export function quotableCodes(snapshot: RateSnapshot): string[] {
	const codes = new Set<string>();

	for (const map of [snapshot.parallel, snapshot.mid]) {
		if (!map) continue;
		for (const [code, value] of Object.entries(map)) {
			if (usable(value)) codes.add(code.toUpperCase());
		}
	}

	return [...codes].sort();
}

/**
 * The currencies the converter can actually price — what the picker is allowed to
 * offer.
 *
 * Measured 2026-09-08: the mid market holds 57 currencies, while the currency API
 * names 84 active ones. The 27-currency difference is real African and minor fiat
 * (BIF, CDF, ETB, MUR, ZMW …) that upstream never seeded and that
 * `update_mid_market_rates` cannot add, since it only refreshes keys already in
 * the stored document. Offering those in the picker promises a conversion we then
 * answer with "no rate", so membership is driven off this list rather than off
 * whatever we happen to hold a name for.
 *
 * Read from the USD pivot, which is the one base always present, so the answer is
 * the same on every page and the proxy's edge cache serves nearly all of it.
 */
export async function getPriceableCodes(
	fetch: typeof globalThis.fetch,
	snapshot?: RateSnapshot
): Promise<string[]> {
	// A USD page already fetched the pivot; don't pay for it twice.
	if (snapshot?.base === PIVOT_BASE && snapshot.mid) {
		return Object.entries(snapshot.mid)
			.filter(([, value]) => usable(value))
			.map(([code]) => code.toUpperCase())
			.sort();
	}

	const pivot = await fetchMarket(fetch, PIVOT_BASE, 'mid').catch(() => null);

	if (!pivot?.rates) return [];

	return Object.entries(pivot.rates)
		.filter(([, value]) => usable(value))
		.map(([code]) => code.toUpperCase())
		.sort();
}

/**
 * Names the rate in the one line under the headline.
 *
 * "Black market" is carried alongside "parallel market" because that is what people
 * searching for this number actually call it — the site's own nav uses it too — and
 * a visitor who cannot tell the two are the same thing will assume we are quoting
 * something else.
 */
export const MARKET_LABEL: Record<MarketName, string> = {
	parallel: 'Parallel-market (Black market)',
	mid: 'Mid-market'
};

export const MARKET_NOTE: Record<MarketName, string> = {
	parallel:
		'The rate desks and exchanges actually quote for this corridor, aggregated across the platforms Monierate tracks.',
	mid: 'The interbank mid-market rate — the midpoint between buy and sell, before any provider margin.'
};

/**
 * The standing disclaimer under the headline rate.
 *
 * Written per market rather than as one string, because the sentence has to match
 * the badge beside it. "We use the mid-market rate for our Converter" is the honest
 * claim on EUR/JPY and a false one on USD/NGN, where the headline is an aggregate of
 * what desks are actually quoting — and a rate a visitor cannot get is a different
 * warning from a rate that is real but not theirs.
 */
export const MARKET_DISCLAIMER: Record<MarketName, string> = {
	parallel:
		'We use the aggregated parallel market rate for our Converter — what the platforms we track are quoting right now. This is for informational purposes only. You will not receive this exact rate when you exchange, and each platform sets its own.',
	mid: 'We use the mid-market rate for our Converter. This is for informational purposes only. You will not receive this rate when sending money, as providers add their own margin.'
};
