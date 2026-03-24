import { json } from '@sveltejs/kit';
import { userAccountRequest } from '$lib/api/userAccountApi';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request }) {
	const userToken = cookies.get('auth_token');

	if (!userToken) {
		return json(
			{ error: 'User not authenticated' },
			{ status: 401 }
		);
	}

	const body = await request.json();

	const res = await userAccountRequest('/alerts/create', {
		method: 'POST',
		userToken,
		body
	});

	if (!res.success) {
		return json(
			{ error: res.error ?? 'Failed to create alert' },
			{ status: res.status || 500 }
		);
	}

	return json(res.data);
}
