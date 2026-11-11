import { describe, expect, it } from 'vitest';
import { groupPairs, matchesPair, searchPairs, sortPairs, pairLabel, type MarketPair } from './marketPairs';

const pair = (code: string, base: string, quote: string): MarketPair => ({ code, base, quote });

const PAIRS: MarketPair[] = [
	pair('usdtzar', 'USDT', 'ZAR'),
	pair('zarngn', 'ZAR', 'NGN'),
	pair('usdtxaf', 'USDT', 'XAF'),
	pair('btcngn', 'BTC', 'NGN'),
	pair('eurusdt', 'EUR', 'USDT'),
	pair('usdngn', 'USD', 'NGN'),
	pair('usdtngn', 'USDT', 'NGN'),
	pair('usdzar', 'USD', 'ZAR'),
	pair('usdtkes', 'USDT', 'KES'),
	pair('usdtxof', 'USDT', 'XOF')
];

describe('sortPairs', () => {
	it('puts naira first and majors before crypto and crosses', () => {
		expect(sortPairs(PAIRS).map((p) => p.code)).toEqual([
			'usdngn',
			'usdtngn',
			'btcngn',
			'zarngn',
			'usdzar',
			'usdtzar',
			'usdtkes',
			'usdtxaf',
			'usdtxof',
			'eurusdt'
		]);
	});

	it('moves the visitor’s group to the top', () => {
		expect(sortPairs(PAIRS, 'ZAR').slice(0, 3).map((p) => p.code)).toEqual(['usdzar', 'usdtzar', 'usdngn']);
	});
});

describe('groupPairs', () => {
	it('splits a sorted list into its groups, CFA francs together', () => {
		const groups = groupPairs(sortPairs(PAIRS)).map((g) => [g.group.key, g.pairs.length]);
		expect(groups).toEqual([
			['NGN', 4],
			['ZAR', 2],
			['KES', 1],
			['CFA', 2],
			['OTHER', 1]
		]);
	});
});

describe('matchesPair', () => {
	const usdtzar = pair('usdtzar', 'USDT', 'ZAR');

	it.each(['usdtzar', 'USDT/ZAR', 'usdt zar', 'usdt-zar', 'rand', 'tether rand', 'zar'])('matches %s', (q) => {
		expect(matchesPair(usdtzar, q)).toBe(true);
	});

	it.each(['kes', 'usdt kes', 'shilling'])('does not match %s', (q) => {
		expect(matchesPair(usdtzar, q)).toBe(false);
	});
});

describe('searchPairs', () => {
	it('lists an exact code match first', () => {
		const sorted = sortPairs(PAIRS);
		expect(searchPairs(sorted, 'usdt zar')[0].code).toBe('usdtzar');
		expect(searchPairs(sorted, 'usd zar').map((p) => p.code)).toEqual(['usdzar', 'usdtzar']);
	});
});

describe('pairLabel', () => {
	it('keeps cNGN’s lowercase c', () => {
		expect(pairLabel(pair('usdtcngn', 'USDT', 'CNGN'))).toBe('USDT/cNGN');
	});
});
