import { basicAccountAuth, getAccountEndpoint } from '$lib/server/utilities.js';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ fetch, cookies }) {
	const user_token = cookies.get('user_token');
	if (!user_token) {
		return json({ error: 'User token not found' });
	}

	const payload = {
		user_token: user_token
	};
	const endpoint = getAccountEndpoint('/users/get_user');
	const res = await fetch(endpoint, basicAccountAuth('GET', payload));

	const result = await res.text();

	return json(result);
}
