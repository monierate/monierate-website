<script lang="ts">
	import type { PageData } from './$types';
	import Seo from '$lib/components/seo/Seo.svelte';
	import AdBanner, { hasActiveAd } from '$lib/components/banners/AdBanner.svelte';
	import ConverterForm from '$lib/components/converter/ConverterForm.svelte';
	import RateHeadline from '$lib/components/converter/RateHeadline.svelte';
	import RateDisclaimer from '$lib/components/converter/RateDisclaimer.svelte';
	import ExchangeRateList from '$lib/components/converter/ExchangeRateList.svelte';
	import ConversionLadder from '$lib/components/converter/ConversionLadder.svelte';
	import PopularConversions from '$lib/components/converter/PopularConversions.svelte';
	import FaqSection from '$lib/components/pair-content/FaqSection.svelte';

	let { data }: { data: PageData } = $props();

	const c = $derived(data.conversion);
	const amountLabel = $derived(c.amount.toLocaleString('en-US'));

	// The H1 carries the amount only when there is one, so the pair page reads as
	// the rate page it is rather than as "1 USD to NGN". The amount attaches to the
	// code, never the name — see the note in `converterContent`.
	const heading = $derived(
		c.amount === 1
			? `${c.from} to ${c.to} — Convert ${data.fromCurrency.name} to ${data.toCurrency.name}`
			: `${amountLabel} ${c.from} to ${c.to} — Convert ${data.fromCurrency.name} to ${data.toCurrency.name}`
	);
</script>

<Seo {...data.seo} />

<div style="background: var(--page-bg);">
	<AdBanner name="converter" isMobile={data.isMobile} />
</div>

<div class="w-[95%] md:max-w-[900px] mx-auto pb-24 {hasActiveAd('converter') ? 'pt-4' : 'pt-8'}">
	<h1 class="text-[22px] md:text-[30px] leading-tight mb-6">{heading}</h1>

	<!-- Converter -->
	<section
		class="rounded-2xl px-5 py-6 md:px-7 md:py-7"
		style="background: var(--card-bg); border: 1px solid var(--card-border); box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04);"
	>
		<ConverterForm
			currencies={data.currencies}
			amount={c.amount}
			from={c.from}
			to={c.to}
		/>

		<RateHeadline
			amount={c.amount}
			from={c.from}
			to={c.to}
			fromName={data.fromCurrency.name}
			toName={data.toCurrency.name}
			fromSymbol={data.fromCurrency.symbol}
			toSymbol={data.toCurrency.symbol}
			rate={data.rate}
			market={data.market}
			updatedAt={data.updatedAt}
		/>

		<RateDisclaimer market={data.market} isLoggedIn={data.auth?.isLoggedIn ?? false} />
	</section>

	<p class="mt-6 text-[14px] leading-relaxed" style="color: var(--text-secondary);">
		{data.content.intro}
	</p>

	<div class="mt-8 space-y-8">
		<!-- The section no single-rate converter can show -->
		<ExchangeRateList
			quotes={data.exchanges}
			amount={c.amount}
			from={c.from}
			to={c.to}
			toSymbol={data.toCurrency.symbol}
			pairCode={data.pairCode}
		/>

		{#if data.rate > 0}
			<ConversionLadder
				from={c.from}
				to={c.to}
				fromSymbol={data.fromCurrency.symbol}
				toSymbol={data.toCurrency.symbol}
				rate={data.rate}
				note={data.content.ladderNote}
			/>
		{/if}

		{#if data.content.faqs.length}
			<FaqSection faqs={data.content.faqs} />
		{/if}

		<!-- Currency info -->
		{#if data.fromCurrency.description || data.toCurrency.description}
			<section class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each [data.fromCurrency, data.toCurrency] as currency (currency.code)}
					{#if currency.description}
						<div
							class="rounded-xl p-5"
							style="background: var(--page-bg); border: 1px solid var(--card-border);"
						>
							<h2 class="text-[15px] font-semibold" style="color: var(--text-primary);">
								{currency.code} — {currency.name}
							</h2>
							<p class="mt-2 text-[13px] leading-relaxed" style="color: var(--text-secondary);">
								{currency.description}
							</p>
						</div>
					{/if}
				{/each}
			</section>
		{/if}

		<PopularConversions
			exclude={{ from: c.from.toLowerCase(), to: c.to.toLowerCase() }}
		/>
	</div>

	<div class="mt-8">
		<AdBanner name="converter_mobile_only" mobileOnly={true} showLabel={true} />
	</div>
</div>
