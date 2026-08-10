import { json } from '@sveltejs/kit';
import { userAccountRequest } from '$lib/api/userAccountApi';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
	const userToken = cookies.get('user_token');

	if (!userToken) {
		return json({ error: 'User token not found' }, { status: 401 });
	}

	const res = await userAccountRequest('/billing/day-pass', {
		method: 'GET',
		userToken
	});

	if (!res.success) {
		return json({ error: res.error ?? 'Failed to fetch day pass status' }, { status: res.status || 500 });
	}

	return json(res.data);
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies }) {
	const userToken = cookies.get('user_token');

	if (!userToken) {
		return json({ error: 'User token not found' }, { status: 401 });
	}

	const res = await userAccountRequest('/billing/day-pass', {
		method: 'POST',
		body: {},
		userToken
	});

	if (!res.success) {
		return json({ error: res.error ?? 'Could not start your day pass.' }, { status: res.status || 500 });
	}

	return json(res.data);
}
