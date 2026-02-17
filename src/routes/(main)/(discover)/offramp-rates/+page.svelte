<script lang="ts">
	import AdBanner from '$lib/components/banners/AdBanner.svelte';
	import ExchangeFilter from '$lib/components/ExchangeFilter.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import ExchangeRateText from '$lib/components/ExchangeRateText.svelte';
	import MainFaq from '$lib/components/MainFAQ.svelte';
	import Highlights from '$lib/components/Highlights.svelte';
	import Rates from '$lib/components/Rates.svelte';
	import { handleQuoteCurrencyChange, handleBaseCurrencyChange } from '$lib/utils/url';
	import { defaultCurrencyStore } from '$lib/stores/defaultCurrency';
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';

	interface Changer {
		code: string;
		name: string;
		link: string;
		pairs: Record<string, unknown>;
	}

	interface Rate {
		changer_code: string;
		price_buy: number;
		price_sell: number;
	}

	export let data;

	const currencySymbols = data.currencySymbols as Record<string, string>;
	const currencies = data.mergedCurrencies as Record<string, string>;
	const providers: Record<string, Changer> = data.providers || {};

	$: base = data.base;
	$: quote = data.quote;
	$: pair = data.pair || {};
	$: highlights = data.highlights;

	$: baseSymbol = currencySymbols[base] || base;
	$: quoteSymbol = currencySymbols[quote] || quote;

	// Rates from selected pair
	$: rates = (pair?.changers || []) as Rate[];

	// Total providers
	$: total = rates.length;

	/**
	 * Sort logic:
	 * - Non-zero buy prices (ascending)
	 * - Zero buy prices (descending sell)
	 */
	$: sortedRates = (() => {
		if (!rates.length) return [];

		const nonZero = rates.filter((r) => r.price_buy > 0);
		const zero = rates.filter((r) => r.price_buy <= 0);

		nonZero.sort((a, b) => a.price_buy - b.price_buy);
		zero.sort((a, b) => b.price_sell - a.price_sell);

		return [...nonZero, ...zero];
	})();

	// Search
	let searchTerm = '';

	const handleSearch = (e: Event) => {
		searchTerm = (e.target as HTMLInputElement).value.toLowerCase().trim();
	};

	// Filtered rates (reactive, no mutation)
	$: filteredRates = sortedRates.filter((rate) => {
		if (!searchTerm) return true;
		const provider = providers[rate.changer_code];
		return provider?.name?.toLowerCase().includes(searchTerm);
	});

	// Default currency sync
	const unsubscribe = defaultCurrencyStore.subscribe((value) => {
		if (!browser || !quote || value === quote) return;
		handleQuoteCurrencyChange(value);
	});

	onDestroy(unsubscribe);
</script>

<svelte:head>
	<title
		>Sell {currencies[base] || base} to {currencies[quote] || quote} - Best Offramp Rates | Monierate</title
	>

	<meta
		name="description"
		content="Cash out {currencies[base] || base} to {currencies[quote] ||
			quote} at the best offramp rates. Compare providers, track real-time updates, and withdraw securely with Monierate."
	/>

	<meta property="og:type" content="website" />

	<meta
		property="og:title"
		content="Sell {currencies[base] || base} to {currencies[quote] ||
			quote} - Offramp Rates | Monierate"
	/>

	<meta
		property="og:description"
		content="Get the best offramp rates to convert {currencies[base] ||
			base} into Naira. Compare providers, track live updates, and withdraw your funds with Monierate."
	/>

	<meta property="og:url" content="https://monierate.com" />
	<meta property="og:image" content="https://monierate.com/media/og-images/offramp-rates.webp" />
</svelte:head>

<!-- partner -->
<div class="bg-white dark:bg-gray-800">
	<AdBanner name="home" bannerIndexes={data.bannerIndexes} isMobile={data.isMobile} />
</div>

<div class="container px-0">
	{#if !data.isValidBase}
		<Notice
			>Looks like the currency you entered isn't valid. Don't worry — we've reset it to {base.toUpperCase()}.</Notice
		>
	{/if}

	<ExchangeRateText
		title={`${currencies[base] || base} to ${currencies[quote] || quote} off-ramp rates across providers`}
		data={{
			currencies: currencies,
			base: { name: base, symbol: baseSymbol },
			quote: { name: quote, symbol: quoteSymbol },
			rate: { now: pair?.price?.current, last: pair?.price_30d }
		}}
	/>

	<Highlights
		base={{ code: base, symbol: baseSymbol }}
		quote={{ code: quote, symbol: quoteSymbol }}
		{highlights}
		isMobile={data.isMobile}
		showHighlightsDefault={data.showHighlights}
	/>
</div>

<div class="container px-0 mb-4">
	<ExchangeFilter
		onSearch={handleSearch}
		selectedCurrency={base}
		onChangeCurrency={handleBaseCurrencyChange}
		selectedCategory="/offramp-rates"
	/>
</div>

<main>
	{#if filteredRates && filteredRates.length > 0}
		<Rates
			data={{
				rates: filteredRates,
				providers,
				base,
				baseSymbol: baseSymbol,
				quote,
				quoteSymbol: quoteSymbol
			}}
			bind:currentPage={data.page}
		/>
	{:else}
		<div class="container text-center text-gray-600 dark:text-gray-300">
			<p>No providers found</p>
		</div>
	{/if}

	<MainFaq />
</main>
