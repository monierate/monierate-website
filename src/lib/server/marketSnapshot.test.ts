import { describe, expect, it } from 'vitest';
import { buildSnapshot } from './marketSnapshot';
import { showableHighlightCount } from '$lib/utils/highlights';
import { rateDecimals } from '$lib/utils/rateFormat';

const changer = (code: string, buy: number, sell: number, extra: Record<string, unknown> = {}) => ({
	changer_code: code,
	price_buy: buy,
	price_sell: sell,
	is_public: true,
	is_active: true,
	...extra
});

describe('buildSnapshot', () => {
	const pair = {
		price: { current: 16.74 },
		price_24hr: 16.87,
		price_change_percent_24hr: -0.75,
		changers: [
			changer('luno', 16.9, 16.6),
			changer('grey', 16.95, 16.5),
			changer('divest', 0, 16.2),
			changer('fastforex', 16.4, 16.4, { is_public: false }),
			changer('stale', 0, 0)
		]
	};

	it('compares the average with the interbank rate and counts live providers', () => {
		const snap = buildSnapshot(pair, 'USD', { USD: 1 / 16.4 })!;
		expect(snap.average).toBe(16.74);
		expect(snap.change24h).toBe(-0.75);
		expect(snap.interbank).toBeCloseTo(16.4);
		expect(snap.premiumPercent).toBeCloseTo((16.74 / 16.4 - 1) * 100);
		expect(snap.providers).toBe(3);
	});

	it('leaves interbank out when the feed has no rate, and change out without 24h history', () => {
		const snap = buildSnapshot({ ...pair, price_24hr: 0 }, 'USD', null)!;
		expect(snap.interbank).toBeNull();
		expect(snap.premiumPercent).toBeNull();
		expect(snap.change24h).toBeNull();
	});

	it('returns null for a pair without a price', () => {
		expect(buildSnapshot({ price: { current: 0 }, changers: [] }, 'USD', null)).toBeNull();
		expect(buildSnapshot(null, 'USD', null)).toBeNull();
	});
});

describe('highlight rules', () => {
	it('only counts cards with at least three providers', () => {
		const three = [1, 2, 3];
		expect(
			showableHighlightCount({
				newResult: [1, 2],
				buyingResult: [1, 2, 3, 4],
				sellingResult: three,
				sendingResult: [1],
				liquidityResult: [],
				fundingResult: [1, 2]
			})
		).toBe(2);
		expect(showableHighlightCount(null)).toBe(0);
	});

	it('keeps decimals below 1,000 and drops them above', () => {
		expect(rateDecimals(16.74)).toBe(2);
		expect(rateDecimals(130.09)).toBe(2);
		expect(rateDecimals(1381.3)).toBe(0);
	});
});
