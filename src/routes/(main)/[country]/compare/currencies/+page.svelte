<script>
    /** @type {import('./$types').PageServerData} */

    export let data;
    const major_currencies = data.major_currencies
    const african_currencies = data.african_currencies
    const crypto_currencies = data.crypto_currencies
</script>

<svelte:head>
	<title>Compare naira exchange rates | Monierate</title>
	<meta name="description" content="Compare naira exchange rates by 52+ currencies | Monierate">
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Compare naira exchange rates by 52+ currencies | Monierate" />
	<meta property="og:description" content="Choose the currency you're exchanging naira to, and we'll compare the best exchange rate providers for you." />
	<meta property="og:url" content="monierate.com/ng/compare/currencies" />
    <meta property="og:image" content="https://monierate.com/monierate-og-image.png">
</svelte:head>

<div>
    <div class="container">
        <h1 class="text-2xl md:text-4xl mb-2">
            Compare naira exchange rates by 52+ currencies
        </h1>
        <div class="text-lg text-gray-600 font-normal dark:text-gray-300">
            <p>
                Choose the currency you're exchanging money to, and we'll compare the best exchange rate providers for you.
            </p>
        </div>
    </div>
</div>

<main>
    <div class="container">
        <section id="popular" class="mt-12">
            <h2 class="text-xl md:text-2xl mb-4">Popular currencies</h2>
            <div class="block md:flex md:items-center md:flex-wrap">
                {#each Object.entries(major_currencies) as [currency, code]}
                    <a href="/ng/compare/currencies/best-{currency.toLowerCase()}-exchange-rates" class="inline-block w-[100%] md:w-[22%] shadow-md rounded-lg border border-gray-100 dark:border-gray-700 text-black dark:text-white mr-8 last-child:mr-0 p-4 mb-4">
                        <span class="flex items-center">
                            <span class="inline-block w-[32px] h-[32px] rounded-full bg-no-repeat bg-cover border border-black bg-black-200 mr-4" style="background-image: url('https://wise.com/public-resources/assets/flags/rectangle/{currency.toLowerCase()}.png');"></span>
                            <span class="">{ code }</span> 
                        </span>
                    </a>
                {/each}
            </div>
        </section>

        <section id="crypto" class="mt-12">
            <h2 class="text-xl md:text-2xl mb-4">Cryptocurrencies</h2>
            <div class="block md:flex md:items-center md:flex-wrap">
                {#each Object.entries(crypto_currencies) as [currency, code]}
                    <a href="/ng/compare/currencies/best-{currency.toLowerCase()}-exchange-rates-crypto" class="inline-block w-[100%] md:w-[22%] shadow-md rounded-lg border border-gray-100 dark:border-gray-700 text-black dark:text-white mr-8 last-child:mr-0 p-4 mb-4">
                        <span class="flex items-center">
                            <span class="inline-block w-[32px] h-[32px] rounded-full bg-no-repeat bg-cover border border-black bg-black-200 mr-4" style="background-image: url('https://raw.githubusercontent.com/monierate/currencies/main/assets/available_icons/{currency.toLowerCase()}.png');"></span>
                            <span class="">{ code }</span> 
                        </span>
                    </a>
                {/each}
            </div>
        </section>

        <section id="africa" class="mt-12">
            <h2 class="text-xl md:text-2xl mb-4">African currencies</h2>
            <div class="block md:flex md:items-center md:flex-wrap">
                {#each Object.entries(african_currencies) as [currency, code]}
                    <a href="/ng/compare/currencies/best-{currency.toLowerCase()}-exchange-rates" class="block md:inline-block w-[100%] md:w-[22%] shadow-md rounded-lg border border-gray-100 dark:border-gray-700 text-black dark:text-white mr-8 last-child:mr-0 p-4 mb-4">
                        <span class="flex items-center">
                            <span class="inline-block w-[32px] h-[32px] rounded-full bg-no-repeat bg-cover border border-black bg-black-200 mr-4" style="background-image: url('https://raw.githubusercontent.com/monierate/currencies/main/assets/available_icons/{currency.toLowerCase()}.png');"></span>
                            <span>{ code }</span> 
                        </span>
                    </a>
                {/each}
            </div>
        </section>
    </div>
</main>

<style>

</style>