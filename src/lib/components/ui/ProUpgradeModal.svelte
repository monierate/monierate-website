<script lang="ts">
  import { fly, fade } from 'svelte/transition';

  // Public-site upgrade prompt for Pro-gated affordances (exports, etc). This
  // is a static marketing prompt — there's no logged-in/paid concept on the
  // public site, so it always points out to the Pro plans page.
  let {
    open = false,
    onClose,
    title = 'Upgrade to Pro for unlimited exports.',
    features = [],
    ctaHref = '/pricing'
  }: {
    open: boolean;
    onClose: () => void;
    title?: string;
    features?: { label: string }[];
    ctaHref?: string;
  } = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-40"
    style="background: rgba(0,0,0,0.5); backdrop-filter: blur(3px);"
    onclick={onClose}
    role="presentation"
    transition:fade={{ duration: 150 }}
  ></div>

  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      class="rounded-2xl border shadow-2xl w-full max-w-md overflow-hidden relative"
      style="border-color: var(--card-border); background: var(--card-bg);"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      transition:fly={{ y: 14, duration: 200 }}
    >
      <button
        type="button"
        onclick={onClose}
        aria-label="Close"
        class="absolute top-4 right-4 rounded-lg p-1 cursor-pointer z-10"
        style="background: transparent; color: var(--text-secondary);"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>

      <div class="px-7 pt-7 pb-6">
        <span
          class="inline-block text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-3"
          style="background: var(--accent-light, rgba(56,97,251,0.1)); color: var(--accent);"
        >Monierate Pro</span>

        <h2 class="text-[22px] font-bold leading-snug" style="font-family: var(--font-head); color: var(--text-primary);">
          {title}
        </h2>

        <ul class="mt-5 space-y-3">
          {#each features as feature}
            <li class="flex items-center gap-3">
              <span
                class="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                style="background: var(--accent-light, rgba(56,97,251,0.1)); color: var(--accent);"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </span>
              <span class="text-[13.5px]" style="color: var(--text-primary);">{feature.label}</span>
            </li>
          {/each}
        </ul>

        <a
          href={ctaHref}
          class="block w-full text-center py-3 px-4 rounded-lg text-[14px] font-semibold text-white no-underline mt-6"
          style="background: var(--accent);"
        >See Pro plans</a>
      </div>
    </div>
  </div>
{/if}
