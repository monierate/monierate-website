import { api as defaultApi, createApi, type Api } from '../../api';

export interface IndexSnapshot {
	pair: string;
	composite_rate: number;
	provider_count: number;
	excluded_count: number;
	high_provider: string;
	low_provider: string;
	spread_range: number;
	calculation_method: string;
	timestamp: string;
}

export interface IndexHistoryEntry extends IndexSnapshot {
	date: string;
	hour: number;
}

export interface IndexDailyHistoryEntry {
	date: string;
	pair: string;
	open: number;
	high: number;
	low: number;
	close: number;
	avg_composite_rate: number;
	avg_spread_range: number;
	avg_provider_count: number;
	data_points: number;
}

export interface SpreadByProvider {
	provider_id: string;
	avg_spread: number;
	min_spread: number;
	max_spread: number;
	data_points: number;
}

export interface SpreadTrend {
	period: string;
	avg_spread: number;
	min_spread: number;
	max_spread: number;
	provider_count: number;
}

export interface VolatilityMetrics {
	pair: string;
	data_points: number;
	avg_rate: number;
	max_rate: number;
	min_rate: number;
	range: number;
	std_dev: number;
	avg_spread: number;
}

function makeIndex(api: Api) {
	return {
		getSnapshot: (pair?: string) => {
			const query = new URLSearchParams();
			if (pair) query.set('pair', pair);
			return api.get(`/currency/v1/index/snapshot?${query}`);
		},

		getHistory: (params: {
			pair: string;
			start_date?: string;
			end_date?: string;
			page?: number;
			limit?: number;
		}) => {
			const query = new URLSearchParams({ pair: params.pair });
			if (params.start_date) query.set('start_date', params.start_date);
			if (params.end_date) query.set('end_date', params.end_date);
			if (params.page) query.set('page', String(params.page));
			if (params.limit) query.set('limit', String(params.limit));
			return api.get(`/currency/v1/index/history?${query}`);
		},

		getDailyHistory: (params: {
			pair: string;
			start_date?: string;
			end_date?: string;
			page?: number;
			limit?: number;
		}) => {
			const query = new URLSearchParams({ pair: params.pair });
			if (params.start_date) query.set('start_date', params.start_date);
			if (params.end_date) query.set('end_date', params.end_date);
			if (params.page) query.set('page', String(params.page));
			if (params.limit) query.set('limit', String(params.limit));
			return api.get(`/currency/v1/index/history/daily?${query}`);
		},

		getSpreadAnalysis: (params: {
			pair: string;
			days?: number;
			group_by?: 'day' | 'week' | 'month';
		}) => {
			const query = new URLSearchParams({ pair: params.pair });
			if (params.days) query.set('days', String(params.days));
			if (params.group_by) query.set('group_by', params.group_by);
			return api.get(`/currency/v1/index/spread-analysis?${query}`);
		},

		getVolatility: (params: { pair: string; days?: number }) => {
			const query = new URLSearchParams({ pair: params.pair });
			if (params.days) query.set('days', String(params.days));
			return api.get(`/currency/v1/index/volatility?${query}`);
		}
	};
}

export const index = makeIndex(defaultApi);

export function createIndex(fetch: typeof globalThis.fetch, origin?: string) {
	return makeIndex(createApi(fetch, origin));
}
