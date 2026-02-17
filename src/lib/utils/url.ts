import { goto } from '$app/navigation';

/* -----------------------------
 * Currency change → URL-driven
 * ----------------------------- */
export const handleBaseCurrencyChange = async (currency: string) => {
	const params = new URLSearchParams(window.location.search);
	params.set('base', currency.toUpperCase());

	await goto(`?${params.toString()}`, {
		keepFocus: true,
		noScroll: true
	});
};

export const handleQuoteCurrencyChange = async (currency: string) => {
	const params = new URLSearchParams(window.location.search);
	params.set('quote', currency.toUpperCase());

	await goto(`?${params.toString()}`, {
		keepFocus: true,
		noScroll: true
	});
};
