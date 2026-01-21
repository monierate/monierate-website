import { json } from '@sveltejs/kit';
import { serverApiRequest } from '$lib/services/api';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	let urlParams = url.searchParams;

	const pair_code = urlParams.get('pair_code') || '';

	const response = await serverApiRequest('/pairs/get_pair', {
		method: 'GET',
		params: {
			code: pair_code
		}
	});

	if (!response.success) {
		return json({ message: response.error }, { status: 500 });
	}

	return json({data: response.data});
}
