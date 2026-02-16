import { getEndpoint, basicAuth } from '$lib/helper';
import { json, redirect } from '@sveltejs/kit';
/** @type {import('./$types').RequestHandler} */

export async function GET({ url }) {
	let urlParams = url.searchParams;
	const changer = urlParams.get('changer') || null;

	if (!changer) {
		console.error('Missing changer parameter');
		return json({ error: 'Missing changer parameter' }, { status: 400 });
	}

	let endpoint = getEndpoint(`/pairs/get_all_pairs?page=1&changer=${encodeURIComponent(changer)}`);

	let res = await fetch(endpoint, basicAuth('GET', {}));
	const pairRates = (await res.json()).data || {};

	return json(pairRates);
}
