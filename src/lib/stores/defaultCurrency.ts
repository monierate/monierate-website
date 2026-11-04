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
 * The currency the server settled on for the current page (?quote=, then the
 * cookie, then the visitor's country — see (main)/+layout.server.ts).
 */
let serverResolved: string | null = null;

/**
 * Mirror the server's choice into the store without saving it as the visitor's
 * own pick. If it were saved, a first visit would pin the cookie to whatever the
 * page resolved to — a Kenyan visitor's later visits would skip the country
 * lookup, and a visitor from a country we add later would stay stuck on NGN.
 */
export function syncDefaultCurrency(currency: string) {
	serverResolved = currency;
	defaultCurrencyStore.set(currency);
}

/**
 * Persist changes to cookie (browser-only)
 */
if (browser) {
	// Seeded with the starting value so the store's first emission — the
	// cookie we just read, or the bare NGN fallback — is not written back.
	let lastValue: string | null = initialCurrency;

	defaultCurrencyStore.subscribe((value) => {
		// guard against empty values & redundant writes
		if (!value || value === lastValue) return;

		lastValue = value;
		if (value === serverResolved) return;

		setCookie(DEFAULT_CURRENCY_COOKIE_NAME, value, 365);
	});
}
