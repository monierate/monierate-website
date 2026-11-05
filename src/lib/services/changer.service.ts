import { clientApiFetch } from '$lib/api/client';

// Big enough that today's list comes back in one request (and one cache entry);
// any providers beyond it are fetched as further pages.
const CHANGERS_PAGE_SIZE = 200;

const fetchChangersPage = (fetch: typeof globalThis.fetch, page: number) =>
	clientApiFetch<Record<string, any>>(
		'/changers/get_all_changers',
		{ params: { page, limit: CHANGERS_PAGE_SIZE } },
		fetch
	);

/**
 * Get every active changer.
 *
 * Pages through the full list using the API's `count`. It used to take one page
 * of 100, and once there were more than 100 providers the rest silently dropped
 * out of every page that looks providers up by code (their rates went missing).
 */
export const getAllChangers = async (fetch: typeof globalThis.fetch) => {
	const first = await fetchChangersPage(fetch, 1);

	if (!first) {
		return null;
	}

	let result: any[] = first.result ?? [];
	const total = Number(first.count) || result.length;

	if (total > result.length) {
		const pageCount = Math.ceil(total / CHANGERS_PAGE_SIZE);
		const rest = await Promise.all(
			Array.from({ length: pageCount - 1 }, (_, i) => fetchChangersPage(fetch, i + 2))
		);
		result = result.concat(...rest.map((page) => page?.result ?? []));
	}

	return result.filter((c: any) => c.is_active);
};

export interface SearchChangersParams {
	q?: string;
	/** OR'd. Sent comma-separated — the API rejects a repeated param. */
	tags?: string[];
	categories?: string[];
	city?: string;
	state?: string;
	country?: string;
	licensed?: boolean;
	license_authority?: string;
	payment_methods?: string[];
	platforms?: string[];
	kyc_required?: boolean;
	verified?: boolean;
	sort?: string;
	page?: number;
	limit?: number;
}

export interface SearchChangersResult {
	count: number;
	result: any[];
	page: number;
}

/**
 * Faceted changer search. Suspended, closed and flagged changers are excluded
 * upstream; results default to rating order.
 */
export const searchChangers = async (
	fetch: typeof globalThis.fetch,
	params: SearchChangersParams = {}
): Promise<SearchChangersResult | null> => {
	const query: Record<string, string | number> = {};

	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			if (value.length === 0) continue;
			query[key] = value.join(',');
		} else {
			query[key] = typeof value === 'boolean' ? String(value) : value;
		}
	}

	const result = await clientApiFetch<SearchChangersResult>(
		'/changers/search_changers',
		{ params: query },
		fetch
	);

	if (!result || !Array.isArray(result.result)) {
		return null;
	}

	return result;
};

export const getChanger = async (fetch: typeof globalThis.fetch, code: string) => {
	const result = await clientApiFetch<Record<string, any>>(
		'/changers/get_changer',
		{
			params: {
				code
			}
		},
		fetch
	);

	if (!result) {
		return null;
	}

	return result;
};

export const getSimilarChangers = async (fetch: typeof globalThis.fetch, code: string) => {
	const result = await clientApiFetch<Record<string, any>>(
		'/changers/get_similar_changers',
		{
			params: {
				code
			}
		},
		fetch
	);

	if (!result) {
		return null;
	}

	return result;
};
