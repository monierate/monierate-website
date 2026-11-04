<script lang="ts">
	import ApiPricingHero from '$lib/components/api-pricing/ApiPricingHero.svelte';
	import ApiPricingLogos from '$lib/components/api-pricing/ApiPricingLogos.svelte';
	import ApiPricingFeatureGrid from '$lib/components/api-pricing/ApiPricingFeatureGrid.svelte';
	import ApiPricingShowcase from '$lib/components/api-pricing/ApiPricingShowcase.svelte';
	import ApiPricingPlans from '$lib/components/api-pricing/ApiPricingPlans.svelte';
	import ApiFaq from '$lib/components/api/ApiFaq.svelte';
	import ApiCta from '$lib/components/api/ApiCta.svelte';
	import { pricingCurrency, perRequestLabel, isNaira } from '$lib/components/api-pricing/currency';

	let { data } = $props();

	const plans = $derived((data.subscriptionPlans as any[]) || []);

	// USD for everyone, Naira for visitors in Nigeria
	const currency = $derived(pricingCurrency(data.ucountry));
	const perRequest = $derived(perRequestLabel(currency));
	const ng = $derived(isNaira(currency));

	const faqAnswers = $derived({
		'What currencies and markets are supported?':
			'170+ fiat and crypto currencies from 100+ providers, including Binance P2P, Bybit, Luno, Quidax, Chipper Cash and more. You get trusted parallel and mid-market rates, stablecoins (USDT, USDC) and fiat (USD, EUR, GBP and many others).',
		'How do I authenticate?':
			'Send your API key in the api_key request header. Your key is available as soon as you create a free account, with no credit card required.',
		'What are the rate limits?': `Free (PAYG): unlimited calls billed at ${perRequest} each. Pro: 10,000 req/month, 10 req/min, included in the flat fee. Max: 100,000 req/month, 50 req/min.`,
		// International visitors only see USD billing; Nigerian visitors keep the shared NGN or USD answer
		...(ng
			? {}
			: {
					'How does billing work?':
						'Free users are charged per action from their wallet. Pro and Max are flat monthly subscriptions with no per-request fees. All billing is in USD.'
				}),
		'Is there a free tier?': `Yes. Every new account gets 100 free API requests, once, on signup. No card needed. After those 100, each request costs ${perRequest}, or you can upgrade to Pro or Max for fixed monthly pricing. The dashboard is free forever.`
	});

	// The NGN payment question is only for visitors in Nigeria
	const faqHide = $derived(ng ? [] : ['Can I pay in NGN?']);

	const faqExtra = [
		{
			q: 'Can I use Monierate with AI agents?',
			a: 'Yes. Monierate runs a remote MCP server at https://mcp.monierate.xyz/mcp. Add it to Claude, ChatGPT, Cursor or any MCP client, sign in, and ask for rates in plain language. Calls are billed like normal API requests.'
		}
	];
</script>

<svelte:head>
	<title>Exchange Rate API Pricing | 170+ Currencies from 100+ Providers | Monierate</title>
	<meta
		name="description"
		content="Fast, reliable exchange rate API with up to date provider rates for 170+ fiat and crypto currencies from 100+ providers, including trusted parallel and midpoint rates. Your first 100 requests are free, then $0.01 per request."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Exchange Rate API Pricing | Monierate" />
	<meta
		property="og:description"
		content="Up to date exchange rates for 170+ currencies from 100+ providers in one JSON API, with an MCP server for AI agents. First 100 requests free, then $0.01 per request."
	/>
	<meta property="og:url" content="https://monierate.com/api-pricing" />
	<meta property="og:image" content="https://monierate.com/monierate-og-image.png" />
	<link rel="canonical" href="https://monierate.com/api-pricing" />
</svelte:head>

<ApiPricingHero {currency} />
<ApiPricingLogos />
<ApiPricingFeatureGrid {currency} />
<ApiPricingShowcase {currency} />
<ApiPricingPlans {plans} {currency} />
<div id="faq" class="scroll-mt-6">
	<ApiFaq fullWidth answers={faqAnswers} extra={faqExtra} hide={faqHide} />
</div>
<ApiCta subtitle="Create a free account and get your API key in minutes. Your first 100 requests are free, no card required." />
