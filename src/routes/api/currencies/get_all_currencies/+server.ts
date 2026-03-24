import { json } from '@sveltejs/kit';
import { serverApiRequest } from '$lib/api/server';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	let urlParams = url.searchParams;
	const code = urlParams.get('code') || null;

	let result: any = null;
	if (code !== null) {
		result = await serverApiRequest(`/currencies/get_currency?code=${code.toUpperCase()}`);
	} else {
		result = await serverApiRequest(`/currencies/get_all_currencies`, {
			method: 'GET',
			params: {
				page: 1,
				limit: 100
			}
		});
	}

	if (!result.success) {
		console.error('Failed to fetch currency data', result);
		return json({ message: 'Filed to fetch currency data' }, { status: 500 });
	}

	const currencies = result.data || {};

	return json(currencies);
}
