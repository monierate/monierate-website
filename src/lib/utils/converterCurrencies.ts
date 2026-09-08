import currencyNames from '$data/currencies.json';
import { CURRENCY_SYMBOLS } from '$lib/constants/currency';

/**
 * The currency list the converter offers, assembled from two sources that each
 * know half of what the page needs.
 *
 * The currency API knows ~90 currencies *well* — description, icon, symbol — which
 * is what the info cards and the picker render. The mid-market snapshot knows every
 * currency we can actually quote, which is a different and larger set. Offering only
 * the first would make a "global" converter that cannot price EUR/JPY; offering only
 * the second would list codes with no name against them.
 *
 * So: everything we can quote, named from whichever source has a name, and marked
 * with whether we hold enough about it to render an info card.
 */

const NAMES: Record<string, string> = {
	...(currencyNames as any).coins,
	...(currencyNames as any).fiat
};

/**
 * Shown at the top of the picker, in this order. The rest follow alphabetically.
 * Chosen from the corridors Monierate actually tracks plus the majors a global
 * converter is expected to lead with.
 */
const PINNED = [
	'USD',
	'NGN',
	'EUR',
	'GBP',
	'CAD',
	'GHS',
	'KES',
	'ZAR',
	'USDT',
	'USDC',
	'BTC'
] as const;

export interface ConverterCurrency {
	/** Uppercase, e.g. USD. */
	code: string;
	name: string;
	symbol: string;
	description: string;
	/** Icon filename from the currency API, when it has one. */
	icon: string;
	/** True while the code sits in the pinned block at the top of the picker. */
	pinned: boolean;
}

/** Raw shape of a currency-API record. */
interface ApiCurrency {
	code: string;
	name?: string;
	symbol?: string;
	description?: string;
	icon?: string;
	is_active?: boolean;
}

/**
 * Assemble the picker.
 *
 * Membership is `priceable` — the currencies we can actually return a rate for.
 * The currency API is a *metadata* source here, not a membership one: it names 84
 * active currencies while the mid market prices 57, and the 27 it names but cannot
 * price (BIF, CDF, ETB, MUR, ZMW …) were being offered in the picker and then
 * answered with "no rate". A picker that promises conversions the page cannot do
 * is worse than a shorter picker.
 *
 * `alwaysInclude` covers the conversion currently on screen, so a corridor the
 * pairs feed can answer still renders even if the mid market has never held it.
 *
 * If the priceable lookup comes back empty — no key, or the rates service down —
 * membership falls back to the named set rather than rendering an empty picker.
 */
export function buildCurrencyUniverse(
	apiCurrencies: ApiCurrency[],
	priceable: string[],
	alwaysInclude: string[] = []
): ConverterCurrency[] {
	const named = new Map<string, ApiCurrency>();

	for (const currency of apiCurrencies) {
		if (currency?.is_active === false) continue;
		if (currency?.code) named.set(currency.code.toUpperCase(), currency);
	}

	const members = new Set(
		(priceable.length ? priceable : [...named.keys()]).map((c) => c.toUpperCase())
	);

	for (const code of alwaysInclude) {
		if (code) members.add(code.toUpperCase());
	}

	const all = [...members].map((upper) => {
		const source = named.get(upper);

		return {
			code: upper,
			name: source?.name || NAMES[upper] || upper,
			symbol: source?.symbol || CURRENCY_SYMBOLS[upper.toLowerCase()] || '',
			description: source?.description ?? '',
			icon: source?.icon ?? '',
			pinned: (PINNED as readonly string[]).includes(upper)
		};
	});

	const pinnedOrder = new Map<string, number>(PINNED.map((code, i) => [code, i]));

	return all.sort((a, b) => {
		const aPin = pinnedOrder.get(a.code);
		const bPin = pinnedOrder.get(b.code);

		if (aPin !== undefined && bPin !== undefined) return aPin - bPin;
		if (aPin !== undefined) return -1;
		if (bPin !== undefined) return 1;

		return a.code.localeCompare(b.code);
	});
}

/** Look one up, falling back to a record built from the code alone. */
export function findCurrency(
	currencies: ConverterCurrency[],
	code: string
): ConverterCurrency {
	const upper = code.toUpperCase();

	return (
		currencies.find((c) => c.code === upper) ?? {
			code: upper,
			name: NAMES[upper] || upper,
			symbol: CURRENCY_SYMBOLS[code.toLowerCase()] || '',
			description: '',
			icon: '',
			pinned: false
		}
	);
}

/** Display name for a code, without needing the assembled list. */
export function currencyName(code: string): string {
	return NAMES[code.toUpperCase()] ?? code.toUpperCase();
}

/**
 * Corridors linked from the hub and from the "popular conversions" block.
 * Deliberately weighted to the pairs we hold exchange quotes for — those are the
 * pages that show something no other converter can.
 */
export const POPULAR_CONVERSIONS: { from: string; to: string }[] = [
	{ from: 'usd', to: 'ngn' },
	{ from: 'gbp', to: 'ngn' },
	{ from: 'eur', to: 'ngn' },
	{ from: 'cad', to: 'ngn' },
	{ from: 'usdt', to: 'ngn' },
	{ from: 'usd', to: 'ghs' },
	{ from: 'usd', to: 'kes' },
	{ from: 'zar', to: 'ngn' },
	{ from: 'ngn', to: 'usd' },
	{ from: 'usd', to: 'eur' },
	{ from: 'usd', to: 'gbp' },
	{ from: 'eur', to: 'gbp' }
];
