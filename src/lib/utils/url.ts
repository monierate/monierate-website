import { goto } from '$app/navigation';

/* -----------------------------
 * Currency change → URL-driven
 * -----------------------------
 * window.location only reflects a navigation once its load functions
 * resolve, so rapid changes (e.g. switching base while a quote change
 * is still loading) must compose on the in-flight target params, not
 * the stale URL.
 */
let pendingParams: URLSearchParams | null = null;

const getCurrentParams = () => new URLSearchParams(pendingParams ?? window.location.search);

const navigateWithParams = async (params: URLSearchParams) => {
	pendingParams = params;
	try {
		await goto(`?${params.toString()}`, {
			keepFocus: true,
			noScroll: true
		});
	} catch {
		// navigation was superseded or aborted — nothing to do
	} finally {
		if (pendingParams === params) pendingParams = null;
	}
};

export const handleBaseCurrencyChange = async (currency: string) => {
	const params = getCurrentParams();
	params.set('base', currency.toUpperCase());
	await navigateWithParams(params);
};

export const handleQuoteCurrencyChange = async (currency: string) => {
	const params = getCurrentParams();
	params.set('quote', currency.toUpperCase());
	await navigateWithParams(params);
};
