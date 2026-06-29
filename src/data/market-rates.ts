import type { MarketCurrencyRate, MarketKey, MarketMeta } from '$lib/types/market';

/**
 * DUMMY DATA — temporary.
 *
 * Everything here will eventually be sourced from docs.monierate.com via
 * `src/lib/services/market.service.ts`. For now we generate realistic-looking
 * NGN rates from a single curated base list so the UI can be built and reviewed.
 *
 * `mid` is the approximate mid-market value of 1 unit of the currency in NGN.
 * Per-market buy/sell/rate values are derived deterministically from `mid`.
 */
interface BaseCurrency {
	code: string;
	name: string;
	countryCode: string;
	mid: number;
	change: number;
}

// Ordered roughly by relevance/liquidity so the "top 20" feels intentional.
const BASE: BaseCurrency[] = [
	{ code: 'USD', name: 'US Dollar', countryCode: 'US', mid: 1552.4, change: 0.34 },
	{ code: 'EUR', name: 'Euro', countryCode: 'EU', mid: 1681.2, change: -0.21 },
	{ code: 'GBP', name: 'British Pound', countryCode: 'GB', mid: 1984.7, change: 0.58 },
	{ code: 'CAD', name: 'Canadian Dollar', countryCode: 'CA', mid: 1139.5, change: 0.12 },
	{ code: 'CNY', name: 'Chinese Yuan', countryCode: 'CN', mid: 214.8, change: -0.05 },
	{ code: 'JPY', name: 'Japanese Yen', countryCode: 'JP', mid: 10.32, change: 0.27 },
	{ code: 'GHS', name: 'Ghanaian Cedi', countryCode: 'GH', mid: 103.6, change: -0.44 },
	{ code: 'ZAR', name: 'South African Rand', countryCode: 'ZA', mid: 85.1, change: 0.19 },
	{ code: 'KES', name: 'Kenyan Shilling', countryCode: 'KE', mid: 12.04, change: 0.03 },
	{ code: 'AED', name: 'UAE Dirham', countryCode: 'AE', mid: 422.6, change: 0.31 },
	{ code: 'AUD', name: 'Australian Dollar', countryCode: 'AU', mid: 1024.3, change: -0.16 },
	{ code: 'CHF', name: 'Swiss Franc', countryCode: 'CH', mid: 1798.9, change: 0.42 },
	{ code: 'SAR', name: 'Saudi Riyal', countryCode: 'SA', mid: 413.8, change: 0.29 },
	{ code: 'INR', name: 'Indian Rupee', countryCode: 'IN', mid: 18.62, change: -0.08 },
	{ code: 'XOF', name: 'West African CFA Franc', countryCode: 'SN', mid: 2.56, change: -0.02 },
	{ code: 'XAF', name: 'Central African CFA Franc', countryCode: 'CM', mid: 2.56, change: -0.02 },
	{ code: 'EGP', name: 'Egyptian Pound', countryCode: 'EG', mid: 31.4, change: 0.11 },
	{ code: 'SGD', name: 'Singapore Dollar', countryCode: 'SG', mid: 1156.2, change: 0.07 },
	{ code: 'HKD', name: 'Hong Kong Dollar', countryCode: 'HK', mid: 199.4, change: 0.04 },
	{ code: 'SEK', name: 'Swedish Krona', countryCode: 'SE', mid: 146.7, change: -0.13 },
	{ code: 'NOK', name: 'Norwegian Krone', countryCode: 'NO', mid: 142.3, change: 0.09 },
	{ code: 'DKK', name: 'Danish Krone', countryCode: 'DK', mid: 225.4, change: -0.18 },
	{ code: 'NZD', name: 'New Zealand Dollar', countryCode: 'NZ', mid: 944.8, change: 0.22 },
	{ code: 'TRY', name: 'Turkish Lira', countryCode: 'TR', mid: 45.6, change: -0.37 },
	{ code: 'RUB', name: 'Russian Ruble', countryCode: 'RU', mid: 17.1, change: 0.05 },
	{ code: 'BRL', name: 'Brazilian Real', countryCode: 'BR', mid: 271.5, change: 0.14 },
	{ code: 'MXN', name: 'Mexican Peso', countryCode: 'MX', mid: 83.4, change: -0.06 },
	{ code: 'KRW', name: 'South Korean Won', countryCode: 'KR', mid: 1.13, change: 0.02 },
	{ code: 'PLN', name: 'Polish Zloty', countryCode: 'PL', mid: 391.2, change: -0.09 },
	{ code: 'QAR', name: 'Qatari Riyal', countryCode: 'QA', mid: 426.4, change: 0.18 },
	{ code: 'MAD', name: 'Moroccan Dirham', countryCode: 'MA', mid: 156.8, change: 0.03 },
	{ code: 'UGX', name: 'Ugandan Shilling', countryCode: 'UG', mid: 0.42, change: -0.01 },
	{ code: 'TZS', name: 'Tanzanian Shilling', countryCode: 'TZ', mid: 0.61, change: 0.0 },
	{ code: 'RWF', name: 'Rwandan Franc', countryCode: 'RW', mid: 1.12, change: -0.02 },
	{ code: 'ETB', name: 'Ethiopian Birr', countryCode: 'ET', mid: 11.9, change: 0.07 },
	{ code: 'ZMW', name: 'Zambian Kwacha', countryCode: 'ZM', mid: 58.3, change: -0.12 },
	{ code: 'CDF', name: 'Congolese Franc', countryCode: 'CD', mid: 0.55, change: 0.01 },
	{ code: 'XAU', name: 'Gold (oz)', countryCode: 'UN', mid: 4120000, change: 0.65 },
	{ code: 'THB', name: 'Thai Baht', countryCode: 'TH', mid: 45.2, change: 0.08 },
	{ code: 'PHP', name: 'Philippine Peso', countryCode: 'PH', mid: 27.6, change: -0.04 },
	{ code: 'IDR', name: 'Indonesian Rupiah', countryCode: 'ID', mid: 0.096, change: 0.01 },
	{ code: 'MYR', name: 'Malaysian Ringgit', countryCode: 'MY', mid: 349.7, change: 0.13 }
];

