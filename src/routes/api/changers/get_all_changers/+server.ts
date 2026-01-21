import { json } from '@sveltejs/kit';
import { serverApiRequest } from '$lib/services/api';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	let urlParams = url.searchParams;

	const page = urlParams.get('page') || '1';
	const limit = urlParams.get('limit') || '100';

	const response = await serverApiRequest('/changers/get_all_changers', {
		method: 'GET',
		params: {
			page: page,
			limit: limit
		}
	});

	if (!response.success) {
		return json({ message: response.error }, { status: 500 });
	}

	return json({ data: response.data });
}
