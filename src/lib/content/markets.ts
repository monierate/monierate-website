/**
 * Copy that changes with the visitor's market, so the homepage reads as written
 * for them: naira and Nigeria for NGN, shillings and Kenya for KES, and so on.
 * A new quote currency in AVAILABLE_QUOTE_CURRENCIES should get an entry here.
 */
export interface MarketContent {
	/** The currency as it reads in a sentence: "exchange it for naira". */
	currency: string;
	country: string;
	/** How providers there usually pay out: "Most providers in Kenya pay out by …". */
	payout: string;
	/**
	 * Homepage <title>, from the currencies' names. "Black market" only where a
	 * parallel market exists and people search for it (NGN, GHS); South Africans
	 * and Kenyans look for the exchange rate today.
	 */
	title: (base: string, quote: string) => string;
	/**
	 * Homepage meta description. Given the region's main provider names; NGN
	 * keeps its long-standing copy so its search listing doesn't change.
	 */
	metaDescription: (providers: string[]) => string;
	ogDescription: (providers: string[]) => string;
}

const blackMarketTitle = (base: string, quote: string) => `${base} to ${quote} today black market`;
const exchangeRateTitle = (base: string, quote: string) => `${base} to ${quote} exchange rate today`;

const listed = (providers: string[], fallback: string) =>
	providers.length ? `${providers.slice(0, 3).join(', ')} and more` : fallback;

const regional = (currency: string, code: string, country: string): Pick<MarketContent, 'metaDescription' | 'ogDescription'> => ({
	metaDescription: (providers) =>
		`Compare ${currency} exchange rates from exchanges and P2P desks in ${country}. Track the dollar and USDT to ${code} rate today on ${listed(providers, 'leading exchanges')}.`,
	ogDescription: (providers) =>
		`Compare the dollar and USDT to ${code} rate across providers in ${country}, including ${listed(providers, 'leading exchanges')}. See the best buy and sell rates today and how they compare with the interbank rate.`
});

export const MARKET_CONTENT: Record<string, MarketContent> = {
	NGN: {
		currency: 'naira',
		country: 'Nigeria',
		payout: 'bank transfer',
		title: blackMarketTitle,
		metaDescription: () =>
			'Monierate offers reliable naira exchange rates from 90+ exchanges. Track rates, convert dollars, and get crypto price alerts from Binance, Bybit, etc.',
		ogDescription: () =>
			'Compare the naira exchange rates from over 90 exchanges in Nigeria. Track naira rates today. Convert dollar to naira using CBN and black market rate. Get price alert from your favourite crypto exchange such as Binance, Bybit, Quidax, etc.'
	},
	KES: {
		currency: 'Kenyan shillings',
		country: 'Kenya',
		payout: 'M-Pesa or bank transfer',
		title: exchangeRateTitle,
		...regional('Kenyan shilling', 'KES', 'Kenya')
	},
	GHS: {
		currency: 'Ghanaian cedis',
		country: 'Ghana',
		payout: 'mobile money or bank transfer',
		title: blackMarketTitle,
		...regional('Ghanaian cedi', 'GHS', 'Ghana')
	},
	ZAR: {
		currency: 'South African rand',
		country: 'South Africa',
		payout: 'EFT or bank transfer',
		title: exchangeRateTitle,
		...regional('South African rand', 'ZAR', 'South Africa')
	}
};

/** The visitor's market copy; NGN for a currency without an entry. */
export const marketContent = (quote: string | null | undefined): MarketContent =>
	MARKET_CONTENT[(quote ?? '').toUpperCase()] ?? MARKET_CONTENT.NGN;
