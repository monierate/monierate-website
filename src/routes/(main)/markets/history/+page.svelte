<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import { IndexHistoryActions, RANGES } from './actions.svelte';
  import HistoryChart from '$lib/components/history/HistoryChart.svelte';
  import IndexOhlcTable from '$lib/components/history/IndexOhlcTable.svelte';
  import IndexHistoryGhost from '$lib/components/history/IndexHistoryGhost.svelte';
  import BaseSelector from '$lib/components/ui/BaseSelector.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import { activeBase } from '$lib/stores/activeBase';
  import { defaultCurrencyStore as activeQuote } from '$lib/stores/defaultCurrency';
  import { CURRENCY_SYMBOLS, defaultBaseForQuote } from '$lib/constants/currency';

  let { data }: { data: PageData } = $props();

  $effect.pre(() => {
    activeBase.set(data.base);
    activeQuote.set(data.quote);
  });

  // Base/quote switch just refetches this same canonical page with a new
  // query string — there's no per-pair long-tail URL for history (unlike the
  // pair-overview page), so navigation stays on /markets/history.
  $effect(() => {
    const base = $activeBase;
    const quote = $activeQuote;
    if (quote !== data.quote) {
      goto(`/markets/history?base=${defaultBaseForQuote(quote)}&range=${data.range}`, { keepFocus: true });
    } else if (base !== data.base) {
      goto(`/markets/history?base=${base}&range=${data.range}`, { keepFocus: true });
    }
  });

  function setRange(r: string) {
    goto(`/markets/history?base=${data.base}&range=${r}`);
  }
</script>

<Seo {...data.seo} />

<div class="max-w-6xl mx-auto space-y-6">
  <!-- Header -->
  <div class="flex items-start justify-between gap-3 flex-wrap">
    <div>
      <h1
        class="text-[22px] font-bold"
        style="font-family: var(--font-head); color: var(--text-primary);"
      >Historical Rates</h1>
      <p class="text-[13px] mt-0.5" style="color: var(--text-secondary);">
        Daily OHLC of the composite index
      </p>
    </div>
  </div>

  <!-- Range + base selector row -->
  <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
    <div class="flex gap-1.5">
      {#each RANGES as r}
        <button
          onclick={() => setRange(r)}
          class="px-3 py-1 rounded-full text-[12px] font-semibold transition-all border whitespace-nowrap cursor-pointer"
          style="
            background: {data.range === r ? 'var(--table-header-bg)' : 'transparent'};
            color: {data.range === r ? 'var(--text-primary)' : 'var(--text-muted)'};
            border-color: var(--card-border);
          "
        >{r}</button>
      {/each}
    </div>
    <BaseSelector showQuote bare />
  </div>

  {#await data.history}
    <IndexHistoryGhost />
  {:then entries}
    {@const state = new IndexHistoryActions({ pair: data.pair, history: entries })}

    {#if state.tableRows.length === 0}
      <div
        class="rounded-xl border"
        style="background: var(--card-bg); border-color: var(--card-border);"
      >
        <EmptyState
          title="No history available"
          description="No index history was found for this pair and range. Try a different time range or currency pair."
        />
      </div>
    {:else}
      <HistoryChart
        data={state.chartData}
        series={state.series}
        symbol={CURRENCY_SYMBOLS[data.quote.toLowerCase()] ?? ''}
      />

      <IndexOhlcTable rows={state.tableRows} symbol={CURRENCY_SYMBOLS[data.quote.toLowerCase()] ?? ''} proSource="markets-history" previewRows={data.hasFullAccess ? null : 10} dayPass={data.dayPass} />
    {/if}
  {:catch}
    <div
      class="rounded-xl border"
      style="background: var(--card-bg); border-color: var(--card-border);"
    >
      <EmptyState
        title="Failed to load history"
        description="Something went wrong while fetching index history. Try selecting a different range or refreshing the page."
      />
    </div>
  {/await}
</div>
