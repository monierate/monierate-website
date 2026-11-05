// Tab order for the homepage's base tabs outside NGN.
const BASE_TAB_ORDER = ['USDT', 'USD', 'USDC', 'BTC', 'ETH', 'EUR', 'GBP', 'CAD'];

/**
 * The bases that have a pair with providers for `quote`, in tab order. ZAR, KES
 * and GHS carry a handful of pairs each, so their tabs follow what exists
 * rather than NGN's fixed list (which would offer pairs like GHS/GHS).
 */
export function quoteBases(pairs: any[], quote: string): string[] {
	const q = quote.toLowerCase();
	return BASE_TAB_ORDER.filter((base) =>
		pairs.some((p) => p?.code === `${base.toLowerCase()}${q}` && (p.changers?.length ?? 0) > 0)
	);
}