/** Round to a sensible number of decimals based on magnitude. */
function tidy(value: number): number {
	if (value >= 100) return Math.round(value * 100) / 100;
	if (value >= 1) return Math.round(value * 1000) / 1000;
	return Math.round(value * 100000) / 100000;
}

function ratesFor(market: MarketKey): MarketCurrencyRate[] {
	return BASE.map((c) => {
		const common = {
			code: c.code,
			name: c.name,
			countryCode: c.countryCode,
			change: c.change
		};

		if (market === 'global-market') {
			return { ...common, rate: tidy(c.mid) };
		}

		// Black market trades at a premium over mid; CBN sits below it.
		// Spread is the dealer's buy/sell gap.
		const center = market === 'black-market' ? c.mid * 1.058 : c.mid * 0.972;
		const spread = market === 'black-market' ? 0.012 : 0.006;

		return {
			...common,
			buy: tidy(center * (1 - spread / 2)),
			sell: tidy(center * (1 + spread / 2))
		};
	});
}

export const MARKET_META: Record<MarketKey, MarketMeta> = {
	'black-market': {
		key: 'black-market',
		title: 'Black Market',
		shortTitle: 'Black Market',
		description:
			'Live parallel (black market) exchange rates for major and emerging currencies against the Nigerian Naira.',
		rateMode: 'buy-sell',
		base: 'NGN',
		updatedAt: new Date().toISOString()
	},
	cbn: {
		key: 'cbn',
		title: 'CBN (Official)',
		shortTitle: 'CBN',
		description:
			'Central Bank of Nigeria (CBN) official exchange rates for major and emerging currencies against the Naira.',
		rateMode: 'buy-sell',
		base: 'NGN',
		updatedAt: new Date().toISOString()
	},
	'global-market': {
		key: 'global-market',
		title: 'Global Market',
		shortTitle: 'Global Market',
		description:
			'Mid-market (interbank) exchange rates for major and emerging currencies against the Naira.',
		rateMode: 'single',
		base: 'NGN',
		updatedAt: new Date().toISOString()
	}
};

export const MARKET_RATES: Record<MarketKey, MarketCurrencyRate[]> = {
	'black-market': ratesFor('black-market'),
	cbn: ratesFor('cbn'),
	'global-market': ratesFor('global-market')
};
