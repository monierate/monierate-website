import type { PageServerLoad } from './$types';
import { createSpread } from '$lib/services';
import { MARKET_READ_ENABLED } from '$lib/constants/msi';
import type { MsiHistory } from '$lib/services/currency/v1/spread';
import { buildSpreadSeo } from '$lib/utils/providerSeo';

// MSI is USDT/NGN only for now (backend MSI_PAIR). Design the pair into the URL
// later when the API supports more; for now it's fixed.
const PAIR = 'usdtngn';
const RANGES: MsiHistory['range'][] = ['7d', '30d', '90d', '1y'];

export const load: PageServerLoad = async ({ fetch, url }) => {
	const requested = url.searchParams.get('range') as MsiHistory['range'] | null;
	const range = requested && RANGES.includes(requested) ? requested : '30d';

	const svc = createSpread(fetch, url.origin);

	// Stream each independently so a slow/failed call never blocks the others.
	const current = svc
		.getCurrent(PAIR)
		.then((r) => r?.data ?? null)
		.catch(() => null);
	const history = svc
		.getHistory({ range, pair: PAIR })
		.then((r) => r?.data ?? null)
		.catch(() => null);
	const sources = svc
		.getSources(PAIR)
		.then((r) => r?.data ?? null)
		.catch(() => null);

	// Default position-aware interpretation (watching). The toggle refetches
	// other positions client-side; this seeds the first paint.
	const interpretation = MARKET_READ_ENABLED
		? svc
				.getInterpretation({ position: 'watching', pair: PAIR })
				.then((r) => r?.data ?? null)
				.catch(() => null)
		: Promise.resolve(null);

	return { range, current, history, sources, interpretation, seo: buildSpreadSeo() };
};
