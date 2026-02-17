import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { getCookie, setCookie } from '$lib/functions';

const FALLBACK_CURRENCY = 'NGN';
export const DEFAULT_CURRENCY_COOKIE_NAME = 'default_currency';

/**
 * Read initial value ONLY in the browser
 */
const initialCurrency = browser
	? getCookie(DEFAULT_CURRENCY_COOKIE_NAME) || FALLBACK_CURRENCY
	: FALLBACK_CURRENCY;

export const defaultCurrencyStore = writable<string>(initialCurrency);

/**
 * Persist changes to cookie (browser-only)
 */
if (browser) {
	let lastValue: string | null = null;

	defaultCurrencyStore.subscribe((value) => {
		// guard against empty values & redundant writes
		if (!value || value === lastValue) return;

		lastValue = value;
		setCookie(DEFAULT_CURRENCY_COOKIE_NAME, value, 365);
	});
}
