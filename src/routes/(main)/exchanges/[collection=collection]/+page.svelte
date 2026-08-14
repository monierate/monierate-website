<script lang="ts">
	import Seo from '$lib/components/seo/Seo.svelte';
	import CollectionList from '$lib/components/exchanges/CollectionList.svelte';
	import CollectionLinks from '$lib/components/exchanges/CollectionLinks.svelte';
	import Faqs from '$lib/components/exchanges/Faqs.svelte';

	let { data } = $props();

	const lastUpdated = $derived(
		new Date(data.lastUpdated).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	);
</script>

<Seo {...data.seo} />

<div class="container max-w-4xl py-8 space-y-12">
	<header class="space-y-4">
		<nav aria-label="Breadcrumb" class="text-sm text-gray-500 dark:text-gray-400">
			<a href="/exchanges" class="hover:text-gray-700 dark:hover:text-gray-200">Exchanges</a>
			<span class="mx-1.5" aria-hidden="true">/</span>
			<span class="text-gray-700 dark:text-gray-300">{data.collection.label}</span>
		</nav>

		<h1 class="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
			{data.collection.heading}
		</h1>

		<p class="text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-300">
			{data.collection.intro}
		</p>
	</header>

	<section class="space-y-4">
		<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
			{data.changers.length}
			{data.changers.length === 1 ? 'platform' : 'platforms'}, ranked
		</h2>

		<CollectionList changers={data.changers} />

		{#if data.total > data.changers.length}
			<p class="text-xs text-gray-500 dark:text-gray-400">
				Showing the top {data.changers.length} of {data.total} platforms in this category.
			</p>
		{/if}
	</section>

	{#if data.collection.faqs.length}
		<section>
			<Faqs name={data.collection.label} faqs={data.collection.faqs} />
		</section>
	{/if}

	{#if data.related.length}
		<section>
			<CollectionLinks
				heading="Explore more collections"
				collections={data.related}
			/>
		</section>
	{/if}

	<footer class="space-y-3 border-t border-gray-200 dark:border-gray-800 pt-6">
		<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
			Rankings reflect user ratings and the platform data on file at Monierate. Listings are
			informational and are not a recommendation or an endorsement — verify a platform’s licence
			and terms yourself before you trade.
		</p>

		<p class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				class="w-4 h-4 shrink-0"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
				/>
			</svg>
			<span>Last updated {lastUpdated}</span>
		</p>
	</footer>
</div>
