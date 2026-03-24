import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import currencySymbols from '$data/currency-symbols.json';
import currencies from '$data/currencies.json';
import { getAllChangers } from '$lib/services/changer.service';
import { getPair } from '$lib/services/pair.service';
import { getHighlights } from '$lib/services/highlight.service';

type CurrencyMap = Record<string, string>;

export const load: PageServerLoad = async ({ fetch, url, parent, cookies, depends }) => {
	try {
		const { VALID_CURRENCIES, defaultCurrency } = await parent();

		// Declare dependencies
		depends('param:base');
		depends('param:quote');

		const page = Number(url.searchParams.get('page') || '1');

		// ---- BASE ----
		const rawBase = (url.searchParams.get('base') ?? 'USD').toUpperCase();
		const isValidBase = (VALID_CURRENCIES as readonly string[]).includes(rawBase);
		let base = isValidBase ? rawBase : 'USD';

		// ---- QUOTE ----
		const rawQuote = url.searchParams.get('quote')?.toUpperCase();
		const isValidQuote = rawQuote && (VALID_CURRENCIES as readonly string[]).includes(rawQuote);

		const quote = isValidQuote ? rawQuote : defaultCurrency;

		const pairCode = `${base}${quote}`.toLowerCase();

		let showHighlights = cookies.get('showHighlights') !== 'false';

		let [rawProviders, highlights, pair] = await Promise.all([
			getAllChangers(fetch),
			getHighlights(fetch, pairCode),
			getPair(fetch, pairCode)
		]);

		if (!pair || pair.changers.length === 0) {
			for (const currency of testCurrencies) {
				const testPairCode = `${currency}${quote}`.toLowerCase();
				if (testPairCode) {
					pair = await getPair(fetch, testPairCode);
					if (pair && pair.changers.length > 0) {
						base = currency;
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

		const availablePairs: string[] = [];
		const providers: Record<string, (typeof rawProviders)[0]> = {};

		for (const provider of rawProviders) {
			if (provider.changer_tags?.includes('virtualcard')) {
				providers[provider.code] = provider;

				if (provider.pairs) {
					for (const pair of Object.keys(provider.pairs)) {
						if (!availablePairs.includes(pair)) {
							availablePairs.push(pair);
						}
					}
				}
			}
		}

		const mergedCurrencies = {
			...currencies.coins,
			...currencies.fiat
		};

		return {
			providers,
			page,
			base,
			quote,
			currencySymbols,
			isValidBase,
			mergedCurrencies,
			highlights,
			showHighlights,
			pair
		};
	} catch (err) {
		console.error('Page load error:', err);
		throw error(500, {
			message: 'Unable to display data, try again in a few minutes.'
		});
	}
};

const testCurrencies = ['USDT', 'USDC'];
