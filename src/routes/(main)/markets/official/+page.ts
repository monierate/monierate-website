import { getMarketRates } from '$lib/services/market.service';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	return getMarketRates(fetch, 'cbn');
};
