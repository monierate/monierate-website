<script lang="ts">
	import type { MarketCurrencyRate, MarketMeta } from '$lib/types/market';
	import { buildMarketRecap } from '$lib/services/recap';

	export let meta: MarketMeta;
	export let rates: MarketCurrencyRate[] = [];

	$: recap = buildMarketRecap(meta, rates);

	// Collapsed on mobile by default; the answer-first paragraph stays visible.
	let expanded = false;
</script>

{#if recap}
	<section class="recap" class:expanded aria-label="Market recap">
		<div class="recap-head">
			<span class="eyebrow">Market recap</span>
			<span class="date">{recap.date}</span>
		</div>
		<h2 class="recap-title">What is the {meta.title} rate today?</h2>
		{#each recap.paragraphs as paragraph, i}
			<p class:extra={i > 0}>{paragraph}</p>
		{/each}
		<p class="note extra">Auto-generated from Monierate rate data.</p>

		{#if recap.paragraphs.length > 1}
			<button
				type="button"
				class="toggle"
				aria-expanded={expanded}
				on:click={() => (expanded = !expanded)}
			>
				{expanded ? 'Show less' : 'Read more'}
			</button>
		{/if}
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

	.toggle {
		margin-top: 0.5rem;
		padding: 0;
		font-family: var(--font-head);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--accent);
		background: none;
		border: none;
		cursor: pointer;
	}

	/* Mobile: collapse everything past the answer-first paragraph. */
	.extra {
		display: none;
	}
	.recap.expanded .extra {
		display: block;
	}

	/* Desktop: always fully expanded, no toggle. */
	@media (min-width: 768px) {
		.extra {
			display: block;
		}
		.toggle {
			display: none;
		}
	}
</style>
