<script lang="ts">
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	import AdBanner, { hasActiveAd } from '$lib/components/banners/AdBanner.svelte';
	import ExchangeFilter from '$lib/components/ExchangeFilter.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import ExchangeRateText from '$lib/components/ExchangeRateText.svelte';
	import MainFaq from '$lib/components/MainFAQ.svelte';
	import Highlights from '$lib/components/Highlights.svelte';
	import Rates from '$lib/components/Rates.svelte';

	import { handleQuoteCurrencyChange, handleBaseCurrencyChange } from '$lib/utils/url';

	import { defaultCurrencyStore } from '$lib/stores/defaultCurrency';

	import type { PageData } from './$types';

	interface Changer {
		code: string;
		name: string;
		link: string;
		pairs: Record<string, unknown>;
	}

	export let data: PageData;

	const currencySymbols = data.currencySymbols as any;
	const currencies = data.mergedCurrencies as any;

	// Core reactive values
	$: pair = data.pair ?? {};
	$: highlights = data.highlights;
	$: base = data.base;
	$: quote = data.quote;

	$: baseSymbol = currencySymbols[base] ?? base;
	$: quoteSymbol = currencySymbols[quote] ?? quote;

	// Providers lookup
	const providers: Record<string, Changer> = data.providers ?? {};

	// Rates from pair
	$: rates = pair?.changers ?? [];

	// Sorted rates (non-zero buys first)
	$: sortedRates = (() => {
		if (!rates.length) return [];

		const nonZero = rates.filter((r: any) => r.price_buy > 0);
		const zero = rates.filter((r: any) => r.price_buy <= 0);

		nonZero.sort((a: any, b: any) => a.price_buy - b.price_buy);
		zero.sort((a: any, b: any) => b.price_sell - a.price_sell);

		return [...nonZero, ...zero];
	})();

	// Search
	let searchTerm = '';

	$: filteredRates = !searchTerm
		? sortedRates
		: sortedRates.filter((rate) => {
				const name = providers[rate.changer_code]?.name;
				return name?.toLowerCase().includes(searchTerm);
			});

	const handleSearch = (e: Event) => {
		searchTerm = (e.target as HTMLInputElement).value.toLowerCase().trim();
	};

	// Sync default quote currency
	const unsubscribe = defaultCurrencyStore.subscribe((value) => {
		if (!browser || !quote || value === quote) return;
		handleQuoteCurrencyChange(value);
	});

	onDestroy(unsubscribe);
</script>

<svelte:head>
	<title>USD Accounts Providers - Best Rates & Secure Payments | Monierate</title>

	<meta
		name="description"
		content="Compare the best USD account providers in Nigeria and worldwide. Open and manage your dollar accounts easily, track live rates, and make secure international transactions with Monierate."
	/>

	<meta property="og:type" content="website" />
	<meta
		property="og:title"
		content="USD Accounts Providers - Best Rates & Secure Online Payments | Monierate"
	/>
	<meta
		property="og:description"
		content="Discover reliable USD account providers with Monierate. Compare offers, track real-time updates, and enjoy safe and seamless global transactions."
	/>
	<meta property="og:url" content="https://monierate.com" />
	<meta
		property="og:image"
		content="https://monierate.com/media/og-images/usd-accounts-rates.webp"
	/>
</svelte:head>

<!-- Partner banner -->
<div>
	<AdBanner name="home" bannerIndexes={data.bannerIndexes} isMobile={data.isMobile} />
</div>

<div class="container px-0 {hasActiveAd('home') ? '' : 'pt-8'}">
	{#if !data.isValidBase}
		<Notice>
			Looks like the currency you entered isn't valid. We've reset it to
			{base.toUpperCase()}.
		</Notice>
	{/if}

	<ExchangeRateText
		title={`${currencies[base] ?? base} to Naira rates for USD Accounts Providers`}
		data={{
			currencies,
			base: { name: base, symbol: baseSymbol },
			quote: { name: quote, symbol: quoteSymbol },
			rate: { now: pair.price?.current, last: pair.price_30d }
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
		selectedCategory="/usd-accounts-rates"
	/>
</div>

<main>
	{#if filteredRates.length}
		<Rates
			data={{
				rates: filteredRates,
				providers,
				base,
				baseSymbol,
				quote,
				quoteSymbol
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
