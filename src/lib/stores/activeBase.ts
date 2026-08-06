import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { getCookie, setCookie } from '$lib/functions';
import { DEFAULT_BASE } from '$lib/constants/currency';

export const ACTIVE_BASE_COOKIE_NAME = 'active_base';

/**
 * Read initial value ONLY in the browser
 */
const initialBase = browser ? getCookie(ACTIVE_BASE_COOKIE_NAME) || DEFAULT_BASE : DEFAULT_BASE;

export const activeBase = writable<string>(initialBase);

/**
 * Persist changes to cookie (browser-only)
 */
if (browser) {
	let lastValue: string | null = null;

	activeBase.subscribe((value) => {
		if (!value || value === lastValue) return;

		lastValue = value;
		setCookie(ACTIVE_BASE_COOKIE_NAME, value, 365);
	});
}
