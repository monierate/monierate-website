import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import currencySymbols from '$data/currency-symbols.json';
import currencies from '$data/currencies.json';
import { getAllChangers } from '$lib/services/changer.service';
import { getHighlights } from '$lib/services/highlight.service';
import { getPair } from '$lib/services/pair.service';

type CurrencyMap = Record<string, string>;
type Provider = Awaited<ReturnType<typeof getAllChangers>>[number];

const DEFAULT_BASE = 'USD';
const DEFAULT_QUOTE = 'NGN';

function normalizeCurrency(raw: string | null, valid: readonly string[], fallback: string) {
	const value = (raw ?? fallback).toUpperCase();
	return {
		value: valid.includes(value) ? value : fallback,
		isValid: valid.includes(value)
	};
}

export const load: PageServerLoad = async ({ fetch, url, parent, cookies, depends }) => {
	try {
		const { VALID_CURRENCIES, SUPPORTED_QUOTE_CURRENCIES } = await parent();

		const page = Number(url.searchParams.get('page') ?? 1);

		const baseParam = normalizeCurrency(
			url.searchParams.get('base'),
			VALID_CURRENCIES,
			DEFAULT_BASE
		);

		const quoteParam = normalizeCurrency(
			url.searchParams.get('quote'),
			SUPPORTED_QUOTE_CURRENCIES,
			DEFAULT_QUOTE
		);

		depends('param:base');
		depends('param:quote');

		console.log(quoteParam.value, baseParam.value);

		const pairCode = `${baseParam.value}${quoteParam.value}`.toLowerCase();

		const showHighlights = cookies.get('showHighlights') !== 'false';

		const [rawProviders, pair, highlights] = await Promise.all([
			getAllChangers(fetch),
			getPair(fetch, pairCode),
			getHighlights(fetch, pairCode)
		]);

		if (!rawProviders?.length) {
			throw error(500, {
				message: 'Unable to fetch platforms data, try again in a few minutes.'
			});
		}

		const providers: Record<string, Provider> = {};
		const availablePairs = new Set<string>();

		for (const provider of rawProviders) {
			if (!provider.changer_tags?.includes('offramp')) continue;

			providers[provider.code] = provider;

			if (provider.pairs) {
				for (const pair of Object.keys(provider.pairs)) {
					availablePairs.add(pair);
				}
			}
		}

		const mergedCurrencies: CurrencyMap = {
			...currencies.coins,
			...currencies.fiat
		};

		return {
			providers,
			page,
			base: baseParam.value,
			quote: quoteParam.value,
			isValidBase: baseParam.isValid,
			isValidQuote: quoteParam.isValid,
			currencySymbols,
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
