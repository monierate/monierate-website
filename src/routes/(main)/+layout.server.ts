import type { LayoutServerLoad } from './$types';
import { getAllPairs } from '$lib/services/pair.service';
import { getUser } from '$lib/services/user.service';
import { AVAILABLE_QUOTE_CURRENCIES } from '$lib/constants/currency';
import { resolveDefaultCurrency, visitorCountry } from '$lib/server/defaultCurrency';
import { footerCountry, pickFooterProviders, providerNames } from '$lib/server/footerProviders';
import { loadTicker } from '$lib/server/ticker';
import { quoteBases } from '$lib/server/quoteBases';

export const load: LayoutServerLoad = async ({ request, cookies, fetch, locals, depends, url }) => {
	const userAgent = request.headers.get('user-agent') || '';
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

	depends('params:quote');

	const auth: {
		isLoggedIn: boolean;
		userToken: string | null;
		user: any;
	} = {
		isLoggedIn: false,
		userToken: null,
		user: null
	};

	const ucountry = visitorCountry(locals, cookies);
	const defaultCurrency = resolveDefaultCurrency({ url, cookies, locals });

	/* -------------------- */
	/* User authentication */
	/* -------------------- */

	const userResult = await getUser(fetch);

	if (userResult) {
		auth.isLoggedIn = true;
		auth.user = userResult;
	}

	/* -------------------- */
	/* Market data          */
	/* -------------------- */

	const [allPairs, names] = await Promise.all([
		getTopPairs(fetch, defaultCurrency || 'NGN'),
		providerNames(fetch)
	]);
	const top_pairs = await loadTicker(fetch, allPairs?.result ?? [], defaultCurrency || 'NGN');

	const market_avg_rate = top_pairs?.usdngn?.price ?? 0;

	const footer = {
		providers: pickFooterProviders(allPairs?.result ?? [], defaultCurrency || 'NGN', names),
		country: footerCountry(defaultCurrency || 'NGN')
	};

	return {
		top_pairs,
		footer,
		quote_bases: quoteBases(allPairs?.result ?? [], defaultCurrency || 'NGN'),
		market_avg_rate,
		auth,
		bannerIndexes: 0,
		isMobile,
		VALID_CURRENCIES,
		defaultCurrency,
		SUPPORTED_QUOTE_CURRENCIES,
		ENABLE_CATEGORIES_FOR,
		ucountry
	};
};

const getTopPairs = async (fetch: any, quote = 'NGN') => {
	const result = await getAllPairs(fetch, undefined, 1, 100, quote);
	return result ?? null;
};

const VALID_CURRENCIES = [
	'USD',
	'EUR',
	'GBP',
	'CAD',
	'GHS',
	'KES',
	'ZAR',
	'BTC',
	'ETH',
	'USDT',
	'USDC'
] as const;

const SUPPORTED_QUOTE_CURRENCIES: readonly string[] = AVAILABLE_QUOTE_CURRENCIES;


const ENABLE_CATEGORIES_FOR = ['NGN'];
