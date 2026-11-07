import { describe, expect, it } from 'vitest';
import { marketContent } from './markets';
import { AVAILABLE_QUOTE_CURRENCIES } from '$lib/constants/currency';

describe('marketContent', () => {
	it('has copy for every quote currency the site can show', () => {
		for (const code of AVAILABLE_QUOTE_CURRENCIES) {
			expect(marketContent(code)).toBe(marketContent(code.toLowerCase()));
		}
		expect(marketContent('ZAR').country).toBe('South Africa');
		expect(marketContent('KES').payout).toContain('M-Pesa');
	});

	it('keeps the NGN meta copy as it was, whatever the providers', () => {
		expect(marketContent('NGN').metaDescription(['Luno'])).toBe(
			'Monierate offers reliable naira exchange rates from 90+ exchanges. Track rates, convert dollars, and get crypto price alerts from Binance, Bybit, etc.'
		);
	});

	it('names the region’s providers in its meta copy', () => {
		expect(marketContent('ZAR').metaDescription(['Luno', 'Bybit', 'Grey', 'Binance P2P'])).toBe(
			'Compare South African rand exchange rates from exchanges and P2P desks in South Africa. Track the dollar and USDT to ZAR rate today on Luno, Bybit, Grey and more.'
		);
		expect(marketContent('GHS').metaDescription([])).toContain('on leading exchanges.');
	});

	it('keeps "black market" in the title only where people search for it', () => {
		expect(marketContent('NGN').title('US Dollar', 'Nigerian Naira')).toBe(
			'US Dollar to Nigerian Naira today black market'
		);
		expect(marketContent('GHS').title('US Dollar', 'Ghanaian Cedi')).toContain('black market');
		expect(marketContent('ZAR').title('US Dollar', 'South African Rand')).toBe(
			'US Dollar to South African Rand exchange rate today'
		);
		expect(marketContent('KES').title('US Dollar', 'Kenyan Shilling')).not.toContain('black market');
	});

	it('writes the euro view for exchanges, not P2P desks', () => {
		expect(marketContent('EUR').country).toBe('Europe');
		expect(marketContent('EUR').title('Tether', 'Euro')).toBe('Tether to Euro exchange rate today');
		expect(marketContent('EUR').metaDescription(['Kraken', 'Coinbase', 'Binance', 'Bitstamp'])).toBe(
			'Compare the USDT to euro rate across crypto exchanges in Europe. Track the USDT to EUR rate today on Kraken, Coinbase, Binance and more.'
		);
	});

	it('falls back to NGN for a currency without copy', () => {
		expect(marketContent('GBP')).toBe(marketContent('NGN'));
		expect(marketContent(undefined)).toBe(marketContent('NGN'));
	});
});
