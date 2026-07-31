<script lang="ts">
  import type { Snippet } from 'svelte';

  let { open, label, onClose, children, escClose = true }: {
    open: boolean;
    label: string;
    onClose: () => void;
    children: Snippet;
    // Disable when another overlay is stacked on top, so Escape only closes the topmost.
    escClose?: boolean;
  } = $props();

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={open && escClose ? onKeydown : undefined} />

{#if open}
  <div
    class="fixed inset-0 z-50 flex sm:items-center sm:justify-center sm:p-4"
    style="background: rgba(0,0,0,0.5);"
    onclick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    role="presentation"
  >
    <div
      class="w-full sm:max-w-5xl overflow-y-auto sm:rounded-2xl sm:shadow-xl sm:max-h-[90vh] h-full sm:h-auto"
      style="background: var(--page-bg); border: 1px solid var(--card-border);"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div class="p-4 sm:p-6">
        {@render children()}
      </div>
    </div>
  </div>
{/if}
