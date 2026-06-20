<script lang="ts">
	import ApiHero from '$lib/components/api/ApiHero.svelte';
	import ApiCodeDemo from '$lib/components/api/ApiCodeDemo.svelte';
	import ApiFeatures from '$lib/components/api/ApiFeatures.svelte';
	import ApiPricing from '$lib/components/api/ApiPricing.svelte';
	import ApiFaq from '$lib/components/api/ApiFaq.svelte';
	import ApiCta from '$lib/components/api/ApiCta.svelte';

	export let data: any;
</script>

<svelte:head>
	<title>Monierate Currency Rates API – Real-time NGN Exchange Rates</title>
	<meta
		name="description"
		content="Integrate real-time NGN stablecoin exchange rates, historical data, and offramp execution into your app. Simple REST API, 40+ providers, free to start."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Monierate Currency Rates API" />
	<meta
		property="og:description"
		content="Real-time NGN exchange rates from 40+ providers. Historical data, offramp execution, analytics dashboard. Free to start."
	/>
	<meta property="og:url" content="https://monierate.com/api" />
	<meta property="og:image" content="https://monierate.com/monierate-og-image.png" />
</svelte:head>

<ApiHero />
<ApiCodeDemo />
<ApiFeatures />
<ApiPricing pageData={data} />
<ApiFaq />
<ApiCta />
