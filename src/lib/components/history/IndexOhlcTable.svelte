<script lang="ts">
  import { fmt } from '$lib/utils/format';
  import type { IndexDailyHistoryEntry } from '$lib/services/currency/v1/index';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import ProGate from '$lib/components/pro/ProGate.svelte';
  import HistoryUnlockGate from '$lib/components/pro/HistoryUnlockGate.svelte';
  import type { DayPassStatus } from '$lib/services/billing.service';

  let {
    rows,
    symbol = '',
    proSource,
    previewRows = null,
    dayPass = null,
  }: {
    rows: IndexDailyHistoryEntry[];
    symbol?: string;
    /** Page this table sits on; omit to hide the gated Export affordance. */
    proSource?: string;
    /** Render only the first N rows behind a Pro upsell. Null shows everything. */
    previewRows?: number | null;
    /** Resolved server-side by the page's load function. */
    dayPass?: DayPassStatus | null;
  } = $props();

  const PAGE_SIZES = [7, 14, 30];

  let fromDate = $state('');
  let toDate = $state('');
  let pageSize = $state(7);
  let currentPage = $state(1);

  // The selectable window is the span of data currently loaded for the range
  // chosen at the top of the page — the filter can't reach beyond it.
  const windowStart = $derived(
    rows.length ? rows.reduce((m, r) => (r.date < m ? r.date : m), rows[0].date).slice(0, 10) : ''
  );
  const windowEnd = $derived(
    rows.length ? rows.reduce((m, r) => (r.date > m ? r.date : m), rows[0].date).slice(0, 10) : ''
  );

  // When the range (and thus the loaded window) changes, snap the From/To back
  // to the full window so the table mirrors the duration selected up top.
  let lastWindow = '';
  $effect(() => {
    const w = `${windowStart}|${windowEnd}`;
    if (w !== lastWindow) {
      lastWindow = w;
      fromDate = windowStart;
      toDate = windowEnd;
      currentPage = 1;
    }
  });

  // Reset to the first page whenever the filter or page size changes.
  function resetPage() {
    currentPage = 1;
  }

  const filtered = $derived(
    rows.filter((r) => {
      const d = r.date.slice(0, 10);
      if (fromDate && d < fromDate) return false;
      if (toDate && d > toDate) return false;
      return true;
    })
  );

  const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / pageSize)));
  const safePage = $derived(Math.min(currentPage, totalPages));
  const paged = $derived(filtered.slice((safePage - 1) * pageSize, safePage * pageSize));

  // Rows past the limit are never rendered, so the gate holds up against "inspect
  // element" — filtering and paging only apply once the full history is visible.
  // Lifted once a day-pass purchase succeeds, so the already-loaded rows show
  // without a refetch.
  let unlocked = $state(false);

  const locked = $derived(!unlocked && previewRows !== null && rows.length > previewRows);
  const visible = $derived(locked ? rows.slice(0, previewRows!) : paged);

  function fmtDate(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      });
    } catch {
      return iso;
    }
  }

  function changePct(open: number, close: number): number {
    if (!open) return 0;
    return ((close - open) / open) * 100;
  }

  function clearFilter() {
    fromDate = windowStart;
    toDate = windowEnd;
    resetPage();
  }

  const hasFilter = $derived(fromDate !== windowStart || toDate !== windowEnd);
</script>

