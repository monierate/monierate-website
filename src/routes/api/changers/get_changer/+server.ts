import { json } from '@sveltejs/kit';
import { serverApiRequest } from '$lib/api/server';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	let urlParams = url.searchParams;

	const code = urlParams.get('code') || null;

	if (!code) {
		return json({ message: 'No changer code provided' }, { status: 400 });
	}

	const response = await serverApiRequest('/changers/get_changer', {
		method: 'GET',
		params: {
			code
		}
	});

	if (!response.success) {
		return json({ message: response.error }, { status: 500 });
	}

	return json({ data: response.data });
}
