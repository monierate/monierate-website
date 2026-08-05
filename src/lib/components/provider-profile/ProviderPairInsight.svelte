<script lang="ts">
	import ProviderLogo from '$lib/components/ui/ProviderLogo.svelte';
	import RateStats from './RateStats.svelte';
	import ProviderAbout from './ProviderAbout.svelte';
	import ProviderConverter from './ProviderConverter.svelte';
	import HistoryChart from '$lib/components/history/HistoryChart.svelte';
	import { getIconPath } from '$lib/utils';

	type Range = '7d' | '30d' | '60d' | '90d';
	const RANGES: readonly Range[] = ['7d', '30d', '60d', '90d'];

	// Structural shape of ProviderPairInsightActions — avoids a lib→routes import.
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

	let { provider, currentRate, state, onClose, showBreadcrumb = true, showProfileLink = true }: {
		provider: any;
		currentRate: any;
		state: InsightState;
		onClose?: () => void;
		showBreadcrumb?: boolean;
		showProfileLink?: boolean;
	} = $props();

	const providerIconUrl = $derived(provider.icon ? getIconPath(provider.icon) : null);
	const { base, quote, symbol } = $derived(state.parsedPair);
	const pairDisplay = $derived(`${base}/${quote}`);
</script>

<div class="space-y-5">
	<!-- Header -->
	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0">
			{#if showBreadcrumb}
				<nav class="flex items-center gap-1.5 text-[12px] mb-2" style="color: var(--text-muted);" aria-label="Breadcrumb">
					<a
						href="/markets/overview/{state.pairCode}"
						class="hover:underline tabular-nums"
						style="color: var(--text-secondary); font-family: var(--font-mono);"
					>{pairDisplay}</a>
					<span aria-hidden="true">›</span>
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
				href="/markets/providers/{state.providerCode}?pair={state.pairCode}"
				class="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap hover:bg-[var(--table-hover)]"
				style="color: var(--text-secondary); border-color: var(--card-border);"
			>
				View Profile
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
	{/if}

	<!-- Chart + quick converter (converter drops below the chart on mobile) -->
	<div class="grid grid-cols-1 lg:grid-cols-[1fr_296px] gap-4">
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

		<ProviderConverter {state} {base} {quote} {symbol} {currentRate} />
	</div>

	<!-- About blurb -->
	<ProviderAbout {provider} />
</div>
