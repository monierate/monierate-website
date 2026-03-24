import { getEndpoint, basicAuth } from '$lib/helper';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const code = url.searchParams.get('code');

	if (!code) {
		return json(
			{ message: 'Missing required query parameter: code' },
			{ status: 400 }
		);
	}

	const endpoint = getEndpoint(
		`/changers/get_similar_changers?code=${encodeURIComponent(code)}`
	);

	try {
		const res = await fetch(endpoint, basicAuth('GET', {}));

		if (!res.ok) {
			console.error('Failed to get related changers', {
				status: res.status,
				statusText: res.statusText
			});

			return json(
				{ message: 'Failed to get related changers' },
				{ status: res.status || 500 }
			);
		}

		const payload = await res.json();
		const data = payload?.data ?? null;

		return json({ data }, { status: 200 });
	} catch (error) {
		console.error('Unexpected error while fetching related changers', error);

		return json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
};
