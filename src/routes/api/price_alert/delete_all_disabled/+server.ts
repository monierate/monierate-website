import { json } from '@sveltejs/kit';
import { userAccountRequest } from '$lib/api/userAccountApi';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies }) {
	const userToken = cookies.get('auth_token');

	if (!userToken) {
		return json({ error: 'User not authenticated' }, { status: 401 });
	}

	const res = await userAccountRequest('/alerts/disabled', {
		method: 'DELETE',
		userToken
	});

	if (!res.success) {
		return json(
			{ error: res.error ?? 'Failed to delete disabled alerts' },
			{ status: res.status || 500 }
		);
	}

	return json(res.data);
}
