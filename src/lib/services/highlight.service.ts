import { clientApiFetch } from '$lib/api/client';

/**
 * Get all changers with pagination
 */
export const getHighlights = async (
	fetch: typeof globalThis.fetch,
	pair: string,
	max: number = 5
) => {
	const result = await clientApiFetch<any>(
		'/highlights',
		{
			params: {
				max,
				pair
			}
		},
		fetch
	);

	if (!result) {
		return null;
	}

	return result;
};
