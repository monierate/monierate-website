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
	import ProGateCta from '$lib/components/ProGateCta.svelte';
	import { getIconPath } from '$lib/utils';

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

	let activeQuote = $state(data.initialQuote);

	const filteredPairCodes = $derived(
		actions.supportedPairCodes.filter((p: string) => parsePairCode(p).quote.toUpperCase() === activeQuote)
	);

	// When the quote tab changes, reselect the first valid pair if needed.
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

	{#if data.quotes.length > 1}
		<div class="quote-tabs" role="tablist">
			{#each data.quotes as q}
				<button
					type="button"
					class="quote-tab"
					class:active={q === activeQuote}
					role="tab"
					aria-selected={q === activeQuote}
					onclick={() => (activeQuote = q)}
				>
					{q}
				</button>
			{/each}
		</div>
	{/if}

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

	<ProGateCta label="Export rates" description="Download this table as CSV on Monierate Pro." />

	<p class="disclaimer">
		Exchange rates are supplied by {data.provider.name} and refreshed as new data comes in.
		Monierate does not guarantee their accuracy — confirm the live rate with the provider before
		you trade.
	</p>
</div>

<style>
	.quote-tabs {
		display: inline-flex;
		gap: 0.25rem;
		padding: 0.25rem;
		border-radius: 0.875rem;
		background: var(--card-bg);
		border: 1px solid var(--card-border);
	}
	.quote-tab {
		font-family: var(--font-head);
		font-weight: 600;
		font-size: 0.85rem;
		padding: 0.45rem 0.9rem;
		border-radius: 0.625rem;
		color: var(--text-secondary);
		white-space: nowrap;
		transition:
			color 0.15s ease,
			background 0.15s ease;
	}
	.quote-tab:hover {
		color: var(--text-primary);
	}
	.quote-tab.active {
		background: var(--accent);
		color: #ffffff;
	}

	.disclaimer {
		font-size: 0.8rem;
		line-height: 1.5;
		color: var(--text-muted);
	}
</style>
