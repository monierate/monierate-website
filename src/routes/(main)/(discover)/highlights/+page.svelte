<script lang="ts">
	/** @type {import('./$types').PageData} */
	import AdBanner from '$lib/components/banners/AdBanner.svelte';
	import ExchangeFilter from '$lib/components/ExchangeFilter.svelte';
	import HighlightCard from '$lib/components/HighlightCard.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import MainFaq from '$lib/components/MainFAQ.svelte';
	import { handleBaseCurrencyChange, handleQuoteCurrencyChange } from '$lib/utils/url';
	import { defaultCurrencyStore } from '$lib/stores/defaultCurrency';
	import { browser } from '$app/environment';

	export let data;
	const currencySymbols = data.currencySymbols as any;
	$: base = data.base;
	$: baseSymbol = currencySymbols[base] || base;
	$: quote = data.quote;
	$: quoteSymbol = currencySymbols[quote] || quote;

	$: highlights = data.highlights;
	$: newResult = highlights.newResult;
	$: buyingResult = highlights.buyingResult;
	$: sellingResult = highlights.sellingResult;
	$: sendingResult = highlights.sendingResult;
	$: fundingResult = highlights.fundingResult;

	defaultCurrencyStore.subscribe((value) => {
		if (!browser) return;
		if (!quote) return;
		if (value === quote) return;
		console.log('Default currency changed:', value);
		handleQuoteCurrencyChange(value);
	});
</script>

<svelte:head>
	<title>Highlights | Monierate</title>
	<meta
		name="description"
		content="Explore daily highlights of naira exchange rates from top Nigerian platforms. Track rate trends, view daily summaries, and get updates from Binance, Bybit, Quidax, and more — all in one place on Monierate."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Highlights of Naira Exchange Rates | Monierate" />
	<meta
		property="og:description"
		content="Stay updated with daily highlights of naira exchange rates across Nigeria’s top exchanges. Compare black market and CBN rates, monitor trends, and get alerts from Binance, Bybit, Quidax, and more."
	/>
	<meta property="og:url" content="https://monierate.com/highlights" />
	<meta property="og:image" content="https://monierate.com/media/og-images/highlights.webp" />
</svelte:head>

<!-- partner -->
<div class="bg-white dark:bg-gray-800">
	<AdBanner name="home" bannerIndexes={data.bannerIndexes} isMobile={data.isMobile}/>
</div>

<div class="container px-0">
	{#if !data.isValidBase}
		<Notice
			>Looks like the currency you entered isn't valid. Don't worry — we've reset it to {base.toUpperCase()}.</Notice
		>
	{/if}

	<h1 class="text-2xl md:text-4xl mb-2 dark:text-gray-100">Rate Highlights</h1>
	<div class="text-gray-600 font-normal dark:text-gray-300">
		<p>
			Explore a quick snapshot of the most competitive naira exchange rates from leading providers.
			These rates are updated regularly to help you make informed conversion decisions across several providers.
		</p>
	</div>

	<div class="my-10">
		<ExchangeFilter
			selectedCurrency={base}
			selectedCategory="/highlights"
			disableSearch={true}
			onChangeCurrency={handleBaseCurrencyChange}
		/>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
		<!--New-->
		{#if newResult}
			<HighlightCard
				highlightData={newResult}
				highlightType="auto"
				title="🔥 New Listing"
				base={baseSymbol}
				quote={quoteSymbol}
			/>
		{/if}

		<!--BUYING-->
		{#if buyingResult}
			<HighlightCard
				highlightData={buyingResult}
				highlightType="buy"
				title="🔥 Best Buy Rate"
				base={baseSymbol}
				quote={quoteSymbol}
			/>
		{/if}

		<!--SELLING-->
		{#if sellingResult}
			<HighlightCard
				highlightData={sellingResult}
				highlightType="sell"
				title="🔥 Best Sell Rate"
				base={baseSymbol}
				quote={quoteSymbol}
			/>
		{/if}

		<!--SENDING-->
		{#if sendingResult}
			<HighlightCard
				highlightData={sendingResult}
				highlightType="sell"
				title="🔥 Best Sending Rate"
				base={baseSymbol}
				quote={quoteSymbol}
			/>
		{/if}

		<!--FUNDING-->
		{#if fundingResult}
			<HighlightCard
				highlightData={fundingResult}
				highlightType="buy"
				title="🔥 Best Card Rate"
				base={baseSymbol}
				quote={quoteSymbol}
			/>
		{/if}
	</div>
</div>

<MainFaq />
