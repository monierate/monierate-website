<script lang="ts">
	import { ladderRows, reverseLadderRows, ladderDecimals } from '$lib/utils/amountLadder';

	let {
		base,
		quote,
		baseSymbol,
		quoteSymbol,
		rate,
		scopeLabel = null,
		note = ''
	}: {
		/** Uppercase codes, e.g. USD / NGN. */
		base: string;
		quote: string;
		baseSymbol: string;
		quoteSymbol: string;
		/** Mid rate: 1 base = `rate` quote. */
		rate: number;
		/** Provider name on a pair×provider page; null on the composite pair page. */
		scopeLabel?: string | null;
		/** Standing disclosure, footed under the tables. */
		note?: string;
	} = $props();

	const forward = $derived(ladderRows(rate));
	const reverse = $derived(reverseLadderRows(rate));

	// Resolved once per column so the decimal points line up down the table.
	const forwardDecimals = $derived(ladderDecimals(forward.map((r) => r.converted)));
	const reverseDecimals = $derived(ladderDecimals(reverse.map((r) => r.converted)));

	const money = (symbol: string, value: number, decimals: number) =>
		`${symbol}${value.toLocaleString('en-US', {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals
		})}`;

	const whole = (value: number) => value.toLocaleString('en-US');
</script>

{#if forward.length}
	<section
		class="rounded-xl border overflow-hidden"
		style="background: var(--page-bg); border-color: var(--card-border);"
	>
		<div class="px-5 py-3 border-b" style="border-color: var(--card-border);">
			<h2 class="text-[14px] font-semibold" style="color: var(--text-primary);">
				{base} to {quote} conversion table
			</h2>
			<p class="text-[11px] mt-0.5" style="color: var(--text-secondary);">
				Common amounts at the current {scopeLabel ? `${scopeLabel} ` : ''}rate of {money(
					quoteSymbol,
					rate,
					2
				)} per {base}.
			</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2">
			{#each [{ rows: forward, from: base, to: quote, fromSymbol: baseSymbol, toSymbol: quoteSymbol, decimals: forwardDecimals }, { rows: reverse, from: quote, to: base, fromSymbol: quoteSymbol, toSymbol: baseSymbol, decimals: reverseDecimals }] as table, tableIndex}
				<div
					class="px-5 py-4 {tableIndex === 1 ? 'sm:border-l' : ''}"
					style="border-color: var(--card-border);"
				>
					<h3
						class="text-[10px] font-semibold uppercase tracking-wider mb-2"
						style="color: var(--text-secondary);"
					>
						{table.from} to {table.to}
					</h3>
					<table class="w-full" style="border-collapse: collapse;">
						<tbody>
							{#each table.rows as row}
								<tr>
									<td
										class="py-1.5 text-[13px] tabular-nums"
										style="color: var(--text-secondary); font-family: var(--font-mono); border-bottom: 1px solid var(--card-border);"
									>
										{table.fromSymbol}{whole(row.amount)}
									</td>
									<td
										class="py-1.5 text-[13px] text-right tabular-nums font-semibold"
										style="color: var(--text-primary); font-family: var(--font-mono); border-bottom: 1px solid var(--card-border);"
									>
										{money(table.toSymbol, row.converted, table.decimals)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/each}
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
