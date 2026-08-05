<script lang="ts">
	import { fmt } from '$lib/utils/format';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { ACCOUNT_URL } from '$lib/config';

	type Range = '7d' | '30d' | '60d' | '90d';

	interface Snapshot {
		date: string;
		open: number;
		high: number;
		low: number;
		close: number;
		availability_pct: number;
	}

	let { history, historyLoading, symbol, selectedRange, providerName, providerIconUrl, previewRows = null }: {
		history: Snapshot[];
		historyLoading: boolean;
		symbol: string;
		selectedRange: Range;
		providerName: string;
		providerIconUrl: string | null;
		/** Render only the first N rows behind a Pro upsell. Null shows everything. */
		previewRows?: number | null;
	} = $props();

	let iconError = $state(false);

	const initials = $derived(
		providerName.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
	);

	// Rows past the limit are never rendered, so the gate holds up against "inspect
	// element" — it isn't a visual mask over data already sitting in the DOM.
	const visibleRows = $derived(previewRows ? history.slice(0, previewRows) : history);
	const locked = $derived(previewRows !== null && history.length > previewRows);
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
			<table class="w-full text-[12px]" style="min-width: 640px;">
				<thead>
					<tr style="background: var(--table-header-bg);">
						<th class="text-left px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Date</th>
						<th class="text-left px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Provider</th>
						<th class="text-right px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Open</th>
						<th class="text-right px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">High</th>
						<th class="text-right px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Low</th>
						<th class="text-right px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Close</th>
						<th class="text-right px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Avail.</th>
					</tr>
				</thead>
				<tbody>
					{#each visibleRows as row}
						{@const up = row.close >= row.open}
						<tr class="border-t transition-colors hover:bg-[var(--table-hover)]" style="border-color: var(--card-border);">
							<td class="px-4 py-2.5 whitespace-nowrap" style="color: var(--text-secondary);">
								{new Date(row.date).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
									year: 'numeric'
								})}
							</td>
							<td class="px-4 py-2.5">
								<div class="flex items-center gap-2 w-fit">
									{#if providerIconUrl && !iconError}
										<img
											src={providerIconUrl}
											alt={providerName}
											style="width:16px; height:16px; border-radius:3px; object-fit:contain; flex-shrink:0;"
											onerror={() => {
												iconError = true;
											}}
										/>
									{:else}
										<div
											style="width:16px; height:16px; border-radius:3px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:5px; font-weight:700; background:var(--table-header-bg); color:var(--text-secondary);"
										>
											{initials}
										</div>
									{/if}
									<span style="color: var(--text-primary); font-family: var(--font-head);">{providerName}</span>
								</div>
							</td>
							<td class="text-right px-4 py-2.5 font-mono" style="color: var(--text-primary);">{symbol}{fmt(row.open)}</td>
							<td class="text-right px-4 py-2.5 font-mono" style="color: var(--positive);">{symbol}{fmt(row.high)}</td>
							<td class="text-right px-4 py-2.5 font-mono" style="color: var(--negative);">{symbol}{fmt(row.low)}</td>
							<td
								class="text-right px-4 py-2.5 font-mono font-semibold"
								style="color: {up ? 'var(--positive)' : 'var(--negative)'};"
							>{symbol}{fmt(row.close)}</td>
							<td class="text-right px-4 py-2.5" style="color: var(--text-muted);">{row.availability_pct.toFixed(0)}%</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if locked}
			<!-- Anchored to the card, so the fade begins transparent over the last visible
			     rows and the table reads as cut off rather than simply ending. -->
			<div
				class="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1.5 px-5 pb-6 pt-24 text-center"
				style="background: linear-gradient(to bottom, transparent 0%, var(--page-bg) 55%);"
			>
				<p class="text-[13px] font-semibold" style="color: var(--text-primary);">
					{history.length - visibleRows.length} more days of {providerName} OHLC data
				</p>
				<p class="text-[12px] max-w-sm" style="color: var(--text-secondary);">
					Sign up for Monierate Pro to unlock the full history for this pair.
				</p>
				<a
					href="{ACCOUNT_URL}/auth/signup"
					class="mt-1.5 inline-flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
					style="background: var(--text-primary); color: var(--page-bg);"
				>
					Sign up to Monierate Pro
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M7 17 17 7" />
						<path d="M7 7h10v10" />
					</svg>
				</a>
			</div>
		{/if}
	{/if}
</div>
