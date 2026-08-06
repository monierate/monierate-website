import { json } from '@sveltejs/kit';
import { serverApiRequest } from '$lib/api/server';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const pair = url.searchParams.get('pair') || undefined;
	const provider_id = url.searchParams.get('provider_id') || undefined;
	const start_date = url.searchParams.get('start_date') || undefined;
	const end_date = url.searchParams.get('end_date') || undefined;
	const page = url.searchParams.get('page') || undefined;
	const limit = url.searchParams.get('limit') || undefined;

	if (!pair) {
		return json({ message: 'No pair provided' }, { status: 400 });
	}

	const response = await serverApiRequest('/v1/rates/history', {
		method: 'GET',
		params: { pair, provider_id, start_date, end_date, page, limit }
	});

	if (!response.success) {
		return json({ message: response.error }, { status: response.status || 500 });
	}

	return json({ data: response.data });
}
