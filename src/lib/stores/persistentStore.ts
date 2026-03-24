import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import { getCookie, setCookie } from '$lib/functions';

export function persistentCookieStore(
	key: string,
	initial: string | null = null
): Writable<string | null> {
	const startValue = browser ? (getCookie(key) ?? initial) : initial;

	const store = writable<string | null>(startValue);

	if (browser) {
		store.subscribe((value) => {
			if (value) {
				setCookie(key, value, 30);
			}
		});
	}

	return store;
}
