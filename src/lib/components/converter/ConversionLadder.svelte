<script lang="ts">
	import { ladderRows, reverseLadderRows, ladderDecimals } from '$lib/utils/amountLadder';
	import { conversionPath } from '$lib/utils/conversionSlug';

	/**
	 * The conversion table, with every row a link.
	 *
	 * This is the page's SEO engine, and it does two jobs at once. It puts the
	 * answer to "how much is 500 dollars in naira" in the HTML — a question a
	 * converter input can never rank for, because the answer only exists once
	 * somebody types. And each row links to that amount's own URL, which is how the
	 * amount pages get discovered at all.
	 *
	 * The amounts are `LADDER_AMOUNTS`, which is also the set `converterSeo` treats
	 * as indexable, so this table never links to a page we ask Google to drop.
	 *
	 * Distinct from `pair-content/AmountLadder.svelte`, which renders the same
	 * figures unlinked on the Markets pages — linking there would point at a
	 * different section of the site than the one the visitor is reading.
	 */

	let {
		from,
		to,
		fromSymbol,
		toSymbol,
		rate,
		note = ''
	}: {
		/** Uppercase codes. */
		from: string;
		to: string;
		fromSymbol: string;
		toSymbol: string;
		/** 1 `from` = `rate` `to`. */
		rate: number;
		note?: string;
	} = $props();

	const forward = $derived(ladderRows(rate));
	const reverse = $derived(reverseLadderRows(rate));

	// One precision per column so the decimal points line up down the table.
	const forwardDecimals = $derived(ladderDecimals(forward.map((r) => r.converted)));
	const reverseDecimals = $derived(ladderDecimals(reverse.map((r) => r.converted)));

	const tables = $derived([
		{
			rows: forward,
			from,
			to,
			fromSymbol,
			toSymbol,
			decimals: forwardDecimals
		},
		{
			rows: reverse,
			from: to,
			to: from,
			fromSymbol: toSymbol,
			toSymbol: fromSymbol,
			decimals: reverseDecimals
		}
	]);

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
		<div class="px-5 py-3.5 border-b" style="border-color: var(--card-border);">
			<h2 class="text-[15px] font-semibold" style="color: var(--text-primary);">
				{from} to {to} conversion table
			</h2>
			<p class="text-[12px] mt-0.5" style="color: var(--text-secondary);">
				Common amounts at the current rate. Select any row to open that conversion.
			</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2">
			{#each tables as table (table.from)}
				<div class="px-5 py-4 sm:[&:nth-child(2)]:border-l" style="border-color: var(--card-border);">
					<h3
						class="text-[10px] font-semibold uppercase tracking-wider mb-2"
						style="color: var(--text-secondary);"
					>
						{table.from} to {table.to}
					</h3>
					<table class="w-full" style="border-collapse: collapse;">
						<tbody>
							{#each table.rows as row (row.amount)}
								<tr>
									<td style="border-bottom: 1px solid var(--card-border);">
										<a
											href={conversionPath(
												row.amount,
												table.from.toLowerCase(),
												table.to.toLowerCase()
											)}
											class="block py-1.5 text-[13px] tabular-nums no-underline"
											style="color: var(--text-secondary); font-family: var(--font-mono);"
										>
											{table.fromSymbol}{whole(row.amount)}
										</a>
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
