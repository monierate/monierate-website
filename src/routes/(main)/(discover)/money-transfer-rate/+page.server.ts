import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import currencySymbols from '$data/currency-symbols.json';
import currencies from '$data/currencies.json';

import { getAllChangers } from '$lib/services/changer.service';
import { getPair } from '$lib/services/pair.service';
import { getHighlights } from '$lib/services/highlight.service';
import { normalizeCurrency } from '$lib/functions';

type CurrencyMap = Record<string, string>;
type Provider = Awaited<ReturnType<typeof getAllChangers>>[number];
type ProviderMap = Record<string, Provider>;

const DEFAULT_BASE = 'USD';
const DEFAULT_QUOTE = 'NGN';

export const load: PageServerLoad = async ({ fetch, url, parent, cookies, depends }) => {
	try {
		const { VALID_CURRENCIES, SUPPORTED_QUOTE_CURRENCIES, defaultCurrency } = await parent();

		const page = Number(url.searchParams.get('page')) || 1;

		const base = normalizeCurrency(url.searchParams.get('base'), VALID_CURRENCIES, DEFAULT_BASE);

		const quote = normalizeCurrency(
			url.searchParams.get('quote') ?? defaultCurrency,
			SUPPORTED_QUOTE_CURRENCIES,
			DEFAULT_QUOTE
		);

		depends('param:base');
		depends('param:quote');

		const pairCode = `${base.value}${quote.value}`.toLowerCase();
		const showHighlights = cookies.get('showHighlights') !== 'false';

		let [rawProviders, pair, highlights] = await Promise.all([
			getAllChangers(fetch),
			getPair(fetch, pairCode),
			getHighlights(fetch, pairCode)
		]);

		if (!pair || pair.changers.length === 0) {
			for (const currency of testCurrencies) {
				const testPairCode = `${currency}${quote.value}`.toLowerCase();
				if (testPairCode) {
					pair = await getPair(fetch, testPairCode);
					if (pair && pair.changers.length > 0) {
						base.value = currency;
						break;
					}
				}
			}
		}

		if (!rawProviders || rawProviders.length === 0) {
			throw error(500, {
				message: 'Unable to fetch platforms data, try again in a few minutes.'
			});
		}

		const availablePairs: any[] = [];

		// Transform providers into key-value pair for easy lookup
		const providers: Record<string, (typeof rawProviders)[0]> = {};
		for (const provider of rawProviders) {
			if (provider.changer_tags && provider.changer_tags.includes('remittance')) {
				providers[provider.code] = provider;
				try {
					if (provider.pairs) {
						Object.keys(provider.pairs).forEach((pair) => {
							if (!availablePairs.includes(pair)) {
								availablePairs.push(pair);
							}
						});
					}
				} catch (err) {
					console.error(err);
				}
			}
		}

		const mergedCurrencies: CurrencyMap = {
			...currencies.coins,
			...currencies.fiat
		};

		// Return everything to page
		return {
			page,
			providers,
			base: base.value,
			quote: quote.value,
			isValidBase: base.isValid,
			isValidQuote: quote.isValid,
			currencySymbols,
			mergedCurrencies,
			highlights,
			showHighlights,
			pair
		};
	} catch (err: any) {
		console.error('Page load error:', err);
		throw error(500, {
			message: 'Unable to display data, try again in a few minutes.'
		});
	}
};

const testCurrencies = ['USDT', 'USDC'];
