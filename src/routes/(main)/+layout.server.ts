import type { LayoutServerLoad } from './$types';
import { DEFAULT_CURRENCY_COOKIE_NAME } from '$lib/stores/defaultCurrency';
import { getAllPairs } from '$lib/services/pair.service';
import { getUser } from '$lib/services/user.service';
import countriesToCurrency from '$data/countries-to-currencies.json';

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

	const ucountry = locals.ucountry || cookies.get('ucountry') || 'XX'; // XX is default country code
	const selectedCurrencyFromCookie = cookies.get(DEFAULT_CURRENCY_COOKIE_NAME) || undefined;
	const typedCountriesToCurrency: Record<string, string> = countriesToCurrency as Record<
		string,
		string
	>;
	const currencyFromCountry = (typedCountriesToCurrency[ucountry.toUpperCase()] || 'NGN') as any;
	const quote = url.searchParams.get('quote') ?? undefined;

	const defaultCurrency =
		quote ||
		selectedCurrencyFromCookie ||
		(SUPPORTED_QUOTE_CURRENCIES.includes(currencyFromCountry) ? currencyFromCountry : 'NGN');

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

	const allPairs = await getTopPairs(fetch, defaultCurrency || 'NGN');
	const top_pairs = select_top_pairs(allPairs?.result ?? [], defaultCurrency || 'NGN');

	const market_avg_rate = top_pairs?.usdngn?.price ?? 0;

	return {
		top_pairs,
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

const select_top_pairs = (pairs: any[], quote: string) => {
	// A base that is also the quote has no pair of its own (e.g. keskes), so drop it.
	const top_pairs = TICKER_BASES.filter((base) => base !== quote.toUpperCase()).map((base) =>
		`${base}${quote}`.toLowerCase()
	);

	const priorityPairs = top_pairs.map((code) => pairs.find((p) => p.code === code)).filter(Boolean);

	const remainingPairs = pairs
		.filter((p) => !priorityPairs.some((pp) => pp.code === p.code))
		.sort((a, b) => b.price.current - a.price.current);

	const selectedPairs = [...priorityPairs, ...remainingPairs].slice(0, top_pairs.length);

	const result: Record<string, any> = {};

	selectedPairs.forEach((pair) => {
		const base = pair.code.toUpperCase().replace(quote.toUpperCase(), '');

		result[pair.code] = {
			price: pair.price.current,
			name: `${base}/${quote}`,
			from: base,
			to: quote,
			price_change_percent_24hr: pair.price_change_percent_24hr
		};
	});

	return result;
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
	'USDT',
	'USDC'
] as const;

const SUPPORTED_QUOTE_CURRENCIES = ['NGN', 'KES'] as const;

// Bases shown in the top-nav ticker, in order.
const TICKER_BASES = ['USD', 'USDT', 'BTC', 'EUR', 'GBP', 'CAD', 'GHS', 'KES', 'ZAR'];

const ENABLE_CATEGORIES_FOR = ['NGN'];
