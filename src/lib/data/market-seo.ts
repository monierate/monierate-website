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
				question: 'What is the black market dollar to naira rate?',
				answer:
					'The black market dollar to naira rate is the price at which the US dollar is bought and sold outside official channels — by Bureau de Change (BDC) operators and independent currency dealers, popularly called “aboki”. It is the rate most Nigerians actually pay when buying dollars for travel, school fees, or online purchases, and it is usually higher than the official CBN rate. You can see today’s live black market buy and sell rate for USD to NGN in the table above.'
			},
			{
				question: 'What is the aboki rate?',
				answer:
					'“Aboki” is a common Nigerian term for a street currency dealer. The aboki rate simply refers to the black market or parallel market exchange rate offered by these dealers.'
			},
			{
				question: 'Why is the black market rate higher than the CBN rate?',
				answer:
					'Demand for dollars in Nigeria far outstrips the supply available through official channels. Because many buyers cannot access dollars at the {link: {cbn: official CBN rate}}, they turn to the parallel market, where prices are set purely by supply and demand. This scarcity premium is why the black market rate is almost always higher than the CBN rate.'
			},
			{
				question: 'What factors affect the dollar to naira black market exchange rate?',
				answer:
					"Several factors move the parallel market rate, including:<br><br>• Nigeria's crude oil earnings and foreign reserves<br>• CBN monetary policy and FX interventions<br>• Inflation and the naira's purchasing power<br>• Seasonal demand (school fees, pilgrimage, festive travel)<br>• Speculation and market sentiment<br>• Remittance inflows from Nigerians abroad<br><br>When dollar supply tightens or confidence in the naira falls, the black market rate rises."
			},
			{
				question: 'Which black market rates can I track on Monierate?',
				answer:
					'On Monierate you can track the parallel (aboki) buy and sell rates for the US dollar (USD) and other major currencies — including the British pound (GBP), euro (EUR), Canadian dollar (CAD) and more — against the naira. You can also compare them with the {link: {cbn: official CBN rates}} to see the full picture before you trade.'
			},
			{
				question: 'How often is the black market rate updated?',
				answer:
					'Black market (Aboki FX) rates on Monierate are updated up to three times every day to reflect changes in the parallel market.'
			},
			{
				question: 'How do I find a reputable dollar black market exchange dealer?',
				answer:
					'Look for established Bureau de Change (BDC) operators with a track record, and ask for referrals from people you trust. These days many black market trades happen digitally — over WhatsApp, Telegram and other social media apps — as well as in person. Because most parallel-market exchanges require the client to send money to the dealer before being credited, dealing with a trusted, verified dealer matters more than anything else. A few pointers:<br><br>• Only exchange dollars (USD) with reputable dealers, whether in person or online.<br>• Ask for a written receipt or transaction record for the exchange.<br>• Be aware of the current dollar to naira black market rate (see the table above) before you exchange your currency.<br>• Do not exchange large amounts of dollars at once on your first transaction with a dealer.<br>• Trade large amounts with licensed dealers.'
			},
			{
				question: 'What are some tips for exchanging dollars for naira on the black market?',
				answer:
					'Check the current rate first so you can negotiate confidently. For in-person trades, meet in a safe, public location, count and inspect cash carefully to avoid counterfeit notes, and avoid carrying large amounts alone. A lot of trades now happen digitally over WhatsApp, Telegram and social media apps — for these, only deal with trusted, verified dealers, keep a record of the chat and payment, and confirm each transfer before releasing funds. Whether in person or online, split large or recurring exchanges into smaller amounts and consider a licensed exchange to reduce risk.'
			}
		],
		faqLinks: [{ key: 'cbn', url: '/fx/official' }]
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
		faqLinks: [{ key: 'parallel', url: '/fx/parallel' }]
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
		faqLinks: [{ key: 'parallel', url: '/fx/parallel' }]
	}
};