<div class="relative rounded-xl border overflow-hidden" style="background: var(--page-bg); border-color: var(--card-border);">
  <!-- Header -->
  <div
    class="px-5 py-3 border-b flex items-center justify-between gap-3 flex-wrap"
    style="background: var(--page-bg); border-color: var(--card-border);"
  >
    <h3 class="text-[14px] font-semibold" style="color: var(--text-primary);">Index OHLC Data</h3>
    <span class="text-[11px]" style="color: var(--text-secondary);">
      {#if locked}Showing {visible.length} of {rows.length}{:else}{filtered.length} rows{/if}
    </span>
  </div>

  <!-- Filter row -->
  <div
    class="px-5 py-3 border-b flex items-center gap-2 flex-wrap"
    style="border-color: var(--card-border);"
  >
    {#if locked}
      <span class="text-[11px]" style="color: var(--text-muted);">
        Last {visible.length} days · date filter is a Pro feature
      </span>
    {:else}
    <label class="flex items-center gap-1.5 text-[11px]" style="color: var(--text-secondary);">
      From
      <input
        type="date"
        bind:value={fromDate}
        min={windowStart || undefined}
        max={toDate || windowEnd || undefined}
        onchange={resetPage}
        class="px-2 py-1 rounded-md text-[12px] border outline-none"
        style="background: var(--card-bg); color: var(--text-primary); border-color: var(--card-border);"
      />
    </label>
    <label class="flex items-center gap-1.5 text-[11px]" style="color: var(--text-secondary);">
      To
      <input
        type="date"
        bind:value={toDate}
        min={fromDate || windowStart || undefined}
        max={windowEnd || undefined}
        onchange={resetPage}
        class="px-2 py-1 rounded-md text-[12px] border outline-none"
        style="background: var(--card-bg); color: var(--text-primary); border-color: var(--card-border);"
      />
    </label>
    {#if hasFilter}
      <button
        type="button"
        onclick={clearFilter}
        class="text-[11px] font-semibold px-2.5 py-1 rounded-md cursor-pointer hover:underline"
        style="color: var(--accent);"
      >Reset</button>
    {/if}
    {/if}
    {#if proSource}
      <div class="ml-auto">
        <ProGate
          variant="button"
          size="sm"
          feature="export-index-history"
          source={proSource}
          title="Upgrade to Pro for unlimited historical data exports."
          features={[
            'Unlimited CSV & PDF exports',
            'Export any custom date range',
            'Full historical index data access',
            'Priority, ad-free data access'
          ]}
        />
      </div>
    {/if}
  </div>

  <div class="overflow-x-auto">
    <table class="w-full text-[12px]" style="min-width: 680px;">
      <thead>
        <tr style="background: var(--table-header-bg);">
          <th class="text-left px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Date</th>
          <th class="text-right px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Open</th>
          <th class="text-right px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">High</th>
          <th class="text-right px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Low</th>
          <th class="text-right px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Close</th>
          <th class="text-right px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Change</th>
          <th class="text-right px-4 py-2.5 font-semibold" style="color: var(--text-secondary);">Spread</th>
        </tr>
      </thead>
      <tbody>
        {#each visible as row}
          {@const up = row.close >= row.open}
          {@const pct = changePct(row.open, row.close)}

          <tr
            class="border-t transition-colors hover:bg-[var(--table-hover)]"
            style="border-color: var(--card-border);"
          >
            <td class="px-4 py-2.5 whitespace-nowrap" style="color: var(--text-secondary);">
              {fmtDate(row.date)}
            </td>
            <td class="text-right px-4 py-2.5 font-mono" style="color: var(--text-primary);">{symbol}{fmt(row.open)}</td>
            <td class="text-right px-4 py-2.5 font-mono" style="color: var(--positive);">{symbol}{fmt(row.high)}</td>
            <td class="text-right px-4 py-2.5 font-mono" style="color: var(--negative);">{symbol}{fmt(row.low)}</td>
            <td class="text-right px-4 py-2.5 font-mono font-semibold" style="color: {up ? 'var(--positive)' : 'var(--negative)'};">
              {symbol}{fmt(row.close)}
            </td>
            <td class="text-right px-4 py-2.5 font-mono" style="color: {up ? 'var(--positive)' : 'var(--negative)'};">
              {up ? '+' : ''}{pct.toFixed(2)}%
            </td>
            <td class="text-right px-4 py-2.5 font-mono" style="color: var(--text-secondary);">{symbol}{fmt(row.avg_spread_range)}</td>
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
        label="index"
        source={proSource ?? 'markets-history'}
        {dayPass}
        onUnlock={() => (unlocked = true)}
      />
    </div>
  {:else if filtered.length === 0}
    <EmptyState
      title="No OHLC rows"
      description={hasFilter
        ? 'No daily index snapshots match the selected dates.'
        : 'No daily index snapshots were recorded for this pair and range.'}
      compact
    />
  {:else}
    <!-- Footer: page size + pagination -->
    <div
      class="px-5 py-3 border-t flex items-center justify-between gap-3 flex-wrap"
      style="border-color: var(--card-border);"
    >
      <label class="flex items-center gap-1.5 text-[11px]" style="color: var(--text-secondary);">
        Rows
        <select
          bind:value={pageSize}
          onchange={resetPage}
          class="px-2 py-1 rounded-md text-[12px] border outline-none cursor-pointer"
          style="background: var(--card-bg); color: var(--text-primary); border-color: var(--card-border);"
        >
          {#each PAGE_SIZES as n}
            <option value={n}>{n}</option>
          {/each}
        </select>
      </label>

      <div class="flex items-center gap-2">
        <button
          type="button"
          disabled={safePage <= 1}
          onclick={() => (currentPage = safePage - 1)}
          class="text-[12px] font-medium px-3 py-1.5 rounded-md border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style="background: transparent; border-color: var(--card-border); color: var(--text-secondary);"
        >Previous</button>
        <span class="text-[11px]" style="color: var(--text-muted);">
          Page {safePage} of {totalPages}
        </span>
        <button
          type="button"
          disabled={safePage >= totalPages}
          onclick={() => (currentPage = safePage + 1)}
          class="text-[12px] font-medium px-3 py-1.5 rounded-md border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style="background: transparent; border-color: var(--card-border); color: var(--text-secondary);"
        >Next</button>
      </div>
    </div>
  {/if}
</div>
