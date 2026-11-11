import { describe, expect, it } from 'vitest';
import { quoteBases } from './quoteBases';

const pair = (code: string, providers = 1) => ({ code, changers: Array.from({ length: providers }, () => ({})) });

describe('quoteBases', () => {
	it('lists the bases with a pair for the quote, in tab order', () => {
		const pairs = [pair('gbpzar'), pair('usdzar'), pair('usdczar'), pair('usdtzar'), pair('eurzar')];
		expect(quoteBases(pairs, 'ZAR')).toEqual(['USDT', 'USD', 'USDC', 'EUR', 'GBP']);
	});

	it('skips pairs without providers and other quotes', () => {
		expect(quoteBases([pair('usdtkes'), pair('btckes', 0), pair('btcngn')], 'KES')).toEqual(['USDT']);
	});
});
