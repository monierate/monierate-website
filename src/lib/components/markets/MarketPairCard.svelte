<script lang="ts">
	import { formatRate } from '$lib/utils/rateFormat';
	import { currencyName, displayCode, pairLabel, type MarketCard } from '$lib/utils/marketPairs';

	let { card }: { card: MarketCard } = $props();

	const tone = $derived(
		card.change24h === null || card.change24h === 0
			? 'var(--text-secondary)'
			: card.change24h > 0
				? 'var(--positive)'
				: 'var(--negative)'
	);
	const change = $derived(
		card.change24h === null ? '—' : `${card.change24h > 0 ? '+' : ''}${card.change24h.toFixed(2)}%`
	);
</script>

<!-- One size (16px) for the pair, the rate and the change, so the card reads as
     one quiet block rather than a stack of competing weights. -->
<a
	href="/markets/{card.code}"
	class="flex h-full flex-col rounded-2xl border p-5 transition-colors hover:bg-[var(--table-hover)]"
	style="background: var(--card-bg); border-color: var(--card-border);"
>
	<div class="flex min-w-0 items-center gap-3">
		<span
			class="relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-[11px] font-bold"
			style="background: var(--badge-neutral-bg); color: var(--text-secondary);"
			aria-hidden="true"
		>
			{displayCode(card.base).slice(0, 3)}
			<img
				src="/icons/currencies/{card.base.toLowerCase()}.png"
				alt=""
				loading="lazy"
				onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
				class="absolute inset-0 h-full w-full object-cover"
			/>
		</span>
		<div class="min-w-0">
			<div class="text-[16px] font-semibold leading-snug" style="color: var(--text-primary);">
				{pairLabel(card)}
			</div>
			<div class="truncate text-[14px] leading-snug" style="color: var(--text-muted);">
				{currencyName(card.base)} / {currencyName(card.quote)}
			</div>
		</div>
	</div>

	<div class="mt-6 text-[16px] font-medium tabular-nums" style="color: var(--text-primary);">
		{formatRate(card.rate)}<span class="ml-1 text-[11px] font-medium tracking-wide" style="color: var(--text-secondary);"
			>{displayCode(card.quote)}</span
		>
	</div>

	<div class="mt-1.5 flex items-baseline justify-between gap-2">
		<span
			class="text-[16px] font-medium tabular-nums"
			style="color: {tone};"
			title={card.change24h === null ? 'No rate from 24 hours ago yet' : '24-hour change'}
		>
			{change}
		</span>
		<span class="shrink-0 text-[13px]" style="color: var(--text-muted);">
			{card.providers} {card.providers === 1 ? 'provider' : 'providers'}
		</span>
	</div>
</a>
