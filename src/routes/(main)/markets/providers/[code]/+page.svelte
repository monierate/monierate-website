<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ProviderProfileActions } from './actions.svelte';
	import { parsePairCode } from '$lib/utils/pairs';
	import ProviderHero from '$lib/components/provider-profile/ProviderHero.svelte';
	import ProviderAbout from '$lib/components/provider-profile/ProviderAbout.svelte';
	import PairSelector from '$lib/components/provider-profile/PairSelector.svelte';
	import RateStats from '$lib/components/provider-profile/RateStats.svelte';
	import RateChartSection from '$lib/components/provider-profile/RateChartSection.svelte';
	import OhlcTable from '$lib/components/provider-profile/OhlcTable.svelte';
	import PairsEmptyGhost from '$lib/components/provider-profile/PairsEmptyGhost.svelte';
	import { getIconPath } from '$lib/utils';
	import { defaultCurrencyStore } from '$lib/stores/defaultCurrency';

	let { data } = $props();

	// Named `actions`, not `state` — a local variable literally called `state`
	// collides with the `$state` rune used below and breaks Svelte's SSR output.
	const actions = untrack(
		() =>
			new ProviderProfileActions({
				code: data.code,
				supportedPairCodes: data.supportedPairCodes,
				providerCurrentRates: data.providerCurrentRates,
				initialPairCode: data.initialPairCode,
				initialHistory: data.initialHistory
			})
	);

	$effect(() => {
		const pair = actions.selectedPair;
		const current = $page.url.searchParams.get('pair') ?? '';
		if (pair && pair !== current) {
			goto(`?pair=${pair}`, { keepFocus: true, noScroll: true, replaceState: true });
		}
	});

	const providerIconUrl = $derived(data.provider.icon ? getIconPath(data.provider.icon) : null);
	const tags = $derived((data.provider.changer_tags as string[] | undefined) ?? []);

	// Quote currency comes from the header's global currency selector, not a
	// second picker on this page.
	const activeQuote = $derived($defaultCurrencyStore.toUpperCase());

	const filteredPairCodes = $derived(
		actions.supportedPairCodes.filter((p: string) => parsePairCode(p).quote.toUpperCase() === activeQuote)
	);

	// When the header's currency changes, reselect the first valid pair if needed.
	$effect(() => {
		const quote = activeQuote;
		if (actions.selectedPair && parsePairCode(actions.selectedPair).quote.toUpperCase() !== quote) {
			const first = untrack(() => filteredPairCodes[0]);
			if (first) actions.selectPair(first);
			else actions.selectedPair = '';
		}
	});

	const seo = data.seo;
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<link rel="canonical" href={seo.canonical} />

	<meta property="og:type" content="website" />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:url" content={seo.canonical} />
	<meta property="og:image" content={seo.ogImage} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={seo.ogImage} />

	{@html `<script type="application/ld+json">${seo.orgJsonLd}<\/script>`}
</svelte:head>

<div class="provider-page max-w-6xl mx-auto space-y-5 px-4 py-8">
	<ProviderHero provider={data.provider} code={data.code} {tags} />

	<ProviderAbout provider={data.provider} />

	{#if filteredPairCodes.length === 0}
		<PairsEmptyGhost quoteCurrency={activeQuote} hasAnyPairs={actions.supportedPairCodes.length > 0} />
	{:else}
		<PairSelector
			pairCodes={filteredPairCodes}
			selectedPair={actions.selectedPair}
			onSelect={(pair) => actions.selectPair(pair)}
		/>

		{#if actions.selectedPair}
			{@const currentRate = actions.currentRate}
			{@const { base, quote, symbol } = actions.parsedPair}

			{#if currentRate}
				<RateStats {currentRate} {base} {quote} {symbol} />
			{/if}

			<RateChartSection
				state={actions}
				{base}
				{quote}
				{symbol}
				{currentRate}
				providerName={data.provider.name}
				providerCode={data.code}
				{providerIconUrl}
			/>

			<OhlcTable
				history={actions.history}
				historyLoading={actions.historyLoading}
				{symbol}
				selectedRange={actions.selectedRange}
				providerName={data.provider.name}
				{providerIconUrl}
			/>
		{/if}
	{/if}
</div>
