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

	return response.result;
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
