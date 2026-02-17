import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import currencySymbols from '$data/currency-symbols.json';
import { getHighlights } from '$lib/services/highlight.service';

export const load: PageServerLoad = async ({ fetch, url, parent, depends }) => {
	try {
		const { VALID_CURRENCIES, defaultCurrency } = await parent();
		// Declare dependencies
		depends('param:base');
		depends('param:quote');

		const page = Number(url.searchParams.get('page') || '1');

		// ---- BASE ----
		const rawBase = (url.searchParams.get('base') ?? 'USD').toUpperCase();
		const isValidBase = (VALID_CURRENCIES as readonly string[]).includes(rawBase);
		const base = isValidBase ? rawBase : 'USD';

		// ---- QUOTE ----
		const rawQuote = url.searchParams.get('quote')?.toUpperCase();
		const isValidQuote = rawQuote && (VALID_CURRENCIES as readonly string[]).includes(rawQuote);

		const quote = isValidQuote ? rawQuote : defaultCurrency;

		const pairCode = `${base}${quote}`.toLowerCase();

		const highlights = await getHighlights(fetch, pairCode);

		return {
			base,
			quote,
			currencySymbols,
			highlights,
			isValidBase
		};
	} catch (err: any) {
		console.error('Page load error:', err);
		throw error(500, {
			message: 'Unable to display data, try again in a few minutes.'
		});
	}
};
