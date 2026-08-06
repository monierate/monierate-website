import { api as defaultApi, createApi, type Api } from '../api';

export interface Changer {
	name: string;
	code: string;
	icon?: string;
	link?: string;
	bio?: string;
	is_active?: boolean;
	[key: string]: unknown;
}

function makeChangers(api: Api) {
	return {
		getAll: (params?: { page?: number; limit?: number; search?: string; is_active?: boolean }) => {
			const query = new URLSearchParams();
			if (params?.page) query.set('page', String(params.page));
			if (params?.limit) query.set('limit', String(params.limit));
			if (params?.search) query.set('search', params.search);
			if (params?.is_active != null) query.set('is_active', String(params.is_active));
			return api.get(`/currency/changers/get_all_changers?${query}`);
		},

		get: (code: string) => api.get(`/currency/changers/get_changer?code=${code}`),

		getSimilar: (code: string) => api.get(`/currency/changers/get_similar_changers?code=${code}`),

	};
}

// Client-side singleton
export const changers = makeChangers(defaultApi);

// Isomorphic factory — pass SvelteKit's `fetch` and `url.origin` for SSR
export function createChangers(fetch: typeof globalThis.fetch, origin?: string) {
	return makeChangers(createApi(fetch, origin));
}
