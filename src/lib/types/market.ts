export type MarketKey = 'black-market' | 'cbn' | 'global-market';

export type RateMode = 'buy-sell' | 'single';

/**
 * A single currency's rate against the market base (NGN).
 *
 * `buy`/`sell` are used for the `buy-sell` markets (Black Market, CBN).
 * `rate` is used for `single` markets (Global / mid-market).
 */
export interface MarketCurrencyRate {
	code: string; // e.g. "USD"
	name: string; // e.g. "US Dollar"
	countryCode: string; // ISO-3166 alpha-2, e.g. "US" (for flag)
	buy?: number;
	sell?: number;
	rate?: number;
	/** 24h change in percent, used for the up/down badge. */
	change?: number;
}

export interface MarketMeta {
	key: MarketKey;
	title: string; // e.g. "Black Market"
	shortTitle: string; // e.g. "Black Market"
	description: string;
	rateMode: RateMode;
	base: string; // quote currency, e.g. "NGN"
	updatedAt: string; // ISO string
}

export interface MarketData {
	meta: MarketMeta;
	rates: MarketCurrencyRate[];
}
