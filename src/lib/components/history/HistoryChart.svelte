<script lang="ts">
	import { onMount, onDestroy, type Snippet } from 'svelte';
	import { Chart, type TooltipModel, type ChartType } from '$lib/charts/chart';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	let {
		data,
		series,
		providerName = '',
		providerCode = '',
		providerIcon = null,
		symbol = '',
		rangeControls
	}: {
		data: { dateLabel: string; open: number; close: number; high: number; low: number }[];
		series: { key: string; label: string; color: string; fill: boolean; dashed?: boolean }[];
		providerName?: string;
		providerCode?: string;
		providerIcon?: string | null;
		symbol?: string;
		rangeControls?: Snippet;
	} = $props();

	let canvas: HTMLCanvasElement = $state()!;
	let tooltipEl: HTMLDivElement = $state()!;
	let containerEl: HTMLDivElement = $state()!;
	let chart: Chart | null = null;
	let iconError = $state(false);

	// The site has no manual theme toggle — dark mode follows the OS
	// preference, so read that directly instead of a global store.
	let isDark = $state(false);
	let mql: MediaQueryList | null = null;
	function handleSchemeChange(e: MediaQueryListEvent) {
		isDark = e.matches;
	}

	function buildGradient(ctx: CanvasRenderingContext2D, color: string): CanvasGradient {
		const g = ctx.createLinearGradient(0, 0, 0, 300);
		g.addColorStop(0, color + '55');
		g.addColorStop(0.45, color + '22');
		g.addColorStop(1, color + '00');
		return g;
	}

	const crosshairPlugin = {
		id: 'history-crosshair',
		afterDatasetsDraw(c: Chart) {
			const els = c.tooltip?.getActiveElements();
			if (!els?.length) return;
			const {
				ctx,
				chartArea: { top, bottom }
			} = c;
			const x = els[0].element.x;
			ctx.save();
			ctx.beginPath();
			ctx.setLineDash([4, 3]);
			ctx.strokeStyle = isDark ? '#374151' : '#d1d5db';
			ctx.lineWidth = 1;
			ctx.moveTo(x, top);
			ctx.lineTo(x, bottom);
			ctx.stroke();
			ctx.restore();
		}
	};

	function fmt(n: number): string {
		return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	}

	function buildExternalTooltip({ chart: c, tooltip }: { chart: Chart; tooltip: TooltipModel<ChartType> }) {
		if (!tooltipEl || !containerEl) return;

		if ((tooltip as any).opacity === 0) {
			tooltipEl.style.opacity = '0';
			return;
		}

		const date = (tooltip as any).title?.[0] ?? '';
		const items: { label: string; color: string; raw: number }[] = ((tooltip as any).dataPoints ?? []).map(
			(p: any) => ({
				label: p.dataset.label as string,
				color: p.dataset.borderColor as string,
				raw: Number(p.raw)
			})
		);

		tooltipEl.innerHTML = `
			<div style="font-size:11px;font-weight:600;margin-bottom:9px;color:var(--text-secondary);font-family:var(--font-head);">${date}</div>
			${items
				.map(
					(it, i) => `
				<div style="display:flex;align-items:center;justify-content:space-between;gap:20px;${i < items.length - 1 ? 'margin-bottom:5px;' : ''}">
					<div style="display:flex;align-items:center;gap:6px;">
						<span style="width:8px;height:8px;border-radius:50%;background:${it.color};flex-shrink:0;display:inline-block;"></span>
						<span style="font-size:11px;color:var(--text-secondary);">${it.label}</span>
					</div>
					<span style="font-size:12px;font-weight:700;font-family:'JetBrains Mono',monospace;color:${it.color};">${symbol}${fmt(it.raw)}</span>
				</div>`
				)
				.join('')}
		`;

		const canvasRect = c.canvas.getBoundingClientRect();
		const ctrRect = containerEl.getBoundingClientRect();
		const tipW = tooltipEl.offsetWidth || 210;
		const tipH = tooltipEl.offsetHeight || 100;
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
		const dark = isDark;
		const gridColor = dark ? '#1f2937' : '#f3f4f6';
		const tickColor = dark ? '#4b5563' : '#9ca3af';

		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: data.map((d) => d.dateLabel),
				datasets: series.map((s) => ({
					label: s.label,
					data: data.map((d) => d[s.key as keyof typeof d] as number),
					borderColor: s.color,
					borderWidth: s.dashed ? 1.5 : 2,
					pointRadius: 0,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: s.color,
					pointHoverBorderColor: dark ? '#111827' : '#ffffff',
					pointHoverBorderWidth: 2,
					fill: s.fill ? 'origin' : false,
					backgroundColor: s.fill ? buildGradient(ctx, s.color) : 'transparent',
					borderDash: s.dashed ? [5, 4] : [],
					tension: 0.4
				}))
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: { mode: 'index', intersect: false },
				animation: { duration: 350, easing: 'easeInOutQuart' },
				plugins: {
					legend: { display: false },
					tooltip: {
						enabled: false,
						external: buildExternalTooltip as any
					}
				},
				scales: {
					x: {
						grid: { color: gridColor, drawTicks: false },
						ticks: {
							color: tickColor,
							font: { size: 10 },
							maxRotation: 0,
							maxTicksLimit: 8
						},
						border: { display: false }
					},
					y: {
						grid: { color: gridColor, drawTicks: false },
						ticks: {
							color: tickColor,
							font: { family: "'JetBrains Mono', monospace", size: 10 },
							callback: (v) => symbol + Number(v).toLocaleString()
						},
						border: { display: false }
					}
				}
			},
			plugins: [crosshairPlugin]
		});
	}

	onMount(() => {
		mql = window.matchMedia('(prefers-color-scheme: dark)');
		isDark = mql.matches;
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
		const _dark = isDark;
		if (canvas && chart) buildChart();
	});
