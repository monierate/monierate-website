<script lang="ts">
    /** @type {import('./$types').PageServerData} */
    import Money from "$lib/money";
    import { friendlyDate } from "$lib/functions";

    export let data;

    const changer = data.changer;
    const pairs = Object.entries(changer.pairs) as any[];

    function getCurrency(pair: string) {
        return pair.split('ngn')[0];
    }
</script>

<svelte:head>
	<title>{changer.name} exchange rates in Nigeria | Monierate</title>
	<meta name="description" content="Compare {changer.name} exchange rates in a range of currencies on Monierate.">
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{changer.name} exchange rates in Nigeria | Monierate" />
	<meta property="og:description" content="Compare {changer.name} exchange rates in a range of currencies." />
	<meta property="og:url" content="monierate.com/ng/compare/changer" />
    <meta property="og:image" content="https://monierate.com/monierate-og-image.png">
</svelte:head>

<div>
    <div class="container md:w-[768px] md:mx-auto">
        <section class="w-full mx-auto pb-16 text-center">
            <span class="inline-block bg-transparent border border-black rounded-full w-[32px] h-[32px] mt-4">
                <img src="/icons/{changer.icon}" width="30px" height="30px" class="rounded-full" alt="{changer.name} icon">
            </span>
            <h1 class="text-2xl md:text-4xl mb-2 dark:text-gray-100">
                {changer.name} exchange rates in Nigeria
            </h1>
            <div class="text-lg text-gray-600 font-normal dark:text-gray-300">
                <p>
                    Considering using {changer.name}? Compare {changer.name} exchange rates in Nigeria.
                </p>
            </div>
        </section>

        <section class="bg-white py-[10px] mb-16 border rounded-lg shadow-sm dark:bg-gray-900 dark:text-light w-full md:w-[768px] md:mx-auto overflow-x-scroll md:overflow-x-hidden">
            {#if pairs.length > 0}
                <table class="table-auto overflow-x-scroll w-full text-sm text-left ">
                    <thead>
                        <tr>
                            <th scope="col" class="py-3 md:pl-0  w-[30%] font-bold font-bitter">
                                Currency
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
                    <tbody class="changers">
                        {#each pairs as [pair, rate]}
                            <tr class="mb-4 border-t border-gray-200 dark:border-gray-700">
                                <td>
                                    <span class="flex items-center">
                                        <span class="inline-block w-[32px] h-[32px] rounded-full bg-no-repeat bg-cover border border-black bg-black-200 mr-4" style="background-image: url('https://raw.githubusercontent.com/monierate/currencies/main/assets/available_icons/{getCurrency(pair)}.png');"></span>
                                        <span class="changer-title">{getCurrency(pair).toUpperCase()}</span>
                                    </span>
                                </td>
                                <td class="text-right pl-6 pr-6">
                                    <span class="changer-rate">
                                        {#if Money.format(rate.price_buy, 0) === "0"}
                                        -
                                        {:else}
                                            ₦{Money.format(rate.price_buy, 0)}
                                        {/if}
                                    </span>
                                    <small class="changer-rate-base">per {pair}</small>
                                </td>
                                <td class="text-right pl-6 pr-6">
                                    <span class="changer-rate">
                                        {#if Money.format(rate.price_sell, 0) === "0"}
                                        -
                                        {:else}
                                            ₦{Money.format(rate.price_sell, 0)}
                                        {/if}
                                    </span>
                                    <small class="changer-rate-base">per {pair}</small>
                                </td>
                                <td class="text-right py-2 pr-2 md:pr-4 whitespace-nowrap text-sm">
                                    {#if (rate.updated_at) }
                                        {friendlyDate(new Date(rate.updated_at))}
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {:else}
                <div class="text-center py-16">
                    <span class="block pb-6">
                        <svg class="mx-auto" width="85px" height="85px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.0315 6.93751C4.75731 4.72857 6.30192 2.69766 8.54207 2.32168L8.93963 2.25496C10.9651 1.91501 13.0349 1.91501 15.0604 2.25496L15.4579 2.32168C17.6981 2.69766 19.2427 4.72857 18.9685 6.93751L18.9505 7.08273C18.8855 7.6063 18.4315 8 17.8928 8H6.10719C5.56847 8 5.11452 7.6063 5.04953 7.08273L5.0315 6.93751Z" stroke="#888888" stroke-width="1.5"></path> <path d="M9 8L6 22" stroke="#888888" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15 8L15.75 11.5M18 22L16.5 15" stroke="#888888" stroke-width="1.5" stroke-linecap="round"></path> <path d="M16.5 17H7.5" stroke="#888888" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                    </span>
                    <span class="text-xl fold-bold block">
                        We should have shown you rates from {changer.name} – we haven’t gotten to them all yet.
                    </span>
                    <p></p>
                </div>
            {/if}
            
        </section>

        <section>
            <h2 class="text-2xl">About {changer.name} in Nigeria</h2>
            <div class="py-6 text-lg">
                <p class="mb-4">{changer.bio}</p>
            </div>
        </section>

        <section>
            <h2 class="text-2xl">How to use {changer.name} in Nigeria</h2>
            <div class="py-6 text-lg">
                <p class="mb-4">
                    To get starting using {changer.name} in Nigeria, follow the steps below.
                </p>
                <ol class="list-decimal ml-12 mb-4">
                    <li>Visit {changer.name} website to get started.</li>
                    <li>Create an account with your personal details.</li>
                    <li>Verify your account as required.</li>
                </ol>
                <p>Once your account is fully setup, you can start using {changer.name} to transact.</p>
            </div>
        </section>
        <section>
            <h2 class="text-2xl">Learn more about {changer.name}</h2>
            <div class="py-6 text-lg">
                Want to learn more about {changer.name}? Click <a href="{changer.link}">here</a> to learn more.
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

.changer {
    @apply flex justify-between items-center py-2 border-b border-gray-200;
}
.changer:last-child {
    @apply border-b-0
}
.changer-icon {
    @apply bg-transparent border border-black rounded-full w-[24px] h-[24px] mr-2;
}
.changer-title {
    @apply font-semibold text-sm capitalize text-gray-800 dark:text-gray-300;
}
.changer-rate-base {
    @apply text-gray-500 dark:text-gray-400;
}
.changer-rate {
    @apply block font-semibold text-sm text-gray-800 dark:text-light;
}
</style>