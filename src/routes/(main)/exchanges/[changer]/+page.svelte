<script lang="ts">
	import Rates from '$lib/components/exchanges/Rates.svelte';
	// import AdBanner from '$lib/components/AdBanner.svelte';
	import FeaturedPublications from '$lib/components/exchanges/FeaturedPublications.svelte';
	import AboutCard from '$lib/components/exchanges/AboutCard.svelte';
	import ChangerSidebar from '$lib/components/exchanges/ChangerSidebar.svelte';

	export let data;
	$: changer = data.changer;
	$: pairs = data.pairs;

	$: filteredPublications = changer.featured_publications?.filter(
		(p: any) => !p.url?.includes('apps.apple.com') && !p.url?.includes('play.google.com')
	) ?? [];
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
	<meta property="og:image" content="https://ik.imagekit.io/monierate/thumbnails/{changer.code}-og.png" />
</svelte:head>

<!-- <AdBanner name="footer" /> -->

<div class="flex flex-col md:flex-row md:justify-between md:container">
	<ChangerSidebar {changer} isAndroid={data.isAndroid} isIOS={data.isIOS} />

	<div class="md:w-2/3 space-y-16">
		<div class="space-y-6 container px-0 mx-0 w-full md:px-6 md:mx-auto">
			<div class="px-4 md:px-0">
				<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
					{changer.name} Exchange Rates
				</h2>
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
				{#if filteredPublications.length > 0}
					<FeaturedPublications posts={filteredPublications} />
				{:else}
					<div class="text-center p-16 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
						There's no featured publications for {changer.name}
					</div>
				{/if}
			</div>

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
