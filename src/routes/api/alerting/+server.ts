import { json } from '@sveltejs/kit';
import { serverApiRequest } from '$lib/api/server.js';

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, fetch }) {
	const { email, interval } = await request.json();
	const payload = {
		email,
		interval
	};
	const result = serverApiRequest('/alerting', {
		method: 'PUT',
		body: payload
	});

	return json(result);
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, fetch, cookies }) {
	const { id } = await request.json();
	const user_token: string = cookies.get('auth') || '';
	const result = serverApiRequest(`/auth/alerting?id=${id}`, {
		method: 'DELETE',
		body: {
			user_token
		}
	});
	console.log(result);

	return json(result);
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, fetch }) {
	const { email } = await request.json();
	const payload = {
		email
	};
	const result = serverApiRequest('/public/alerting/signin', {
		method: 'POST',
		body: payload
	});
	console.log(result);

	return json(result);
}
