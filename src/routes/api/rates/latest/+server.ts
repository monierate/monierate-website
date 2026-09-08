import { json } from '@sveltejs/kit';
import { getLatestRates, hasAccountApiKey, type RateMarket } from '$lib/api/accountApi';

const MARKETS: RateMarket[] = ['parallel', 'mid', 'official'];

/**
 * Proxy for the account API's `/rates/latest`.
 *
 * Exists for two reasons. The key: `ACCOUNT_API_KEY` stays on the server, so the
 * browser asks this route and never sees it. The bill: the upstream endpoint is
 * metered per call, and a rate map is identical for every visitor asking for the
 * same base, so it is cached at the edge — one upstream call serves a minute of
 * traffic instead of one per pageview.
 *
 * A base the market does not carry answers 204, not 500. That is the ordinary
 * case for `market=parallel`, which only holds the corridors the pairs feed
 * quotes; the caller falls back to mid.
 */
export async function GET({ url, setHeaders }) {
	const base = (url.searchParams.get('base') ?? 'USD').toUpperCase();
	const market = (url.searchParams.get('market') ?? 'mid').toLowerCase() as RateMarket;

	if (!/^[A-Z0-9]{2,6}$/.test(base)) {
		return json({ message: 'Invalid base' }, { status: 400 });
	}

	if (!MARKETS.includes(market)) {
		return json({ message: `market must be one of ${MARKETS.join(', ')}` }, { status: 400 });
	}

	if (!hasAccountApiKey()) {
		return json({ message: 'Rates are not configured' }, { status: 503 });
	}

	const rates = await getLatestRates(base, market);

	// Cached either way: a base with no rate on this market is just as stable an
	// answer as one with a rate, and re-asking upstream every time would bill for
	// the privilege of being told "no" again.
	setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=60' });

	if (!rates) return new Response(null, { status: 204 });

	return json({ data: rates });
}
