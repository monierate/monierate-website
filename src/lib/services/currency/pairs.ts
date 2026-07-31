import { api as defaultApi, createApi, type Api } from '../api';

export interface Pair {
	code: string;
	is_active: boolean;
	[key: string]: unknown;
}

export interface PairChanger {
	changer_code: string;
	price?: string;
	price_buy?: string;
	price_sell?: string;
	[key: string]: unknown;
}

export interface PaginationParams {
	page?: number;
	limit?: number;
}

function makePairs(api: Api) {
	return {
		getAll: (params?: PaginationParams & { code?: string; base?: string; quote?: string; changer?: string; is_active?: boolean }) => {
			const query = new URLSearchParams();
			if (params?.page) query.set('page', String(params.page));
			if (params?.limit) query.set('limit', String(params.limit));
			if (params?.code) query.set('code', params.code);
			if (params?.base) query.set('base', params.base);
			if (params?.quote) query.set('quote', params.quote);
			if (params?.changer) query.set('changer', params.changer);
			if (params?.is_active != null) query.set('is_active', String(params.is_active));
			return api.get(`/currency/pairs/get_all_pairs?${query}`);
		},

		get: (code: string) => api.get(`/currency/pairs/get_pair?code=${code}`),

		getChangerPairs: (changerCode: string, params?: PaginationParams) => {
			const query = new URLSearchParams({ changer: changerCode });
			if (params?.page) query.set('page', String(params.page));
			if (params?.limit) query.set('limit', String(params.limit));
			return api.get(`/currency/pairs/get_all_pairs?${query}`);
		},

		getChangers: (code: string, filters?: { is_remittance?: boolean; changer_service?: string; changer_code?: string }) => {
			const query = new URLSearchParams({ code });
			if (filters?.is_remittance != null) query.set('is_remittance', String(filters.is_remittance));
			if (filters?.changer_service) query.set('changer_service', filters.changer_service);
			if (filters?.changer_code) query.set('changer_code', filters.changer_code);
			return api.get(`/currency/pairs/get_pair_changers?${query}`);
		}
	};
}

export const pairs = makePairs(defaultApi);

export function createPairs(fetch: typeof globalThis.fetch, origin?: string) {
	return makePairs(createApi(fetch, origin));
}
