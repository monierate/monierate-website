<script lang="ts">
	import { untrack } from 'svelte';
	import { ProviderPairInsightActions } from './actions.svelte';
	import ProviderPairInsight from '$lib/components/provider-profile/ProviderPairInsight.svelte';
	import OhlcTable from '$lib/components/provider-profile/OhlcTable.svelte';
	import { getIconPath } from '$lib/utils';

	let { data } = $props();

	// Named `insight`, not `state` — a local variable literally called `state`
	// collides with the `$state` rune (see markets/providers/[code]/+page.svelte).
	const insight = untrack(
		() =>
			new ProviderPairInsightActions({
				pairCode: data.pairCode,
				providerCode: data.providerCode,
				currentRate: data.currentRate,
				initialHistory: data.initialHistory,
				amount: data.amount
			})
	);

	const seo = data.seo;
	const providerIconUrl = data.provider.icon ? getIconPath(data.provider.icon) : null;
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

<!-- Container mirrors Breadcrumb.svelte so the page gutter lines up with the breadcrumb bar. -->
<div class="w-[95%] md:max-w-[1200px] mx-auto px-4 py-8">
	<ProviderPairInsight
		provider={data.provider}
		currentRate={data.currentRate}
		state={insight}
		showBreadcrumb={false}
	/>

	<!-- Mirrors the OHLC table on /markets/providers/[code]; shares the same range
	     selection, so switching 7d/30d/60d/90d above refreshes both. -->
	<div class="mt-5">
		<OhlcTable
			history={insight.history}
			historyLoading={insight.historyLoading}
			symbol={insight.parsedPair.symbol}
			selectedRange={insight.selectedRange}
			providerName={data.provider.name}
			{providerIconUrl}
		/>
	</div>
</div>
