import { describe, expect, it } from 'vitest';
import { currencyForCountry } from './defaultCurrency';

describe('currencyForCountry', () => {
	it('uses the country’s own currency when we carry it', () => {
		expect(currencyForCountry('NG')).toBe('NGN');
		expect(currencyForCountry('KE')).toBe('KES');
		expect(currencyForCountry('GH')).toBe('GHS');
		expect(currencyForCountry('ZA')).toBe('ZAR');
	});

	it('uses KES across East Africa', () => {
		for (const country of ['UG', 'TZ', 'RW', 'BI', 'SS', 'SO', 'ET', 'DJ', 'ER']) {
			expect(currencyForCountry(country)).toBe('KES');
		}
	});

	it('uses ZAR in the rand-pegged Common Monetary Area', () => {
		for (const country of ['NA', 'LS', 'SZ']) {
			expect(currencyForCountry(country)).toBe('ZAR');
		}
	});

	it('falls back to NGN for West Africa and everywhere else', () => {
		for (const country of ['CI', 'SN', 'CM', 'BW', 'US', 'GB', 'XX', '']) {
			expect(currencyForCountry(country)).toBe('NGN');
		}
	});

	it('ignores case', () => {
		expect(currencyForCountry('ug')).toBe('KES');
	});
});
