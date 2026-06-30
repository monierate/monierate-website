<script lang="ts">
	import MarketView from '$lib/components/markets/MarketView.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<MarketView meta={data.meta} rates={data.rates} />
