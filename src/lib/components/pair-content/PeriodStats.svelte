<script lang="ts">
	import { fmt } from '$lib/utils/format';
	import type { PeriodStat } from '$lib/utils/rateStats';

	let {
		stats,
		base,
		quote,
		symbol,
		sentence = null,
		scopeLabel = null,
		note = ''
	}: {
		stats: PeriodStat[];
		base: string;
		quote: string;
		symbol: string;
		/** Prose restatement of the 30-day row — the part that lands in answer boxes. */
		sentence?: string | null;
		/** Provider name on a pair×provider page; null on the composite pair page. */
		scopeLabel?: string | null;
		/** Standing disclosure, footed under the table. */
		note?: string;
	} = $props();

	const heading = $derived(
		scopeLabel ? `${base}/${quote} statistics on ${scopeLabel}` : `${base}/${quote} statistics`
	);
</script>

{#if stats.length}
	<section
		class="rounded-xl border overflow-hidden"
		style="background: var(--page-bg); border-color: var(--card-border);"
	>
		<div class="px-5 py-3 border-b" style="border-color: var(--card-border);">
			<h2 class="text-[14px] font-semibold" style="color: var(--text-primary);">{heading}</h2>
		</div>

		{#if sentence}
			<p class="px-5 pt-4 text-[14px] leading-relaxed" style="color: var(--text-secondary);">
				{sentence}
			</p>
		{/if}

		<div class="overflow-x-auto px-5 py-4">
			<table class="w-full" style="border-collapse: collapse; min-width: 460px;">
				<thead>
					<tr>
						{#each ['Period', 'High', 'Low', 'Average', 'Change'] as label, i}
							<th
								class="text-[10px] font-semibold uppercase tracking-wider pb-2 {i === 0
									? 'text-left'
									: 'text-right'}"
								style="color: var(--text-secondary); border-bottom: 1px solid var(--card-border);"
								>{label}</th
							>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each stats as stat}
						<tr>
							<td
								class="py-2.5 text-[13px] font-semibold"
								style="color: var(--text-primary); border-bottom: 1px solid var(--card-border);"
							>
								{stat.label}
							</td>
							{#each [stat.high, stat.low, stat.average] as value}
								<td
									class="py-2.5 text-[13px] text-right tabular-nums"
									style="color: var(--text-primary); font-family: var(--font-mono); border-bottom: 1px solid var(--card-border);"
								>
									{symbol}{fmt(value)}
								</td>
							{/each}
							<td
								class="py-2.5 text-[13px] text-right tabular-nums font-semibold"
								style="color: {stat.changePct >= 0
									? 'var(--positive)'
									: 'var(--negative)'}; font-family: var(--font-mono); border-bottom: 1px solid var(--card-border);"
							>
								{stat.changePct >= 0 ? '+' : '−'}{Math.abs(stat.changePct).toFixed(2)}%
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		{#if note}
			<p
				class="px-5 py-3 text-[11px] leading-relaxed border-t"
				style="color: var(--text-muted); border-color: var(--card-border);"
			>
				{note}
			</p>
		{/if}
	</section>
{/if}
