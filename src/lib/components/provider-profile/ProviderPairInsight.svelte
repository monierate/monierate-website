<script lang="ts">
	import ProviderLogo from '$lib/components/ui/ProviderLogo.svelte';
	import RateStats from './RateStats.svelte';
	import ProviderAbout from './ProviderAbout.svelte';
	import ProviderConverter from './ProviderConverter.svelte';
	import HistoryChart from '$lib/components/history/HistoryChart.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { getIconPath } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { RateBasis } from '$lib/utils/currentRate';

	type Range = '7d' | '30d' | '60d' | '90d';
	const RANGES: readonly Range[] = ['7d', '30d', '60d', '90d'];

	// Structural shape of ProviderPairInsightActions â€” avoids a libâ†’routes import.
	interface InsightState {
		pairCode: string;
		providerCode: string;
		selectedRange: Range;
		historyLoading: boolean;
		rangeHigh: number;
		rangeLow: number;
		parsedPair: { base: string; quote: string; symbol: string };
		chartData: { dateLabel: string; open: number; close: number; high: number; low: number }[];
		chartSeries: { key: string; label: string; color: string; fill: boolean; dashed?: boolean }[];
		selectRange: (r: Range) => void;
		// Quick converter
		convertDir: 'buy' | 'sell';
		convertSwapped: boolean;
		sendDisplay: string;
		receiveDisplay: string;
		activeRateValue: number;
		handleSendInput: (val: string) => void;
		handleReceiveInput: (val: string) => void;
		toggleSwap: () => void;
	}

	let {
		provider,
		currentRate,
		state,
		onClose,
		showBreadcrumb = true,
		summary,
		rateBasis = 'live',
		rateAsOf = null
	}: {
		provider: any;
		currentRate: any;
		state: InsightState;
		onClose?: () => void;
		showBreadcrumb?: boolean;
		/** Optional blurb rendered between the header and the stat cards. */
		summary?: Snippet;
		/** Whether `currentRate` is a live quote or the last sealed daily close. */
		rateBasis?: RateBasis;
		/** ISO date the rate is effective for — set when `rateBasis` is `'daily'`. */
		rateAsOf?: string | null;
	} = $props();

	const providerIconUrl = $derived(provider.icon ? getIconPath(provider.icon) : null);
	const { base, quote, symbol } = $derived(state.parsedPair);
	const pairDisplay = $derived(`${base}/${quote}`);

	// No rate of any kind for this pair. The chart still earns its place if the
	// provider has history (a long-stalled feed), but the converter does not — it
	// would silently multiply by a zero rate.
	const hasHistory = $derived(state.chartData.length > 0);
	const showConverter = $derived(!!currentRate);
	const showChartColumn = $derived(!!currentRate || hasHistory || state.historyLoading);

	// Daily-cadence providers (Yellow Card, Chipper Cash…) never appear in the live
	// quote feed, so their rate here is the most recent sealed daily close. Labelled
	// rather than hidden: the number is real, it just isn't a tick-by-tick quote.
	const isDaily = $derived(!!currentRate && rateBasis === 'daily');
	const asOfLabel = $derived(
		rateAsOf
			? new Date(rateAsOf).toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
					year: 'numeric',
					timeZone: 'UTC'
				})
			: ''
	);
</script>

<div class="space-y-5">
	<!-- Header -->
	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0">
			{#if showBreadcrumb}
				<nav class="flex items-center gap-1.5 text-[12px] mb-2" style="color: var(--text-muted);" aria-label="Breadcrumb">
					<a
						href="/markets/{state.pairCode}"
						class="hover:underline tabular-nums"
						style="color: var(--text-secondary); font-family: var(--font-mono);"
					>{pairDisplay}</a>
					<span aria-hidden="true">â€º</span>
					<span class="truncate" style="color: var(--text-secondary);">{provider.name}</span>
				</nav>
			{/if}

			<div class="flex items-center gap-3">
				<ProviderLogo logo={provider.icon ?? ''} name={provider.name} size={40} />
				<div class="min-w-0">
					<h1
						class="text-[18px] font-bold leading-tight tabular-nums"
						style="font-family: var(--font-mono); color: var(--text-primary);"
					>{pairDisplay}</h1>
					<p class="text-[13px] truncate" style="color: var(--text-secondary);">{provider.name}</p>
				</div>
			</div>
		</div>

		<div class="flex items-center gap-2 flex-shrink-0">
			<a
				href="/exchanges/{state.providerCode}"
				class="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap hover:bg-[var(--table-hover)]"
				style="color: var(--text-secondary); border-color: var(--card-border);"
			>
				View Full Profile
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M7 17 17 7" />
					<path d="M7 7h10v10" />
				</svg>
			</a>
			{#if onClose}
				<button
					type="button"
					onclick={onClose}
					aria-label="Close"
					class="p-1.5 rounded-lg border cursor-pointer transition-colors hover:bg-[var(--table-hover)]"
					style="color: var(--text-muted); border-color: var(--card-border); background: none;"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
						<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			{/if}
		</div>
	</div>

	{@render summary?.()}

	<!-- Metrics -->
	{#if currentRate}
		{#if isDaily}
			<div
				class="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border px-3 py-2 text-[12px]"
				style="background: var(--table-header-bg); border-color: var(--card-border); color: var(--text-secondary);"
			>
				<span
					class="inline-flex items-center gap-1 font-semibold flex-shrink-0"
					style="color: var(--text-primary);"
				>
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
					</svg>
					Daily rate
				</span>
				<span>
					The {provider.name} {pairDisplay} rate is published once a day rather than continuously.
					The figures below are the daily close{asOfLabel ? ` for ${asOfLabel}` : ''}.
				</span>
			</div>
		{/if}
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
				title="No recent {pairDisplay} rate from {provider.name}"
				description={hasHistory
					? `We aren't receiving current quotes for this pair, and the last daily close we recorded is too old to show as a rate. The history below is the last data we have.`
					: `Monierate isn't currently tracking this pair from ${provider.name}.`}
			/>
			<div class="px-6 pb-6 flex flex-wrap justify-center gap-2">
				<a
					href="/markets/{state.pairCode}"
					class="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-[var(--table-hover)]"
					style="color: var(--text-secondary); border-color: var(--card-border);"
				>
					Compare live {pairDisplay} rates
				</a>
				<a
					href="/markets/providers/{state.providerCode}"
					class="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-[var(--table-hover)]"
					style="color: var(--text-secondary); border-color: var(--card-border);"
				>
					Other pairs on {provider.name}
				</a>
			</div>
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
						<span class="text-[12px]">Loading chart dataâ€¦</span>
					</div>
				</div>
			{:else}
				<HistoryChart
					data={state.chartData}
					series={state.chartSeries}
					{symbol}
					providerName={provider.name}
					providerCode={state.providerCode}
					providerIcon={providerIconUrl}
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
			<ProviderConverter
				{state}
				{base}
				{quote}
				{symbol}
				{currentRate}
				rateNote={isDaily ? `daily close${asOfLabel ? ` · ${asOfLabel}` : ''}` : ''}
			/>
		{/if}
	</div>
	{/if}

	<!-- About blurb -->
	<ProviderAbout {provider} />
</div>
