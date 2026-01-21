import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import currencySymbols from '$data/currency-symbols.json';
import currencies from '$data/currencies.json';
import { getAllChangers } from '$lib/services/changer.service';
import { getPair } from '$lib/services/pair.service';
import { getHighlights } from '$lib/services/highlight.service';
import { mapProvidersByCode } from '$lib/utils';

type CurrencyMap = Record<string, string>;

export const load: PageServerLoad = async ({ fetch, url, parent, cookies, depends }) => {
	try {
		/* -----------------------------
		 * Explicit param dependencies
		 * ----------------------------- */
		depends('params:page', 'params:base', 'params:quote');

		const pageParam = url.searchParams.get('page');
		const baseParam = url.searchParams.get('base');
		const quoteParam = url.searchParams.get('quote');

		/* -----------------------------
		 * Parent data
		 * ----------------------------- */
		const { VALID_CURRENCIES, defaultCurrency } = await parent();

		/* -----------------------------
		 * Normalize params
		 * ----------------------------- */
		const page = Number(pageParam ?? '1');

		const baseInput = (baseParam ?? 'USD').toUpperCase();
		const quoteInput = (quoteParam ?? defaultCurrency).toUpperCase();

		const isValidCurrency = (VALID_CURRENCIES as readonly string[]).includes(baseInput);
		const base = isValidCurrency ? baseInput : 'USD';
		const quote = quoteInput || defaultCurrency;

		const pairCode = `${base}${quote}`.toLowerCase();

		/* -----------------------------
		 * UI preferences
		 * ----------------------------- */
		const showHighlights = cookies.get('showHighlights') !== 'false';

		/* -----------------------------
		 * Fetch data
		 * ----------------------------- */
		const [providers, highlights, pair] = await Promise.all([
			getAllChangers(fetch),
			getHighlights(fetch, pairCode),
			getPair(fetch, pairCode)
		]);

		if (!providers?.length) {
			throw error(500, {
				message: 'Unable to fetch platforms data, try again in a few minutes.'
			});
		}

		/* -----------------------------
		 * Providers & rates
		 * ----------------------------- */
		const providersByCode = mapProvidersByCode(providers, [pairCode]);

		const rates = pair?.changers ?? [];
		const filteredRates = rates.filter((rate: any) => !!providersByCode[rate.changer_code]);

		/* -----------------------------
		 * Currency maps
		 * ----------------------------- */
		const mergedCurrencies: CurrencyMap = {
			...currencies.coins,
			...currencies.fiat
		};

		return {
			page,
			base,
			quote,
			isValidCurrency,
			showHighlights,
			pair,
			highlights,
			rates: filteredRates,
			providers: providersByCode,
			total: Object.keys(providersByCode).length,
			currencySymbols,
			mergedCurrencies
		};
	} catch (err) {
		console.error('Page load error:', err);
		throw error(500, {
			message: 'Unable to display data, try again in a few minutes.'
		});
	}
};
