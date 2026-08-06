<script lang="ts">
  import { fmtNGN, fmtPct } from '$lib/utils/format';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import type { MsiChannel } from '$lib/services/currency/v1/spread';

  let { channels, cbnRate }: { channels: MsiChannel[]; cbnRate: number } = $props();
</script>

<div class="rounded-2xl px-6 py-5" style="background: var(--card-bg); border: 1px solid var(--card-border);">
  <div class="flex items-baseline justify-between mb-4">
    <h3 class="text-[14px] font-semibold" style="font-family: var(--font-head); color: var(--text-primary);">
      Source Breakdown
    </h3>
    <span class="text-[11px]" style="color: var(--text-muted);">premium vs CBN {fmtNGN(cbnRate)}</span>
  </div>

  {#if channels.length === 0}
    <EmptyState title="No sources" description="No contributing sources are available right now." compact />
  {:else}
    <div class="space-y-5">
      {#each channels as channel}
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-[12px] font-semibold" style="color: var(--text-primary);">{channel.label}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded" style="background: var(--table-header-bg); color: var(--text-muted);">
              {channel.sources.length} source{channel.sources.length === 1 ? '' : 's'}
            </span>
          </div>

          <div class="space-y-1.5">
            {#each channel.sources as s}
              <div
                class="flex items-center justify-between px-3 py-2 rounded-lg"
                style="background: var(--page-bg); border: 1px solid var(--card-border);"
              >
                <div class="flex items-center gap-2">
                  <span class="text-[12px] font-medium capitalize" style="color: var(--text-primary);">{s.name}</span>
                  {#if s.status === 'stale'}
                    <span class="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded" style="background: #f59e0b1a; color: #f59e0b;">
                      stale
                    </span>
                  {/if}
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-[12px] font-mono" style="color: var(--text-secondary);">{fmtNGN(s.rate)}</span>
                  <span class="text-[12px] font-mono font-semibold" style="color: {s.premium_pct >= 0 ? '#ef4444' : '#22c55e'}; min-width: 56px; text-align: right;">
                    {fmtPct(s.premium_pct)}
                  </span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
