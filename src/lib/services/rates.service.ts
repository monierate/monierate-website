import { clientApiFetch } from '$lib/api/client';

export interface DailySnapshot {
	date: string;
	provider_id: string;
	pair: string;
	open: number;
	close: number;
	high: number;
	low: number;
	availability_pct: number | null;
	/**
	 * Two-sided legs of the same day. The OHLC table and chart plot the single-sided
	 * figures above; these are what let a sealed day stand in for a live buy/sell
	 * quote on providers that never reach the live feed (see `resolveCurrentRate`).
	 * Optional because older rows predate them.
	 */
	open_buy?: number;
	open_sell?: number;
	high_buy?: number;
	high_sell?: number;
	low_buy?: number;
	low_sell?: number;
	close_buy?: number;
	close_sell?: number;
	/** How the day was assembled — `'fetch'` for polled providers, `'manual'` for keyed-in ones. */
	source?: string;
}

export interface RateHistoryResponse {
	total: number;
	count: number;
	page: number;
	limit: number;
	snapshots: DailySnapshot[];
}

/**
 * Get daily OHLC snapshots for a pair (optionally scoped to one provider).
 */
export const getRateHistory = async (
	fetch: typeof globalThis.fetch,
	params: {
		pair: string;
		provider_id?: string;
		start_date?: string;
		end_date?: string;
		page?: number;
		limit?: number;
	}
): Promise<RateHistoryResponse | null> => {
	const result = await clientApiFetch<RateHistoryResponse>(
		'/v1/rates/history',
		{ method: 'GET', params },
		fetch
	);

	if (!result) {
		return null;
	}

	return result;
};
