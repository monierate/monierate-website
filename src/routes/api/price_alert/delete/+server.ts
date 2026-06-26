import { json } from '@sveltejs/kit';
import { userAccountRequest } from '$lib/api/userAccountApi';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request }) {
	const userToken = cookies.get('user_token');

	if (!userToken) {
		return json(
			{ error: 'User not authenticated' },
			{ status: 401 }
		);
	}

	const body = await request.json();
	const { alert_id } = body;

	if (!alert_id) {
		return json(
			{ error: 'alert_id is required' },
			{ status: 400 }
		);
	}

	const res = await userAccountRequest(`/alerts/${alert_id}`, {
		method: 'DELETE',
		userToken
	});

	if (!res.success) {
		return json(
			{ error: res.error ?? 'Failed to delete alert' },
			{ status: res.status || 500 }
		);
	}

	return json(res.data);
}
