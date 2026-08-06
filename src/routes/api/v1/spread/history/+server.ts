import { json } from '@sveltejs/kit';
import { serverApiRequest } from '$lib/api/server';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const pair = url.searchParams.get('pair') || undefined;
	const range = url.searchParams.get('range') || undefined;
	const start_date = url.searchParams.get('start_date') || undefined;
	const end_date = url.searchParams.get('end_date') || undefined;

	const response = await serverApiRequest('/v1/spread/history', {
		method: 'GET',
		params: { pair, range, start_date, end_date }
	});

	if (!response.success) {
		return json({ message: response.error }, { status: response.status || 500 });
	}

	return json({ data: response.data });
}
