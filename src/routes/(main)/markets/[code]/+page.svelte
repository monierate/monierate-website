<script lang="ts">
  import { onMount } from 'svelte';
  import { goto, preloadData, pushState } from '$app/navigation';
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import { PairActions } from './actions.svelte';
  import { ProviderPairInsightActions } from './[provider]/actions.svelte';
  import { activeBase } from '$lib/stores/activeBase';
  import { defaultCurrencyStore as activeQuote } from '$lib/stores/defaultCurrency';
  import PairMetrics from '$lib/components/pair/PairMetrics.svelte';
  import PairMetricsGhost from '$lib/components/pair/PairMetricsGhost.svelte';
  import PairRateChart from '$lib/components/pair/PairRateChart.svelte';
  import PairRateChartGhost from '$lib/components/pair/PairRateChartGhost.svelte';
  import MarketHighlights from '$lib/components/overview/MarketHighlights.svelte';
  import OverlayModal from '$lib/components/overview/OverlayModal.svelte';
  import ProviderPairInsight from '$lib/components/provider-profile/ProviderPairInsight.svelte';
  import ProviderPairInsightGhost from '$lib/components/provider-profile/ProviderPairInsightGhost.svelte';
  import MarketHighlightFull from '$lib/components/overview/MarketHighlightFull.svelte';
  import MarketHighlightFullGhost from '$lib/components/overview/MarketHighlightFullGhost.svelte';
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

  // --- Provider insight overlay (shallow routing on desktop, real page on mobile) ---
  const insight = $derived($page.state.insight);
  const insightState = $derived(
    insight
      ? new ProviderPairInsightActions({
          pairCode: insight.pairCode,
          providerCode: insight.providerCode,
          currentRate: insight.currentRate,
          initialHistory: insight.initialHistory,
        })
      : null
  );

  const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;

  // Shown immediately on click so the overlay (with skeleton) appears while
  // preloadData fetches, instead of the click feeling unresponsive.
  let insightLoading = $state(false);
  const insightOpen = $derived(insightLoading || (!!insight && !!insightState));

  function closeInsight() {
    if (insightLoading) insightLoading = false;
    if (insight) history.back();
  }

  async function onProviderClick(_id: string, href: string, e: MouseEvent) {
    // Honour new-tab / modifier clicks and let mobile navigate to the real page.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (!isDesktop()) return;
    e.preventDefault();
    insightLoading = true;
    try {
      const result = await preloadData(href);
      if (!insightLoading) return; // user dismissed while loading
      if (result.type === 'loaded' && result.status === 200) {
        // Preserve any open "View all" overlay underneath so the insight stacks
        // on top of it â€” back/dismiss then returns to that list, not the page.
        pushState(href, { highlights: $page.state.highlights, insight: result.data });
      } else {
        goto(href);
      }
    } finally {
      insightLoading = false;
    }
  }

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

  // --- "View all" highlights overlay (shallow routing on desktop, page on mobile) ---
  const highlights = $derived($page.state.highlights);
  let highlightsLoading = $state(false);
  const highlightsOpen = $derived(highlightsLoading || !!highlights);

  function closeHighlights() {
    if (highlightsLoading) highlightsLoading = false;
    if (highlights) history.back();
  }

  async function onViewAll(_slug: string, href: string, e: MouseEvent) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (!isDesktop()) return;
    e.preventDefault();
    highlightsLoading = true;
    try {
      const result = await preloadData(href);
      if (!highlightsLoading) return;
      if (result.type === 'loaded' && result.status === 200) {
        pushState(href, { highlights: result.data });
      } else {
        goto(href);
      }
    } finally {
      highlightsLoading = false;
    }
  }

  $effect(() => {
    activeBase.set(s.pair.base);
    activeQuote.set(s.pair.quote);
  });

  onMount(() => {
    const stopBaseWatch = activeBase.subscribe((base) => {
      if (base !== s.pair.base) {
        goto(`/markets/${base.toLowerCase()}${s.pair.quote.toLowerCase()}`);
      }
    });
    const stopQuoteWatch = activeQuote.subscribe((quote) => {
      if (quote !== s.pair.quote) {
        goto(`/markets/${s.pair.base.toLowerCase()}${quote.toLowerCase()}`);
      }
    });
    return () => {
      stopBaseWatch();
      stopQuoteWatch();
    };
  });
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

  <!-- Page title with country switcher -->
  <div class="pt-2 mb-10">
    <FxInsightTitle quote={s.pair.quote} />
  </div>

  <div>
    <p class="text-[13px]" style="color: var(--text-secondary);">Live index rate, metrics and provider breakdown</p>
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
      {onProviderClick}
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
      {onProviderClick}
      {onViewAll}
    />
  {/if}

</div>

<!-- "View all" highlights overlay (desktop) â€” sits underneath the insight overlay -->
<OverlayModal
  open={highlightsOpen}
  label="{highlights?.title ?? 'Market highlight'} list"
  onClose={closeHighlights}
  escClose={!insightOpen}
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
      {onProviderClick}
    />
  {:else}
    <MarketHighlightFullGhost />
  {/if}
</OverlayModal>

<!-- Provider insight overlay (desktop) â€” rendered last so it stacks on top -->
<OverlayModal
  open={insightOpen}
  label="{insight?.provider?.name ?? 'Provider'} pair insight"
  onClose={closeInsight}
>
  {#if insight && insightState}
    <ProviderPairInsight
      provider={insight.provider}
      currentRate={insight.currentRate}
      state={insightState}
      onClose={closeInsight}
    />
  {:else}
    <ProviderPairInsightGhost />
  {/if}
</OverlayModal>
