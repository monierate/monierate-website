<script>
	/** @type {import('./$types').PageServerData} */

	export let data;
	const providers = data.changers;
</script>

<svelte:head>
	<title>Compare naira exchange rates by providers | Monierate</title>
	<meta
		name="description"
		content="On Monierate, you can choose the provider you’d like to see their rates, and we'll compare their exchange rates across a range of currencies."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Compare naira exchange rates by providers | Monierate" />
	<meta
		property="og:description"
		content="Choose the provider you’d like to see their rates, and we'll compare their exchange rates across a range of currencies"
	/>
	<meta property="og:url" content="monierate.com/ng/compare/provider" />
	<meta property="og:image" content="https://monierate.com/monierate-og-image.png" />
</svelte:head>

<div>
	<div class="container">
		<h1 class="text-2xl md:text-4xl mb-2">Compare naira exchange rates by providers</h1>
		<div class="text-lg text-gray-600 font-normal dark:text-gray-300">
			<p>
				Choose the provider you’d like to see their rates, and we'll compare their exchange rates
				across a range of currencies.
			</p>
		</div>
	</div>
</div>

<main>
	<div class="container">
		<section id="popular" class="mt-12">
			<div class="block md:flex md:items-center md:flex-wrap">
				{#each providers as provider}
					{#if provider.is_active && provider.pairs}
						<a
							href="/ng/compare/providers/{provider.code}-exchange-rates"
							class="inline-block w-[100%] md:w-[22%] shadow-md rounded-lg border border-gray-100 dark:border-gray-700 text-black dark:text-white mr-8 last-child:mr-0 p-4 mb-4"
						>
							<span class="flex items-center">
								<span
									class="inline-block w-[32px] h-[32px] rounded-full bg-no-repeat bg-cover border border-black bg-black-200 mr-4"
									style="background-image: url('/icons/{provider.icon}');"
								/>
								<span class="">{provider.name}</span>
							</span>
						</a>
					{/if}
				{/each}
			</div>
		</section>
	</div>
</main>

<style>
</style>
