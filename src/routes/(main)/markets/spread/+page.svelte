<script lang="ts">
  import { MsiActions, RANGES } from './actions.svelte';
  import { spread } from '$lib/services';
  import type {
    MsiCurrent,
    MsiHistory,
    MsiSources,
    MsiInterpretation,
    Position
  } from '$lib/services/currency/v1/spread';
  import { DEFAULT_POSITION, MARKET_READ_ENABLED } from '$lib/constants/msi';
  import MsiHeadline from '$lib/components/spread-index/MsiHeadline.svelte';
  import PositionToggle from '$lib/components/spread-index/PositionToggle.svelte';
  import WhatThisMeans from '$lib/components/spread-index/WhatThisMeans.svelte';
  import WhatThisMeansModal from '$lib/components/spread-index/WhatThisMeansModal.svelte';
  import MsiHistoryChart from '$lib/components/spread-index/MsiHistoryChart.svelte';
  import MsiChannelBreakdown from '$lib/components/spread-index/MsiChannelBreakdown.svelte';
  import MsiSignals from '$lib/components/spread-index/MsiSignals.svelte';
  import MsiHeadlineSkeleton from '$lib/components/spread-index/skeletons/MsiHeadlineSkeleton.svelte';
  import MsiHistoryChartSkeleton from '$lib/components/spread-index/skeletons/MsiHistoryChartSkeleton.svelte';
  import MsiChannelBreakdownSkeleton from '$lib/components/spread-index/skeletons/MsiChannelBreakdownSkeleton.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import ProGate from '$lib/components/pro/ProGate.svelte';
  import type { PageData } from './$types';

  const PAIR = 'usdtngn';

  const EXPORT_FEATURES = [
    'Unlimited CSV & PDF exports',
    'Export any custom date range',
    'Full Stablecoin Spread Index (MSI) history',
    'Per-source premium breakdown',
    'Priority, ad-free data access'
  ];

  let { data }: { data: PageData } = $props();

  // Resolve the streamed load promises once into local state. Only `history`
  // depends on the selected range, so a range change refetches just that —
  // current/sources are never reloaded.
  let current = $state<MsiCurrent | null>(null);
  let history = $state<MsiHistory | null>(null);
  let sources = $state<MsiSources | null>(null);
  let initialLoading = $state(true);
  let loadError = $state(false);

  // Position-aware "What this means" panel.
  const POSITION_KEY = 'msi:position';
  let position = $state<Position>(DEFAULT_POSITION);
  let large = $state(false);
  let interpretation = $state<MsiInterpretation | null>(null);
  let interpretationLoading = $state(false);
  let meansModalOpen = $state(false);

  let activeRange = $state(data.range);
  let historyLoading = $state(false);

  $effect(() => {
    let cancelled = false;
    initialLoading = true;
    loadError = false;
    Promise.all([data.current, data.history, data.sources, data.interpretation])
      .then(([c, h, s, i]) => {
        if (cancelled) return;
        current = c;
        history = h;
        sources = s;
        interpretation = i;
        activeRange = data.range;
        initialLoading = false;
        // Restore the user's last-chosen position; refetch if it isn't the
        // server-seeded default (watching).
        const saved = localStorage.getItem(POSITION_KEY) as Position | null;
        if (MARKET_READ_ENABLED && saved && saved !== DEFAULT_POSITION) {
          position = saved;
          selectPosition(saved, large);
        }
      })
      .catch(() => {
        if (cancelled) return;
        loadError = true;
        initialLoading = false;
      });
    return () => {
      cancelled = true;
    };
  });

  // Live headline: poll /current (edge TTL ~30s) and patch only the headline.
  $effect(() => {
    const id = setInterval(async () => {
      try {
        current = (await spread.getCurrent(PAIR))?.data ?? current;
      } catch {
        /* keep last good value */
      }
    }, 60_000);
    return () => clearInterval(id);
  });

  async function setRange(r: MsiHistory['range']) {
    if (r === activeRange) return;
    activeRange = r;
    // Keep the URL shareable without re-running the server load.
    window.history.replaceState(window.history.state, '', `?range=${r}`);
    historyLoading = true;
    try {
      const next = (await spread.getHistory({ range: r, pair: PAIR }))?.data ?? null;
      if (activeRange === r) history = next; // ignore out-of-order responses
    } catch {
      if (activeRange === r) history = null;
    } finally {
      if (activeRange === r) historyLoading = false;
    }
  }

  // Swap the interpretation variant for the chosen position/size. The public
  // endpoint serves pre-generated, cached variants, so this is a cheap read.
  async function selectPosition(p: Position, isLarge: boolean) {
    position = p;
    large = isLarge;
    localStorage.setItem(POSITION_KEY, p);
    interpretationLoading = true;
    try {
      const next =
        (
          await spread.getInterpretation({
            position: p,
            size: isLarge ? 'large' : undefined,
            pair: PAIR
          })
        )?.data ?? null;
      // Ignore out-of-order responses if the user toggled again meanwhile.
      if (position === p && large === isLarge) interpretation = next;
    } catch {
      if (position === p && large === isLarge) interpretation = null;
    } finally {
      if (position === p && large === isLarge) interpretationLoading = false;
    }
  }
