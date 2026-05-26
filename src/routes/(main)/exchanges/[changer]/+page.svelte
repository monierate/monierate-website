<script lang="ts">
	import Rates from '$lib/components/exchanges/Rates.svelte';
	// import AdBanner from '$lib/components/AdBanner.svelte';
	import ViewMoreText from '$lib/components/ViewMoreText.svelte';
	import FeaturedPublications from '$lib/components/exchanges/FeaturedPublications.svelte';
	import AboutCard from '$lib/components/exchanges/AboutCard.svelte';
	import RelatedExchanges from '$lib/components/exchanges/RelatedExchanges.svelte';
	import SocialLinks from '$lib/components/exchanges/SocialLinks.svelte';
	import ProviderIcon from '$lib/components/ProviderIcon.svelte';

	export let data;
	const currencies = data.currencies;
	$: changer = data.changer;
	$: relatedChangers = data.relatedChangers;
	$: pairs = data.pairs;

	$: appStoreLink = changer.featured_publications?.find((p: any) =>
		p.url?.includes('apps.apple.com')
	);
	$: playStoreLink = changer.featured_publications?.find((p: any) =>
		p.url?.includes('play.google.com')
	);
	$: filteredPublications = changer.featured_publications?.filter(
		(p: any) => !p.url?.includes('apps.apple.com') && !p.url?.includes('play.google.com')
	) ?? [];

	$: isAndroid = data.isAndroid;
	$: isIOS = data.isIOS;
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
	<div class="md:w-1/3">
		<div
			class="container space-y-6 md:px-6 md:py-8 md:mx-0 md:mr-10 md:sticky md:top-[80px] md:border md:border-gray-200/80 md:dark:border-gray-700/60 md:rounded-xl"
		>
			<div class="flex flex-col md:flex-row justify-between items-center gap-4">
				<div class="w-full md:w-auto">
					<h2 class="text-xl md:text-2xl font-bold flex items-center gap-1">
						<ProviderIcon
							icon={changer.icon}
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

			{#if appStoreLink || playStoreLink}
				{@const showPlay = playStoreLink && !isIOS}
				{@const showApp = appStoreLink && !isAndroid}
				{@const stacked = isAndroid || isIOS}
				{#if showPlay || showApp}
					<div class="flex flex-col gap-2">
						<p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Download App</p>
						<div class="flex gap-2" class:flex-col={stacked} class:flex-row={!stacked}>
							{#if showPlay}
								<a
									href={playStoreLink.url}
									target="_blank"
									rel="noopener noreferrer"
									class="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
									class:px-4={stacked} class:py-3={stacked}
									class:px-3={!stacked} class:py-2={!stacked}
								>
									<img src="/icons/stores/playstore.png" alt="Google Play" class="object-contain shrink-0" class:w-7={stacked} class:h-7={stacked} class:w-5={!stacked} class:h-5={!stacked} />
									<div class="leading-tight">
										<div class="text-gray-400 dark:text-gray-500" class:text-[10px]={stacked} class:text-[9px]={!stacked}>Get it on</div>
										<div class="font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap" class:text-sm={stacked} class:text-xs={!stacked}>Google Play</div>
									</div>
									{#if stacked}
										<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-auto shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
										</svg>
									{/if}
								</a>
							{/if}
							{#if showApp}
								<a
									href={appStoreLink.url}
									target="_blank"
									rel="noopener noreferrer"
									class="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
									class:px-4={stacked} class:py-3={stacked}
									class:px-3={!stacked} class:py-2={!stacked}
								>
									<img src="/icons/stores/appstore.png" alt="App Store" class="object-contain shrink-0" class:w-7={stacked} class:h-7={stacked} class:w-5={!stacked} class:h-5={!stacked} />
									<div class="leading-tight">
										<div class="text-gray-400 dark:text-gray-500" class:text-[10px]={stacked} class:text-[9px]={!stacked}>Download on</div>
										<div class="font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap" class:text-sm={stacked} class:text-xs={!stacked}>App Store</div>
									</div>
									{#if stacked}
										<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-auto shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
										</svg>
									{/if}
								</a>
							{/if}
						</div>
					</div>
				{/if}
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
				{#if filteredPublications.length > 0}
					<FeaturedPublications posts={filteredPublications} />
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
