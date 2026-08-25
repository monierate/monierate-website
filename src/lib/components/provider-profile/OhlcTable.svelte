<script lang="ts">
	import { fmt } from '$lib/utils/format';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import HistoryUnlockGate from '$lib/components/pro/HistoryUnlockGate.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import type { DayPassStatus } from '$lib/services/billing.service';

	type TableRange = '7d' | '30d' | '60d' | '90d' | 'all';
	const RANGE_OPTIONS: { value: TableRange; label: string }[] = [
		{ value: '7d', label: '7d' },
		{ value: '30d', label: '30d' },
		{ value: '60d', label: '60d' },
		{ value: '90d', label: '90d' },
		{ value: 'all', label: 'All' }
	];

	interface Snapshot {
		date: string;
		open: number;
		high: number;
		low: number;
		close: number;
		/** Null on manually-updated providers, which report no fetch attempts. */
		availability_pct: number | null;
	}

	let {
		rows,
		total,
		page,
		pageSize = 20,
		loading,
		symbol,
		range,
		providerName,
		providerIconUrl,
		previewRows = null,
		proSource = 'markets-pair-provider',
		dayPass = null,
		onPageChange,
		onRangeChange
	}: {
		/** Current page's rows only — pagination is server-driven, not sliced client-side. */
		rows: Snapshot[];
		/** True row count for the selected window, from the API's pagination envelope. */
		total: number;
		page: number;
		pageSize?: number;
		loading: boolean;
		symbol: string;
		/** Table's own date window — independent of the chart's range pills above it. */
		range: TableRange;
		providerName: string;
		providerIconUrl: string | null;
		/** Cap the free preview to this many rows (== page 1) behind a Pro upsell. Null shows everything. */
		previewRows?: number | null;
		/** Page this table sits on — feeds the gate's CTA attribution. */
		proSource?: string;
		/** Resolved server-side by the page's load function. */
		dayPass?: DayPassStatus | null;
		onPageChange: (page: number) => void;
		onRangeChange: (range: TableRange) => void;
	} = $props();

	let iconError = $state(false);

	const initials = $derived(
		providerName.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
	);

	// Lifted once a day-pass purchase succeeds — page 1 is already loaded, so
	// this just unhides the pagination controls for the pages beyond it.
	let unlocked = $state(false);

	// `total` (not the length of whatever's been fetched) decides whether this
	// gates, so it stays correct even though only one page is ever in memory.
	const locked = $derived(!unlocked && previewRows !== null && total > previewRows);
	const visibleRows = $derived(locked ? rows.slice(0, previewRows!) : rows);
	const totalPages = $derived(locked ? 1 : Math.max(1, Math.ceil(total / pageSize)));
</script>

<div class="relative rounded-xl border overflow-hidden" style="background: var(--page-bg); border-color: var(--card-border);">
	<div
		class="px-5 py-3 border-b flex items-center justify-between"
		style="background: var(--table-header-bg); border-color: var(--card-border);"
	>
		<h3 class="text-[14px] font-semibold" style="color: var(--text-primary);">OHLC Data</h3>
		<span class="text-[11px] flex items-center gap-1" style="color: var(--text-secondary);">
			{#if locked}
				Showing {visibleRows.length} of {total}
			{:else if totalPages > 1}
				Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
			{:else}
				{total} rows
			{/if}
			<span aria-hidden="true">·</span>
			<select
				value={range}
				onchange={(e) => onRangeChange(e.currentTarget.value as TableRange)}
				aria-label="Table date range"
				class="bg-transparent border-none outline-none cursor-pointer font-semibold p-0"
				style="color: var(--accent); font-size: 11px;"
			>
				{#each RANGE_OPTIONS as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</span>
	</div>

	{#if !loading && rows.length === 0}
		<EmptyState title="No historical data" description="No daily snapshots found for this pair and time range." compact />
	{:else}
		<div class="relative">
			{#if loading}
				<!-- Dims the existing rows in place rather than swapping them out, so
				     paging or switching ranges never shifts the table's height. -->
				<div
					class="absolute inset-0 z-10 flex items-center justify-center"
					style="background: color-mix(in srgb, var(--page-bg) 65%, transparent);"
				>
					<div class="flex items-center gap-2" style="color: var(--text-muted);">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="animate-spin">
							<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="31.4 31.4" stroke-linecap="round" />
						</svg>
						<span class="text-[12px]">Loading…</span>
					</div>
				</div>
			{/if}
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
								<td class="text-right px-4 py-2.5" style="color: var(--text-muted);">
								{row.availability_pct == null ? '—' : `${row.availability_pct.toFixed(0)}%`}
							</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		{#if locked}
			<!-- Anchored to the card, so the fade begins transparent over the last visible
			     rows and the table reads as cut off rather than simply ending. -->
			<div
				class="absolute inset-x-0 bottom-0 px-5 pb-6 pt-24"
				style="background: linear-gradient(to bottom, transparent 0%, var(--page-bg) 55%);"
			>
				<HistoryUnlockGate
					label={providerName}
					source={proSource}
					{dayPass}
					onUnlock={() => (unlocked = true)}
				/>
			</div>
		{:else if totalPages > 1}
			<div
				class="px-5 py-3 border-t flex items-center"
				style="border-color: var(--card-border);"
			>
				<Pagination currentPage={page} {totalPages} onChange={onPageChange} />
			</div>
		{/if}
	{/if}
</div>
