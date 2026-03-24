import { json } from '@sveltejs/kit';
import { userAccountRequest } from '$lib/api/userAccountApi';

/** @type {import('./$types').RequestHandler} */
export async function GET({}) {
	const res = await userAccountRequest('/pricing/get_all_pricing', {
		method: 'GET',
		userToken: ''
	});

	if (!res?.success) {
		return json({ error: res?.error ?? 'Failed to fetch pricing' }, { status: res?.status ?? 500 });
	}

	return json({ data: res.data });
}
