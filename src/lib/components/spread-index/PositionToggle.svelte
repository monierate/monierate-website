<script lang="ts">
  import { POSITION_OPTIONS } from '$lib/constants/msi';
  import type { Position } from '$lib/services/currency/v1/spread';

  // Controlled by the page: it owns position/large state and refetches the
  // interpretation on change (TDD §10.1). Large unlocks execution-risk context.
  let {
    position,
    large,
    onSelect
  }: {
    position: Position;
    large: boolean;
    onSelect: (position: Position, large: boolean) => void;
  } = $props();

  // Size context only makes sense when the user actually holds something.
  const showSize = $derived(position !== 'watching');
</script>

<div class="flex flex-col gap-3">
  <div class="flex items-center gap-2 flex-wrap">
    <span
      style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-secondary);"
    >
      What this means if you're
    </span>

    <div class="inline-flex gap-1.5 flex-wrap">
      {#each POSITION_OPTIONS as opt}
        {@const active = opt.key === position}
        <button
          type="button"
          title={opt.hint}
          onclick={() => onSelect(opt.key, large)}
          class="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all border whitespace-nowrap cursor-pointer"
          style="
            background: {active ? 'var(--table-header-bg)' : 'transparent'};
            color: {active ? 'var(--text-primary)' : 'var(--text-muted)'};
            border-color: var(--card-border);
          "
        >
          {opt.label}
        </button>
      {/each}
    </div>
  </div>

  {#if showSize}
    <label class="inline-flex items-center gap-2 cursor-pointer select-none w-fit">
      <input
        type="checkbox"
        checked={large}
        onchange={(e) => onSelect(position, e.currentTarget.checked)}
        style="accent-color: var(--accent); width: 14px; height: 14px;"
      />
      <span style="font-size: 12px; color: var(--text-secondary);">
        Large order (execution &amp; liquidity context)
      </span>
    </label>
  {/if}
</div>
