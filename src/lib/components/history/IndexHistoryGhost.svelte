<div class="space-y-6">
  <!-- Chart ghost -->
  <div class="rounded-xl p-5" style="background: var(--page-bg);">
    <!-- Header row -->
    <div class="flex items-center justify-between mb-5">
      <div class="h-3.5 w-36 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
      <div class="flex items-center gap-3">
        {#each [20, 18, 16] as w}
          <div class="h-2.5 rounded animate-pulse" style="width:{w}px; background: var(--table-header-bg);"></div>
        {/each}
      </div>
    </div>

    <!-- Chart area -->
    <div class="animate-pulse" style="position:relative; height:300px; pointer-events:none; user-select:none;">
      <svg
        width="100%" height="100%"
        viewBox="0 0 800 300"
        preserveAspectRatio="none"
        style="display:block; opacity:0.35;"
      >
        <defs>
          <linearGradient id="ihg-close-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3861fb" stop-opacity="0.18"/>
            <stop offset="100%" stop-color="#3861fb" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polygon
          points="0,185 80,168 160,172 240,148 320,158 400,134 480,143 560,122 640,138 720,114 800,128 800,300 0,300"
          fill="url(#ihg-close-fill)"
        />
        <polyline
          points="0,158 80,142 160,148 240,120 320,132 400,108 480,118 560,96 640,112 720,88 800,104"
          fill="none" stroke="#22c55e" stroke-width="1.4" stroke-dasharray="5 3" opacity="0.45"
        />
        <polyline
          points="0,185 80,168 160,172 240,148 320,158 400,134 480,143 560,122 640,138 720,114 800,128"
          fill="none" stroke="#3861fb" stroke-width="1.6" opacity="0.55"
        />
        <polyline
          points="0,210 80,194 160,198 240,174 320,184 400,160 480,168 560,148 640,163 720,140 800,154"
          fill="none" stroke="#ef4444" stroke-width="1.4" stroke-dasharray="5 3" opacity="0.35"
        />
      </svg>
      <div
        style="position:absolute; inset:0; background:linear-gradient(to bottom, transparent 40%, var(--page-bg) 100%); pointer-events:none;"
      ></div>
    </div>

    <!-- X-axis tick placeholders -->
    <div class="flex justify-between mt-2">
      {#each { length: 8 } as _}
        <div class="h-2.5 w-7 rounded animate-pulse" style="background: var(--table-header-bg);"></div>
      {/each}
    </div>
  </div>

  <!-- OHLC table ghost -->
  <div class="rounded-xl overflow-hidden" style="background: var(--page-bg);">
    <div
      class="px-5 py-3 border-b flex items-center justify-between"
      style="background: var(--table-header-bg); border-color: var(--card-border);"
    >
      <div class="h-3.5 w-24 rounded animate-pulse" style="background: var(--card-border);"></div>
      <div class="h-3 w-10 rounded animate-pulse" style="background: var(--card-border);"></div>
    </div>
    <div
      class="flex gap-4 px-5 py-2.5 border-b"
      style="background: var(--table-header-bg); border-color: var(--card-border);"
    >
      {#each [52, 48, 44, 44, 48, 44, 48, 52] as w}
        <div class="h-2.5 rounded animate-pulse" style="width:{w}px; background: var(--card-border);"></div>
      {/each}
    </div>
    {#each [
      [72, 56, 60, 60, 56, 48, 52, 40],
      [68, 52, 56, 52, 60, 44, 48, 36],
      [72, 56, 60, 56, 52, 48, 52, 40],
      [68, 60, 52, 60, 56, 44, 48, 36],
      [72, 52, 60, 52, 60, 48, 52, 40],
      [68, 56, 56, 60, 52, 44, 48, 36],
      [72, 60, 60, 52, 56, 48, 52, 40],
    ] as cols}
      <div class="flex gap-4 px-5 py-3 border-b" style="border-color: var(--card-border);">
        {#each cols as w}
          <div class="h-3 rounded animate-pulse" style="width:{w}px; background: var(--table-header-bg);"></div>
        {/each}
      </div>
    {/each}
  </div>
</div>
