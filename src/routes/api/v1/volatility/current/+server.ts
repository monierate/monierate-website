import { json } from '@sveltejs/kit';
import { serverApiRequest } from '$lib/api/server';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const pair = url.searchParams.get('pair') || undefined;

	const response = await serverApiRequest('/v1/volatility/current', {
		method: 'GET',
		params: { pair }
	});

	if (!response.success) {
		return json({ message: response.error }, { status: response.status || 500 });
	}

	return json({ data: response.data });
}
