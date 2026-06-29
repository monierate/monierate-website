import type { MarketData, MarketKey } from '$lib/types/market';
import { MARKET_META, MARKET_RATES } from '$data/market-rates';

/**
 * Get the rates table for a single market (Black Market, CBN, or Global Market).
 *
 * NOTE: currently backed by dummy data in `$data/market-rates`. This is the single
 * place to swap when the real data source (docs.monierate.com) is wired up — keep
 * the `{ meta, rates }` shape so callers don't change.
 */
export const getMarketRates = async (
	_fetch: typeof globalThis.fetch,
	market: MarketKey
): Promise<MarketData> => {
	return {
		meta: MARKET_META[market],
		rates: MARKET_RATES[market]
	};
};
