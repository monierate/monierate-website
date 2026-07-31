<script lang="ts">
  import { get } from 'svelte/store';
  import { defaultCurrencyStore as activeQuote } from '$lib/stores/defaultCurrency';
  import { activeBase } from '$lib/stores/activeBase';
  import { AVAILABLE_QUOTE_CURRENCIES, QUOTE_SUPPORTED_BASES } from '$lib/constants/currency';

  // Displayed quote (from the loaded pair) — drives the title text + active row.
  let { quote }: { quote: string } = $props();

  const QUOTE_NAMES: Record<string, string> = {
    NGN: 'Nigerian Naira',
    KES: 'Kenyan Shilling',
    GHS: 'Ghanaian Cedi',
  };
  const quotes = AVAILABLE_QUOTE_CURRENCIES.map((code) => ({ code, name: QUOTE_NAMES[code] ?? code }));
  const flagUrl = (code: string) => `/icons/currencies/${code.toLowerCase()}.png`;

  let open = $state(false);
  let wrapperEl: HTMLDivElement;

  // Switch country/currency — same flow as the top-bar QuoteSelector: keep the
  // active base if the new quote supports it, else fall back to its first base.
  function select(code: string) {
    const supported = QUOTE_SUPPORTED_BASES[code] ?? [];
    if (!supported.includes(get(activeBase))) {
      activeBase.set(supported[0] ?? 'USDT');
    }
    activeQuote.set(code);
    open = false;
  }

  function handleOutside(e: MouseEvent) {
    if (wrapperEl && !wrapperEl.contains(e.target as Node)) open = false;
  }
</script>

<svelte:window onclick={handleOutside} />

<div class="relative flex justify-center" bind:this={wrapperEl}>
  <button
    type="button"
    onclick={(e) => { e.stopPropagation(); open = !open; }}
    class="inline-flex items-center gap-2 cursor-pointer bg-transparent border-none"
    aria-haspopup="listbox"
    aria-expanded={open}
  >
    <span class="text-[22px] sm:text-[40px] font-extrabold tracking-tight" style="font-family: var(--font-head); color: var(--text-primary);">Market Insight, {quote}</span>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3.25"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="w-[18px] h-[18px] sm:w-7 sm:h-7"
      style="color: var(--text-primary); transition: transform 0.15s; transform: rotate({open ? 180 : 0}deg);"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>

  {#if open}
    <div
      class="absolute top-full mt-3 left-1/2 -translate-x-1/2 rounded-xl border overflow-hidden z-50 min-w-[220px]"
      style="background: var(--card-bg); border-color: var(--card-border); box-shadow: 0 8px 24px rgba(0,0,0,0.15);"
      role="listbox"
    >
      {#each quotes as q (q.code)}
        <button
          type="button"
          onclick={() => select(q.code)}
          class="w-full flex items-center gap-2.5 px-3.5 py-3 text-[14px] text-left cursor-pointer transition-colors"
          style="color: {q.code === quote ? 'var(--accent)' : 'var(--text-primary)'}; background: {q.code === quote ? 'var(--accent-light)' : 'transparent'};"
        >
          <img src={flagUrl(q.code)} alt={q.code} class="w-6 h-4 rounded object-cover flex-shrink-0" />
          <span class="font-semibold" style="font-family: var(--font-mono);">{q.code}</span>
          <span style="color: var(--text-muted);">{q.name}</span>
          {#if q.code === quote}
            <span class="ml-auto text-[11px] font-bold" style="color: var(--accent);">✓</span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
