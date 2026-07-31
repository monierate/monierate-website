<script lang="ts">
	import HistoryChart from '$lib/components/history/HistoryChart.svelte';
	import ProviderConverter from './ProviderConverter.svelte';

	const RANGES = ['7d', '30d', '60d', '90d'] as const;
	type Range = (typeof RANGES)[number];

	interface ChartState {
		selectedRange: Range;
		historyLoading: boolean;
		chartData: { dateLabel: string; open: number; close: number; high: number; low: number }[];
		chartSeries: { key: string; label: string; color: string; fill: boolean; dashed?: boolean }[];
		selectRange: (r: Range) => void;
		convertDir: 'buy' | 'sell';
		convertSwapped: boolean;
		sendDisplay: string;
		receiveDisplay: string;
		activeRateValue: number;
		handleSendInput: (val: string) => void;
		handleReceiveInput: (val: string) => void;
		toggleSwap: () => void;
	}

	let { state, base, quote, symbol, currentRate, providerName, providerCode, providerIconUrl }: {
		state: ChartState;
		base: string;
		quote: string;
		symbol: string;
		currentRate: any;
		providerName: string;
		providerCode: string;
		providerIconUrl: string | null;
	} = $props();
</script>

<div>
	<div class="grid grid-cols-1 lg:grid-cols-[1fr_296px] gap-4">
		<div>
			{#if state.historyLoading}
				<div
					class="rounded-xl border flex items-center justify-center"
					style="background: var(--card-bg); border-color: var(--card-border); height: 352px;"
				>
					<div class="flex flex-col items-center gap-2" style="color: var(--text-muted);">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="animate-spin">
							<circle
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="2"
								stroke-dasharray="31.4 31.4"
								stroke-linecap="round"
							/>
						</svg>
						<span class="text-[12px]">Loading chart data…</span>
					</div>
				</div>
			{:else}
				<HistoryChart
					data={state.chartData}
					series={state.chartSeries}
					{symbol}
					{providerName}
					providerCode={providerCode}
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
</div>
