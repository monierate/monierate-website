<script lang="ts">
	import ApiPricingHero from '$lib/components/api-pricing/ApiPricingHero.svelte';
	import ApiPricingLogos from '$lib/components/api-pricing/ApiPricingLogos.svelte';
	import ApiPricingFeatureGrid from '$lib/components/api-pricing/ApiPricingFeatureGrid.svelte';
	import ApiPricingShowcase from '$lib/components/api-pricing/ApiPricingShowcase.svelte';
	import ApiPricingPlans from '$lib/components/api-pricing/ApiPricingPlans.svelte';
	import ApiFaq from '$lib/components/api/ApiFaq.svelte';
	import ApiCta from '$lib/components/api/ApiCta.svelte';

	let { data } = $props();

	const plans = $derived((data.subscriptionPlans as any[]) || []);

	// Cheapest flat plan, for the "from only $X/month" hero line
	const fromPrice = $derived.by(() => {
		const flat = plans.filter((p) => p.billing_model === 'flat' && p.price_usd > 0);
		if (!flat.length) return null;
		const p = flat.reduce((a, b) => (a.price_usd < b.price_usd ? a : b));
		return p.prices_by_cycle?.yearly?.usd ? Math.round(p.prices_by_cycle.yearly.usd / 12) : p.price_usd;
	});
</script>

<svelte:head>
	<title>Exchange Rate API Pricing | Live Naira Rates from 90+ Providers | Monierate</title>
	<meta
		name="description"
		content="Fast, reliable exchange rate API for Naira. Live stablecoin, official and parallel market rates from 90+ providers. Start free with $10 credit, then pick a flat monthly plan."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Exchange Rate API Pricing | Monierate" />
	<meta
		property="og:description"
		content="Live Naira exchange rates from 90+ providers in one JSON API. Start free, pay per request or choose a flat plan."
	/>
	<meta property="og:url" content="https://monierate.com/api-pricing" />
	<meta property="og:image" content="https://monierate.com/monierate-og-image.png" />
	<link rel="canonical" href="https://monierate.com/api-pricing" />
</svelte:head>

<ApiPricingHero {fromPrice} />
<ApiPricingLogos />
<ApiPricingFeatureGrid />
<ApiPricingShowcase />
<ApiPricingPlans {plans} />
<ApiFaq />
<ApiCta />
