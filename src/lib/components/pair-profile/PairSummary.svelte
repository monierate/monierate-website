<script lang="ts">
	import { fmt } from '$lib/utils/format';
	import { slide } from 'svelte/transition';
	import currencies from '$data/currencies.json';
	import { isDollarBase, DIGITAL_DOLLAR_NOTE, FEES_NOTE } from '$lib/constants/disclosure';

	interface CurrentRate {
		rate_mid?: number;
		spread?: number;
	}

	let { base, quote, symbol, currentRate, rateMonthAgo = 0 }: {
		/** Uppercase currency codes, e.g. USDT / NGN. */
		base: string;
		quote: string;
		/** Quote symbol, e.g. ₦. */
		symbol: string;
		currentRate: CurrentRate | null;
		/** Close from the oldest loaded snapshot; 0 when there is no history. */
		rateMonthAgo?: number;
	} = $props();

	// Full display names ("Nigerian Naira") keyed by uppercase code; falls back to
	// the code itself for anything not in the dataset.
	const NAMES: Record<string, string> = { ...currencies.fiat, ...currencies.coins };
	const baseName = $derived(NAMES[base] ?? base);
	const quoteName = $derived(NAMES[quote] ?? quote);

	const mid = $derived(currentRate?.rate_mid ?? 0);
	const spreadRange = $derived(Math.abs(currentRate?.spread ?? 0));

	const changePct = $derived(rateMonthAgo > 0 ? ((mid - rateMonthAgo) / rateMonthAgo) * 100 : 0);
	const moved = $derived(changePct >= 0 ? 'up' : 'down');

	// Round 100 units of base — more tangible than the unit rate.
	const per100 = $derived(mid * 100);

	let readMore = $state(false);
</script>

{#if mid > 0}
	<div class="font-normal space-y-2 text-[14px]" style="color: var(--text-secondary);">
		<p>
			Monierate's composite index is pricing {base}/{quote} at about {symbol}{fmt(mid)}
			per {base}{#if rateMonthAgo > 0}, {moved} {Math.abs(changePct).toFixed(2)}% from {symbol}{fmt(
					rateMonthAgo
				)} a month ago{/if}.
			{#if !readMore}
				<button
					class="cursor-pointer font-medium hover:underline"
					style="color: var(--accent);"
					onclick={() => (readMore = true)}>Read More</button
				>
			{/if}
		</p>

		{#if readMore}
			<div class="space-y-2" transition:slide={{ duration: 250 }}>
				<p>
					The composite rate is the average of every live quote Monierate tracks for {base}/{quote},
					so it moves with the market rather than any single provider.
				</p>
				<p>
					{#if spreadRange > 0}
						The {symbol}{fmt(spreadRange)} spread range shown above is how far providers' quotes
						diverged from each other over the selected window.
					{/if}
					At the current mid rate, {base}100 is worth roughly {symbol}{fmt(per100)}.
				</p>
				<p>
					Rates update continuously and are indicative only — the figure you're quoted at checkout
					depends on your payment method, limits, trade size, and which provider you use. Use the
					chart and the daily OHLC table below to see how the {base}/{quote} composite rate has
					moved over time, or compare individual providers on the {baseName} to {quoteName} pair page.
				</p>
				<p>
					{#if isDollarBase(base)}{DIGITAL_DOLLAR_NOTE}{/if}
					{FEES_NOTE}
				</p>
				<button
					class="cursor-pointer hover:underline"
					style="color: var(--text-muted);"
					onclick={() => (readMore = false)}>Read Less</button
				>
			</div>
		{/if}
	</div>
{/if}
