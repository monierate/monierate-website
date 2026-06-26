import { json } from '@sveltejs/kit';
import { userAccountRequest } from '$lib/api/userAccountApi';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
	const userToken = cookies.get('user_token');

	if (!userToken) {
		return json(
			{ error: 'User token not found' },
			{ status: 401 }
		);
	}

	const res = await userAccountRequest('/users/get_user', {
		method: 'GET',
		userToken
	});

	if (!res.success) {
		return json(
			{ error: res.error ?? 'Failed to fetch user' },
			{ status: res.status || 500 }
		);
	}

	return json(res.data);
}
