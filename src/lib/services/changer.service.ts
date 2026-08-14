import { clientApiFetch } from '$lib/api/client';

/**
 * Get all changers with pagination
 */
export const getAllChangers = async (
	fetch: typeof globalThis.fetch,
	page: number = 1,
	limit: number = 100
) => {
	const response = await clientApiFetch<Record<string, any>>(
		'/changers/get_all_changers',
		{
			params: {
				page,
				limit
			}
		},
		fetch
	);

	if (!response) {
		return null;
	}

	return (response.result as any[])?.filter((c: any) => c.is_active) ?? response.result;
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
