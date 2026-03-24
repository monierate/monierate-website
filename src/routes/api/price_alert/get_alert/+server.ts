import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { userAccountRequest } from '$lib/api/userAccountApi';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, url }: RequestEvent) {
	const userToken = cookies.get('auth_token');
	const alertId = url.searchParams.get('alert_id');

	if (!userToken) {
		return json(
			{ error: 'User not authenticated' },
			{ status: 401 }
		);
	}

	if (!alertId) {
		return json(
			{ error: 'alert_id is required' },
			{ status: 400 }
		);
	}

	const res = await userAccountRequest(`/alerts/${alertId}`, {
		method: 'GET',
		userToken
	});

	if (!res.success) {
		return json(
			{ error: res.error ?? 'Failed to fetch alert' },
			{ status: res.status || 500 }
		);
	}

	return json(res.data);
}
