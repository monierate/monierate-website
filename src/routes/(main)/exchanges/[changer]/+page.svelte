<script lang="ts">
	import Rates from '$lib/components/exchanges/Rates.svelte';
	// import AdBanner from '$lib/components/AdBanner.svelte';
	import ViewMoreText from '$lib/components/ViewMoreText.svelte';
	import FeaturedPublications from '$lib/components/exchanges/FeaturedPublications.svelte';
	import AboutCard from '$lib/components/exchanges/AboutCard.svelte';
	import RelatedExchanges from '$lib/components/exchanges/RelatedExchanges.svelte';
	import SocialLinks from '$lib/components/exchanges/SocialLinks.svelte';

	export let data;
	const currencies = data.currencies;
	$: changer = data.changer;
	$: relatedChangers = data.relatedChangers;
	$: pairs = data.pairs;
</script>

<svelte:head>
	<title>{changer.name} Exchange Rates & Profile | Monierate</title>

	<meta
		name="description"
		content={`${changer.bio} view ${changer.name} exchange rates and company profile.`}
	/>

	<meta property="og:type" content="website" />
	<meta property="og:title" content={`${changer.name} Exchange Rates & Profile | Monierate`} />
	<meta
		property="og:description"
		content={`${changer.bio} view ${changer.name} exchange rates and company profile.`}
	/>
	<meta property="og:url" content={`https://monierate.com/exchanges/${changer.slug}`} />
	<meta property="og:image" content="https://monierate.com/monierate-og-image.png" />
</svelte:head>

<!-- <AdBanner name="footer" /> -->

<div class="flex flex-col md:flex-row md:justify-between md:container">
	<div class="md:w-1/3">
		<div
			class="container space-y-6 md:px-6 md:py-8 md:mx-0 md:mr-10 md:sticky md:top-[80px] md:border md:border-gray-200/80 md:dark:border-gray-700/60 md:rounded-xl"
		>
			<div class="flex flex-col md:flex-row justify-between items-center gap-4">
				<div class="w-full md:w-auto">
					<h2 class="text-xl md:text-2xl font-bold flex items-center gap-1">
						<img
							src="/icons/{changer.icon}"
							alt="{changer.name} Logo"
							class="w-10 h-10 rounded-full object-contain"
						/>
						<span>{changer.name}</span>
					</h2>
				</div>
				<div class="w-full md:w-auto">
					<a
						href={changer.link}
						target="_blank"
						class="w-full block md:inline-block md:w-auto text-center border border-geay-200/80 dark:border-gray-700/60 rounded-full px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-100 transition-colors hover:bg-gray-100/10 dark:hover:bg-gray-700/60"
						>Visit website</a
					>
				</div>
			</div>

			<div class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
				<ViewMoreText text={changer.bio} />
			</div>

			{#if changer.media_handles && changer.media_handles.length > 0}
				<SocialLinks links={changer.media_handles} />
			{/if}
		</div>
	</div>
	<div class="md:w-2/3 space-y-16">
		<div class="space-y-6 container px-0 mx-0 w-full md:px-6 md:mx-auto">
			<div class="px-4 md:px-0">
				<div class="space-y-5">
					<div class="">
						<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
							{changer.name} Exchange Rates
						</h2>
					</div>
				</div>
			</div>
			{#if pairs && pairs.length > 0}
				<Rates
					data={{
						pairs: pairs,
						currencySymbols: data.currencySymbols,
						changer: changer.code
					}}
				/>
			{:else}
				<div class="text-center p-16">There's no pair data for {changer.name}</div>
			{/if}
		</div>

		<div class="container md:px-0 md:w-full md:mx-0 space-y-16">
			{#if changer.about}
				<div class="w-full md:px-6 text-gray-500">
					<AboutCard {changer} />
				</div>
			{/if}

			<div class="md:px-6 space-y-5">
				<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
					Featured Publications
				</h3>
				{#if changer.featured_publications && changer.featured_publications.length > 0}
					<FeaturedPublications posts={changer.featured_publications} />
				{:else}
					<div class="text-center p-16 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
						There's no featured publications for {changer.name}
					</div>
				{/if}
			</div>

			<!-- {#if relatedChangers}
				<div class="md:px-6 space-y-5">
					<RelatedExchanges exchanges={relatedChangers} />
				</div>
			{/if} -->

			<div class="md:px-6 space-y-3">
				<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Disclaimer</h3>

				<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
					All information provided on this page is for general informational purposes only. While we
					strive to keep the information accurate and up to date, we make no representations or
					warranties of any kind, express or implied, about the completeness, accuracy, reliability,
					suitability, or availability of the information displayed.
				</p>

				<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
					Any reliance you place on such information is strictly at your own risk. We shall not be
					held responsible or liable for any loss, damage, or inconvenience arising from the use of,
					or reliance on, the information presented, including but not limited to exchange rates,
					financial data, or third-party content.
				</p>
			</div>
		</div>
	</div>
</div>
