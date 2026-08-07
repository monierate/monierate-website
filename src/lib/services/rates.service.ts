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
