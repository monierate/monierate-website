import { describe, expect, it } from 'vitest';
import { formatRate, rateDecimals } from './rateFormat';

describe('rateDecimals', () => {
	it('drops decimals from 1,000 up', () => {
		expect(rateDecimals(1381.42)).toBe(0);
		expect(rateDecimals(1266257.08)).toBe(0);
	});

	it('keeps two decimals from 1 to 1,000', () => {
		expect(rateDecimals(16.5699)).toBe(2);
		expect(rateDecimals(130.087)).toBe(2);
	});

	it('keeps four decimals below 1', () => {
		expect(rateDecimals(0.012242)).toBe(4);
	});
});

describe('formatRate', () => {
	it('shows ZAR, KES and GHS rates to two decimals, so providers can be told apart', () => {
		expect(formatRate(16.5699)).toBe('16.57');
		expect(formatRate(16.694275)).toBe('16.69');
		expect(formatRate(16.5)).toBe('16.50');
		expect(formatRate(130.087)).toBe('130.09');
	});

	it('shows naira and crypto rates as grouped whole numbers', () => {
		expect(formatRate(1381.42)).toBe('1,381');
		expect(formatRate(1266257.0833)).toBe('1,266,257');
	});

	it('keeps small rates readable', () => {
		expect(formatRate(0.012242378)).toBe('0.0122');
	});
});
