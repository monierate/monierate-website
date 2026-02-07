import { clientApiFetch } from '$lib/api/client';

export const getCurrencies = async (fetch: any) => {
	const result = await clientApiFetch<Record<string, any>>(
		'/currencies/get_all_currencies',
		{ method: 'GET' },
		fetch
	);

	if (!result) {
		return [];
	}

	return result;
};
