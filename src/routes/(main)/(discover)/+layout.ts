import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { DEFAULT_CURRENCY_COOKIE_NAME } from '$lib/stores/defaultCurrency';
import { getCookie } from '$lib/functions';

export const load: LayoutLoad = async ({ url }) => {
    const quote = url.searchParams.get('quote') || 'NGN';
	const defaultCurrency = getCookie(DEFAULT_CURRENCY_COOKIE_NAME) || 'NGN';

    const currency = quote || defaultCurrency;

	if (currency.toUpperCase() !== 'NGN') {
		throw redirect(302, '/');
	}
};
