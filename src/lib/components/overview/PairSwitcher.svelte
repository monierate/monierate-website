<script lang="ts">
  import type { PairTab } from '../../../routes/(main)/markets/[code]/insight/actions.svelte';
  import { fmt } from '$lib/utils/format';
  import { useImageOrDefault } from '$lib/utils/loadImageOrDefault';

  let {
    tabs,
    activeBase,
    quote,
    symbol,
    onSelect,
  }: {
    tabs: PairTab[];
    activeBase: string;
    quote: string;
    symbol: string;
    onSelect: (base: string) => void;
  } = $props();

  function baseIcon(code: string): Promise<string> {
    return useImageOrDefault(`/icons/currencies/${code.toLowerCase()}.png`, '');
  }

  // Right-edge fade hint shown (on mobile) while the strip can still scroll right,
  // signalling there are more pairs off-screen. Hidden once scrolled to the end.
  let scrollEl: HTMLDivElement | undefined;
  let canScrollRight = $state(false);

  function updateScroll() {
    if (!scrollEl) return;
    canScrollRight = scrollEl.scrollWidth - scrollEl.clientWidth - scrollEl.scrollLeft > 4;
  }

  // Recompute when tabs change (and on first mount, after the DOM is measured).
  $effect(() => {
    void tabs;
    updateScroll();
  });
</script>

<svelte:window onresize={updateScroll} />

<div class="relative -mx-1">
  <div
    bind:this={scrollEl}
    onscroll={updateScroll}
    class="flex items-stretch gap-2.5 overflow-x-auto px-1 py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
  >
  {#each tabs as t (t.base)}
    {@const active = t.base === activeBase}
    {@const deltaColor = t.delta >= 0 ? 'var(--positive)' : 'var(--negative)'}
    <button
      type="button"
      onclick={() => onSelect(t.base)}
      aria-pressed={active}
      class="group flex items-center gap-2.5 shrink-0 pl-2.5 pr-4 py-2 rounded-2xl border text-left cursor-pointer transition-all hover:-translate-y-0.5 {active ? '' : 'hover:bg-[var(--table-hover)]'}"
      style="
        border-color: var(--card-border);
        {active ? 'background: color-mix(in srgb, var(--table-header-bg) 94%, var(--text-primary)); box-shadow: 0 1px 2px rgba(0,0,0,0.04);' : 'background: var(--page-bg);'}
      "
    >
      <!-- Base currency icon -->
      {#await baseIcon(t.base) then src}
        {#if src}
          <img {src} alt={t.base} class="w-8 h-8 rounded-full object-cover shrink-0" style="border: 1px solid var(--card-border);" />
        {:else}
          <span class="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style="background: var(--table-header-bg); color: var(--text-secondary);">{t.base.slice(0, 3)}</span>
        {/if}
      {/await}

      <span class="flex flex-col gap-0.5">
        <span
          class="whitespace-nowrap leading-tight"
          style="font-family: var(--font-head); font-size: 15.5px; font-weight: {active ? 800 : 600}; color: {active ? 'var(--text-primary)' : 'var(--text-secondary)'};"
        >{t.base} / {quote}</span>

        <span class="flex items-baseline gap-1.5 whitespace-nowrap">
          {#if t.rate > 0}
            <span class="tabular-nums" style="font-family: var(--font-mono); font-size: 13px; font-weight: 600; color: {active ? 'var(--text-primary)' : 'var(--text-secondary)'};">{symbol}{fmt(t.rate)}</span>
            <span class="tabular-nums text-[12px] font-semibold" style="color: {deltaColor};">{t.delta >= 0 ? '+' : ''}{fmt(t.delta)}%</span>
          {:else}
            <span class="text-[13px]" style="color: var(--text-muted);">—</span>
          {/if}
        </span>
      </span>
    </button>
  {/each}
  </div>

  <!-- Mobile-only "more pairs" hint: fades the right edge while scrollable -->
  <div
    class="md:hidden pointer-events-none absolute inset-y-0 right-0 w-14 transition-opacity duration-200"
    style="background: linear-gradient(to right, transparent, var(--page-bg)); opacity: {canScrollRight ? 1 : 0};"
    aria-hidden="true"
  ></div>
</div>
