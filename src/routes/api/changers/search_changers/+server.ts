import { json } from '@sveltejs/kit';
import { serverApiRequest } from '$lib/api/server';

/**
 * Faceted changer search — the data source behind the /exchanges collection
 * pages. Suspended, closed and flagged changers are excluded upstream and
 * results come back sorted by rating.
 *
 * Multi-value facets (tags, categories, payment_methods, platforms) are
 * comma-separated; the upstream endpoint rejects a repeated param.
 */
const PASSTHROUGH_PARAMS = [
	'q',
	'tags',
	'categories',
	'city',
	'state',
	'country',
	'licensed',
	'license_authority',
	'payment_methods',
	'platforms',
	'kyc_required',
	'verified',
	'sort',
	'page',
	'limit'
] as const;

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, setHeaders }) {
	const params: Record<string, string> = {};

	for (const key of PASSTHROUGH_PARAMS) {
		const value = url.searchParams.get(key);
		if (value !== null && value !== '') params[key] = value;
	}

	params.page ??= '1';
	params.limit ??= '20';

	const response = await serverApiRequest('/changers/search_changers', {
		method: 'GET',
		params
	});

	if (!response.success) {
		return json({ message: response.error }, { status: 500 });
	}

	// Directory data turns over slowly; caching at the edge keeps the collection
	// pages cheap to serve without letting a new listing sit hidden for long.
	setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=600' });

	return json({ data: response.data });
}
