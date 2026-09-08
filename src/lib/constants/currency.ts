export const KNOWN_BASES = ['usd', 'usdt', 'usdc', 'btc'];

// Crypto / stablecoin bases (everything in KNOWN_BASES except fiat `usd`).
// Used to hide crypto-only categories (on/off-ramp, virtual card) on fiat pairs.
export const CRYPTO_BASES = ['usdt', 'usdc', 'btc'];

export const isCryptoBase = (base: string): boolean => CRYPTO_BASES.includes(base.toLowerCase());

export const DEFAULT_BASE = 'USDT';

// Ordered list — SparklineCards renders quote currencies in this sequence
export const AVAILABLE_QUOTE_CURRENCIES = ['NGN', 'KES', 'GHS'];

// KES and GHS only have USDT liquidity; NGN supports all bases
export const QUOTE_SUPPORTED_BASES: Record<string, string[]> = {
	NGN: ['USDT', 'USD', 'USDC', 'BTC'],
	KES: ['USDT'],
	GHS: ['USDT'],
};

// The default base for a given quote — the first base in that quote's supported
// list (USDT for every current quote). Used by the historical pages so a pair
// always resolves to e.g. USDT/NGN and resets to the first base on quote switch.
export function defaultBaseForQuote(quote: string): string {
	const supported = QUOTE_SUPPORTED_BASES[quote.toUpperCase()] ?? [DEFAULT_BASE];
	return supported[0] ?? DEFAULT_BASE;
}

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
	aud: 'A$',

	// Added for the global converter: without a symbol the conversion table renders
	// bare numbers, which reads as unitless rather than as yen. Only currencies with
	// a symbol in genuinely common use — the rest correctly fall back to their code,
	// which is what `moneyWithUnit` expects. `CN¥` rather than `¥` so the yuan and
	// the yen cannot be mistaken for each other on a CNY/JPY page.
	jpy: '¥',
	cny: 'CN¥',
	inr: '₹',
	krw: '₩',
	brl: 'R$',
	php: '₱',
	thb: '฿',
	vnd: '₫',
	try: '₺',
	rub: '₽',
	ils: '₪',
	pln: 'zł',
	nzd: 'NZ$',
	hkd: 'HK$',
	mxn: 'Mex$',
	ars: 'ARS$',
	clp: 'CLP$',
	cop: 'COP$',
	twd: 'NT$',
	pkr: '₨',
	lkr: '₨',
	bdt: '৳',
	egp: 'E£',
};
