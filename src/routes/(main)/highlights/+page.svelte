<script lang="ts">
	/** @type {import('./$types').PageData} */
	import AdBanner from '$lib/components/banners/AdBanner.svelte';
	import ExchangeFilter from '$lib/components/ExchangeFilter.svelte';
	import HighlightCard from '$lib/components/HighlightCard.svelte';
	import { slide } from 'svelte/transition';
	import Notice from '$lib/components/Notice.svelte';
	import MainFaq from '$lib/components/MainFAQ.svelte';

	export let data;
	const currencySymbols = data.currencySymbols as any;
	$: currency = data.currency;
	$: getCurrencySymbol = currencySymbols[currency] || currency;

	const highlights = data.highlights;
	let newResult = highlights.newResult;
	let buyingResult = highlights.buyingResult;
	let sellingResult = highlights.sellingResult;
	let sendingResult = highlights.sendingResult;
	let fundingResult = highlights.fundingResult;

	let highlightsLoading: boolean = false;
	const getHighlights = async (pair: string): Promise<any> => {
		try {
			highlightsLoading = true;
			const res = await fetch('/api/highlights?max=10&pair=' + pair);
			if (!res.ok) throw new Error(`Failed to fetch highlights: ${res.status}`);
			return await res.json();
		} catch (err) {
			console.error('getHighlights error:', err);
			return [];
		} finally {
			highlightsLoading = false;
		}
	};

	const handleFilterByCurrency = async (currency_: string) => {
		currency = currency_;
		let highlights = await getHighlights(`${currency.toLowerCase()}ngn`);
		newResult = highlights.newResult;
		buyingResult = highlights.buyingResult;
		sellingResult = highlights.sellingResult;
		sendingResult = highlights.sendingResult;
		fundingResult = highlights.fundingResult;
	};
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
	{#if !data.isValidCurrency}
		<Notice
			>Looks like the currency you entered isn't valid. Don't worry — we've reset it to {currency.toUpperCase()}.</Notice
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
			selectedCurrency={currency}
			selectedCategory="/highlights"
			disableSearch={true}
			onChangeCurrency={handleFilterByCurrency}
		/>
	</div>

	<div class="flex justify-end items-center mb-6 overflow-hidden">
		{#if highlightsLoading}
			<span in:slide={{ duration: 250 }} out:slide={{ duration: 250 }} class="flex">
				<span
					class="inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"
				/>
			</span>
		{/if}
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
		<!--New-->
		{#if newResult}
			<HighlightCard
				highlightData={newResult}
				highlightType="auto"
				title="🔥 New Listing"
				currency={getCurrencySymbol}
			/>
		{/if}

		<!--BUYING-->
		{#if buyingResult}
			<HighlightCard
				highlightData={buyingResult}
				highlightType="buy"
				title="🔥 Best Buy Rate"
				link="/buy/usd-with-ngn-best-buying-rate"
				currency={getCurrencySymbol}
			/>
		{/if}

		<!--SELLING-->
		{#if sellingResult}
			<HighlightCard
				highlightData={sellingResult}
				highlightType="sell"
				title="🔥 Best Sell Rate"
				link="/sell/usd-get-ngn-best-selling-rate"
				currency={getCurrencySymbol}
			/>
		{/if}

		<!--SENDING-->
		{#if sendingResult}
			<HighlightCard
				highlightData={sendingResult}
				highlightType="sell"
				title="🔥 Best Sending Rate"
				link="/send/usd-to-ng-best-rate"
				currency={getCurrencySymbol}
			/>
		{/if}

		<!--FUNDING-->
		{#if fundingResult}
			<HighlightCard
				highlightData={fundingResult}
				highlightType="buy"
				title="🔥 Best Card Rate"
				link="/card/usd-ngn-best-funding-rate"
				currency={getCurrencySymbol}
			/>
		{/if}
	</div>
</div>

<MainFaq />