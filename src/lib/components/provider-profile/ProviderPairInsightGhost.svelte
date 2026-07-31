<!-- Loading skeleton for ProviderPairInsight — mirrors its layout. -->
<div class="space-y-5">

  <!-- Header -->
  <div class="flex items-start justify-between gap-3">
    <div class="min-w-0 flex-1">
      <div class="w-28 h-2.5 rounded animate-pulse mb-3" style="background: var(--table-header-bg);"></div>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full animate-pulse flex-shrink-0" style="background: var(--table-header-bg);"></div>
        <div class="flex flex-col gap-2">
          <div class="w-40 h-4 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
          <div class="w-24 h-2.5 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
        </div>
      </div>
    </div>
    <div class="w-24 h-8 rounded-lg animate-pulse flex-shrink-0" style="background: var(--table-header-bg);"></div>
  </div>

  <!-- Metric cards -->
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
    {#each { length: 6 } as _}
      <div
        class="rounded-xl border"
        style="background: var(--page-bg); border-color: var(--card-border); padding: clamp(10px, 3vw, 16px);"
      >
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <div class="w-12 h-2 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
          <div class="w-5 h-5 rounded-md animate-pulse" style="background: var(--table-header-bg);"></div>
        </div>
        <div class="w-20 h-5 rounded animate-pulse mb-2" style="background: var(--table-header-bg);"></div>
        <div class="w-14 h-2 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
      </div>
    {/each}
  </div>

  <!-- Chart + converter -->
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_296px] gap-4">
    <div
      class="rounded-xl border flex items-center justify-center"
      style="background: var(--card-bg); border-color: var(--card-border); height: 352px;"
    >
      <div class="flex flex-col items-center gap-2" style="color: var(--text-muted);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="animate-spin">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="31.4 31.4" stroke-linecap="round"/>
        </svg>
        <span class="text-[12px]">Loading insight…</span>
      </div>
    </div>
    <div
      class="rounded-xl border p-4 space-y-4"
      style="background: var(--page-bg); border-color: var(--card-border); min-height: 200px;"
    >
      <div class="w-24 h-2.5 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
      <div class="w-full h-12 rounded-lg animate-pulse" style="background: var(--table-header-bg);"></div>
      <div class="w-full h-12 rounded-lg animate-pulse" style="background: var(--table-header-bg);"></div>
    </div>
  </div>

  <!-- About -->
  <div class="rounded-xl border p-5" style="background: var(--card-bg); border-color: var(--card-border);">
    <div class="w-24 h-2.5 rounded animate-pulse mb-3" style="background: var(--table-header-bg);"></div>
    <div class="space-y-2">
      <div class="w-full h-2.5 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
      <div class="w-3/4 h-2.5 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
    </div>
  </div>

</div>
