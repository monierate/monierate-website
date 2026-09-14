import { json } from '@sveltejs/kit';
import { serverApiRequest } from '$lib/api/server';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const isActive = url.searchParams.get('is_active');

	const response = await serverApiRequest('/v1/rates/pairs', {
		method: 'GET',
		params: { is_active: isActive ?? undefined }
	});

	if (!response.success) {
		return json({ message: response.error }, { status: response.status || 500 });
	}

	return json({ data: response.data });
}