</script>

<svelte:head>
  <title>{data.seo.title}</title>
  <meta name="description" content={data.seo.description} />
  <link rel="canonical" href={data.seo.canonical} />

  <meta property="og:type" content="website" />
  <meta property="og:title" content={data.seo.title} />
  <meta property="og:description" content={data.seo.description} />
  <meta property="og:url" content={data.seo.canonical} />
  <meta property="og:image" content={data.seo.ogImage} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.seo.title} />
  <meta name="twitter:description" content={data.seo.description} />
  <meta name="twitter:image" content={data.seo.ogImage} />

  {@html `<script type="application/ld+json">${data.seo.webPageJsonLd}<\/script>`}
</svelte:head>

<div class="max-w-6xl mx-auto space-y-6">
  <div class="flex items-start justify-between gap-3 flex-wrap">
    <div>
      <h1 class="text-[22px] font-bold" style="font-family: var(--font-head); color: var(--text-primary);">
        Stablecoin Spread Index (MSI)
      </h1>
      <p class="text-[13px] mt-0.5" style="color: var(--text-secondary);">
        Stablecoin-dollar (USDT/NGN) premium over the CBN official rate.
      </p>
    </div>
    <ProGate
      variant="button"
      feature="export-spread-index"
      source="markets-spread"
      title="Upgrade to Pro for unlimited Spread and Data exports."
      features={EXPORT_FEATURES}
      disabled={!history || history.points.length === 0}
    />
  </div>

  {#snippet rangeBar()}
    <!-- Duration selector — sits directly above the chart -->
    <div class="flex gap-1.5">
      {#each RANGES as r}
        <button
          onclick={() => setRange(r)}
          class="px-3 py-1 rounded-full text-[12px] font-semibold transition-all border whitespace-nowrap uppercase"
          style="
            background: {activeRange === r ? 'var(--table-header-bg)' : 'transparent'};
            color: {activeRange === r ? 'var(--text-primary)' : 'var(--text-muted)'};
            border-color: var(--card-border);
          "
        >{r}</button>
      {/each}
    </div>
  {/snippet}

  {#if initialLoading}
    <MsiHeadlineSkeleton />
    {@render rangeBar()}
    <MsiHistoryChartSkeleton />
    <MsiChannelBreakdownSkeleton />
  {:else if loadError}
    <div class="rounded-xl border" style="background: var(--card-bg); border-color: var(--card-border);">
      <EmptyState
        title="Failed to load spread index"
        description="Something went wrong while fetching data. Try refreshing the page."
      />
    </div>
  {:else if !current}
    <div class="rounded-xl border" style="background: var(--card-bg); border-color: var(--card-border);">
      <EmptyState
        title="Spread index unavailable"
        description="No snapshot has been computed yet. Check back shortly."
      />
    </div>
  {:else}
    {@const state = new MsiActions(current, history, sources)}
    <MsiHeadline actions={state} />

    <!-- Position-aware interpretation: what the spread means for the user.
         Hidden while summary generation is paused; see MARKET_READ_ENABLED. -->
    {#if MARKET_READ_ENABLED}
      <div class="space-y-3">
        <PositionToggle {position} {large} onSelect={selectPosition} />
        <WhatThisMeans
          {interpretation}
          loading={interpretationLoading}
          onExpand={() => (meansModalOpen = true)}
        />
      </div>
    {/if}

    {@render rangeBar()}
    {#if historyLoading}
      <MsiHistoryChartSkeleton />
    {:else}
      <MsiHistoryChart data={state.historyData} avg={state.historyAvg} range={activeRange} />
    {/if}
    <MsiChannelBreakdown channels={state.channels} cbnRate={current.cbn_rate} />
    <MsiSignals signals={state.signals} />
  {/if}
</div>

{#if MARKET_READ_ENABLED}
  <WhatThisMeansModal
    open={meansModalOpen}
    onClose={() => (meansModalOpen = false)}
    {interpretation}
  />
{/if}
