import { clientApiFetch } from '$lib/api/client';
import { pairPath } from '$lib/utils/conversionSlug';

export interface TickerItem {
	/** e.g. "EUR/ZAR" */
	name: string;
	href: string;
	price: number;
	/**
	 * null when there is no price from 24 hours ago to compare with: a pair added
	 * today, or an interbank rate, which carries no history here.
	 */
	price_change_percent_24hr: number | null;
	/** parallel: a pair we track from desks and P2P books; mid: the interbank rate. */
	market: 'parallel' | 'mid';
}

// Bases shown in the ticker, in order; the visitor's own currency is skipped.
// NGN only appears for the other quotes, where naira is the region's
// most-traded neighbour (NGN/ZAR, NGN/KES).
const TICKER_BASES = ['USD', 'USDT', 'BTC', 'EUR', 'GBP', 'CAD', 'NGN', 'GHS', 'KES', 'ZAR'];
const TICKER_LENGTH = 9;

// The interbank rates come from the account API, which bills per call and isn't
// edge-cached when the page asks for it server-side. They move slowly, so a
// minute per isolate (the route's own s-maxage) is plenty.
const MID_TTL_MS = 60_000;
const midCache = new Map<string, { at: number; rates: Record<string, number> | null }>();

/** Interbank rates for `quote`: base code -> units of that base per 1 `quote`. */
async function midRates(
	fetch: typeof globalThis.fetch,
	quote: string
): Promise<Record<string, number> | null> {
	const hit = midCache.get(quote);
	if (hit && Date.now() - hit.at < MID_TTL_MS) return hit.rates;

	const result = await clientApiFetch<{ rates?: Record<string, number> }>(
		'/rates/latest',
		{ params: { base: quote, market: 'mid' } },
		fetch
	);
	const rates = result?.rates ?? null;

	midCache.set(quote, { at: Date.now(), rates });
	return rates;
}

const trackedItem = (pair: any, base: string, quote: string): TickerItem => ({
	name: `${base}/${quote}`,
	href: `/markets/${pair.code}`,
	price: pair.price.current,
	price_change_percent_24hr: pair.price_24hr > 0 ? pair.price_change_percent_24hr : null,
	market: 'parallel'
});

/**
 * The ticker for one quote currency: each base's tracked pair where we have
 * one, its interbank rate where we don't, then other tracked pairs if it is
 * still short. NGN has a tracked pair for every base; ZAR, KES and GHS have
 * only USD and USDT, so the rest of their row is interbank.
 */
export function buildTicker(
	pairs: any[],
	quote: string,
	mid: Record<string, number> | null
): Record<string, TickerItem> {
	const q = quote.toUpperCase();
	const byCode = new Map(pairs.filter((p) => p?.price?.current > 0).map((p) => [p.code, p]));
	const items: [string, TickerItem][] = [];

	for (const base of TICKER_BASES) {
		if (base === q) continue;

		const code = `${base}${q}`.toLowerCase();
		const pair = byCode.get(code);
		if (pair) {
			items.push([code, trackedItem(pair, base, q)]);
			continue;
		}

		const perQuote = Number(mid?.[base]);
		if (perQuote > 0) {
			items.push([
				code,
				{
					name: `${base}/${q}`,
					href: pairPath(base, q),
					price: 1 / perQuote,
					price_change_percent_24hr: null,
					market: 'mid'
				}
			]);
		}
	}

	if (items.length < TICKER_LENGTH) {
		const shown = new Set(items.map(([code]) => code));
		const rest = [...byCode.values()]
			.filter((p) => !shown.has(p.code) && p.code.endsWith(q.toLowerCase()))
			.sort((a, b) => b.price.current - a.price.current);
		for (const pair of rest) {
			const base = pair.code.slice(0, -q.length).toUpperCase();
			items.push([pair.code, trackedItem(pair, base, q)]);
		}
	}

	return Object.fromEntries(items.slice(0, TICKER_LENGTH));
}

/** Only asks for interbank rates when a base has no tracked pair (never for NGN). */
export async function loadTicker(
	fetch: typeof globalThis.fetch,
	pairs: any[],
	quote: string
): Promise<Record<string, TickerItem>> {
	const q = quote.toUpperCase();
	const tracked = new Set(pairs.map((p) => p?.code));
	const needsMid = TICKER_BASES.some(
		(base) => base !== q && !tracked.has(`${base}${q}`.toLowerCase())
	);

	const mid = needsMid ? await midRates(fetch, q).catch(() => null) : null;
	return buildTicker(pairs, q, mid);
}
