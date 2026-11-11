import type { Cookies } from '@sveltejs/kit';
import countriesToCurrency from '$data/countries-to-currencies.json';
import { AVAILABLE_QUOTE_CURRENCIES } from '$lib/constants/currency';
import { DEFAULT_CURRENCY_COOKIE_NAME } from '$lib/stores/defaultCurrency';

const COUNTRY_CURRENCY = countriesToCurrency as Record<string, string>;
const SUPPORTED: readonly string[] = AVAILABLE_QUOTE_CURRENCIES;
const FALLBACK = 'NGN';

/**
 * When we don't carry a country's own currency, show the one most used around
 * it rather than jumping straight to NGN. Keyed by that regional currency;
 * the countries listed are ones whose own currency we don't carry.
 *
 * - KES: East Africa, where the shilling is the reference currency people
 *   trade against.
 * - ZAR: the Common Monetary Area. The Namibian dollar, loti and lilangeni are
 *   pegged 1:1 to the rand, and the rand circulates alongside them.
 *
 * West Africa and everywhere else fall through to NGN. A country moves off
 * this list once its own currency is in AVAILABLE_QUOTE_CURRENCIES.
 */
const REGIONAL_CURRENCY: Record<string, readonly string[]> = {
	KES: [
		'UG', // Uganda
		'TZ', // Tanzania
		'RW', // Rwanda
		'BI', // Burundi
		'SS', // South Sudan
		'SO', // Somalia
		'ET', // Ethiopia
		'DJ', // Djibouti
		'ER' // Eritrea
	],
	ZAR: [
		'NA', // Namibia
		'LS', // Lesotho
		'SZ' // Eswatini
	]
};

const COUNTRY_TO_REGIONAL: Record<string, string> = Object.fromEntries(
	Object.entries(REGIONAL_CURRENCY).flatMap(([currency, countries]) =>
		countries.map((country) => [country, currency])
	)
);

/**
 * The visitor's ISO-2 country: Cloudflare's cf-ipcountry (set in hooks.server.ts),
 * else the client-side guess cookie, else XX.
 */
export function visitorCountry(locals: App.Locals, cookies: Cookies): string {
	return locals.ucountry || cookies.get('ucountry') || 'XX';
}

/**
 * The currency a visitor from this country should see first: their own when we
 * carry it, else their region's (see REGIONAL_CURRENCY), else NGN.
 */
export function currencyForCountry(country: string): string {
	const code = country.toUpperCase();
	const candidates = [COUNTRY_CURRENCY[code], COUNTRY_TO_REGIONAL[code]];
	return candidates.find((currency) => currency && SUPPORTED.includes(currency)) ?? FALLBACK;
}

/**
 * The quote currency a page should open on: an explicit ?quote= wins, then the
 * visitor's own pick (cookie), then their country's currency.
 */
export function resolveDefaultCurrency({
	url,
	cookies,
	locals
}: {
	url: URL;
	cookies: Cookies;
	locals: App.Locals;
}): string {
	return (
		url.searchParams.get('quote') ||
		cookies.get(DEFAULT_CURRENCY_COOKIE_NAME) ||
		currencyForCountry(visitorCountry(locals, cookies))
	);
}
