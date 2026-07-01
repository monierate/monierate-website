<script lang="ts">
	import type { MarketCurrencyRate, MarketMeta } from '$lib/types/market';
	import { buildMarketRecap } from '$lib/services/recap';

	export let meta: MarketMeta;
	export let rates: MarketCurrencyRate[] = [];

	$: recap = buildMarketRecap(meta, rates);
</script>

{#if recap}
	<section class="recap" aria-label="Market recap">
		<div class="recap-head">
			<span class="eyebrow">Market recap</span>
			<span class="date">{recap.date}</span>
		</div>
		<h2 class="recap-title">What is the {meta.title} rate today?</h2>
		{#each recap.paragraphs as paragraph}
			<p>{paragraph}</p>
		{/each}
		<p class="note">Auto-generated from Monierate rate data.</p>
	</section>
{/if}

<style>
	.recap {
		margin: 2.5rem 0 1rem;
		padding: 1.5rem 1.75rem;
		border: 1px solid color-mix(in srgb, var(--card-border) 20%, transparent);
		background: var(--card-bg, transparent);
	}
	.recap-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}
	.eyebrow {
		font-family: var(--font-head);
		font-size: 0.78rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--accent);
	}
	.date {
		font-size: 0.8rem;
		color: var(--text-muted);
	}
	.recap-title {
		font-family: var(--font-head);
		font-weight: 700;
		font-size: 1.2rem;
		color: var(--text-primary);
		margin: 0 0 0.75rem;
	}
	.recap p {
		color: var(--text-secondary);
		font-size: 0.95rem;
		line-height: 1.65;
		margin-bottom: 0.75rem;
	}
	.recap p:last-child {
		margin-bottom: 0;
	}
	.note {
		font-size: 0.78rem !important;
		color: var(--text-muted) !important;
		font-style: italic;
	}
</style>
