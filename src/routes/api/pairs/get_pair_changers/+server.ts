import { json } from '@sveltejs/kit';
import { serverApiRequest } from '$lib/api/server';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	let urlParams = url.searchParams;
	const pair_code = urlParams.get('pair_code') || '';
	const changer_service = urlParams.get('changer_service') || '';

	const changers = await serverApiRequest(`/pairs/get_pair_changers`, {
		method: 'GET',
		params: {
			code: pair_code,
			changer_service: changer_service || undefined
		}
	});

	if (!changers.success) {
		console.error('Failed to get pair changers', changers.error);
		json({ message: 'Failed to get pair changers' }, { status: 500 });
	}

	return json({ data: changers.data });
}
