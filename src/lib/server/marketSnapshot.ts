export interface MarketSnapshot {
	/** The pair's average across providers. */
	average: number;
	/** null when the pair has no price from 24 hours ago. */
	change24h: number | null;
	/** The interbank (mid-market) rate, when the rates feed has one. */
	interbank: number | null;
	/** How far the average sits from interbank, in percent; positive is above. */
	premiumPercent: number | null;
	/** Public providers currently quoting the pair. */
	providers: number;
}

/**
 * The summary card a thin market gets in place of the highlight cards it
 * can't fill. `mid` is the interbank feed for the quote currency: base code ->
 * units of that base per 1 quote, so base/quote is its inverse.
 */
export function buildSnapshot(
	pair: any,
	base: string,
	mid: Record<string, number> | null
): MarketSnapshot | null {
	const average = Number(pair?.price?.current);
	if (!(average > 0)) return null;

	const perQuote = Number(mid?.[base.toUpperCase()]);
	const interbank = perQuote > 0 ? 1 / perQuote : null;

	const providers = (pair.changers ?? []).filter(
		(c: any) =>
			c.is_public !== false && c.is_active !== false && (c.price_buy > 0 || c.price_sell > 0)
	).length;

	return {
		average,
		change24h: pair.price_24hr > 0 ? Number(pair.price_change_percent_24hr) : null,
		interbank,
		premiumPercent: interbank ? (average / interbank - 1) * 100 : null,
		providers
	};
}
