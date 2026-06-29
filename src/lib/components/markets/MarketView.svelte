<script lang="ts">
	import type { MarketCurrencyRate, MarketMeta } from '$lib/types/market';
	import MarketTabs from './MarketTabs.svelte';
	import MarketRateTable from './MarketRateTable.svelte';

	export let meta: MarketMeta;
	export let rates: MarketCurrencyRate[] = [];

	$: updated = new Date(meta.updatedAt).toLocaleString('en-US', {
		dateStyle: 'medium',
		timeStyle: 'short'
	});
</script>

<section class="market-view">
	<div class="head-row">
		<div>
			<span class="eyebrow">Markets · {meta.base}</span>
			<h1>{meta.title}</h1>
			<p class="sub">{meta.description}</p>
		</div>
	</div>

	<div class="controls">
		<MarketTabs />
		<span class="updated">Updated {updated}</span>
	</div>

	<MarketRateTable {rates} rateMode={meta.rateMode} base={meta.base} />
</section>

<style>
	.market-view {
		width: 95%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
	}

	.eyebrow {
		font-family: var(--font-head);
		font-size: 0.78rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--accent);
	}
	h1 {
		font-family: var(--font-head);
		font-weight: 700;
		font-size: clamp(1.8rem, 4vw, 2.4rem);
		color: var(--text-primary);
		margin: 0.25rem 0 0.5rem;
	}
	.sub {
		max-width: 46rem;
		color: var(--text-secondary);
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin: 1.5rem 0 1rem;
	}
	.updated {
		font-size: 0.8rem;
		color: var(--text-muted);
	}
</style>
