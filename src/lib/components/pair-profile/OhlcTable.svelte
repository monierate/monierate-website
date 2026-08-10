<script lang="ts">
	import { fmt } from '$lib/utils/format';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import HistoryUnlockGate from '$lib/components/pro/HistoryUnlockGate.svelte';
	import type { DayPassStatus } from '$lib/services/billing.service';

	type Range = '7d' | '30d' | '60d' | '90d';

	interface Snapshot {
		date: string;
		open: number;
		high: number;
		low: number;
		close: number;
	}

	let { history, historyLoading, symbol, selectedRange, previewRows = null, proSource = 'markets-pair', dayPass = null }: {
		history: Snapshot[];
		historyLoading: boolean;
		symbol: string;
		selectedRange: Range;
		/** Render only the first N rows behind a Pro upsell. Null shows everything. */
		previewRows?: number | null;
		/** Page this table sits on — feeds the gate's CTA attribution. */
		proSource?: string;
		/** Resolved server-side by the page's load function. */
		dayPass?: DayPassStatus | null;
	} = $props();

	// Lifted once a day-pass purchase succeeds, so the already-loaded rows show
	// without a refetch.
	let unlocked = $state(false);

	// Rows past the limit are never rendered, so the gate holds up against "inspect
	// element" — it isn't a visual mask over data already sitting in the DOM.
	const visibleRows = $derived(previewRows && !unlocked ? history.slice(0, previewRows) : history);
	const locked = $derived(!unlocked && previewRows !== null && history.length > previewRows);
</script>

<div class="relative rounded-xl border overflow-hidden" style="background: var(--page-bg); border-color: var(--card-border);">
	<div
		class="px-5 py-3 border-b flex items-center justify-between"
		style="background: var(--table-header-bg); border-color: var(--card-border);"
	>
		<h3 class="text-[14px] font-semibold" style="color: var(--text-primary);">OHLC Data</h3>
		<span class="text-[11px]" style="color: var(--text-secondary);">
			{#if locked}
				Showing {visibleRows.length} of {history.length} · {selectedRange}
			{:else}
				{history.length} rows · {selectedRange}
			{/if}
		</span>
	</div>

	{#if historyLoading}
		<div class="flex items-center justify-center py-12" style="color: var(--text-muted);">
			<span class="text-[12px]">Loading…</span>
		</div>
	{:else if history.length === 0}
		<EmptyState title="No historical data" description="No daily snapshots found for this pair and time range." compact />
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full text-[12px]" style="min-width: 560px;">
				<thead>
					<tr style="background: var(--table-header-bg);">
						<th class="text-left px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Date</th>
						<th class="text-right px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Open</th>
						<th class="text-right px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">High</th>
						<th class="text-right px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Low</th>
						<th class="text-right px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Close</th>
						<th class="text-right px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Change</th>
					</tr>
				</thead>
				<tbody>
					{#each visibleRows as row}
						{@const up = row.close >= row.open}
						{@const pct = row.open ? ((row.close - row.open) / row.open) * 100 : 0}
						<tr class="border-t transition-colors hover:bg-[var(--table-hover)]" style="border-color: var(--card-border);">
							<td class="px-4 py-2.5 whitespace-nowrap" style="color: var(--text-secondary);">
								{new Date(row.date).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
									year: 'numeric'
								})}
							</td>
							<td class="text-right px-4 py-2.5 font-mono" style="color: var(--text-primary);">{symbol}{fmt(row.open)}</td>
							<td class="text-right px-4 py-2.5 font-mono" style="color: var(--positive);">{symbol}{fmt(row.high)}</td>
							<td class="text-right px-4 py-2.5 font-mono" style="color: var(--negative);">{symbol}{fmt(row.low)}</td>
							<td
								class="text-right px-4 py-2.5 font-mono font-semibold"
								style="color: {up ? 'var(--positive)' : 'var(--negative)'};"
							>{symbol}{fmt(row.close)}</td>
							<td class="text-right px-4 py-2.5 font-mono" style="color: {up ? 'var(--positive)' : 'var(--negative)'};">
								{up ? '+' : ''}{pct.toFixed(2)}%
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if locked}
			<!-- Anchored to the card, so the fade begins transparent over the last visible
			     rows and the table reads as cut off rather than simply ending. -->
			<div
				class="absolute inset-x-0 bottom-0 px-5 pb-6 pt-24"
				style="background: linear-gradient(to bottom, transparent 0%, var(--page-bg) 55%);"
			>
				<HistoryUnlockGate
					label="this pair's"
					source={proSource}
					{dayPass}
					onUnlock={() => (unlocked = true)}
				/>
			</div>
		{/if}
	{/if}
</div>
