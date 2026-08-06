import { json } from '@sveltejs/kit';
import { serverApiRequest } from '$lib/api/server';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const { code } = params;

	const response = await serverApiRequest(`/v1/providers/${code}`, {
		method: 'GET'
	});

	if (!response.success) {
		return json({ message: response.error }, { status: response.status || 500 });
	}

	return json({ data: response.data });
}
