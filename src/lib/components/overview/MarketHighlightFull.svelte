<script lang="ts">
  import type { ProviderRate } from '$lib/types';
  import type { HighlightMode } from '$lib/utils/market-highlights';
  import HighlightRow from './HighlightRow.svelte';

  let {
    pairCode,
    title,
    sublabel,
    mode,
    base,
    quote,
    symbol,
    providers,
    indexContributorIds = [],
    onClose,
    onProviderClick,
  }: {
    pairCode: string;
    title: string;
    sublabel: string;
    mode: HighlightMode;
    base: string;
    quote: string;
    symbol: string;
    providers: ProviderRate[];
    indexContributorIds?: string[];
    onClose?: () => void;
    onProviderClick?: (id: string, href: string, e: MouseEvent) => void;
  } = $props();

  const idxSet = $derived(new Set(indexContributorIds));
  const pairDisplay = $derived(`${base}/${quote}`);
</script>

<div class="space-y-5">

  <!-- Header: breadcrumb, title, actions -->
  <div class="flex items-start justify-between gap-3">
    <div class="min-w-0">
      <nav class="flex items-center gap-1.5 text-[12px] mb-2" style="color: var(--text-muted);" aria-label="Breadcrumb">
        <a href="/markets/{pairCode}" class="hover:underline tabular-nums" style="color: var(--text-secondary); font-family: var(--font-mono);">{pairDisplay}</a>
        <span aria-hidden="true">â€º</span>
        <span class="truncate" style="color: var(--text-secondary);">{title}</span>
      </nav>
      <h1 class="text-[18px] font-bold leading-tight" style="font-family: var(--font-head); color: var(--text-primary);">{title}</h1>
      <p class="text-[13px] mt-0.5" style="color: var(--text-secondary);">{sublabel}</p>
    </div>

    <div class="flex items-center gap-2 flex-shrink-0">
      {#if providers.length > 0}
        <span class="text-[12px] font-semibold px-2 py-1 rounded-lg tabular-nums" style="background: var(--table-header-bg); color: var(--text-secondary);">{providers.length}</span>
      {/if}
      {#if onClose}
        <button
          type="button"
          onclick={onClose}
          aria-label="Close"
          class="p-1.5 rounded-lg border cursor-pointer transition-colors hover:bg-[var(--table-hover)]"
          style="color: var(--text-muted); border-color: var(--card-border); background: none;"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      {/if}
    </div>
  </div>

  <!-- Full list -->
  <div class="rounded-2xl border overflow-hidden" style="background: var(--page-bg); border-color: var(--card-border);">
    {#if providers.length === 0}
      <div class="flex items-center justify-center px-5 py-12 text-center">
        <p class="text-[13px]" style="color: var(--text-secondary); opacity: 0.65;">No providers available</p>
      </div>
    {:else}
      {#each providers as p, i (p.id)}
        <HighlightRow
          {p}
          {mode}
          {quote}
          {symbol}
          isIndexContributor={idxSet.has(p.id)}
          divider={i > 0}
          href={`/markets/${pairCode}/${p.id}`}
          onClick={onProviderClick}
        />
      {/each}
    {/if}
  </div>

</div>
