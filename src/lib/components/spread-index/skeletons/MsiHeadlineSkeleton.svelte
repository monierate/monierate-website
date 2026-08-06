<div class="space-y-4">
  <div class="rounded-2xl p-6" style="background: var(--page-bg);">
    <div class="w-40 h-10 rounded animate-pulse mb-3" style="background: var(--table-header-bg);"></div>
    <div class="w-32 h-3 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
  </div>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {#each { length: 4 } as _}
      <div class="rounded-xl p-4" style="background: var(--page-bg);">
        <div class="w-24 h-2.5 rounded animate-pulse mb-3" style="background: var(--table-header-bg);"></div>
        <div class="w-20 h-5 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
      </div>
    {/each}
  </div>
</div>
