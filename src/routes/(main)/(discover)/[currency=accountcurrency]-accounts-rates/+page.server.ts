import { error, isRedirect, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import currencySymbols from '$data/currency-symbols.json';
import currencies from '$data/currencies.json';

import { getAllChangers } from '$lib/services/changer.service';
import { getPair } from '$lib/services/pair.service';
import { getHighlights } from '$lib/services/highlight.service';
import { normalizeCurrency } from '$lib/functions';
import {
	accountsHref,
	DEFAULT_VIRTUAL_ACCOUNT_BASE,
	VIRTUAL_ACCOUNTS_SLUG
} from '$lib/utils/accountsRoute';

type CurrencyMap = Record<string, string>;
type Provider = Awaited<ReturnType<typeof getAllChangers>>[number];
type ProviderMap = Record<string, Provider>;

const DEFAULT_QUOTE = 'NGN';

export const load: PageServerLoad = async ({ fetch, url, params, parent, cookies, depends }) => {
	try {
		const { VALID_CURRENCIES, SUPPORTED_QUOTE_CURRENCIES, defaultCurrency } = await parent();

		const page = Number(url.searchParams.get('page')) || 1;

		// Fiat pages carry the base in the path. The shared virtual page carries a crypto
		// base in the query; a `?base=` on a fiat page is a legacy link (the old
		// `/usd-accounts-rates?base=EUR`) and is honoured, then canonicalised below.
		const slug = params.currency.toLowerCase();
		const rawBase = url.searchParams.get('base');
		const base =
			slug === VIRTUAL_ACCOUNTS_SLUG || rawBase
				? normalizeCurrency(
						rawBase,
						VALID_CURRENCIES,
						slug === VIRTUAL_ACCOUNTS_SLUG ? DEFAULT_VIRTUAL_ACCOUNT_BASE : slug.toUpperCase()
					)
				: { value: slug.toUpperCase(), isValid: true };

		// e.g. /usd-accounts-rates?base=EUR -> /eur-accounts-rates, /virtual-accounts-rates?base=GBP -> /gbp-accounts-rates
		const canonical = accountsHref(base.value, url.search);
		if (base.isValid && canonical !== url.pathname + url.search) {
			throw redirect(301, canonical);
		}

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

			// The fallback base lives on a different URL; send the visitor there rather
			// than render stablecoin rates under an EUR Accounts address.
			const fallback = accountsHref(base.value, url.search);
			if (fallback !== url.pathname + url.search) {
				throw redirect(307, fallback);
			}
		}

		if (!rawProviders?.length) {
			throw error(500, {
				message: 'Unable to fetch platforms data, try again in a few minutes.'
			});
		}

		const providers: ProviderMap = {};
		const availablePairs = new Set<string>();

		for (const provider of rawProviders) {
			if (!provider.changer_tags?.includes('account')) continue;

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
	} catch (err) {
		if (isRedirect(err)) throw err;

		console.error('Page load error:', err);

		throw error(500, {
			message: 'Unable to display data, try again in a few minutes.'
		});
	}
};

const testCurrencies = ['USDT', 'USDC'];
