<script lang="ts">
  // Mirrors the MarketHighlights card grid so streamed provider data fills in
  // without shifting layout (CLS-safe). `count` matches the number of cards shown.
  let { count = 4, rows = 4 }: { count?: number; rows?: number } = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  {#each { length: count } as _}
    <div class="rounded-2xl border flex flex-col overflow-hidden" style="background: var(--page-bg); border-color: var(--card-border);">
      <!-- Header -->
      <div class="flex items-start justify-between gap-2 px-4 sm:px-5 pt-4 pb-3.5 border-b" style="border-color: var(--card-border);">
        <div class="min-w-0 space-y-1.5">
          <div class="w-32 h-4 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
          <div class="w-44 h-3 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
        </div>
        <div class="w-8 h-6 rounded-lg animate-pulse shrink-0" style="background: var(--table-header-bg);"></div>
      </div>
      <!-- Rows -->
      <div class="flex-1">
        {#each { length: rows } as _, i}
          <div class="flex items-center gap-3 px-4 sm:px-5 py-3.5 {i === 0 ? '' : 'border-t'}" style="border-color: var(--card-border);">
            <div class="w-8 h-8 rounded-full animate-pulse shrink-0" style="background: var(--table-header-bg);"></div>
            <div class="flex-1 space-y-1.5">
              <div class="w-28 h-3 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
              <div class="w-16 h-2.5 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
            </div>
            <div class="w-16 h-4 rounded animate-pulse shrink-0" style="background: var(--table-header-bg);"></div>
          </div>
        {/each}
      </div>
      <!-- Footer -->
      <div class="px-4 sm:px-5 py-3 border-t flex justify-center" style="border-color: var(--card-border);">
        <div class="w-20 h-3.5 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
      </div>
    </div>
  {/each}
</div>
