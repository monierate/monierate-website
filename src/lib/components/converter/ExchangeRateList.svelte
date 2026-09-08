<script lang="ts">
	import ProviderLogo from '$lib/components/ui/ProviderLogo.svelte';
	import { conversionDecimals } from '$lib/utils/converterContent';
	import { timeAgo } from '$lib/utils/format';
	import { bestQuote, type ExchangeQuote } from '$lib/utils/converterQuotes';

	/**
	 * What each exchange would actually pay you.
	 *
	 * This is the section that makes the page worth visiting twice. XE answers
	 * "what is 100 USD worth"; the number a visitor can act on is "what will I
	 * receive", and that differs by hundreds of naira between the platforms in this
	 * table. So the payout column leads and the rate is secondary — the rate is how
	 * the payout is computed, not the thing being decided.
	 *
	 * Rows arrive pre-sorted best-first from `buildExchangeQuotes`, which also
	 * handles the buy/sell side so the ordering is correct in both directions.
	 */

	let {
		quotes,
		amount,
		from,
		to,
		toSymbol,
		pairCode,
		limit = 8
	}: {
		quotes: ExchangeQuote[];
		amount: number;
		from: string;
		to: string;
		toSymbol: string;
		/** Pair slug for the onward `/markets` links. */
		pairCode: string;
		limit?: number;
	} = $props();

	let expanded = $state(false);

	const visible = $derived(expanded ? quotes : quotes.slice(0, limit));

	const money = (value: number, decimals = conversionDecimals(value)) =>
		`${toSymbol}${value.toLocaleString('en-US', {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals
		})}`;

	const amountLabel = $derived(amount.toLocaleString('en-US'));

	// Everything is measured against the best available payout, which is the
	// comparison a visitor is actually making — "how much am I leaving on the table
	// by using this one?" — rather than against the aggregate headline.
	//
	// Asked for explicitly rather than read off row 0: index contributors are ranked
	// first, so the top row is the best *trusted* quote and not necessarily the
	// highest number in the table.
	const best = $derived(bestQuote(quotes)?.received ?? 0);

	// Drives the subtitle: with no contributors on this pair the order really is
	// plain best-first, and saying otherwise would be describing a tier that is not there.
	const hasContributors = $derived(quotes.some((q) => q.isContributor));

	// One precision for the whole column, taken from the payouts rather than each
	// row's own difference — otherwise a −₦500 and a −₦0.02 print with different
	// decimal counts and the column stops being scannable. Same rule the ladder uses.
	const deltaDecimals = $derived(conversionDecimals(best));

	/** Sign outside the symbol: `−₦500.00`, never `₦-500.00`. */
	const signed = (value: number) =>
		`${value < 0 ? '−' : '+'}${money(Math.abs(value), deltaDecimals)}`;
</script>

{#if quotes.length}
	<section
		class="rounded-xl border overflow-hidden"
		style="background: var(--page-bg); border-color: var(--card-border);"
	>
		<div class="px-5 py-3.5 border-b" style="border-color: var(--card-border);">
			<h2 class="text-[15px] font-semibold" style="color: var(--text-primary);">
				What you get for {amountLabel}
				{from} on each exchange
			</h2>
			<p class="text-[12px] mt-0.5" style="color: var(--text-secondary);">
				{quotes.length}
				{quotes.length === 1 ? 'platform quotes' : 'platforms quote'}
				{from}/{to}.
				{#if hasContributors}
					Verified rate contributors first, then the rest by what you receive.
				{:else}
					Sorted by what you receive, best first.
				{/if}
			</p>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full" style="border-collapse: collapse; min-width: 520px;">
				<thead>
					<tr>
						<th
							class="text-left px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider"
							style="color: var(--text-muted); border-bottom: 1px solid var(--card-border);"
							>Exchange</th
						>
						<th
							class="text-right px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider"
							style="color: var(--text-muted); border-bottom: 1px solid var(--card-border);"
							>Rate</th
						>
						<th
							class="text-right px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider"
							style="color: var(--text-muted); border-bottom: 1px solid var(--card-border);"
							>You get</th
						>
						<th
							class="text-right px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider"
							style="color: var(--text-muted); border-bottom: 1px solid var(--card-border);"
							>vs best</th
						>
					</tr>
				</thead>
				<tbody>
					{#each visible as quote, index (quote.code)}
						{@const shortfall = quote.received - best}
						<tr style="border-bottom: 1px solid var(--card-border);">
							<td class="px-5 py-3">
								<a
									href="/markets/{pairCode}/{quote.code}"
									class="flex items-center gap-2.5 no-underline"
									style="color: var(--text-primary);"
								>
									<ProviderLogo logo={quote.logo} name={quote.name} size={26} />
									<span class="min-w-0">
										<span class="block text-[13.5px] font-semibold truncate">{quote.name}</span>
										{#if quote.updatedAt}
											<span class="block text-[10.5px]" style="color: var(--text-muted);"
												>{timeAgo(Date.parse(quote.updatedAt))}</span
											>
										{/if}
									</span>
									</a>
							</td>
							<td
								class="px-3 py-3 text-right text-[13px] tabular-nums"
								style="color: var(--text-secondary); font-family: var(--font-mono);"
							>
								{money(quote.rate)}
							</td>
							<td
								class="px-3 py-3 text-right text-[13.5px] font-semibold tabular-nums"
								style="color: var(--text-primary); font-family: var(--font-mono);"
							>
								{money(quote.received)}
							</td>
							<td
								class="px-5 py-3 text-right text-[12px] tabular-nums"
								style="font-family: var(--font-mono); color: {shortfall < 0
									? 'var(--negative)'
									: 'var(--text-muted)'};"
							>
								{#if shortfall === 0}
									—
								{:else}
									{signed(shortfall)}
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if quotes.length > limit}
			<button
				type="button"
				onclick={() => (expanded = !expanded)}
				class="w-full px-5 py-3 text-[12.5px] font-semibold bg-transparent transition-colors"
				style="color: var(--accent); border-top: 1px solid var(--card-border);"
			>
				{expanded ? 'Show fewer' : `Show all ${quotes.length} exchanges`}
			</button>
		{/if}
	</section>
{/if}
