// api-pricing is international and priced in USD by default.
// Visitors detected in Nigeria get Naira pricing and Naira-focused copy and rate samples.
// The pricing API returns both (`price_ngn` / `price_usd`, `prices_by_cycle.*.ngn` / `.usd`).

export type PricingCurrency = {
	code: 'ngn' | 'usd';
	symbol: string;
	perRequest: number;
};

export const USD: PricingCurrency = { code: 'usd', symbol: '$', perRequest: 0.01 };
export const NGN: PricingCurrency = { code: 'ngn', symbol: '₦', perRequest: 10 };

export function pricingCurrency(country: string | null | undefined): PricingCurrency {
	return (country ?? '').toUpperCase() === 'NG' ? NGN : USD;
}

export function isNaira(currency: PricingCurrency): boolean {
	return currency.code === 'ngn';
}

export function formatMoney(n: number, currency: PricingCurrency): string {
	const digits = currency.code === 'usd' && n < 100 ? 2 : 0;
	return `${currency.symbol}${n.toLocaleString('en-US', { maximumFractionDigits: digits })}`;
}

export function perRequestLabel(currency: PricingCurrency): string {
	return formatMoney(currency.perRequest, currency);
}
