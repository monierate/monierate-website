<script lang="ts">
	import { fmt } from '$lib/utils/format';
	import { slide } from 'svelte/transition';
	import currencies from '$data/currencies.json';

	interface CurrentRate {
		rate_buy?: number;
		rate_sell?: number;
		rate_mid?: number;
		spread?: number;
	}

	let { providerName, base, quote, symbol, currentRate, rateMonthAgo = 0 }: {
		providerName: string;
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

	const buy = $derived(currentRate?.rate_buy ?? 0);
	const sell = $derived(currentRate?.rate_sell ?? 0);
	const mid = $derived(currentRate?.rate_mid || buy || sell);
	// Absolute gap — the API reports the signed difference, which goes negative when
	// a provider's sell quote sits above its buy quote.
	const spread = $derived(Math.abs(currentRate?.spread ?? (buy > 0 && sell > 0 ? buy - sell : 0)));

	const changePct = $derived(rateMonthAgo > 0 ? ((mid - rateMonthAgo) / rateMonthAgo) * 100 : 0);
	const moved = $derived(changePct >= 0 ? 'up' : 'down');

	// Round 100 units of base — more tangible than the unit rate.
	const per100 = $derived(mid * 100);

	let readMore = $state(false);
</script>

{#if mid > 0}
	<div class="font-normal space-y-2 text-[14px]" style="color: var(--text-secondary);">
		<p>
			{providerName} is quoting {base}/{quote} at about
			<strong style="color: var(--text-primary);">{symbol}{fmt(mid)}</strong>
			per {base}{#if rateMonthAgo > 0}, {moved} {Math.abs(changePct).toFixed(2)}% from {symbol}{fmt(
					rateMonthAgo
				)} a month ago{/if}.
			{#if buy > 0 && sell > 0}
				Buying costs <strong style="color: var(--text-primary);">{symbol}{fmt(buy)}</strong>, selling
				returns <strong style="color: var(--text-primary);">{symbol}{fmt(sell)}</strong>.
			{/if}
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
					<strong style="color: var(--text-primary);">Buy rate</strong> is what {providerName} charges
					in {quoteName} to give you {baseName}.
					<strong style="color: var(--text-primary);">Sell rate</strong> is what it pays you in {quoteName}
					for your {baseName}.
					{#if spread > 0}
						The {symbol}{fmt(spread)} gap between them is what a round trip costs you, before any fees
						{providerName} charges separately.
					{/if}
					At the current mid rate, {base}100 is worth roughly {symbol}{fmt(per100)}.
				</p>
				<p>
					Rates update continuously and are indicative only — the figure you are quoted at checkout
					depends on your payment method, limits, and trade size. Use the chart and the daily OHLC
					table below to see how {providerName} has priced this pair over time, or compare it against
					every other provider on the {base}/{quote} page.
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
