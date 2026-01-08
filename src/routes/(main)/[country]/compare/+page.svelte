<script>
    /** @type {import('./$types').PageServerData} */

    export let data;
</script>

<svelte:head>
	<title>Compare naira exchange rates | Monierate</title>
	<meta name="description" content="Compare exchange rates by currencies or provider on Monierate. Choose the currency or provider, and we'll compare the exchange rates across a range of provider and currencies.">
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Compare naira exchange rates | Monierate" />
	<meta property="og:description" content="Compare exchange rates by currencies or provider. Choose the currency or provider, and we'll compare the exchange rates across a range of provider and currencies." />
	<meta property="og:url" content="monierate.com/ng/compare" />
    <meta property="og:image" content="https://monierate.com/monierate-og-image.png">
</svelte:head>

<div>
    <div class="container">
        <h1 class="text-2xl md:text-4xl mb-2">
            Compare naira exchange rates
        </h1>
    </div>
</div>

<main>
    <div class="container">
        <section id="popular" class="mt-12">
            <div class="grid grid-cols-2 gap-4 place-content-center h-48 ...">
                <!-- <a href="/ng/compare/providers" class="h-64 shadow-md rounded-lg border border-gray-100 dark:border-gray-700 text-black text-2xl dark:text-white flex cols justify-center items-center">
                    <span>Providers</span>
                </a> -->
                <a href="/ng/compare/currencies" class="h-64 shadow-md rounded-lg border border-gray-100 dark:border-gray-700 text-black text-2xl dark:text-white flex cols justify-center items-center">
                    <span>Currencies</span>
                </a>
            </div>
        </section>
    </div>
</main>

<style>

</style>