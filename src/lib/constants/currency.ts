export const KNOWN_BASES = ['usd', 'usdt', 'usdc', 'btc'];

// Crypto / stablecoin bases (everything in KNOWN_BASES except fiat `usd`).
export const CRYPTO_BASES = ['usdt', 'usdc', 'btc'];

export const isCryptoBase = (base: string): boolean => CRYPTO_BASES.includes(base.toLowerCase());

export const DEFAULT_BASE = 'USDT';

export const CURRENCY_SYMBOLS: Record<string, string> = {
	ngn: '₦',
	kes: 'KSh',
	ghs: '₵',
	tzs: 'TSh',
	ugx: 'USh',
	zar: 'R',
	usd: '$',
	eur: '€',
	gbp: '£',
	btc: '₿',
	usdt: '$',
	usdc: '$',
	usde: '$',
	cad: 'C$',
	aud: 'A$'
};
