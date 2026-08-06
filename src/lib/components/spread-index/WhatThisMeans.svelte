<script lang="ts">
  import type { MsiInterpretation } from '$lib/services/currency/v1/spread';
  import WhatThisMeansSkeleton from './skeletons/WhatThisMeansSkeleton.svelte';

  // Compact "Market read" summary card (CoinGecko-style). Click expand to open
  // the full popup of what the market is saying (TDD §10.1/§10.2). Neutral card
  // styling — no accent borders.
  let {
    interpretation,
    loading,
    onExpand
  }: {
    interpretation: MsiInterpretation | null;
    loading: boolean;
    onExpand: () => void;
  } = $props();

  function relativeTime(iso: string): string {
    const mins = Math.floor((Date.now() - Date.parse(iso)) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `about ${hrs} ${hrs === 1 ? 'hour' : 'hours'} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
</script>

{#if loading}
  <WhatThisMeansSkeleton />
{:else if interpretation}
  <div
    class="rounded-2xl"
    style="background: var(--card-bg); border: 1px solid var(--card-border); padding: 18px 20px;"
  >
    <div class="flex items-center justify-between gap-3 mb-2.5">
      <div class="flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary);"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></svg>
        <span
          style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-secondary);"
        >
          Market read
        </span>
      </div>
      <button
        type="button"
        onclick={onExpand}
        aria-label="Expand market read"
        title="What the market is saying"
        class="rounded-lg p-1 cursor-pointer transition-opacity hover:opacity-70"
        style="background: transparent; color: var(--text-muted);"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
      </button>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: var(--text-primary); margin: 0;">
      <span style="font-weight: 700;">Summary:</span>
      {interpretation.text}
    </p>

    {#if interpretation.watch}
      <div
        class="flex items-start gap-2 mt-3 pt-3"
        style="border-top: 1px solid var(--card-border);"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-top: 2px; flex: none; color: var(--text-muted);"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" /></svg>
        <span style="font-size: 12.5px; line-height: 1.5; color: var(--text-secondary);">
          <span style="font-weight: 700; color: var(--text-primary);">Watch:</span>
          {interpretation.watch}
        </span>
      </div>
    {/if}

    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <span style="font-size: 11px; color: var(--text-muted);">
        updated {relativeTime(interpretation.as_of)}
      </span>
      <span style="font-size: 10px; color: var(--text-muted);">·</span>
      <span
        class="inline-flex items-center gap-1"
        title="Beta — AI-generated market read. Figures are computed; wording is generated."
        style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted);"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></svg>
        Beta · AI generated
      </span>
    </div>
  </div>
{/if}
