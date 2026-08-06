<script lang="ts">
  // Displayed quote (from the loaded pair) — drives the title text. The quote
  // itself is switched from the header's existing currency selector, not here.
  let { quote }: { quote: string } = $props();
</script>

<h1 class="text-2xl md:text-4xl font-bold" style="color: var(--text-primary);">
  Market Insight, {quote}
</h1>
