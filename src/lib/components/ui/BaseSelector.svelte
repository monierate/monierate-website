<script lang="ts">
  import { activeBase } from '$lib/stores/activeBase';
  import { defaultCurrencyStore as activeQuote } from '$lib/stores/defaultCurrency';
  import { KNOWN_BASES, QUOTE_SUPPORTED_BASES } from '$lib/constants/currency';

  let { showQuote = false, bare = false }: { showQuote?: boolean; bare?: boolean } = $props();

  const supportedBases = $derived(
    QUOTE_SUPPORTED_BASES[$activeQuote] ?? KNOWN_BASES.map(b => b.toUpperCase())
  );

  // Order pills by the quote's supported list (USDT first), not KNOWN_BASES,
  // so the default/first base sits leftmost.
  const bases = $derived(
    supportedBases.map(code => ({ code: code.toUpperCase(), label: code.toUpperCase() }))
  );

  // Auto-correct active base if it's not supported by the current quote
  $effect(() => {
    if (!supportedBases.includes($activeBase)) {
      activeBase.set(supportedBases[0] ?? 'USDT');
    }
  });

  function select(code: string) {
    activeBase.set(code);
  }
</script>

{#if bare}
  <div class="flex gap-1.5">
    {#each bases as b}
      <button
        onclick={() => select(b.code)}
        class="px-3 py-1 rounded-full text-[12px] font-semibold transition-all border whitespace-nowrap cursor-pointer"
        style="
          background: {$activeBase === b.code ? 'var(--accent)' : 'transparent'};
          color: {$activeBase === b.code ? '#fff' : 'var(--text-muted)'};
          border-color: {$activeBase === b.code ? 'var(--accent)' : 'var(--card-border)'};
        "
      >{showQuote ? `${b.label}/${$activeQuote}` : b.label}</button>
    {/each}
  </div>
{:else}
  <div
    class="inline-flex items-center gap-0.5 p-1 rounded-full"
    style="background: var(--table-header-bg); border: 1px solid var(--card-border);"
  >
    {#each bases as b}
      <button
        onclick={() => select(b.code)}
        class="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer transition-all"
        style={$activeBase === b.code
          ? 'background: var(--accent); color: #fff;'
          : 'background: transparent; color: var(--text-secondary);'}
      >
        {#if $activeBase === b.code}
          <span class="text-[10px]">✓</span>
        {/if}
        {showQuote ? `${b.label}/${$activeQuote}` : b.label}
      </button>
    {/each}
  </div>
{/if}
