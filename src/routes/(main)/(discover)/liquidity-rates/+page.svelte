<script lang="ts">
	import AdBanner, { hasActiveAd } from '$lib/components/banners/AdBanner.svelte';
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
	 * - Non-zero sell prices (descending) — liquidity desks are read sell-side first
	 * - Zero sell prices (ascending buy)
	 */
	$: sortedRates = (() => {
		if (!rates.length) return [];

		const nonZero = rates.filter((r) => r.price_sell > 0);
		const zero = rates.filter((r) => r.price_sell <= 0);

		nonZero.sort((a, b) => b.price_sell - a.price_sell);
		zero.sort((a, b) => a.price_buy - b.price_buy);

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
		>{currencies[base] || base} to {currencies[quote] || quote} Liquidity Provider Rates | Monierate</title
	>

	<meta
		name="description"
		content="Compare {currencies[base] || base} to {currencies[quote] ||
			quote} rates from liquidity providers and OTC desks. Track real-time updates and settle larger volumes with Monierate."
	/>

	<meta property="og:type" content="website" />

	<meta
		property="og:title"
		content="{currencies[base] || base} to {currencies[quote] ||
			quote} - Liquidity Provider Rates | Monierate"
	/>

	<meta
		property="og:description"
		content="Find the best {currencies[base] ||
			base} liquidity rates in Nigeria. Compare desks, track live updates, and settle larger volumes with Monierate."
	/>

	<meta property="og:url" content="https://monierate.com/liquidity-rates" />
	<meta property="og:image" content="https://monierate.com/monierate-og-image.png" />
</svelte:head>

<!-- partner -->
<div>
	<AdBanner name="home" bannerIndexes={data.bannerIndexes} isMobile={data.isMobile} />
</div>

<div class="container px-0 {hasActiveAd('home') ? '' : 'pt-8'}">
	{#if !data.isValidBase}
		<Notice
			>Looks like the currency you entered isn't valid. Don't worry — we've reset it to {base.toUpperCase()}.</Notice
		>
	{/if}

	<ExchangeRateText
		title={`${currencies[base] || base} to ${currencies[quote] || quote} liquidity provider rates`}
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
		selectedCategory="/liquidity-rates"
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
