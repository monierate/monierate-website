import { api as defaultApi, createApi, type Api } from '../../api';

export interface RatePairSummary {
	code: string;
	is_active: boolean;
	price: { current: number; open: number; high: number; low: number; average: number; close: number };
	price_24hr: number;
	price_change_percent_24hr: number;
	updatedAt: string;
}

export interface CurrentRate {
	provider_id: string;
	pair: string;
	rate_type: string;
	rate_buy: number;
	rate_sell: number;
	rate_mid: number;
	spread: number;
	timestamp: string;
}

export interface DailySnapshot {
	date: string;
	provider_id: string;
	pair: string;
	open: number;
	close: number;
	high: number;
	low: number;
	total_fetches: number;
	successful_fetches: number;
	availability_pct: number;
	was_excluded: boolean;
	exclusion_reason: string | null;
	createdAt: string;
	updatedAt: string;
}

function makeRates(api: Api) {
	return {
		getPairs: (params?: { is_active?: boolean }) => {
			const query = new URLSearchParams();
			if (params?.is_active != null) query.set('is_active', String(params.is_active));
			return api.get(`/currency/v1/rates/pairs?${query}`);
		},

		getCurrent: (params?: { pair?: string; rate_type?: string; limit?: number }) => {
			const query = new URLSearchParams();
			if (params?.pair) query.set('pair', params.pair);
			if (params?.rate_type) query.set('rate_type', params.rate_type);
			if (params?.limit) query.set('limit', String(params.limit));
			return api.get(`/currency/v1/rates/current?${query}`);
		},

		getHistory: (params: {
			pair: string;
			provider_id?: string;
			start_date?: string;
			end_date?: string;
			page?: number;
			limit?: number;
		}) => {
			const query = new URLSearchParams({ pair: params.pair });
			if (params.provider_id) query.set('provider_id', params.provider_id);
			if (params.start_date) query.set('start_date', params.start_date);
			if (params.end_date) query.set('end_date', params.end_date);
			if (params.page) query.set('page', String(params.page));
			if (params.limit) query.set('limit', String(params.limit));
			return api.get(`/currency/v1/rates/history?${query}`);
		}
	};
}

export const rates = makeRates(defaultApi);

export function createRates(fetch: typeof globalThis.fetch, origin?: string) {
	return makeRates(createApi(fetch, origin));
}
