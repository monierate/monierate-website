<script lang="ts">
	import MarketView from '$lib/components/markets/MarketView.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Global Market (Mid-Market) Exchange Rates Today | Monierate</title>
	<meta name="description" content={data.meta.description} />
	<meta property="og:title" content="Global Market Exchange Rates Today | Monierate" />
	<meta property="og:description" content={data.meta.description} />
</svelte:head>

<MarketView meta={data.meta} rates={data.rates} />
