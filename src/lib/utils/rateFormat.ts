/**
 * Decimals for a rate: whole numbers from 1,000 up (₦1,381), two from 10
 * (R16.57, KSh130.09), four below 10 (1.1155, 6.6648, 0.0122). Rounding every
 * rate to a whole number suited naira, but made every ZAR provider read R17 and
 * hid the ranking; two decimals did the same below 10, where EUR/USDT
 * exchanges sit 0.0002 apart and would all read 1.12.
 */
export const rateDecimals = (value: number): number => {
	const size = Math.abs(value);
	if (size >= 1000) return 0;
	return size >= 10 ? 2 : 4;
};

/** A rate formatted with `rateDecimals`, grouped: 1,381 · 16.57 · 1.1155. */
export const formatRate = (value: number): string => {
	const decimals = rateDecimals(value);
	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	}).format(value);
};
