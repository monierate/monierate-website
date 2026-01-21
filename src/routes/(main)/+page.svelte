<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { browser } from '$app/environment';

	import AdBanner from '$lib/components/banners/AdBanner.svelte';
	import ExchangeFilter from '$lib/components/ExchangeFilter.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import ExchangeRateText from '$lib/components/ExchangeRateText.svelte';
	import MainFaq from '$lib/components/MainFAQ.svelte';
	import Highlights from '$lib/components/Highlights.svelte';
	import ExchangeRates from '$lib/components/ExchangeRates.svelte';
	import { defaultCurrencyStore } from '$lib/stores/defaultCurrency';

	export let data;

	/* -----------------------------
	 * Derived data (single source of truth)
	 * ----------------------------- */
	$: pair = data.pair ?? {};
	$: base = data.base;
	$: quote = data.quote;
	$: rates = data.rates ?? [];
	$: providers = data.providers ?? {};
	$: highlights = data.highlights ?? [];

	const currencySymbols = data.currencySymbols as any;
	const currencies = data.mergedCurrencies;

	$: baseSymbol = currencySymbols[base] ?? base;
	$: quoteSymbol = currencySymbols[quote] ?? quote;

	/* -----------------------------
	 * Sorting (reactive)
	 * ----------------------------- */
	$: sortedRates = (() => {
		if (!rates.length) return [];

		const nonZero = rates.filter((r: any) => r.price_buy > 0);
		const zero = rates.filter((r: any) => r.price_buy <= 0);

		nonZero.sort((a: any, b: any) => a.price_buy - b.price_buy);
		zero.sort((a: any, b: any) => b.price_sell - a.price_sell);

		return [...nonZero, ...zero];
	})();

	/* -----------------------------
	 * Search filtering (reactive)
	 * ----------------------------- */
	let searchTerm = '';

	$: filteredRates = !searchTerm
		? sortedRates
		: sortedRates.filter((rate: any) => {
				const provider = providers[rate.changer_code];
				return provider?.name?.toLowerCase().includes(searchTerm.toLowerCase());
			});

	const handleSearch = (e: Event) => {
		searchTerm = (e.target as HTMLInputElement).value.trim();
	};

	/* -----------------------------
	 * Currency change → URL-driven
	 * ----------------------------- */
	const handleFilterByCurrency = async (currency: string) => {
		const params = new URLSearchParams(window.location.search);
		params.set('base', currency.toUpperCase());
		params.set('page', '1');

		await goto(`?${params.toString()}`, {
			keepFocus: true,
			noScroll: true
		});
	};

	const handleQuoteCurrencyChange = async (currency: string) => {
		const params = new URLSearchParams(window.location.search);
		params.set('quote', currency.toUpperCase());
		params.set('page', '1');

		await goto(`?${params.toString()}`, {
			keepFocus: true,
			noScroll: true
		});
	};

	defaultCurrencyStore.subscribe((value) => {
		if (!browser) return;
		if (value === quote) return;
		console.log('Default currency changed:', value);
		handleQuoteCurrencyChange(value);
	});
</script>

<svelte:head>
	<title>Dollar to naira today black market | Monierate</title>
	<meta
		name="description"
		content="Monierate offers reliable naira exchange rates from 40+ exchanges. Track rates, convert dollars, and get crypto price alerts."
	/>
</svelte:head>

<!-- Partner banner -->
<div class="bg-white dark:bg-gray-800">
	<AdBanner name="home" bannerIndexes={data.bannerIndexes} isMobile={data.isMobile} />
</div>

<div class="container px-0">
	{#if !data.isValidCurrency}
		<Notice>
			Looks like the currency you entered isn't valid. We've reset it to {base}.
		</Notice>
	{/if}

	<!-- <ExchangeRateText title={Today ${currencies[currency] || currency} to Naira rates on exchanges} data={{ currencies: currencies, currency: { name: currency, symbol: getCurrencySymbol }, rate: { now: pair.price.current, last: pair.price_30d } }} /> -->

	<Highlights
		currency={{ code: base, symbol: baseSymbol }}
		{highlights}
		isMobile={data.isMobile}
		showHighlightsDefault={data.showHighlights}
	/>
</div>

<div class="container px-0 mb-4">
	<ExchangeFilter
		onSearch={handleSearch}
		selectedCurrency={base}
		onChangeCurrency={handleFilterByCurrency}
	/>
</div>

<main>
	{#if filteredRates.length > 0}
		<ExchangeRates
			data={{
				rates: filteredRates,
				providers,
				base,
				baseSymbol,
				quote,
				quoteSymbol,
			}}
			bind:currentPage={data.page}
		/>
	{:else}
		<div class="container text-center text-gray-600 dark:text-gray-300">
			<p>No exchange providers found</p>
		</div>
	{/if}

	<MainFaq />
</main>
