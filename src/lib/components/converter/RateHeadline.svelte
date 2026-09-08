<script lang="ts">
	import { MARKET_LABEL, type MarketName } from '$lib/services/globalRate.service';
	import { conversionDecimals } from '$lib/utils/converterContent';

	/**
	 * The answer, stated once and labelled.
	 *
	 * Which market the number came from is not decoration: a parallel rate and an
	 * interbank mid rate are different claims about the world, and a visitor comparing
	 * us with Google needs to know which one they are reading. It is said in plain
	 * words — "Mid-market rate at 12:44 UTC" — rather than as a coloured pill, because
	 * the market and the timestamp are one fact and reading them as one sentence is
	 * faster than decoding a badge and then hunting for "updated 3 mins ago".
	 */

	let {
		amount,
		from,
		to,
		fromName,
		toName,
		toSymbol,
		fromSymbol,
		rate,
		market,
		updatedAt
	}: {
		amount: number;
		from: string;
		to: string;
		fromName: string;
		toName: string;
		toSymbol: string;
		fromSymbol: string;
		/** 1 `from` = `rate` `to`. Zero when unavailable. */
		rate: number;
		market: MarketName | null;
		updatedAt: number | null;
	} = $props();

	const converted = $derived(rate * amount);

	const money = (symbol: string, value: number) =>
		`${symbol}${value.toLocaleString('en-US', {
			minimumFractionDigits: conversionDecimals(value),
			maximumFractionDigits: conversionDecimals(value)
		})}`;

	const amountLabel = $derived(amount.toLocaleString('en-US'));

	const utc = (ts: number, options: Intl.DateTimeFormatOptions) =>
		new Date(ts).toLocaleString('en-GB', { timeZone: 'UTC', ...options });

	/**
	 * " at 12:44 UTC", carrying the date only when the rate is not from today.
	 *
	 * A bare clock time silently reads as today's, which on a stale or weekend feed
	 * would age a rate by days without saying so. Today is the overwhelming case and
	 * stays short; anything older has to name its date.
	 */
	const stamp = $derived.by(() => {
		if (!updatedAt) return '';

		const time = utc(updatedAt, { hour: '2-digit', minute: '2-digit', hour12: false });
		const day = (ts: number) => utc(ts, { year: 'numeric', month: '2-digit', day: '2-digit' });

		return day(updatedAt) === day(Date.now())
			? ` at ${time} UTC`
			: ` at ${time} UTC on ${utc(updatedAt, { day: 'numeric', month: 'short', year: 'numeric' })}`;
	});
</script>

{#if rate > 0 && market}
	<div class="mt-7">
		<!-- The code, not the name: "100 US Dollar" is wrong and the plural cannot be
		     generated safely across currencies. The name is on the page either way. -->
		<p class="text-[14px]" style="color: var(--text-secondary);">
			{amountLabel}
			{from} equals
		</p>

		<p
			class="font-head font-bold mt-1 leading-none"
			style="color: var(--text-primary); letter-spacing: -0.025em; font-size: clamp(30px, 7vw, 46px);"
		>
			<span style="font-family: var(--font-mono);">{money(toSymbol, converted)}</span>
			<span class="text-[0.5em] font-semibold" style="color: var(--text-secondary);">{to}</span>
		</p>

		<p class="mt-3 text-[13px] font-semibold" style="color: var(--text-primary);">
			{MARKET_LABEL[market]} rate{stamp}
		</p>

		<div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[13px]">
			<span style="color: var(--text-secondary); font-family: var(--font-mono);">
				1 {from} = {money(toSymbol, rate)}
				{to}
			</span>
			<span style="color: var(--text-secondary); font-family: var(--font-mono);">
				1 {to} = {money(fromSymbol, 1 / rate)}
				{from}
			</span>
		</div>

	</div>
{:else}
	<div
		class="mt-7 rounded-xl p-5"
		style="background: var(--highlight-bg); border: 1px solid var(--card-border);"
	>
		<p class="text-[15px] font-semibold" style="color: var(--text-primary);">
			No live {from} to {to} rate
		</p>
		<p class="mt-1.5 text-[13px] leading-relaxed max-w-2xl" style="color: var(--text-secondary);">
			Monierate holds no current rate for {fromName} to {toName}. Rather than show a stale number,
			we show none — pick another currency above, or try one of the conversions below.
		</p>
	</div>
{/if}
