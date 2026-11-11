import { describe, expect, it } from 'vitest';
import { buildTicker } from './ticker';

const pair = (code: string, current: number, price_24hr = current, change = 0.5) => ({
	code,
	price: { current },
	price_24hr,
	price_change_percent_24hr: change
});

describe('buildTicker', () => {
	it('fills the bases a thin market lacks with interbank rates', () => {
		const pairs = [pair('usdzar', 16.9, 17.0, -0.9), pair('usdtzar', 16.9, 17.0, -0.9)];
		// units of each base per 1 ZAR
		const mid = { USD: 0.061, BTC: 0.00000078, EUR: 0.0543, GBP: 0.0451, CAD: 0.0854, NGN: 81.96, GHS: 0.709, KES: 7.92 };

		const ticker = buildTicker(pairs, 'ZAR', mid);

		expect(Object.keys(ticker)).toEqual([
			'usdzar', 'usdtzar', 'btczar', 'eurzar', 'gbpzar', 'cadzar', 'ngnzar', 'ghszar', 'keszar'
		]);
		expect(ticker.usdzar).toMatchObject({ market: 'parallel', href: '/markets/usdzar', price_change_percent_24hr: -0.9 });
		expect(ticker.eurzar).toMatchObject({ market: 'mid', href: '/converter/eur-to-zar', price_change_percent_24hr: null });
		expect(ticker.eurzar.price).toBeCloseTo(1 / 0.0543);
	});

	it('never asks for a pair of the quote against itself', () => {
		const ticker = buildTicker([], 'KES', { KES: 1, USD: 0.0077 });
		expect(Object.keys(ticker)).toEqual(['usdkes']);
	});

	it('keeps a tracked pair over the interbank rate, and hides change without 24h history', () => {
		const ticker = buildTicker([pair('usdghs', 12.05, 0)], 'GHS', { USD: 0.08 });
		expect(ticker.usdghs).toMatchObject({ market: 'parallel', price: 12.05, price_change_percent_24hr: null });
	});

	it('shows only tracked pairs when every base has one (NGN)', () => {
		const bases = ['usd', 'usdt', 'btc', 'eur', 'gbp', 'cad', 'ghs', 'kes', 'zar'];
		const ticker = buildTicker(bases.map((b, i) => pair(`${b}ngn`, 100 + i)), 'NGN', null);
		expect(Object.keys(ticker)).toEqual(bases.map((b) => `${b}ngn`));
		expect(Object.values(ticker).every((t) => t.market === 'parallel')).toBe(true);
	});

	it('tops up with other tracked pairs when interbank rates are unavailable', () => {
		const ticker = buildTicker([pair('usdngn', 1380), pair('aedngn', 375), pair('xofngn', 2.4)], 'NGN', null);
		expect(Object.keys(ticker)).toEqual(['usdngn', 'aedngn', 'xofngn']);
	});
});
