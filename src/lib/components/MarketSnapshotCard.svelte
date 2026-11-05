<script lang="ts">
	import { formatNumber } from '$lib/functions';
	import { rateDecimals } from '$lib/utils/highlights';
	import type { MarketSnapshot } from '$lib/server/marketSnapshot';

	export let snapshot: MarketSnapshot;
	/** Display symbols, e.g. "$" and "R". */
	export let base: string;
	export let quote: string;

	const rate = (value: number, symbol: string) => {
		const decimals = rateDecimals(value);
		return `${symbol} ${formatNumber(value, 'en-US', {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals
		})}`;
	};

	const percent = (value: number) =>
		`${formatNumber(Math.abs(value), 'en-US', { maximumFractionDigits: 2 })}%`;
</script>

<!-- Same shell as HighlightCard, so it sits in the row as one of them. -->
<div class="card card-raised p-4 h-full">
	<div class="flex justify-between items-center mb-4">
		<span
			class="font-head block text-[0.8em] md:text-[1em] font-semibold"
			style="color: var(--text-primary);"
		>
			📊 Market snapshot
		</span>
	</div>

	<ul class="text-sm">
		<li class="flex justify-between gap-3 mb-2 text-nowrap">
			<span class="text-gray-500 dark:text-gray-300">Average rate</span>
			<span class="flex items-center gap-1">
				<span class="font-mono" style="color: var(--text-primary);">{rate(snapshot.average, quote)}</span>
				<small class="text-xs text-gray-500">per {base}1</small>
			</span>
		</li>

		{#if snapshot.change24h != null}
			<li class="flex justify-between gap-3 mb-2 text-nowrap">
				<span class="text-gray-500 dark:text-gray-300">24h change</span>
				<span
					class="font-mono"
					style="color: {snapshot.change24h > 0
						? 'var(--positive)'
						: snapshot.change24h < 0
							? 'var(--negative)'
							: 'var(--text-secondary)'};"
				>
					{snapshot.change24h > 0 ? '+' : snapshot.change24h < 0 ? '−' : ''}{percent(snapshot.change24h)}
				</span>
			</li>
		{/if}

		{#if snapshot.interbank}
			<li class="flex justify-between gap-3 mb-2 text-nowrap">
				<span class="text-gray-500 dark:text-gray-300" title="The mid-market rate banks trade at">
					Interbank rate
				</span>
				<span class="font-mono" style="color: var(--text-primary);">{rate(snapshot.interbank, quote)}</span>
			</li>
		{/if}

		{#if snapshot.premiumPercent != null}
			<li class="flex justify-between gap-3 mb-2 text-nowrap">
				<span class="text-gray-500 dark:text-gray-300">Average vs interbank</span>
				<span class="font-mono" style="color: var(--text-primary);">
					{percent(snapshot.premiumPercent)}
					{snapshot.premiumPercent >= 0 ? 'above' : 'below'}
				</span>
			</li>
		{/if}

		<li class="flex justify-between gap-3 mb-2 text-nowrap">
			<span class="text-gray-500 dark:text-gray-300">Providers tracked</span>
			<span class="font-mono" style="color: var(--text-primary);">{snapshot.providers}</span>
		</li>
	</ul>
</div>
