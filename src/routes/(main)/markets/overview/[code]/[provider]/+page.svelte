<script lang="ts">
	import { untrack } from 'svelte';
	import { ProviderPairInsightActions } from './actions.svelte';
	import ProviderPairInsight from '$lib/components/provider-profile/ProviderPairInsight.svelte';

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

<div class="max-w-5xl mx-auto px-4 py-8">
	<ProviderPairInsight
		provider={data.provider}
		currentRate={data.currentRate}
		state={insight}
		showBreadcrumb={false}
		showProfileLink={false}
	/>
</div>
