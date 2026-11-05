/**
 * Decimals for a rate: whole numbers from 1,000 up (₦1,381), two from 1
 * (R16.57, KSh130.09), four below 1 (0.0122). Rounding every rate to a whole
 * number suited naira, but made every ZAR provider read R17 and hid the ranking.
 */
export const rateDecimals = (value: number): number => {
	const size = Math.abs(value);
	if (size >= 1000) return 0;
	return size >= 1 ? 2 : 4;
};

/** A rate formatted with `rateDecimals`, grouped: 1,381 · 16.57 · 0.0122. */
export const formatRate = (value: number): string => {
	const decimals = rateDecimals(value);
	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	}).format(value);
};
