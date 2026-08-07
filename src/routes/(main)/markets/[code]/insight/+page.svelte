<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import { PairActions } from './actions.svelte';
  import { activeBase } from '$lib/stores/activeBase';
  import { defaultCurrencyStore as activeQuote } from '$lib/stores/defaultCurrency';
  import Seo from '$lib/components/seo/Seo.svelte';
  import PairMetrics from '$lib/components/pair/PairMetrics.svelte';
  import PairMetricsGhost from '$lib/components/pair/PairMetricsGhost.svelte';
  import PairRateChart from '$lib/components/pair/PairRateChart.svelte';
  import PairRateChartGhost from '$lib/components/pair/PairRateChartGhost.svelte';
  import MarketHighlights from '$lib/components/overview/MarketHighlights.svelte';
  import OverlayModal from '$lib/components/overview/OverlayModal.svelte';
  import MarketHighlightFull from '$lib/components/overview/MarketHighlightFull.svelte';
  import MarketHighlightsSkeleton from '$lib/components/overview/skeletons/MarketHighlightsSkeleton.svelte';
  import FxInsightTitle from '$lib/components/overview/FxInsightTitle.svelte';
  import MarketReadPanel from '$lib/components/spread-index/MarketReadPanel.svelte';
  import type { HighlightCard } from '$lib/components/overview/highlights';
  import { HIGHLIGHT_DEFS, DIRECTION_SLUGS, CATEGORY_SLUGS, HIGHLIGHT_PREVIEW_LIMIT } from '$lib/utils/market-highlights';
  import { isCryptoBase } from '$lib/constants/currency';

  let { data }: { data: PageData } = $props();

  const s: PairActions = $derived(new PairActions(data as any));

  // The provider breakdown (changers + currentRates) is streamed from the loader so the
  // hero/chart paint first. Resolve those promises and hydrate the instance they belong to
  // â€” capturing `s` guards against a late resolution landing on a stale instance after nav.
  $effect(() => {
    const inst = s;
    Promise.all([Promise.resolve(data.changers), Promise.resolve(data.currentRates)])
      .then(([changers, rates]) => inst.setProviderData((changers ?? []) as any, (rates ?? []) as any))
      .catch(() => inst.setProviderData([], []));
  });

  // Provider rows are plain links to /markets/:pair/:provider — no overlay.

  // Index contributors are pinned to the top of every highlight for quality.
  const contributorIds = $derived(new Set(s.indexContributorIds));

  // Build highlight cards from the shared defs so the preview cards and the
  // "View all" pages stay in lockstep. Cards preview the first few; the page is full.
  function toCard(slug: string): HighlightCard {
    const def = HIGHLIGHT_DEFS[slug];
    const full = def.compute(s.providers, { contributorIds });
    return {
      slug: def.slug,
      title: def.title,
      sublabel: def.sublabel,
      mode: def.mode,
      cryptoOnly: def.cryptoOnly,
      providers: full.slice(0, HIGHLIGHT_PREVIEW_LIMIT),
      total: full.length,
    };
  }

  const directionCards: HighlightCard[] = $derived(DIRECTION_SLUGS.map(toCard));

  // Crypto-only categories (on/off-ramp, virtual card) are hidden on fiat pairs like USD/NGN.
  const categoryCards: HighlightCard[] = $derived(
    CATEGORY_SLUGS.map(toCard).filter((c) => !c.cryptoOnly || isCryptoBase(s.pair.base))
  );

  // --- "View all" highlights modal ---
  // Built from the providers already loaded on this page (the cards themselves are
  // just a `slice` of the same computation), so opening it needs no fetch and no route.
  let viewAllSlug = $state<string | null>(null);

  const highlights = $derived.by(() => {
    if (!viewAllSlug) return null;
    const def = HIGHLIGHT_DEFS[viewAllSlug];
    if (!def) return null;
    return {
      pairCode: s.pair.code,
      title: def.title,
      sublabel: def.sublabel,
      mode: def.mode,
      base: s.pair.base,
      quote: s.pair.quote,
      symbol: s.pair.symbol,
      providers: def.compute(s.providers, { contributorIds }),
      indexContributorIds: s.indexContributorIds,
    };
  });

  const highlightsOpen = $derived(!!highlights);

  function closeHighlights() {
    viewAllSlug = null;
  }

  function onViewAll(slug: string) {
    viewAllSlug = slug;
  }

  $effect(() => {
    activeBase.set(s.pair.base);
    activeQuote.set(s.pair.quote);
  });

  onMount(() => {
    const stopBaseWatch = activeBase.subscribe((base) => {
      if (base !== s.pair.base) {
        goto(`/markets/${base.toLowerCase()}${s.pair.quote.toLowerCase()}/insight`);
      }
    });
    const stopQuoteWatch = activeQuote.subscribe((quote) => {
      if (quote !== s.pair.quote) {
        goto(`/markets/${s.pair.base.toLowerCase()}${quote.toLowerCase()}/insight`);
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

  <!-- Page title with country switcher -->
  <div class="pt-2">
    <FxInsightTitle quote={s.pair.quote} />
    <p class="text-[13px] mt-1" style="color: var(--text-secondary);">Live index rate, metrics and provider breakdown</p>
  </div>

  <!-- Stat cards -->
  {#if s.historyLoading}
    <PairMetricsGhost />
  {:else}
    <PairMetrics
      symbol={s.pair.symbol}
      currentRate={s.currentRate}
      delta24h={s.delta24h}
      high24h={s.high24h}
      low24h={s.low24h}
      volatility24h={s.volatility24h}
      spreadRange={s.spreadRange}
      msiScore={s.msiScore}
      msiLevel={s.msiLevel}
      volScore={s.volScore}
      volRegime={s.volRegime}
      indexContributors={s.indexContributors}
      highProvider={s.highProviderData}
      lowProvider={s.lowProviderData}
      timeRange={s.timeRange}
      pairCode={s.pair.code}
    />
  {/if}

  <!-- Full market read: combined rates + spread + volatility (MSI pair only). -->
  {#if s.pair.code === 'usdtngn'}
    <MarketReadPanel pair="usdtngn" />
  {/if}

  <!-- Range pills -->
  <div class="flex gap-1.5">
    {#each s.ranges as r}
      <button
        onclick={() => s.setRange(r)}
        disabled={s.historyLoading}
        class="px-3 py-1 rounded-full text-[12px] font-semibold transition-all border whitespace-nowrap"
        style="
          background: {s.timeRange === r ? 'color-mix(in srgb, var(--table-header-bg) 94%, var(--text-primary))' : 'transparent'};
          color: {s.timeRange === r ? 'var(--text-primary)' : 'var(--text-muted)'};
          border-color: var(--card-border);
          opacity: {s.historyLoading ? '0.6' : '1'};
        "
      >{r}</button>
    {/each}
  </div>

  <!-- Rate chart -->
  {#if s.historyLoading}
    <PairRateChartGhost />
  {:else}
    <PairRateChart
      data={s.chartData}
      series={s.rateSeries}
      symbol={s.pair.symbol}
    />
  {/if}

  <!-- Direction highlights -->
  {#if s.providersLoading}
    <MarketHighlightsSkeleton count={DIRECTION_SLUGS.length} />
  {:else}
    <MarketHighlights
      symbol={s.pair.symbol}
      quote={s.pair.quote}
      cards={directionCards}
      indexContributorIds={s.indexContributorIds}
      pairCode={s.pair.code}
      {onViewAll}
    />
  {/if}

  <!-- Category highlights -->
  {#if s.providersLoading}
    <MarketHighlightsSkeleton count={CATEGORY_SLUGS.length} />
  {:else}
    <MarketHighlights
      symbol={s.pair.symbol}
      quote={s.pair.quote}
      cards={categoryCards}
      indexContributorIds={s.indexContributorIds}
      pairCode={s.pair.code}
      {onViewAll}
    />
  {/if}

</div>

<!-- "View all" highlights modal -->
<OverlayModal
  open={highlightsOpen}
  label="{highlights?.title ?? 'Market highlight'} list"
  onClose={closeHighlights}
>
  {#if highlights}
    <MarketHighlightFull
      pairCode={highlights.pairCode}
      title={highlights.title}
      sublabel={highlights.sublabel}
      mode={highlights.mode}
      base={highlights.base}
      quote={highlights.quote}
      symbol={highlights.symbol}
      providers={highlights.providers}
      indexContributorIds={highlights.indexContributorIds}
      onClose={closeHighlights}
    />
  {/if}
</OverlayModal>
