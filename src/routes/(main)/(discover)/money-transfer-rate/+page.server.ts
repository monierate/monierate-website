import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { get_changers } from '$lib/server/changer.service';
import currencySymbols from '$data/currency-symbols.json';
import currencies from '$data/currencies.json';

type CurrencyMap = Record<string, string>;

const getHighlights = async (fetch: typeof globalThis.fetch, pair: string): Promise<any> => {
	try {
		const res = await fetch('/api/highlights?max=5&pair=' + pair);
		if (!res.ok) throw new Error(`Failed to fetch highlights: ${res.status}`);
		return await res.json();
	} catch (err) {
		console.error('getHighlights error:', err);
		return [];
	}
};

export const load: PageServerLoad = async ({ fetch, url, parent, cookies }) => {
	try {
		const { VALID_CURRENCIES } = await parent();
		const page = Number(url.searchParams.get('page') || '1');
		const rawCurrency = (url.searchParams.get('currency') ?? 'USD').toUpperCase();
		const isValidCurrency = (VALID_CURRENCIES as readonly string[]).includes(rawCurrency);
		const currency = isValidCurrency ? (rawCurrency as string) : 'USD';
		const pair = `${currency}NGN`.toLowerCase();

		let showHighlights: boolean = true;
		if (cookies.get('showHighlights')) {
			showHighlights = cookies.get('showHighlights') === 'true';
		}

		// Fetch changers and rate data in parallel
		const [rawProviders, highlights] = await Promise.all([
			get_changers(),
			getHighlights(fetch, pair)
		]);

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
			providers,
			page,
			currency,
			currencySymbols,
			isValidCurrency,
			mergedCurrencies,
			highlights,
			showHighlights
		};
	} catch (err: any) {
		console.error('Page load error:', err);
		throw error(500, {
			message: 'Unable to display data, try again in a few minutes.'
		});
	}
};
