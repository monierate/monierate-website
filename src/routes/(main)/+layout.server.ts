import type { LayoutServerLoad } from './$types';
import { parseJSONSafe } from '$lib/functions';
import { DEFAULT_CURRENCY_COOKIE_NAME } from '$lib/stores/defaultCurrency';
import { getPair, getAllPairs } from '$lib/services/pair.service';

export const load: LayoutServerLoad = async ({ request, cookies, fetch }) => {
	const userAgent = request.headers.get('user-agent') || '';
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

	const authToken = cookies.get('auth_token');
	const user = {
		isLoggedIn: false,
		userToken: null,
		userData: null
	} as {
		isLoggedIn: boolean;
		userToken: string | null;
		userData: any;
	};
	const defaultCurrency = cookies.get(DEFAULT_CURRENCY_COOKIE_NAME) || 'NGN';

	if (authToken) {
		const response = await fetch(`/api/users/get_user`);
		if (response.ok) {
			let userData = await response.json();
			userData = parseJSONSafe(userData);

			if (userData.status === 'success') {
				user.isLoggedIn = true;
				user.userToken = authToken;
				user.userData = userData;
			}
		}
	}

	const top_pairs = {};
	// const top_pairs = select_top_pairs(pairs, defaultCurrency);

	// const market_avg_rate = top_pairs.usdngn.price;
	const market_avg_rate = 0;

	return {
		top_pairs,
		market_avg_rate,
		user,
		bannerIndexes: 0,
		isMobile,
		VALID_CURRENCIES,
        defaultCurrency,
	};
};

const select_top_pairs = (pairs: any[], quote: string) => {
	// hardcoded priority pairs
	const top_pairs = ['usdngn', 'usdtngn', 'btcngn', 'eurngn', 'gbpngn', 'cadngn'];

	// 1. pick hardcoded pairs first (in order)
	const priorityPairs = top_pairs
		.map(code => pairs.find(p => p.code === code))
		.filter(Boolean);

	// 2. get remaining pairs not already selected
	const remainingPairs = pairs
		.filter(p => !priorityPairs.some(pp => pp.code === p.code))
		.sort((a, b) => b.price.current - a.price.current);

	// 3. combine and limit to top 6
	const selectedPairs = [...priorityPairs, ...remainingPairs].slice(0, 6);

	// 4. sort final result by price descending
	selectedPairs.sort((a, b) => b.price.current - a.price.current);

	// 5. convert to keyed object
	const result: Record<string, any> = {};

	selectedPairs.forEach(pair => {
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

const getTopPairs = async (fetch:any) => {
	const result = await getAllPairs(fetch, undefined, 1, 100);
	if (!result) {
		return null;
	}
	return result;
}

const VALID_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'BTC', 'USDT', 'USDC'] as const;
