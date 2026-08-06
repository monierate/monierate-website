<script lang="ts">
  import { fmt, fmtNGN } from '$lib/utils/format';
  import type { MsiSources } from '$lib/services/currency/v1/spread';

  let { signals }: { signals: MsiSources['signals'] | null } = $props();

  const cards = $derived(
    !signals
      ? []
      : [
          {
            label: 'P2P vs OTC',
            value: signals.p2p_vs_otc_naira === null ? '—' : `${fmtNGN(signals.p2p_vs_otc_naira)}`,
            sub: 'channel gap'
          },
          {
            label: 'P2P vs Exchange',
            value: signals.p2p_vs_exchange_naira === null ? '—' : `${fmtNGN(signals.p2p_vs_exchange_naira)}`,
            sub: 'channel gap'
          },
          {
            label: 'Best Rate',
            value: signals.best_rate ? signals.best_rate.name : '—',
            sub: signals.best_rate
              ? `${fmtNGN(signals.best_rate.rate)} · ${fmt(signals.best_rate.delta_vs_composite)} vs composite`
              : 'no source'
          }
        ]
  );
</script>

{#if signals}
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    {#each cards as card}
      <div style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 14px; padding: 16px;">
        <span style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-secondary);">
          {card.label}
        </span>
        <div style="font-size: 18px; font-weight: 700; line-height: 1.1; margin-top: 12px; font-family: var(--font-mono); color: var(--text-primary); text-transform: capitalize;">
          {card.value}
        </div>
        <div style="font-size: 11px; margin-top: 6px; color: var(--text-muted);">{card.sub}</div>
      </div>
    {/each}
  </div>
{/if}
