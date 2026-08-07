<script lang="ts">
	import RateStats from './RateStats.svelte';
	import Converter from './Converter.svelte';
	import HistoryChart from '$lib/components/history/HistoryChart.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { useImageOrDefault } from '$lib/utils/loadImageOrDefault';
	import type { Snippet } from 'svelte';

	type Range = '7d' | '30d' | '60d' | '90d';
	const RANGES: readonly Range[] = ['7d', '30d', '60d', '90d'];

	// Structural shape of PairInsightActions — avoids a lib→routes import.
	interface InsightState {
		pairCode: string;
		selectedRange: Range;
		historyLoading: boolean;
		rangeHigh: number;
		rangeLow: number;
		parsedPair: { base: string; quote: string; symbol: string };
		chartData: { dateLabel: string; open: number; close: number; high: number; low: number }[];
		chartSeries: { key: string; label: string; color: string; fill: boolean; dashed?: boolean }[];
		selectRange: (r: Range) => void;
		// Quick converter
		convertSwapped: boolean;
		sendDisplay: string;
		receiveDisplay: string;
		activeRateValue: number;
		handleSendInput: (val: string) => void;
		handleReceiveInput: (val: string) => void;
		toggleSwap: () => void;
	}

	let { currentRate, state, summary }: {
		currentRate: any;
		state: InsightState;
		/** Optional blurb rendered between the header and the stat cards. */
		summary?: Snippet;
	} = $props();

	const { base, quote, symbol } = $derived(state.parsedPair);
	const pairDisplay = $derived(`${base}/${quote}`);

	const baseIcon = $derived(useImageOrDefault(`/icons/currencies/${base.toLowerCase()}.png`, ''));
	const baseInitials = $derived(base.slice(0, 3));

	const hasHistory = $derived(state.chartData.length > 0);
	const showConverter = $derived(!!currentRate);
	const showChartColumn = $derived(!!currentRate || hasHistory || state.historyLoading);
</script>

<div class="space-y-5">
	<!-- Header -->
	<div class="flex items-start justify-between gap-3">
		<div class="flex items-center gap-3 min-w-0">
			{#await baseIcon then src}
				{#if src}
					<img
						{src}
						alt={base}
						class="rounded-full object-cover flex-shrink-0"
						style="width:40px; height:40px; border: 1px solid var(--card-border);"
					/>
				{:else}
					<div
						class="rounded-full flex items-center justify-center flex-shrink-0"
						style="width:40px; height:40px; font-size:12px; font-weight:700; font-family:var(--font-head); background:var(--table-header-bg); color:var(--text-primary);"
					>
						{baseInitials}
					</div>
				{/if}
			{/await}
			<div class="min-w-0">
				<h1
					class="text-[18px] font-bold leading-tight tabular-nums"
					style="font-family: var(--font-mono); color: var(--text-primary);"
				>{pairDisplay}</h1>
				<p class="text-[13px] truncate" style="color: var(--text-secondary);">Composite Index</p>
			</div>
		</div>

		<a
			href="/markets/{state.pairCode}/insight"
			class="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap hover:bg-[var(--table-hover)] flex-shrink-0"
			style="color: var(--text-secondary); border-color: var(--card-border);"
		>
			Full Insight
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M7 17 17 7" />
				<path d="M7 7h10v10" />
			</svg>
		</a>
	</div>

	{@render summary?.()}

	<!-- Metrics -->
	{#if currentRate}
		<RateStats
			{currentRate}
			{base}
			{quote}
			{symbol}
			high={state.rangeHigh}
			low={state.rangeLow}
			rangeLabel={state.selectedRange}
		/>
	{:else}
		<div
			class="rounded-xl border"
			style="background: var(--card-bg); border-color: var(--card-border);"
		>
			<EmptyState
				title="No live {pairDisplay} composite rate"
				description={hasHistory
					? `We aren't receiving current quotes for this pair. The history below is the last data we recorded.`
					: `Monierate isn't currently tracking a composite rate for this pair.`}
			/>
		</div>
	{/if}

	<!-- Chart + quick converter (converter drops below the chart on mobile) -->
	{#if showChartColumn || showConverter}
	<div class="grid grid-cols-1 gap-4 {showConverter ? 'lg:grid-cols-[1fr_296px]' : ''}">
		{#if showChartColumn}
		<div>
			{#if state.historyLoading}
				<div
					class="rounded-xl border flex items-center justify-center"
					style="background: var(--card-bg); border-color: var(--card-border); height: 352px;"
				>
					<div class="flex flex-col items-center gap-2" style="color: var(--text-muted);">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="animate-spin">
							<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="31.4 31.4" stroke-linecap="round" />
						</svg>
						<span class="text-[12px]">Loading chart data…</span>
					</div>
				</div>
			{:else}
				<HistoryChart
					data={state.chartData}
					series={state.chartSeries}
					{symbol}
				>
					{#snippet rangeControls()}
						<div class="flex gap-1">
							{#each RANGES as r}
								<button
									onclick={() => state.selectRange(r)}
									class="px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer"
									style="
										background: {state.selectedRange === r ? 'var(--table-header-bg)' : 'transparent'};
										color: {state.selectedRange === r ? 'var(--text-primary)' : 'var(--text-muted)'};
										border-color: var(--card-border);
									"
								>{r}</button>
							{/each}
						</div>
					{/snippet}
				</HistoryChart>
			{/if}
		</div>
		{/if}

		{#if showConverter}
			<Converter {state} {base} {quote} {symbol} {currentRate} />
		{/if}
	</div>
	{/if}
</div>
