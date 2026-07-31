<script lang="ts">
  import { spread } from '$lib/services';
  import type { MsiInterpretation, Position } from '$lib/services/currency/v1/spread';
  import { MARKET_READ_ENABLED } from '$lib/constants/msi';
  import WhatThisMeans from './WhatThisMeans.svelte';
  import WhatThisMeansModal from './WhatThisMeansModal.svelte';

  // Self-contained general "Market read" — the same combined spread + volatility
  // interpretation used on the Spread page, without the position toggle. Drop it
  // on any page (volatility, overview) for a one-line market summary. Defaults to
  // the general `watching` USDT/NGN read, served from the pre-generated cache.
  let {
    pair = 'usdtngn',
    position = 'watching'
  }: {
    pair?: string;
    position?: Position;
  } = $props();

  let interpretation = $state<MsiInterpretation | null>(null);
  let loading = $state(true);
  let failed = $state(false);
  let modalOpen = $state(false);

  // Retry on transient failures (e.g. a proxy/DNS blip) so the panel doesn't
  // silently vanish after a single bad fetch.
  $effect(() => {
    if (!MARKET_READ_ENABLED) {
      loading = false;
      return;
    }
    let cancelled = false;
    loading = true;
    failed = false;

    (async () => {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const r = await spread.getInterpretation({ position, pair });
          if (cancelled) return;
          if (r?.data) {
            interpretation = r.data;
            loading = false;
            return;
          }
        } catch {
          /* fall through to retry */
        }
        if (cancelled) return;
        await new Promise((res) => {
          setTimeout(res, 1200);
        });
      }
      if (!cancelled) {
        interpretation = null;
        loading = false;
        failed = true;
      }
    })();

    return () => {
      cancelled = true;
    };
  });
</script>

{#if !MARKET_READ_ENABLED}
  <!-- Hidden while summary generation is paused; see MARKET_READ_ENABLED. -->
{:else if loading || interpretation}
  <WhatThisMeans {interpretation} {loading} onExpand={() => (modalOpen = true)} />
  <WhatThisMeansModal open={modalOpen} onClose={() => (modalOpen = false)} {interpretation} />
{:else if failed}
  <div
    class="rounded-2xl text-[12px]"
    style="background: var(--card-bg); border: 1px solid var(--card-border); padding: 14px 18px; color: var(--text-muted);"
  >
    Market read unavailable right now.
  </div>
{/if}
