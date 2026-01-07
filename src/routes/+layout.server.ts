import { basicAuth, getEndpoint } from "$lib/helper";
import type { LayoutServerLoad } from "./$types";
import { parseJSONSafe } from '$lib/functions';
import { BANNER_COOKIE_PREFIX } from '$lib/stores/banner-store';

export const load: LayoutServerLoad = async ({ request, cookies, fetch }) => {

    const userAgent = request.headers.get('user-agent') || '';
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    const authToken = cookies.get('auth_token');
    const user = {
        isLoggedIn: false,
        userToken: null,
        userData: null,
    } as {
        isLoggedIn: boolean,
        userToken: string | null,
        userData: any,
    }

    if (authToken) {
        const response = await fetch(`/api/users/get_user?user_token=${authToken}`);
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

    const selected_partner_top = selectTopPartnerBanner();
    const get_pairs = await getPairs();
    const pairs = get_pairs.result;
    const top_pairs = select_top_pairs(pairs);

    const market_avg_rate = top_pairs.usdngn.price;

    // Extract banner cookies from the request
    const bannerIndexes: Record<string, number> = {};
    const allCookies = cookies.getAll();
    for (const { name, value } of allCookies) {
        if (name.startsWith(BANNER_COOKIE_PREFIX)) {
            const bannerName = name.replace(BANNER_COOKIE_PREFIX, '');
            bannerIndexes[bannerName] = parseInt(value, 10) || 0;
        }
    }

    return {
        pairs,
        top_pairs,
        market_avg_rate,
        selected_partner_top,
        user,
        bannerIndexes,
        isMobile,
        VALID_CURRENCIES,
    }

};

const select_top_pairs = (pairs: any) => {
    // hardcoded top pairs for now, dynamic in the future based on user IP
    const top_pairs = ['usdngn', 'usdtngn', 'btcngn', 'eurngn', 'gbpngn', 'cadngn'];
    // filter pairs to get top selected pairs by code
    // but filter should be in order of the top pairs hardcoded above
    // then sort them by price in descending order
    const top_selected_pairs = top_pairs.map(
        (pair_code: string) => pairs.find(
            (pair: any) => pair.code === pair_code)
    );

    // convert selected pair from array to key object 
    const top_selected_pairs_obj: Record<string, any> = {};
    top_selected_pairs.forEach((pair: any) => {
        // split the pair code to base and qoute currency code
        const quote = 'NGN';
        const split_code = pair.code.toUpperCase().split(quote);
        const base = split_code[0].toUpperCase();

        top_selected_pairs_obj[pair.code] = {
            price: pair.price.current,
            name: `${base}/${quote}`,
            from: base,
            to: quote,
            price_change_percent_24hr: pair.price_change_percent_24hr,
        };
    });

    return top_selected_pairs_obj;
}

const getDeviceName = (request: any) => {
    const headers = request.headers;
    const userAgent = headers.get('user-agent') || '';
    console.log(userAgent)

    let detectedDevice = 'Unknown';

    if (userAgent.includes('iPhone')) {
        detectedDevice = 'iphone';
    } else if (userAgent.includes('Android')) {
        detectedDevice = 'Android';
    } else {
        detectedDevice = 'Unknown';
    }

    return detectedDevice;
}

const getPairs = async () => {
    let endpoint = getEndpoint("/pairs/get_all_pairs?page=1&limit=100");
    let response = await fetch(endpoint, basicAuth('GET', {}));

    if (response.status != 200) {
        return null;
    }

    const pairs = (await response.json()).data;

    return pairs;
}

const sponsored_partners = [
    {
        image: 'https://tinyurl.com/nsave-app-sponsored-link',
        text: 'Open a USD Salary Account',
        link: 'https://tinyurl.com/nsave-app-sponsored-link',
        brand: 'nsave',
        cta: 'Download App'
    },
    // {
    //     image: 'https://bit.ly/3svJGhQ',
    //     text: 'Send money to over 80 countries worldwide.',
    //     link: 'https://tinyurl.com/cambridge-currences-top-banner',
    //     brand: 'Cambridge Currencies',
    //     cta: 'Send Money'
    // }
];

const selectTopPartnerBanner = () => {
    const random_index = Math.floor(Math.random() * sponsored_partners.length);
    return sponsored_partners[random_index];
}

const VALID_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'BTC', 'USDT', 'USDC'] as const;
