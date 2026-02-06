<script lang="ts">
	/** @type {import('./$types').PageData} */
	import AdBanner from '$lib/components/banners/AdBanner.svelte';
	import ExchangeFilter from '$lib/components/ExchangeFilter.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import ExchangeRateText from '$lib/components/ExchangeRateText.svelte';
	import MainFaq from '$lib/components/MainFAQ.svelte';
	import Highlights from '$lib/components/Highlights.svelte';
	import ExchangeRates from '$lib/components/ExchangeRates.svelte';
	import { handleQuoteCurrencyChange, handleBaseCurrencyChange } from '$lib/utils/url';
	import { defaultCurrencyStore } from '$lib/stores/defaultCurrency';
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	interface Changer {
		code: string;
		name: string;
		link: string;
		pairs: Record<string, unknown>;
	}

	export let data;
	const currencySymbols = data.currencySymbols as any;
	const currencies = data.mergedCurrencies as any;

	// Core reactive values
	$: pair = data.pair ?? {};
	$: highlights = data.highlights;
	$: base = data.base;
	$: quote = data.quote;

	$: baseSymbol = currencySymbols[base] ?? base;
	$: quoteSymbol = currencySymbols[quote] ?? quote;

	// Reactive rates from selected pair
	$: rates = pair?.changers || [];

	// Reactive provider lookup
	const providers: Record<string, Changer> = data.providers || {};
	let total = 0;
	$: if (rates) {
		total = Object.entries(rates).length;
	}

	// Sort and filter rates reactively
	$: sortedFilteredRates = (() => {
		if (!rates) return [];

		// Separate non-zero and zero `price_buy` rates
		const nonZeroRates = rates.filter((rate: any) => rate.price_buy > 0);
		const zeroRates = rates.filter((rate: any) => rate.price_buy <= 0);

		// Sort non-zero in ascending price_buy
		nonZeroRates.sort((a: any, b: any) => a.price_buy - b.price_buy);

		// Sort zero rates in descending price_sell
		zeroRates.sort((a: any, b: any) => b.price_sell - a.price_sell);

		// Combine both lists
		return nonZeroRates.concat(zeroRates);
	})();

	// Search filtering
	let searchTerm = '';
	$: filteredRates = sortedFilteredRates.filter((rate: any) => {
		const providerName = providers[rate.changer_code]?.name || '';
		return (
			providers[rate.changer_code] && providerName.toLowerCase().includes(searchTerm.toLowerCase())
		);
	});

	let originalFilteredRates: any[] | null = null;

	const handleSearch = (e: Event) => {
		const searchTerm = (e.target as HTMLInputElement).value.toLowerCase().trim();

		// Backup the original list once
		if (!originalFilteredRates) {
			originalFilteredRates = [...filteredRates];
		}

		// If empty, restore full list
		if (!searchTerm) {
			filteredRates = originalFilteredRates;
			return;
		}

		// Filter using provider name
		const filtered = originalFilteredRates.filter((item: any) => {
			const provider = providers[item.changer_code];
			return provider && provider.name && provider.name.toLowerCase().includes(searchTerm);
		});

		filteredRates = filtered;
	};

	// Sync default quote currency
	const unsubscribe = defaultCurrencyStore.subscribe((value) => {
		if (!browser || !quote || value === quote) return;
		handleQuoteCurrencyChange(value);
	});

	onDestroy(unsubscribe);
</script>

<svelte:head>
	<title>Send {currencies[base] || base} to Nigeria – Fast Money Transfers | Monierate</title>

	<meta
		name="description"
		content="Send {currencies[base] || base} to {currencies[quote] ||
			quote} securely and instantly. Compare real-time transfer rates, track conversions, and get the best payout with Monierate's money transfer tools."
	/>

	<meta property="og:type" content="website" />
	<meta
		property="og:title"
		content="Send {currencies[base] || base} to {currencies[quote] ||
			quote} – Money Transfer Rates | Monierate"
	/>
	<meta
		property="og:description"
		content="Transfer {currencies[base] || base} to {currencies[quote] ||
			quote} with transparent, real-time rates. Compare providers, monitor fees, and get alerts to maximize value on every transfer."
	/>
	<meta property="og:url" content="https://monierate.com" />
	<meta
		property="og:image"
		content="https://monierate.com/media/og-images/money-transfer-rate.webp"
	/>
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
		title={`${currencies[base] || base} to Naira ${currencies[quote] || quote} for sending to Nigeria`}
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
		selectedCategory="/money-transfer-rate"
	/>
</div>

<main>
	{#if filteredRates && filteredRates.length > 0}
		<ExchangeRates
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
			<p>No money transfer providers found</p>
		</div>
	{/if}

	<MainFaq />
</main>
