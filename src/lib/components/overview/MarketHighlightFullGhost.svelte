<!-- Loading skeleton for MarketHighlightFull. -->
<div class="space-y-5">
  <!-- Header -->
  <div>
    <div class="w-28 h-2.5 rounded animate-pulse mb-3" style="background: var(--table-header-bg);"></div>
    <div class="w-40 h-4 rounded animate-pulse mb-2" style="background: var(--table-header-bg);"></div>
    <div class="w-56 h-2.5 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
  </div>

  <!-- List -->
  <div class="rounded-2xl border overflow-hidden" style="background: var(--page-bg); border-color: var(--card-border);">
    {#each { length: 6 } as _, i}
      <div class="flex items-center gap-3 px-4 sm:px-5 py-3.5 {i > 0 ? 'border-t' : ''}" style="border-color: color-mix(in srgb, var(--card-border) 35%, transparent);">
        <div class="w-10 h-10 rounded-full animate-pulse flex-shrink-0" style="background: var(--table-header-bg);"></div>
        <div class="flex-1 min-w-0 flex flex-col gap-2">
          <div class="w-32 h-3 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
          <div class="w-20 h-2 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
        </div>
        <div class="w-20 h-4 rounded animate-pulse flex-shrink-0" style="background: var(--table-header-bg);"></div>
      </div>
    {/each}
  </div>
</div>
