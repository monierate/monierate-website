<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chart, type TooltipModel, type ChartType } from '$lib/charts/chart';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';

  let {
    data,
    avg,
    range
  }: {
    data: { date: string; msi: number; avg: number }[];
    avg: number;
    range: string;
  } = $props();

  const PRIMARY = '#3861fb';
  const AVG_COLOR = '#f59e0b';

  let canvas: HTMLCanvasElement = $state()!;
  let tooltipEl: HTMLDivElement = $state()!;
  let containerEl: HTMLDivElement = $state()!;
  let chart: Chart | null = null;

  let darkMode = $state(false);
  let mql: MediaQueryList | null = null;
  function handleSchemeChange(e: MediaQueryListEvent) {
    darkMode = e.matches;
  }

  function fmtLabel(s: string): string {
    try {
      // 7d uses hourly buckets; everything else daily/weekly.
      const opts: Intl.DateTimeFormatOptions =
        range === '7d' ? { month: 'short', day: 'numeric', hour: 'numeric' } : { month: 'short', day: 'numeric' };
      return new Date(s).toLocaleDateString('en-US', opts);
    } catch {
      return s;
    }
  }

  function buildGradient(ctx: CanvasRenderingContext2D, h: number): CanvasGradient {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, PRIMARY + 'bb');
    g.addColorStop(0.3, PRIMARY + '55');
    g.addColorStop(1, PRIMARY + '00');
    return g;
  }

  function externalTooltip({ chart: c, tooltip }: { chart: Chart; tooltip: TooltipModel<ChartType> }) {
    if (!tooltipEl || !containerEl) return;
    if ((tooltip as any).opacity === 0) {
      tooltipEl.style.opacity = '0';
      return;
    }

    const i = (tooltip as any).dataPoints?.[0]?.dataIndex ?? 0;
    const title = (tooltip as any).title?.[0] ?? '';
    const msi = Number((tooltip as any).dataPoints?.[0]?.raw ?? 0);

    tooltipEl.innerHTML = `
      <div style="font-size:11px;font-weight:600;margin-bottom:8px;color:var(--text-secondary);font-family:var(--font-head);">${title}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:20px;">
        <span style="font-size:11px;color:var(--text-secondary);">MSI</span>
        <span style="font-size:13px;font-weight:700;font-family:var(--font-mono);color:${PRIMARY};">${msi.toFixed(2)}%</span>
      </div>`;

    const canvasRect = c.canvas.getBoundingClientRect();
    const ctrRect = containerEl.getBoundingClientRect();
    const tipW = tooltipEl.offsetWidth || 150;
    const caretX = (tooltip as any).caretX as number;
    const caretY = (tooltip as any).caretY as number;
    const offsetX = canvasRect.left - ctrRect.left;
    const offsetY = canvasRect.top - ctrRect.top;
    let left = offsetX + caretX + 14;
    if (left + tipW + 16 > ctrRect.width) left = offsetX + caretX - tipW - 14;
    tooltipEl.style.left = `${left}px`;
    tooltipEl.style.top = `${Math.max(8, offsetY + caretY - 30)}px`;
    tooltipEl.style.opacity = '1';
  }

  function buildChart() {
    if (chart) chart.destroy();
    const ctx = canvas.getContext('2d')!;
    const dark = darkMode;
    const gridColor = dark ? '#1f293720' : '#f3f4f6';
    const tickColor = dark ? '#4b5563' : '#9ca3af';
    const chartH = canvas.parentElement?.clientHeight ?? 170;

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((d) => fmtLabel(d.date)),
        datasets: [
          {
            label: 'MSI',
            data: data.map((d) => d.msi),
            borderColor: PRIMARY,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: 'origin',
            backgroundColor: buildGradient(ctx, chartH),
            tension: 0.4
          },
          {
            label: 'Average',
            data: data.map(() => avg),
            borderColor: AVG_COLOR,
            borderWidth: 1.5,
            borderDash: [5, 4],
            pointRadius: 0,
            pointHoverRadius: 0,
            fill: false,
            tension: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        animation: { duration: 600, easing: 'easeInOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false, external: externalTooltip as any }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: tickColor, font: { size: 10 }, maxRotation: 0, maxTicksLimit: 7 },
            border: { display: false }
          },
          y: {
            grid: { color: gridColor, drawTicks: false },
            ticks: {
              color: tickColor,
              font: { family: "'JetBrains Mono', monospace", size: 10 },
              maxTicksLimit: 4,
              callback: (v) => `${v}%`
            },
            border: { display: false }
          }
        }
      }
    });
  }

  onMount(() => {
    mql = window.matchMedia('(prefers-color-scheme: dark)');
    darkMode = mql.matches;
    mql.addEventListener('change', handleSchemeChange);
    buildChart();
  });
  onDestroy(() => {
    mql?.removeEventListener('change', handleSchemeChange);
    chart?.destroy();
  });

  $effect(() => {
    const _d = data;
    const _a = avg;
    const _dark = darkMode;
    if (canvas && chart) buildChart();
  });
</script>

<div class="rounded-2xl px-6 pt-5 pb-3" style="background: var(--card-bg); border: 1px solid var(--card-border); position: relative;" bind:this={containerEl}>
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-[14px] font-semibold" style="font-family: var(--font-head); color: var(--text-primary);">
      MSI Over Time
    </h3>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-1.5">
        <div style="width:20px; height:2.5px; background:{PRIMARY}; border-radius:2px; box-shadow: 0 0 6px {PRIMARY}88;"></div>
        <span class="text-[11px]" style="color: var(--text-secondary);">MSI</span>
      </div>
      <div class="flex items-center gap-1.5">
        <svg width="22" height="10" style="flex-shrink:0;" fill="none">
          <line x1="0" y1="5" x2="22" y2="5" stroke={AVG_COLOR} stroke-dasharray="5 3.5" stroke-width="1.5" />
        </svg>
        <span class="text-[11px]" style="color: var(--text-secondary);">Average</span>
      </div>
    </div>
  </div>

  {#if data.length === 0}
    <EmptyState title="No history yet" description="MSI history is unavailable for this range." />
  {:else}
    <div style="position: relative; height: 200px;">
      <canvas bind:this={canvas}></canvas>
      <div
        bind:this={tooltipEl}
        style="
          position: absolute; pointer-events: none; opacity: 0;
          transition: opacity 0.12s ease;
          background: var(--card-bg); border: 1px solid var(--card-border);
          border-radius: 12px; padding: 10px 14px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.18); white-space: nowrap; z-index: 10;
        "
      ></div>
    </div>
  {/if}
</div>
