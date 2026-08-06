<script lang="ts">
  import type { HighlightCard } from './highlights';
  import HighlightRow from './HighlightRow.svelte';

  let {
    symbol,
    quote,
    cards,
    indexContributorIds = [],
    pairCode = '',
    onProviderClick,
    onViewAll,
  }: {
    symbol: string;
    quote: string;
    cards: HighlightCard[];
    indexContributorIds?: string[];
    pairCode?: string;
    onProviderClick?: (id: string, href: string, e: MouseEvent) => void;
    onViewAll?: (slug: string) => void;
  } = $props();

  // Pair-scoped insight when a pairCode is supplied, else the full provider profile.
  function providerHref(id: string): string {
    return pairCode ? `/markets/${pairCode}/${id}` : `/markets/providers/${id}`;
  }

  const idxSet = $derived(new Set(indexContributorIds));
</script>

{#snippet card(c: HighlightCard)}
  {@const total = c.total ?? c.providers.length}
  <div class="rounded-2xl border flex flex-col overflow-hidden" style="background: var(--page-bg); border-color: var(--card-border);">
    <!-- Header -->
    <div class="flex items-start justify-between gap-2 px-4 sm:px-5 pt-4 pb-3.5 border-b" style="border-color: var(--card-border);">
      <div class="min-w-0">
        <div class="text-[16px] font-bold leading-snug truncate" style="font-family: var(--font-head); color: var(--text-primary);">{c.title}</div>
        <div class="text-[12.5px] mt-0.5 truncate" style="color: var(--text-secondary);">{c.sublabel}</div>
      </div>
      {#if total > 0}
        <span class="text-[12px] font-semibold px-2 py-1 rounded-lg shrink-0 tabular-nums" style="background: var(--table-header-bg); color: var(--text-secondary);">{total}</span>
      {/if}
    </div>

    <!-- Rows -->
    {#if c.providers.length === 0}
      <div class="flex-1 flex items-center justify-center px-5 py-10 text-center">
        <p class="text-[13px]" style="color: var(--text-secondary); opacity: 0.65;">No providers available</p>
      </div>
    {:else}
      <div class="flex-1">
        {#each c.providers as p, i (p.id)}
          <HighlightRow
            {p}
            mode={c.mode}
            {quote}
            {symbol}
            isIndexContributor={idxSet.has(p.id)}
            divider={i > 0}
            href={providerHref(p.id)}
            onClick={onProviderClick}
          />
        {/each}
      </div>

      {#if pairCode && onViewAll}
        <!-- A button, not a link: the full list opens in a modal built from data
             already on this page, so there is no URL to navigate to. -->
        <button
          type="button"
          onclick={() => onViewAll(c.slug)}
          class="w-full flex items-center justify-center gap-1 px-4 sm:px-5 py-3 border-t text-[13px] font-semibold transition-colors cursor-pointer hover:bg-[var(--table-hover)]"
          style="border-color: var(--card-border); color: var(--accent); background: none;"
        >
          View all{total > c.providers.length ? ` ${total}` : ''}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      {/if}
    {/if}
  </div>
{/snippet}

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  {#each cards as c (c.slug)}
    {@render card(c)}
  {/each}
</div>
