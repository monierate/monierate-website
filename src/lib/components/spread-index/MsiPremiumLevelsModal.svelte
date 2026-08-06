<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { MSI_LEVELS, MSI_LEVEL_LABEL, TONE_COLOR } from '$lib/constants/msi';
  import { fmt } from '$lib/utils/format';
  import type { PremiumLevel } from '$lib/services/currency/v1/spread';

  let {
    open = false,
    onClose,
    activeLevel = null,
    score = null
  }: {
    open: boolean;
    onClose: () => void;
    activeLevel?: PremiumLevel | null;
    score?: number | null;
  } = $props();

  const activeColor = $derived(activeLevel ? TONE_COLOR[(MSI_LEVELS.find((l) => l.key === activeLevel)?.tone ?? 'info')] : 'var(--accent)');

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-40"
    style="background: rgba(0,0,0,0.5); backdrop-filter: blur(3px);"
    onclick={onClose}
    role="presentation"
    transition:fade={{ duration: 150 }}
  ></div>

  <!-- Modal -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      class="rounded-2xl border shadow-2xl w-full max-w-lg overflow-hidden"
      style="border-color: var(--card-border); background: var(--card-bg);"
      role="dialog"
      aria-modal="true"
      aria-label="Premium levels explained"
      transition:fly={{ y: 12, duration: 180 }}
    >
      <!-- Header -->
      <div class="flex items-start justify-between px-6 pt-5 pb-4 border-b" style="border-color: var(--card-border);">
        <div>
          <h2 class="text-[16px] font-bold" style="color: var(--text-primary); font-family: var(--font-head);">
            Premium levels
          </h2>
          <p class="text-[12px] mt-1 leading-relaxed" style="color: var(--text-secondary);">
            The Monierate Stablecoin Spread Index (MSI) is an index that tracks the stablecoin-dollar spread over the CBN official rate. It tells you how far the USDT/NGN market rate sits above the CBN official rate. The wider the premium, the more pressure on the naira.
          </p>
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

      <!-- Current standing -->
      {#if activeLevel && score !== null}
        <div class="px-6 py-3 flex items-center gap-2 border-b" style="border-color: var(--card-border); background: {activeColor}10;">
          <span class="text-[12px]" style="color: var(--text-muted);">Right now</span>
          <span class="text-[13px] font-bold" style="font-family: var(--font-mono); color: {activeColor};">{fmt(score)}%</span>
          <span class="text-[12px]" style="color: var(--text-secondary);">·</span>
          <span class="text-[13px] font-semibold" style="color: {activeColor};">{MSI_LEVEL_LABEL[activeLevel]}</span>
        </div>
      {/if}

      <!-- Levels -->
      <div class="px-6 py-5 space-y-2.5 max-h-[60vh] overflow-y-auto">
        {#each MSI_LEVELS as level}
          {@const color = TONE_COLOR[level.tone]}
          {@const isNow = activeLevel === level.key}
          <div
            class="rounded-xl p-3.5"
            style="
              border: 1px solid {isNow ? color : 'var(--card-border)'};
              background: {isNow ? color + '14' : 'var(--card-bg)'};
            "
          >
            <div class="flex items-center gap-2">
              <span class="text-[13px] font-bold" style="color: {color};">{level.label}</span>
              <span class="text-[12px] font-semibold" style="font-family: var(--font-mono); color: var(--text-muted);">{level.rangeLabel}</span>
              {#if isNow}
                <span
                  class="ml-auto text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                  style="background: {color}; color: #fff;"
                >Current</span>
              {/if}
            </div>
            <p class="text-[12px] leading-relaxed mt-1.5" style="color: var(--text-secondary);">
              {level.meaning}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
