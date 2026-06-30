import type { MarketKey } from '$lib/types/market';

export interface MarketSeo {
	/** `{date}` is replaced with the current date at render time. */
	title: string;
	description: string;
	keywords: string;
	ogImage: string;
	/** Prose paragraphs rendered under an H2. `{date}` is substituted. */
	intro: string[];
	faqItems: Array<{ question: string; answer: string }>;
	faqLinks: Array<{ key: string; url: string }>;
}

const OG_IMAGE = 'https://monierate.com/monierate-og-image.png';

export const MARKET_SEO: Record<MarketKey, MarketSeo> = {
	'black-market': {
		title: 'Black Market Dollar to Naira (USD to NGN) Exchange Rate Today – {date} | Monierate',
		description:
			"Today's black market (parallel / aboki) exchange rate for the US dollar, pound, euro and more to the Nigerian naira. Live USD to NGN aboki rate, updated daily on Monierate.",
		keywords:
			'black market dollar to naira, aboki rate today, parallel market rate, usd to ngn black market, dollar to naira black market today, pounds to naira black market, euro to naira black market',
		ogImage: OG_IMAGE,
		intro: [
			'The black market exchange rate — also known as the parallel market or “aboki” rate — is the price at which the US dollar and other foreign currencies are bought and sold outside official Central Bank of Nigeria (CBN) channels, such as with Bureau de Change operators and street currency dealers. It is usually higher than the official CBN rate.',
			'The table above shows the black market buy and sell prices for the US dollar (USD), British pound (GBP), euro (EUR) and other major currencies against the Nigerian naira (NGN) as of {date}. Aboki FX rates are updated up to three times a day.'
		],
		faqItems: [
			{
				question: 'What is the black market dollar to naira rate today?',
				answer:
					'The black market (aboki) dollar to naira rate is the price at which the US dollar is bought and sold by parallel market dealers in Nigeria. You can see the live USD to NGN black market rate in the table above, updated daily.'
			},
			{
				question: 'What is the aboki rate?',
				answer:
					'“Aboki” is a common Nigerian term for a street currency dealer. The aboki rate simply refers to the black market or parallel market exchange rate offered by these dealers.'
			},
			{
				question: 'Why is the black market rate higher than the CBN rate?',
				answer:
					'The black market rate reflects real-time demand for foreign currency outside official channels. Because access to dollars at the official rate is limited, the parallel market rate is usually higher than the {link: {cbn: CBN official rate}}.'
			},
			{
				question: 'How often is the black market rate updated?',
				answer:
					'Black market (Aboki FX) rates on Monierate are updated up to three times every day to reflect changes in the parallel market.'
			}
		],
		faqLinks: [{ key: 'cbn', url: '/markets/official' }]
	},
	cbn: {
		title: 'CBN Official Dollar to Naira (USD to NGN) Exchange Rate Today – {date} | Monierate',
		description:
			'The latest CBN official exchange rate for the US dollar, pound, euro and more to the Nigerian naira today. Live USD to NGN CBN rate on Monierate.',
		keywords:
			'cbn exchange rate, cbn dollar to naira, official dollar to naira rate today, usd to ngn cbn, central bank of nigeria exchange rate, official naira rate',
		ogImage: OG_IMAGE,
		intro: [
			'The CBN exchange rate is the official rate set by the Central Bank of Nigeria. It is the benchmark rate used by banks and licensed operators for foreign exchange transactions, and is typically lower than the parallel (black market) rate.',
			'The table above shows the official CBN buy and sell rates for the US dollar (USD), British pound (GBP), euro (EUR) and other major currencies against the Nigerian naira (NGN) as of {date}.'
		],
		faqItems: [
			{
				question: 'What is the official CBN dollar to naira rate today?',
				answer:
					'The CBN rate is the official US dollar to naira exchange rate published by the Central Bank of Nigeria. You can see the current CBN buy and sell rate in the table above.'
			},
			{
				question: 'What is the difference between the CBN rate and the black market rate?',
				answer:
					'The CBN rate is the official rate set by the Central Bank of Nigeria and used by banks, while the {link: {parallel: black market (parallel) rate}} is set by street dealers and is usually higher.'
			},
			{
				question: 'Where does the CBN exchange rate come from?',
				answer:
					"The CBN rate is sourced directly from the Central Bank of Nigeria's published official exchange rates."
			}
		],
		faqLinks: [{ key: 'parallel', url: '/markets/parallel' }]
	},
	'global-market': {
		title: 'Global (Mid-Market) Exchange Rates to Naira Today – {date} | Monierate',
		description:
			'Live mid-market (interbank) exchange rates for the US dollar, pound, euro and more to the Nigerian naira today on Monierate.',
		keywords:
			'mid market rate, interbank exchange rate, global exchange rate to naira, usd to ngn mid market, real exchange rate naira',
		ogImage: OG_IMAGE,
		intro: [
			'The global or mid-market rate is the midpoint between the buy and sell prices on the global currency markets (the interbank rate). It is the “real” exchange rate often quoted by Google and currency converters, before any dealer margin is added.',
			'The table above shows the mid-market rate for the US dollar (USD), British pound (GBP), euro (EUR) and other major currencies against the Nigerian naira (NGN) as of {date}.'
		],
		faqItems: [
			{
				question: 'What is the mid-market exchange rate?',
				answer:
					'The mid-market rate is the midpoint between the buy and sell prices for a currency on the global market. It is the rate banks use to trade with each other and is considered the fairest exchange rate.'
			},
			{
				question: 'How is the mid-market rate different from the black market rate?',
				answer:
					'The mid-market rate is the global interbank rate, while the {link: {parallel: black market rate}} is the local parallel-market rate set by dealers in Nigeria, which usually carries a premium.'
			}
		],
		faqLinks: [{ key: 'parallel', url: '/markets/parallel' }]
	}
};
