import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { userAccountRequest } from '$lib/api/userAccountApi';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }: RequestEvent) {
	const userToken = cookies.get('auth_token');

	if (!userToken) {
		return json(
			{ error: 'User not authenticated' },
			{ status: 401 }
		);
	}

	const res = await userAccountRequest('/alerts/get-all', {
		method: 'GET',
		userToken
	});

	if (!res.success) {
		return json(
			{ error: res.error ?? 'Failed to fetch alerts' },
			{ status: res.status || 500 }
		);
	}

	return json(res.data);
}
