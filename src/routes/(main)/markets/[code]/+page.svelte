<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import { PairHistoryActions, RANGES } from './actions.svelte';
  import { activeBase } from '$lib/stores/activeBase';
  import { defaultCurrencyStore as activeQuote } from '$lib/stores/defaultCurrency';
  import Seo from '$lib/components/seo/Seo.svelte';
  import HistoryChart from '$lib/components/history/HistoryChart.svelte';
  import IndexOhlcTable from '$lib/components/history/IndexOhlcTable.svelte';
  import IndexHistoryGhost from '$lib/components/history/IndexHistoryGhost.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { fmt } from '$lib/utils/format';

  let { data }: { data: PageData } = $props();

  const s = untrack(() => new PairHistoryActions({ pairCode: data.pairCode, initialHistory: data.initialHistory }));

  const pairDisplay = $derived(`${s.parsedPair.base}/${s.parsedPair.quote}`);

  $effect(() => {
    activeBase.set(s.parsedPair.base);
    activeQuote.set(s.parsedPair.quote);
  });

  onMount(() => {
    const stopBaseWatch = activeBase.subscribe((base) => {
      if (base !== s.parsedPair.base) {
        goto(`/markets/${base.toLowerCase()}${s.parsedPair.quote.toLowerCase()}`);
      }
    });
    const stopQuoteWatch = activeQuote.subscribe((quote) => {
      if (quote !== s.parsedPair.quote) {
        goto(`/markets/${s.parsedPair.base.toLowerCase()}${quote.toLowerCase()}`);
      }
    });
    return () => {
      stopBaseWatch();
      stopQuoteWatch();
    };
  });
</script>

<Seo {...data.seo} />

<div class="max-w-6xl mx-auto space-y-6">

  <!-- Header -->
  <div class="flex items-start justify-between gap-3 flex-wrap">
    <div>
      <h1
        class="text-[22px] font-bold tabular-nums"
        style="font-family: var(--font-mono); color: var(--text-primary);"
      >{pairDisplay}</h1>
      <p class="text-[13px] mt-0.5" style="color: var(--text-secondary);">Daily OHLC of the composite index</p>
    </div>
    <a
      href="/markets/{data.pairCode}/insight"
      class="text-[12px] font-semibold whitespace-nowrap hover:underline"
      style="color: var(--accent);"
    >Full market insight →</a>
  </div>

  <!-- Stat cards -->
  <div class="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4">
    {#each [
      { label: 'Composite Rate', display: `${s.parsedPair.symbol}${fmt(s.currentRate)}`, color: 'var(--text-primary)', sub: 'latest close' },
      { label: `${s.selectedRange} Change`, display: `${s.changePct >= 0 ? '+' : ''}${s.changePct.toFixed(2)}%`, color: s.changePct >= 0 ? 'var(--positive)' : 'var(--negative)', sub: 'over range' },
      { label: `${s.selectedRange} High`, display: `${s.parsedPair.symbol}${fmt(s.rangeHigh)}`, color: 'var(--positive)', sub: 'range peak' },
      { label: `${s.selectedRange} Low`, display: `${s.parsedPair.symbol}${fmt(s.rangeLow)}`, color: 'var(--negative)', sub: 'range trough' },
    ] as stat}
      <div class="rounded-xl border" style="background: var(--page-bg); border-color: var(--card-border); padding: clamp(10px, 3vw, 16px);">
        <span style="font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:0.07em; color:var(--text-secondary);">{stat.label}</span>
        <div class="text-[15px] sm:text-[18px] font-bold leading-none mt-2" style="font-family: var(--font-mono); color: {stat.color};">
          {stat.display}
        </div>
        <div class="text-[10px] sm:text-[11px] mt-1" style="color: var(--text-muted);">{stat.sub}</div>
      </div>
    {/each}
  </div>

  <!-- Range pills -->
  <div class="flex gap-1.5">
    {#each RANGES as r}
      <button
        onclick={() => s.selectRange(r)}
        disabled={s.historyLoading}
        class="px-3 py-1 rounded-full text-[12px] font-semibold transition-all border whitespace-nowrap"
        style="
          background: {s.selectedRange === r ? 'color-mix(in srgb, var(--table-header-bg) 94%, var(--text-primary))' : 'transparent'};
          color: {s.selectedRange === r ? 'var(--text-primary)' : 'var(--text-muted)'};
          border-color: var(--card-border);
          opacity: {s.historyLoading ? '0.6' : '1'};
        "
      >{r}</button>
    {/each}
  </div>

  <!-- Chart + OHLC table -->
  {#if s.historyLoading}
    <IndexHistoryGhost />
  {:else if s.tableRows.length === 0}
    <div class="rounded-xl border" style="background: var(--card-bg); border-color: var(--card-border);">
      <EmptyState
        title="No history available"
        description="No index history was found for this pair and range. Try a different time range."
      />
    </div>
  {:else}
    <HistoryChart data={s.chartData} series={s.series} symbol={s.parsedPair.symbol} />
    <IndexOhlcTable rows={s.tableRows} symbol={s.parsedPair.symbol} proSource="markets-pair-history" />
  {/if}

</div>
