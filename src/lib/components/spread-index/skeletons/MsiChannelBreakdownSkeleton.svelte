<div class="rounded-xl px-5 py-5" style="background: var(--page-bg);">
  <div class="w-32 h-3 rounded animate-pulse mb-4" style="background: var(--table-header-bg);"></div>
  <div class="space-y-4">
    {#each { length: 3 } as _}
      <div>
        <div class="w-24 h-2.5 rounded animate-pulse mb-2" style="background: var(--table-header-bg);"></div>
        <div class="space-y-1.5">
          {#each { length: 2 } as _}
            <div class="h-9 rounded-lg animate-pulse" style="background: var(--table-header-bg);"></div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
