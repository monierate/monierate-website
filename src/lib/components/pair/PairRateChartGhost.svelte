<div class="py-2">
  <!-- Header -->
  <div class="flex items-center justify-between mb-5 flex-wrap gap-2">
    <div class="w-20 h-3.5 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-1.5">
        <div class="w-5 h-0.5 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
        <div class="w-16 h-2.5 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-full animate-pulse" style="background: var(--table-header-bg);"></div>
        <div class="w-16 h-2.5 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
      </div>
    </div>
  </div>

  <!-- Chart ghost -->
  <div style="position:relative; pointer-events:none; user-select:none;">
    <!-- Fake y-axis ticks -->
    <div style="display:flex; flex-direction:column; position:absolute; left:0; top:0; bottom:32px; justify-content:space-between; width:56px;">
      {#each { length: 5 } as _}
        <div class="animate-pulse" style="height:10px; width:36px; border-radius:4px; background:var(--table-header-bg);"></div>
      {/each}
    </div>
    <!-- Chart area -->
    <div style="margin-left:64px; position:relative;">
      <svg width="100%" height="300" viewBox="0 0 1000 300" preserveAspectRatio="none" style="display:block; opacity:0.4;">
        <defs>
          <linearGradient id="prcg-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3861fb" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="var(--page-bg)" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <!-- Spread band top -->
        <polyline points="0,130 120,105 240,120 360,80 480,95 600,60 700,80 800,55 900,70 1000,50"
          fill="none" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="3 4" opacity="0.2"/>
        <!-- Spread band bottom -->
        <polyline points="0,165 120,145 240,158 360,118 480,132 600,100 700,118 800,94 900,108 1000,90"
          fill="none" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="3 4" opacity="0.2"/>
        <!-- Main index line -->
        <polyline points="0,148 120,125 240,140 360,98 480,114 600,79 700,98 800,74 900,88 1000,68"
          fill="none" stroke="#3861fb" stroke-width="2" stroke-dasharray="4 3" opacity="0.35"/>
        <!-- Fill area -->
        <polygon points="0,148 120,125 240,140 360,98 480,114 600,79 700,98 800,74 900,88 1000,68 1000,300 0,300"
          fill="url(#prcg-fade)"/>
      </svg>
      <!-- Fade-to-bg overlay -->
      <div style="position:absolute; inset:0; background:linear-gradient(to bottom, transparent 30%, var(--page-bg) 100%);"></div>
      <!-- Fake x-axis ticks -->
      <div style="display:flex; justify-content:space-between; margin-top:8px;">
        {#each { length: 8 } as _}
          <div class="animate-pulse" style="height:10px; width:28px; border-radius:4px; background:var(--table-header-bg);"></div>
        {/each}
      </div>
    </div>
  </div>
</div>
