<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chart, type TooltipModel, type ChartType } from '$lib/charts/chart';

  type ChartPoint = {
    dateLabel: string;
    rate: number;
    spreadUpper?: number;
    spreadLower?: number;
    spread_range?: number;
    provider_count?: number;
    excluded_count?: number;
    high_provider?: string;
    low_provider?: string;
    calculation_method?: string;
    [key: string]: number | string | undefined;
  };

  let {
    data,
    series,
    symbol = '',
  }: {
    data: ChartPoint[];
    series: { key: string; label: string; color: string; fill: boolean; dashed?: boolean }[];
    symbol?: string;
  } = $props();

  let canvas: HTMLCanvasElement = $state()!;
  let tooltipEl: HTMLDivElement = $state()!;
  let containerEl: HTMLDivElement = $state()!;
  let chart: Chart | null = null;

  // The site has no manual theme toggle — dark mode follows the OS preference.
  let darkMode = $state(false);
  let mql: MediaQueryList | null = null;
  function handleSchemeChange(e: MediaQueryListEvent) {
    darkMode = e.matches;
  }

  function fmt(n: number): string {
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatMethod(m: string): string {
    return m.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim();
  }

  function buildGradient(ctx: CanvasRenderingContext2D, color: string): CanvasGradient {
    const g = ctx.createLinearGradient(0, 0, 0, 300);
    g.addColorStop(0, color + '50');
    g.addColorStop(0.5, color + '20');
    g.addColorStop(1, color + '00');
    return g;
  }

  const crosshairPlugin = {
    id: 'pair-crosshair',
    afterDatasetsDraw(c: Chart) {
      const els = c.tooltip?.getActiveElements();
      if (!els?.length) return;
      const { ctx, chartArea: { top, bottom } } = c;
      const x = els[0].element.x;
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = darkMode ? '#374151' : '#d1d5db';
      ctx.lineWidth = 1;
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.stroke();
      ctx.restore();
    },
  };

  function buildExternalTooltip({ chart: c, tooltip }: { chart: Chart; tooltip: TooltipModel<ChartType> }) {
    if (!tooltipEl || !containerEl) return;
    if ((tooltip as any).opacity === 0) { tooltipEl.style.opacity = '0'; return; }

    const idx: number = (tooltip as any).dataPoints?.[0]?.dataIndex ?? -1;
    if (idx < 0) return;

    const pt = data[idx];
    const date = (tooltip as any).title?.[0] ?? '';
    const rate = pt?.rate ?? 0;
    const spreadRange = pt?.spread_range ?? 0;
    const providerCount = pt?.provider_count ?? 0;
    const excludedCount = pt?.excluded_count ?? 0;
    const highProvider = pt?.high_provider ?? '—';
    const lowProvider = pt?.low_provider ?? '—';
    const method = pt?.calculation_method ? formatMethod(pt.calculation_method) : '—';

    // Find the accent color from first real series
    const accentColor = series[0]?.color ?? '#3861fb';

    tooltipEl.innerHTML = `
      <div style="font-size:11px;font-weight:600;color:var(--text-secondary);margin-bottom:10px;font-family:var(--font-head);">${date}</div>

      <div style="display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:10px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="width:8px;height:8px;border-radius:50%;background:${accentColor};flex-shrink:0;display:inline-block;"></span>
          <span style="font-size:11px;color:var(--text-secondary);">Index Rate</span>
        </div>
        <span style="font-size:14px;font-weight:700;font-family:'JetBrains Mono',monospace;color:${accentColor};">${symbol}${fmt(rate)}</span>
      </div>

      <div style="height:1px;background:var(--card-border);margin-bottom:10px;"></div>

      <div style="display:grid;grid-template-columns:auto auto;gap:4px 20px;">
        <span style="font-size:10px;color:var(--text-muted);">Spread range</span>
        <span style="font-size:10px;font-weight:600;color:var(--text-primary);text-align:right;">${symbol}${fmt(spreadRange)}</span>

        <span style="font-size:10px;color:var(--text-muted);">Providers</span>
        <span style="font-size:10px;font-weight:600;color:var(--text-primary);text-align:right;">${providerCount} active${excludedCount > 0 ? ` · <span style="color:#f59e0b;">${excludedCount} excl.</span>` : ''}</span>

        <span style="font-size:10px;color:var(--text-muted);">Highest rate</span>
        <span style="font-size:10px;font-weight:600;color:#22c55e;text-align:right;">${highProvider}</span>

        <span style="font-size:10px;color:var(--text-muted);">Lowest rate</span>
        <span style="font-size:10px;font-weight:600;color:#ef4444;text-align:right;">${lowProvider}</span>

        <span style="font-size:10px;color:var(--text-muted);">Method</span>
        <span style="font-size:10px;font-weight:600;color:var(--text-secondary);text-align:right;">${method}</span>
      </div>
    `;

    const canvasRect = c.canvas.getBoundingClientRect();
    const ctrRect = containerEl.getBoundingClientRect();
    const tipW = tooltipEl.offsetWidth || 240;
    const tipH = tooltipEl.offsetHeight || 140;
    const caretX = (tooltip as any).caretX as number;
    const caretY = (tooltip as any).caretY as number;

    const offsetX = canvasRect.left - ctrRect.left;
    const offsetY = canvasRect.top - ctrRect.top;

    let left = offsetX + caretX + 14;
    if (left + tipW + 16 > ctrRect.width) left = offsetX + caretX - tipW - 14;
    let top = offsetY + caretY - tipH / 2;
    top = Math.max(8, Math.min(top, ctrRect.height - tipH - 8));

    tooltipEl.style.left = `${left}px`;
    tooltipEl.style.top = `${top}px`;
    tooltipEl.style.opacity = '1';
  }

  function buildChart() {
    if (chart) chart.destroy();
    const ctx = canvas.getContext('2d')!;
    const dark = darkMode;
    const gridColor = dark ? '#ffffff06' : '#00000006';
    const tickColor = dark ? '#4b5563' : '#9ca3af';
    const accentColor = series[0]?.color ?? '#3861fb';

    const hasSpread = data.some((d) => d.spreadUpper != null);

    const spreadBandTop = hasSpread ? {
      label: '__band_top',
      data: data.map((d) => d.spreadUpper ?? d.rate ?? 0),
      borderColor: accentColor + '25',
      borderWidth: 1,
      borderDash: [3, 4],
      pointRadius: 0,
      fill: '+1',
      backgroundColor: accentColor + '0e',
      tension: 0.4,
      spanGaps: true,
    } : null;

    const spreadBandBottom = hasSpread ? {
      label: '__band_bottom',
      data: data.map((d) => d.spreadLower ?? d.rate ?? 0),
      borderColor: accentColor + '25',
      borderWidth: 1,
      borderDash: [3, 4],
      pointRadius: 0,
      fill: false,
      backgroundColor: 'transparent',
      tension: 0.4,
      spanGaps: true,
    } : null;

    const seriesDatasets = series.map((s) => ({
      label: s.label,
      data: data.map((d) => (d[s.key] as number) ?? 0),
      borderColor: s.color,
      borderWidth: 2.5,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: s.color,
      pointHoverBorderColor: dark ? '#111827' : '#ffffff',
      pointHoverBorderWidth: 2,
      fill: s.fill ? 'origin' : false,
      backgroundColor: s.fill ? buildGradient(ctx, s.color) : 'transparent',
      borderDash: s.dashed ? [5, 4] : [],
      tension: 0.4,
    }));

    const datasets = [
      ...(spreadBandTop ? [spreadBandTop] : []),
      ...(spreadBandBottom ? [spreadBandBottom] : []),
      ...seriesDatasets,
    ];

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((d) => d.dateLabel as string),
        datasets: datasets as any,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        animation: { duration: 350, easing: 'easeInOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false, external: buildExternalTooltip as any },
        },
        scales: {
          x: {
            grid: { color: gridColor, drawTicks: false },
            ticks: { color: tickColor, font: { size: 10 }, maxRotation: 0, maxTicksLimit: 8 },
            border: { display: false },
          },
          y: {
            grid: { color: gridColor, drawTicks: false },
            ticks: {
              color: tickColor,
              font: { family: "'JetBrains Mono', monospace", size: 10 },
              callback: (v) => symbol + Number(v).toLocaleString(),
            },
            border: { display: false },
          },
        },
      },
      plugins: [crosshairPlugin],
    });
  }

  onMount(() => {
    mql = window.matchMedia('(prefers-color-scheme: dark)');
    darkMode = mql.matches;
    mql.addEventListener('change', handleSchemeChange);
    buildChart();
  });
  onDestroy(() => {
    chart?.destroy();
    mql?.removeEventListener('change', handleSchemeChange);
  });

  $effect(() => {
    const _d = data;
    const _s = series;
    const _dark = darkMode;
    if (canvas && chart) buildChart();
  });
