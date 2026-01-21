import { json } from '@sveltejs/kit';
import { serverApiRequest } from '$lib/services/api';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	let urlParams = url.searchParams;

	const pair_code = urlParams.get('pair_code') || null;
	const page = urlParams.get('page') || '1';
	const limit = urlParams.get('limit') || '100';

	const response = await serverApiRequest('/pairs/get_all_pairs', {
		method: 'GET',
		params: {
			code: pair_code || undefined,
			page: page,
			limit: limit
		}
	});

	if (!response.success) {
		return json({ message: response.error }, { status: 500 });
	}

	return json({ data: response.data });
}
