<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { POSITION_LABEL } from '$lib/constants/msi';
  import type { MsiInterpretation } from '$lib/services/currency/v1/spread';

  // The "what the market is saying" popup — the full read for the current
  // position, opened from the compact summary card. Neutral styling.
  let {
    open,
    onClose,
    interpretation
  }: {
    open: boolean;
    onClose: () => void;
    interpretation: MsiInterpretation | null;
  } = $props();

  const subtitle = $derived(
    interpretation
      ? [
          POSITION_LABEL[interpretation.position],
          interpretation.size_band === 'large' || interpretation.size_band === 'very_large'
            ? 'large order'
            : null,
          'USDT/NGN'
        ]
          .filter(Boolean)
          .join(' · ')
      : ''
  );

  function relativeTime(iso: string): string {
    const mins = Math.floor((Date.now() - Date.parse(iso)) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `about ${hrs} ${hrs === 1 ? 'hour' : 'hours'} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open && interpretation}
  <div
    class="fixed inset-0 z-40"
    style="background: rgba(0,0,0,0.5); backdrop-filter: blur(3px);"
    onclick={onClose}
    role="presentation"
    transition:fade={{ duration: 150 }}
  ></div>

  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      class="rounded-2xl border shadow-2xl w-full max-w-lg overflow-hidden"
      style="border-color: var(--card-border); background: var(--card-bg);"
      role="dialog"
      aria-modal="true"
      aria-label="What the market is saying"
      transition:fly={{ y: 12, duration: 180 }}
    >
      <div
        class="flex items-start justify-between px-6 pt-5 pb-4 border-b"
        style="border-color: var(--card-border);"
      >
        <div>
          <h2
            class="flex items-center gap-2 text-[16px] font-bold"
            style="color: var(--text-primary); font-family: var(--font-head);"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary);"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></svg>
            What the market is saying
          </h2>
          <p class="text-[12px] mt-1" style="color: var(--text-secondary);">{subtitle}</p>
        </div>
        <button
          type="button"
          onclick={onClose}
          aria-label="Close"
          class="rounded-lg p-1 cursor-pointer shrink-0 ml-3"
          style="background: transparent; color: var(--text-secondary);"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="px-6 py-5 max-h-[70vh] overflow-y-auto">
        <p style="font-size: 15px; line-height: 1.65; color: var(--text-primary); margin: 0;">
          {interpretation.text}
        </p>

        {#if interpretation.watch}
          <div
            class="flex items-start gap-2 mt-4 rounded-xl p-3.5"
            style="background: var(--page-bg);"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-top: 2px; flex: none; color: var(--text-secondary);"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" /></svg>
            <span style="font-size: 13px; line-height: 1.55; color: var(--text-secondary);">
              <span style="font-weight: 700; color: var(--text-primary);">Watch:</span>
              {interpretation.watch}
            </span>
          </div>
        {/if}

        <p
          class="text-[11px] leading-relaxed mt-4"
          style="color: var(--text-muted);"
        >
          {interpretation.disclaimer} These are data-based observations to inform your own
          decision, not a recommendation. Conditions can change quickly.
        </p>
      </div>

      <div
        class="flex items-center gap-2 px-6 py-3 border-t flex-wrap"
        style="border-color: var(--card-border);"
      >
        <span class="text-[11px]" style="color: var(--text-muted);">
          updated {relativeTime(interpretation.as_of)}
        </span>
        <span class="text-[10px]" style="color: var(--text-muted);">·</span>
        <span
          class="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide"
          title="Beta — AI-generated market read. Figures are computed; wording is generated."
          style="color: var(--text-muted);"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></svg>
          Beta · AI generated
        </span>
      </div>
    </div>
  </div>
{/if}