</script>

<div
	class="rounded-b-xl border p-5"
	style="background: var(--page-bg); border-color: var(--card-border); position: relative;"
	bind:this={containerEl}
>
	<!-- Fade overlay: covers the top border+edge with a page-bg gradient so the border dissolves upward -->
	<div
		class="absolute pointer-events-none"
		style="top:-1px; left:-1px; right:-1px; height:24px; z-index:1;
		       background: linear-gradient(to bottom, var(--page-bg) 0%, transparent 100%);"
	></div>
	<!-- Header + provider badge + legend -->
	<div class="flex items-center justify-between mb-5 flex-wrap gap-2">
		<h3 class="text-[14px] font-semibold" style="font-family: var(--font-head); color: var(--text-primary);">
			Rate History (OHLC)
		</h3>

		<div class="flex items-center gap-4 flex-wrap">
			{#if rangeControls}
				{@render rangeControls()}
				<div style="width:1px; height:12px; background: var(--card-border); flex-shrink:0;"></div>
			{/if}

			{#if providerName}
				<a
					href="/markets/providers/{providerCode}"
					class="flex items-center gap-2 hover:underline"
					style="color: inherit; text-decoration: none;"
				>
					{#if providerIcon && !iconError}
						<img
							src={providerIcon}
							alt={providerName}
							style="width:18px; height:18px; border-radius:4px; object-fit:contain;"
							onerror={() => {
								iconError = true;
							}}
						/>
					{:else}
						<div
							style="width:18px; height:18px; border-radius:4px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:6px; font-weight:700; background:var(--table-header-bg); color:var(--text-primary); font-family:var(--font-head);"
						>
							{providerName
								.split(' ')
								.slice(0, 2)
								.map((w) => w[0])
								.join('')
								.toUpperCase()}
						</div>
					{/if}
					<span class="text-[12px] font-medium" style="color: var(--text-secondary); font-family: var(--font-head);"
						>{providerName}</span
					>
				</a>
				<div style="width:1px; height:12px; background: var(--card-border); flex-shrink:0;"></div>
			{/if}

			<!-- Inline legend -->
			{#each series as s}
				<div class="flex items-center gap-1.5">
					{#if s.dashed}
						<svg width="22" height="10" style="flex-shrink:0;" fill="none">
							<line x1="0" y1="5" x2="22" y2="5" stroke={s.color} stroke-dasharray="5 3.5" stroke-width="1.5" />
						</svg>
					{:else}
						<div style="width:20px; height:2.5px; background:{s.color}; border-radius:2px; flex-shrink:0;"></div>
					{/if}
					<span class="text-[11px]" style="color: var(--text-secondary);">{s.label}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Canvas or empty state -->
	{#if data.length === 0}
		<EmptyState title="No chart data" description="No rate data is available for this provider and range." />
	{:else}
		<div style="position: relative; height: 300px;">
			<canvas bind:this={canvas}></canvas>

			<!-- Floating tooltip -->
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
					padding: 12px 16px;
					box-shadow: 0 8px 28px rgba(0,0,0,0.18);
					white-space: nowrap;
					z-index: 10;
				"
			></div>
		</div>
	{/if}
</div>
