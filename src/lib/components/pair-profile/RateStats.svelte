<script lang="ts">
	import { fmt } from '$lib/utils/format';

	interface CurrentRate {
		rate_mid?: number;
		spread?: number;
	}

	let { currentRate, base, quote, symbol, high, low, rangeLabel }: {
		currentRate: CurrentRate;
		base: string;
		quote: string;
		symbol: string;
		high?: number;
		low?: number;
		rangeLabel?: string;
	} = $props();

	const statCards = $derived([
		{
			label: 'Composite Rate',
			value: currentRate.rate_mid,
			valueColor: 'var(--text-primary)',
			sub: `${quote} per ${base}`,
			accent: '#3861fb',
			icon: `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`
		},
		{
			label: 'Provider Spread',
			value: Math.abs(currentRate.spread ?? 0),
			valueColor: 'var(--text-primary)',
			sub: 'avg. quote dispersion',
			accent: '#a855f7',
			icon: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`
		},
		...(high != null && low != null
			? [
					{
						label: `${rangeLabel ?? ''} High`.trim(),
						value: high,
						valueColor: 'var(--text-primary)',
						sub: 'range peak',
						accent: '#0ea5e9',
						icon: `<polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/>`
					},
					{
						label: `${rangeLabel ?? ''} Low`.trim(),
						value: low,
						valueColor: 'var(--text-primary)',
						sub: 'range trough',
						accent: '#f97316',
						icon: `<polyline points="3 7 9 13 13 9 21 17"/><polyline points="14 17 21 17 21 10"/>`
					}
				]
			: [])
	]);
</script>

<div
	class="grid grid-cols-2 gap-2 sm:gap-3 {high != null && low != null ? 'lg:grid-cols-4' : ''}"
>
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
				{stat.value ? symbol + fmt(stat.value) : '—'}
			</div>
			<div class="text-[10px] sm:text-[11px] mt-1" style="color: var(--text-muted);">{stat.sub}</div>
		</div>
	{/each}
</div>
