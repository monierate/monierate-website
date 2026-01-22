import { clientApiFetch } from '$lib/api/client';

/**
 * Get logged in user
 */
export const getUser = async (fetch: any) => {
	const result = await clientApiFetch<Record<string, any>>('/users/get_user', undefined, fetch);

	if (!result) {
		return null;
	}

	return result;
};
