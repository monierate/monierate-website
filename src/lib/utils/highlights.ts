/**
 * A "best rate" card needs at least this many providers to show. One or two
 * isn't a comparison, and cards that size are what made a thin market's
 * highlight row (ZAR, GHS) look broken next to NGN's full ones.
 */
export const MIN_HIGHLIGHT_PROVIDERS = 3;

/** Highlight cards per row on desktop. */
export const HIGHLIGHT_ROW = 4;

export const HIGHLIGHT_KEYS = [
	'newResult',
	'buyingResult',
	'sellingResult',
	'sendingResult',
	'liquidityResult',
	'fundingResult'
] as const;

export const isShowableHighlight = (list: unknown): boolean =>
	Array.isArray(list) && list.length >= MIN_HIGHLIGHT_PROVIDERS;

export const showableHighlightCount = (highlights: Record<string, unknown> | null | undefined) =>
	HIGHLIGHT_KEYS.filter((key) => isShowableHighlight(highlights?.[key])).length;

/**
 * Decimals for a rate: whole numbers from 1,000 up (₦1,381), two below
 * (R16.74, KSh130.09). Rounding a ZAR rate to a whole number made every
 * provider read R16 or R17 and hid the ranking.
 */
export const rateDecimals = (value: number): number => (Math.abs(value) >= 1000 ? 0 : 2);
