<script lang="ts">
  import type { ProviderRate } from '$lib/types';
  import type { HighlightMode } from '$lib/utils/market-highlights';
  import ProviderLogo from '$lib/components/ui/ProviderLogo.svelte';
  import { fmt, timeAgo } from '$lib/utils/format';

  const FRESH_WINDOW_MS = 30 * 60 * 1000; // 30 minutes — matches the ranking gate

  let {
    p,
    mode,
    quote,
    symbol,
    isIndexContributor = false,
    divider = false,
    href,
    onClick,
  }: {
    p: ProviderRate;
    mode: HighlightMode;
    quote: string;
    symbol: string;
    isIndexContributor?: boolean;
    divider?: boolean;
    href: string;
    onClick?: (id: string, href: string, e: MouseEvent) => void;
  } = $props();

  const isStale = $derived(p.lastUpdated > 0 && Date.now() - p.lastUpdated > FRESH_WINDOW_MS);
</script>

{#snippet money(value: number, big: boolean)}
  {#if value > 0}
    <span class="tabular-nums {big ? 'text-[15.5px] font-bold' : 'text-[13px] font-semibold'}" style="color: var(--text-primary); font-family: var(--font-mono);">{symbol}{fmt(value)}</span>
  {:else}
    <span class="{big ? 'text-[15.5px]' : 'text-[13px]'}" style="color: var(--text-disabled, color-mix(in srgb, var(--text-secondary) 45%, transparent));">—</span>
  {/if}
{/snippet}

<div
  class="flex items-center gap-3 px-4 sm:px-5 py-3.5 {divider ? 'border-t' : ''}"
  style="border-color: color-mix(in srgb, var(--card-border) 35%, transparent);"
>
  <a
    {href}
    onclick={(e) => onClick?.(p.id, href, e)}
    class="flex items-center gap-3 min-w-0 flex-1 group"
    style="color: inherit; text-decoration: none;"
  >
    <ProviderLogo logo={p.logo} name={p.name} size={40} />
    <div class="min-w-0">
      <div class="flex items-center gap-1.5">
        {#if isIndexContributor}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--accent)" aria-label="Index contributor" style="opacity: 0.8; flex-shrink: 0;">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        {/if}
        <span class="text-[15px] font-semibold truncate group-hover:underline" style="color: var(--text-primary);">{p.name}</span>
      </div>
      <div class="flex items-center gap-1.5 mt-1">
        <span class="text-[11px] font-semibold px-1.5 py-0.5 rounded-md" style="background: var(--table-header-bg); color: var(--text-secondary);">{p.type}</span>
        {#if isStale}
          <span class="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md" style="background: color-mix(in srgb, #f59e0b 16%, transparent); color: #f59e0b;">Stale</span>
        {/if}
        {#if p.lastUpdated > 0}
          <span class="text-[11px]" style="color: var(--text-muted);">{timeAgo(p.lastUpdated)}</span>
        {/if}
      </div>
    </div>
  </a>

  {#if mode === 'card'}
    <div class="flex items-center gap-4 shrink-0 text-right">
      <span class="flex flex-col items-end leading-tight">
        <span class="text-[10px] font-semibold uppercase tracking-wide" style="color: var(--text-muted);">Deposit</span>
        {@render money(p.buy, false)}
      </span>
      <span class="flex flex-col items-end leading-tight">
        <span class="text-[10px] font-semibold uppercase tracking-wide" style="color: var(--text-muted);">Withdraw</span>
        {@render money(p.sell, false)}
      </span>
    </div>
  {:else}
    <div class="flex items-baseline justify-end gap-1 shrink-0">
      {@render money(mode === 'buy' ? p.buy : p.sell, true)}
      <span class="text-[10px] font-semibold uppercase tracking-wide" style="color: var(--text-muted);">{quote}</span>
    </div>
  {/if}
</div>
