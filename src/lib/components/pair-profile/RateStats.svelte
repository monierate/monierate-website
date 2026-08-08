<script lang="ts">
	import { fmt } from '$lib/utils/format';

	interface CurrentRate {
		rate_mid?: number;
		spread?: number;
	}

	let { currentRate, symbol, high, low, volatility, rangeLabel }: {
		currentRate: CurrentRate;
		symbol: string;
		high: number;
		low: number;
		volatility: number;
		rangeLabel: string;
	} = $props();

	const ICONS = {
		dollar: `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
		trendUp: `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>`,
		trendDown: `<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>`,
		activity: `<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>`,
		zap: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`
	};

	const rate = $derived(currentRate.rate_mid ? symbol + fmt(currentRate.rate_mid) : '—');
	const highDisplay = $derived(high ? symbol + fmt(high) : '—');
	const lowDisplay = $derived(low ? symbol + fmt(low) : '—');
	const spread = $derived(Math.abs(currentRate.spread ?? 0));
	const spreadDisplay = $derived(spread ? symbol + fmt(spread) : '—');

	const statCards = $derived([
		{
			label: 'Composite Rate',
			display: rate,
			valueColor: 'var(--text-primary)',
			sub: 'index average',
			accent: '#3861fb',
			icon: ICONS.dollar
		},
		{
			label: `${rangeLabel.toUpperCase()} High`,
			display: highDisplay,
			valueColor: '#22c55e',
			sub: 'period peak',
			accent: '#22c55e',
			icon: ICONS.trendUp
		},
		{
			label: `${rangeLabel.toUpperCase()} Low`,
			display: lowDisplay,
			valueColor: '#ef4444',
			sub: 'period floor',
			accent: '#ef4444',
			icon: ICONS.trendDown
		},
		{
			label: `${rangeLabel.toUpperCase()} Volatility`,
			display: `${volatility}%`,
			valueColor: 'var(--text-primary)',
			sub: 'high–low range',
			accent: '#f59e0b',
			icon: ICONS.activity
		},
		{
			label: `${rangeLabel.toUpperCase()} Spread`,
			display: spreadDisplay,
			valueColor: 'var(--text-primary)',
			sub: 'high vs low provider',
			accent: '#a855f7',
			icon: ICONS.zap
		}
	]);
</script>

<div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3">
	{#each statCards as stat}
		<div
			class="rounded-xl border"
			style="background: var(--page-bg); border-color: var(--card-border); padding: clamp(10px, 3vw, 16px);"
		>
			<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
				<span
					style="font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:0.07em; color:var(--text-secondary); line-height:1.3;"
				>{stat.label}</span>
				<div
					style="width:22px; height:22px; border-radius:7px; display:flex; align-items:center; justify-content:center; background:{stat.accent}1a; color:{stat.accent}; flex-shrink:0;"
				>
					<svg
						viewBox="0 0 24 24"
						width="11"
						height="11"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>{@html stat.icon}</svg>
				</div>
			</div>
			<div
				class="text-[15px] sm:text-[18px] font-bold leading-none"
				style="font-family: var(--font-mono); color: {stat.valueColor};"
			>
				{stat.display}
			</div>
			<div class="text-[10px] sm:text-[11px] mt-1" style="color: var(--text-muted);">{stat.sub}</div>
		</div>
	{/each}
</div>