</script>

<div
  class="py-2"
  style="position: relative; overflow: hidden;"
  bind:this={containerEl}
>
  <!-- Header -->
  <div class="flex items-center justify-between mb-5 flex-wrap gap-2">
    <h3
      class="text-[14px] font-semibold"
      style="font-family: var(--font-head); color: var(--text-primary);"
    >
      Rate Chart
    </h3>
    <div class="flex items-center gap-4 flex-wrap">
      {#each series as s}
        <div class="flex items-center gap-1.5">
          <div style="width:20px; height:2.5px; background:{s.color}; border-radius:2px; flex-shrink:0;"></div>
          <span class="text-[11px]" style="color: var(--text-secondary);">{s.label}</span>
        </div>
      {/each}
      {#if data.some((d) => d.spreadUpper != null)}
        <div class="flex items-center gap-1.5">
          <div style="display:flex;align-items:center;gap:2px;">
            <div style="width:6px; height:6px; border-radius:50%; background:{series[0]?.color ?? '#3861fb'}40; border:1px dashed {series[0]?.color ?? '#3861fb'}60;"></div>
          </div>
          <span class="text-[11px]" style="color: var(--text-muted);">Spread band</span>
        </div>
      {/if}
    </div>
  </div>

  <div style="position: relative; height: 300px;">
    <canvas bind:this={canvas}></canvas>

    <div
      bind:this={tooltipEl}
      style="
        position: absolute;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.12s ease;
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: 12px;
        padding: 14px 16px;
        box-shadow: 0 8px 28px rgba(0,0,0,0.22);
        white-space: nowrap;
        z-index: 10;
        min-width: 200px;
      "
    ></div>
  </div>
</div>
