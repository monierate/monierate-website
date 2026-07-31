<script lang="ts">
  import { fmt, fmtNGN, fmtPct } from '$lib/utils/format';
  import MsiPremiumLevelsModal from './MsiPremiumLevelsModal.svelte';
  import type { MsiActions } from '../../../routes/(main)/markets/spread/actions.svelte';

  let { actions }: { actions: MsiActions } = $props();

  const c = $derived(actions.current!); // headline is only rendered when current exists

  let levelsOpen = $state(false);

  function relativeTime(iso: string): string {
    const diff = Date.now() - Date.parse(iso);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    return `${Math.floor(hrs / 24)} d ago`;
  }

  const dirArrow = $derived(
    c.change.direction === 'up' ? '▲' : c.change.direction === 'down' ? '▼' : '–'
  );
  const dirColor = $derived(
    c.change.direction === 'up' ? '#ef4444' : c.change.direction === 'down' ? '#22c55e' : 'var(--text-muted)'
  );

  const stats = $derived([
    { label: 'Composite (USDT/NGN)', value: fmtNGN(c.composite_rate), color: 'var(--text-primary)' },
    { label: 'CBN Official (USD/NGN)', value: fmtNGN(c.cbn_rate), color: 'var(--text-primary)' },
    { label: 'Spread', value: fmtNGN(c.spread_naira), color: 'var(--text-primary)' },
    {
      label: 'Today range',
      value: `${fmt(c.window.range_low)} – ${fmt(c.window.range_high)}`,
      color: 'var(--text-secondary)'
    }
  ]);
</script>

<div class="space-y-4">
  <!-- Headline card -->
  <div
    style="
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 22px 24px;
    "
  >
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <div class="flex items-center gap-3">
          <span style="font-family: var(--font-mono); font-size: 42px; font-weight: 700; line-height: 1; color: {actions.toneColor};">
            {fmt(c.msi_score)}%
          </span>
          <button
            type="button"
            onclick={() => (levelsOpen = true)}
            title="What does this mean?"
            class="inline-flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-80"
            style="
              font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
              padding: 4px 10px; border-radius: 999px; border: none;
              background: {actions.toneColor}1a; color: {actions.toneColor};
            "
          >
            {actions.levelLabel}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.7;"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
          </button>
        </div>

        <div class="flex items-center gap-2 mt-2">
          {#if c.change.vs_yesterday_pct_points !== null}
            <span style="font-size: 13px; font-weight: 600; color: {dirColor};">
              {dirArrow} {fmtPct(c.change.vs_yesterday_pct_points)} pts
            </span>
            <span style="font-size: 12px; color: var(--text-muted);">vs yesterday</span>
          {:else}
            <span style="font-size: 12px; color: var(--text-muted);">no prior-day comparison</span>
          {/if}
        </div>
      </div>

      <div class="text-right">
        <div style="font-size: 11px; color: var(--text-muted);">
          updated {relativeTime(c.as_of)}
        </div>
        {#if actions.isStale}
          <span
            style="
              display: inline-block; margin-top: 6px;
              font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
              padding: 3px 8px; border-radius: 6px;
              background: #f59e0b1a; color: #f59e0b;
            "
          >Delayed</span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Secondary stat cards -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {#each stats as s}
      <div
        style="
          background: var(--card-bg); border: 1px solid var(--card-border);
          border-radius: 14px; padding: 16px;
        "
      >
        <span style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-secondary);">
          {s.label}
        </span>
        <div style="font-size: 19px; font-weight: 700; line-height: 1; margin-top: 12px; font-family: var(--font-mono); color: {s.color};">
          {s.value}
        </div>
      </div>
    {/each}
  </div>
</div>

<MsiPremiumLevelsModal
  open={levelsOpen}
  onClose={() => (levelsOpen = false)}
  activeLevel={c.premium_level}
  score={c.msi_score}
/>
