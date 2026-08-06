import { json } from '@sveltejs/kit';
import { serverApiRequest } from '$lib/api/server';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const pair = url.searchParams.get('pair') || undefined;
	const rate_type = url.searchParams.get('rate_type') || undefined;
	const limit = url.searchParams.get('limit') || undefined;

	const response = await serverApiRequest('/v1/rates/current', {
		method: 'GET',
		params: { pair, rate_type, limit }
	});

	if (!response.success) {
		return json({ message: response.error }, { status: response.status || 500 });
	}

	return json({ data: response.data });
}
