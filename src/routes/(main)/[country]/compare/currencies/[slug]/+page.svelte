<script>
    /** @type {import('./$types').PageServerData} */
    import Money from "$lib/money";
    import { format, friendlyDate, sortRates } from "$lib/functions";

    export let data;

    const currency = data.currency;
    const country = data.country;
    const pair_changers = sortRates(data.pair_changers);
    const market_changer = pair_changers.find(changer => changer.changer_code === 'market');
    const changers = data.changers;

    console.log(pair_changers);
</script>

<svelte:head>
	<title>Best {currency.name} exchange rates in {country.name} | Monierate</title>
	<meta name="description" content="">
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Compare naira exchange rates by 52+ currencies | Monierate" />
	<meta property="og:description" content="Choose the currency you're exchanging naira to, and we'll compare the best exchange rate providers for you." />
	<meta property="og:url" content="monierate.com/ng/compare/currencies" />
    <meta property="og:image" content="https://monierate.com/monierate-og-image.png">
</svelte:head>

<div>
    <div class="container md:w-[768px] md:mx-auto">
        <section class="w-full mx-auto pb-16">
            <h1 class="text-2xl md:text-4xl mb-2 dark:text-gray-100">
                Best {currency.name} exchange rates in {country.name}
            </h1>
            <div class="text-lg text-gray-600 font-normal dark:text-gray-300">
                <p>
                    Compare today’s best exchange rate for {currency.name}. We compare live prices for currency exchange providers in {country.name} — so you can get the best value for your money.
                </p>
            </div>
        </section>

        <section class="bg-white py-[10px] mb-16 border rounded-lg shadow-sm dark:bg-gray-900 dark:text-light w-full md:w-[768px] md:mx-auto overflow-x-scroll md:overflow-x-hidden">
            <div class="py-8 text-center">
                <span class="market-rate block text-xl md:text-2xl font-bold">
                    1 {currency.code} = 
                    {Money.format(market_changer.price_buy || market_changer.price_sell || "0")} NGN
                </span>
                <span class="block text-sm text-gray-700 dark:text-gray-300">
                    Mid-market exchange rate
                    <span class="block">{format(market_changer.updated_at)}</span>
                </span>
            </div>

            {#if pair_changers.length > 1}
                <table class="table-auto overflow-x-scroll w-full text-sm text-left ">
                    <thead>
                        <tr>
                            <th scope="col" class="py-3 md:pl-0 w-[30%] font-bold font-bitter">
                                Provider
                            </th>
                            <th scope="col" class="pl-6 pr-6 py-3 font-bold font-bitter text-right">
                                Buy rate
                            </th>
                            <th scope="col" class="pl-6 pr-6 py-3 font-bold font-bitter text-right">
                                Sell rate
                            </th>
                            <th scope="col" class="pl-6 py-3 font-bold font-bitter text-right pr-2 md:pr-4 whitespace-nowrap">
                                Last updated
                            </th>
                        </tr>
                    </thead>
                    <tbody class="providers">
                        {#each pair_changers as pair_changer}
                            {#if pair_changer.changer_code != 'market'}
                            <tr class="mb-4 border-t border-gray-200 dark:border-gray-700">
                                <td>
                                    <a href="/converter/{pair_changer.changer_code}?Amount=1&From=USD&To=NGN" class="flex items-center">
                                        <span class="provider-icon">
                                            <img width="22px" height="22px" src="/icons/{changers[pair_changer.changer_code].icon}" class="rounded-full" alt="{changers[pair_changer.changer_code].name} icon">
                                        </span>
                                        <span class="provider-title">{changers[pair_changer.changer_code].name}</span>
                                    </a>
                                </td>
                                <td class="text-right pl-6 pr-6">
                                    <span class="provider-rate">
                                        {#if Money.format(pair_changer.price_buy, 0) === "0"}
                                        -
                                        {:else}
                                            ₦{Money.format(pair_changer.price_buy, 0)}
                                        {/if}
                                    </span>
                                    <small class="provider-rate-base">per {currency.code}</small>
                                </td>
                                <td class="text-right pl-6 pr-6">
                                    <span class="provider-rate">
                                        {#if Money.format(pair_changer.price_sell, 0) === "0"}
                                        -
                                        {:else}
                                            ₦{Money.format(pair_changer.price_sell, 0)}
                                        {/if}
                                    </span>
                                    <small class="provider-rate-base">per {currency.code}</small>
                                </td>
                                <td class="text-right py-2 pr-2 md:pr-4 whitespace-nowrap text-sm">
                                    {#if (pair_changer.updated_at) }
                                        {friendlyDate(new Date(pair_changer.updated_at))}
                                    {/if}
                                </td>
                            </tr>
                            {/if}
                        {/each}
                    </tbody>
                </table>
            {:else}
                <div class="text-center py-16">
                    <span class="block pb-6">
                        <svg class="mx-auto" width="85px" height="85px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M5.0315 6.93751C4.75731 4.72857 6.30192 2.69766 8.54207 2.32168L8.93963 2.25496C10.9651 1.91501 13.0349 1.91501 15.0604 2.25496L15.4579 2.32168C17.6981 2.69766 19.2427 4.72857 18.9685 6.93751L18.9505 7.08273C18.8855 7.6063 18.4315 8 17.8928 8H6.10719C5.56847 8 5.11452 7.6063 5.04953 7.08273L5.0315 6.93751Z" stroke="#888888" stroke-width="1.5"></path>
                                <path d="M9 8L6 22" stroke="#888888" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15 8L15.75 11.5M18 22L16.5 15" stroke="#888888" stroke-width="1.5" stroke-linecap="round"></path> <path d="M16.5 17H7.5" stroke="#888888" stroke-width="1.5" stroke-linecap="round"></path>
                            </g>
                        </svg>
                    </span>
                    <span class="text-xl fold-bold block">
                        We should have shown you rates from other market providers – we haven’t gotten to them all yet.
                    </span>
                    <p></p>
                </div>
            {/if}
            
        </section>

        <section>
            <h2 class="text-2xl">How to get the best {currency.name} rate in Nigeria</h2>
            <div class="py-6 text-lg">
                <p class="mb-4">We collect rates from the most popular currency exchange providers — so you don’t have to.</p>
                <p class="mb-4">We want to bring you the best {currency.code}/NGN rate possible, so we compared the rates for exchanging {currency.name} in Nigeria.</p>
                <p class="mb-4">However, note that converting, sending a money transfer, or trading {currency.code}/NGN may cost extra fees based on the provider you used.</p>
            </div>
        </section>

        <section>
            <h2 class="text-2xl">
                Why does getting a good {currency.name} exchange rate in Nigeria matter?
            </h2>
            <div class="py-6 text-lg">
                <p class="mb-4">The lower the rate of converting NGN to {currency.code}, the more {currency.name} for you. The higher the rate of converting {currency.code} to NGN, the more money for you. That’s why it’s important to compare multiple rates from different market providers before you convert your money.</p>
                <p class="mb-4">When exchanging currencies, banks or exchange providers usually add hidden markups in the exchange rate. Some may also charge extra conversion or trading fee. So you end up getting less money.</p>
                <p class="mb-4">You should always look for the best possible exchange rate, this will save you some extra money.</p>
            </div>
        </section>

        <section>
            <h2 class="text-2xl">
                Waiting for the best rate to exchange {currency.name} in Nigeria
            </h2>
            <div class="py-6 text-lg">
                <p class="mb-4">Knowing when to exchange {currency.code} can be tricky. Exchange rates are often volatile, as they react to economic and political events. And rates move so quickly — when you find the right time, how do you grab it?</p>
                <p class="mb-4">Follow us on <a href="https://x.com/monierate">Twitter</a> or join our <a href="https://t.me/monierate">Telegram</a> for rate alerts, and you’ll get live updates.</p>
            </div>
        </section>

        <section>
            <h2 class="text-2xl">
                About {currency.code}/NGN
            </h2>
            <div class="py-6 text-lg">
                <p class="mb-4">{currency.code} is the currency code of {currency.name}. NGN is the currency code of Nigeria Naira. Nigeria Naira is the official currency of Nigeria. {currency.code}/NGN is the exchange market of {currency.name} and Nigerian Naira.</p>
            </div>
        </section>
    </div>
</div>

<style>
table thead th {
    @apply dark:text-gray-300 text-black whitespace-nowrap
}
table tbody tr td {
    @apply py-6 whitespace-nowrap
}
table tr td:first-child, table thead th:first-child {
    @apply pl-4
}
.provider {
    @apply flex justify-between items-center py-2 border-b border-gray-200;
}
.provider:last-child {
    @apply border-b-0
}
.provider-icon {
    @apply bg-transparent border border-black rounded-full w-[24px] h-[24px] mr-2;
}
.provider-title {
    @apply font-semibold text-sm capitalize text-gray-800 dark:text-gray-300;
}
.provider-rate-base {
    @apply text-gray-500 dark:text-gray-400;
}
.provider-rate {
    @apply block font-semibold text-sm text-gray-800 dark:text-light;
}
</style>