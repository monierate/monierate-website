<script lang="ts">
  import { slide } from 'svelte/transition';

  export let text: string = '';
  export let maxChars: number | null = 200;
  export let maxLines: number | null = null;
  export let allowHtml = false;

  let expanded = false;

  $: isTruncated =
    (maxChars !== null && text.length > maxChars) || maxLines !== null;

  $: collapsedText =
    maxChars && !expanded
      ? text.slice(0, maxChars).trimEnd() + `${text.length > maxChars ? '...' : ''}`
      : text;
</script>

<div class="space-y-2">
  {#if expanded}
    <!-- Expanded -->
    <div transition:slide>
      {#if allowHtml}
        {@html text}
      {:else}
        {text}
      {/if}
    </div>
  {:else}
    <!-- Collapsed -->
    <div
      transition:slide
      class={`${
        maxLines ? `line-clamp-${maxLines}` : ''
      }`}
    >
      {#if allowHtml}
        {@html collapsedText}
      {:else}
        {collapsedText}
      {/if}
    </div>
  {/if}

  {#if isTruncated}
    <button
      type="button"
      class="text-sm font-medium text-primary hover:text-blue-800 focus:outline-none"
      on:click={() => (expanded = !expanded)}
    >
      {expanded ? 'View less' : 'View more'}
    </button>
  {/if}
</div>
