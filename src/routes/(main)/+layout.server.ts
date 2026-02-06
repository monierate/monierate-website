import type { LayoutServerLoad } from './$types';
import { DEFAULT_CURRENCY_COOKIE_NAME } from '$lib/stores/defaultCurrency';
import { getAllPairs } from '$lib/services/pair.service';
import { getUser } from '$lib/services/user.service';

export const load: LayoutServerLoad = async ({ request, cookies, fetch }) => {
	const userAgent = request.headers.get('user-agent') || '';
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

	const auth: {
		isLoggedIn: boolean;
		userToken: string | null;
		user: any;
	} = {
		isLoggedIn: false,
		userToken: null,
		user: null
	};

	const defaultCurrency = cookies.get(DEFAULT_CURRENCY_COOKIE_NAME) || 'NGN';

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

	const allPairs = await getTopPairs(fetch);
	const top_pairs = select_top_pairs(allPairs?.result ?? [], 'NGN');

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
	};
};

const select_top_pairs = (pairs: any[], quote: string) => {
	const top_pairs = ['usdngn', 'usdtngn', 'btcngn', 'eurngn', 'gbpngn', 'cadngn'];

	const priorityPairs = top_pairs.map((code) => pairs.find((p) => p.code === code)).filter(Boolean);

	const remainingPairs = pairs
		.filter((p) => !priorityPairs.some((pp) => pp.code === p.code))
		.sort((a, b) => b.price.current - a.price.current);

	const selectedPairs = [...priorityPairs, ...remainingPairs].slice(0, 6);

	selectedPairs.sort((a, b) => b.price.current - a.price.current);

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

const getTopPairs = async (fetch: any) => {
	const result = await getAllPairs(fetch, undefined, 1, 100);
	return result ?? null;
};

const VALID_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'BTC', 'USDT', 'USDC'] as const;

const SUPPORTED_QUOTE_CURRENCIES = ['NGN', 'KES'] as const;
