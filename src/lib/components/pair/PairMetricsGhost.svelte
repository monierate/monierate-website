<!-- Info strip skeleton -->
<div class="flex items-center gap-x-4 mb-3 flex-nowrap">
  <div class="flex items-center gap-1.5 flex-shrink-0">
    <div class="w-5 h-5 rounded-md animate-pulse" style="background: var(--table-header-bg);"></div>
    <div class="flex flex-col gap-1">
      <div class="w-20 h-2.5 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
      <div class="w-14 h-2 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
    </div>
  </div>

  <div style="width:1px; height:28px; background:var(--card-border); flex-shrink:0;"></div>

  <div class="flex items-center gap-1.5 flex-shrink-0">
    <div class="w-5 h-5 rounded-full animate-pulse" style="background: var(--table-header-bg);"></div>
    <div class="flex flex-col gap-1">
      <div class="w-16 h-2.5 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
      <div class="w-12 h-2 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
    </div>
  </div>

  <div style="width:1px; height:28px; background:var(--card-border); flex-shrink:0;"></div>

  <div class="flex items-center gap-1.5 flex-shrink-0">
    <div class="w-5 h-5 rounded-full animate-pulse" style="background: var(--table-header-bg);"></div>
    <div class="flex flex-col gap-1">
      <div class="w-16 h-2.5 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
      <div class="w-12 h-2 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
    </div>
  </div>
</div>

<!-- Metric cards skeleton -->
<div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3">
  {#each { length: 5 } as _}
    <div
      class="rounded-xl border"
      style="background: var(--page-bg); border-color: var(--card-border); padding: clamp(10px, 3vw, 16px);"
    >
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <div class="w-14 h-2 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
        <div class="w-5 h-5 rounded-md animate-pulse" style="background: var(--table-header-bg);"></div>
      </div>
      <div class="w-24 h-5 rounded animate-pulse mb-2" style="background: var(--table-header-bg);"></div>
      <div class="w-16 h-2 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
    </div>
  {/each}
</div>
