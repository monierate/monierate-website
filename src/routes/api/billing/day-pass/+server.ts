import { json } from '@sveltejs/kit';
import { userAccountRequest } from '$lib/api/userAccountApi';

// Day-pass *status* is resolved server-side by each page's own load function
// (see `$lib/server/billing`) so the unlock button renders correctly on first
// paint — this route only needs to handle the purchase itself.

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
