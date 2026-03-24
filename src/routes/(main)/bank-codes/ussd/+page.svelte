<script lang="ts">
	import BankCard from '$lib/components/bank-codes/BankUssdCard.svelte';

	export let data;

	let { banksData } = data;
	let searchTerm: string = '';

	let filteredBanksData = Object.values(banksData);
	const filterBanks = () => {
		if (!searchTerm) return (filteredBanksData = Object.values(banksData));

		const lowerCaseSearchTerm = searchTerm.toLowerCase();

		filteredBanksData = Object.values(banksData).filter((bank) => {
			return bank.name.toLowerCase().includes(lowerCaseSearchTerm);
		});
	};
</script>

<svelte:head>
	<title>Nigeria Banks USSD Codes</title>
	<meta name="description" content="Get all Nigeria Banks USSD codes for your mobile banking." />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Nigeria USSD Banking Codes" />
	<meta
		property="og:description"
		content="Get all Nigeria Bank USSD codes for your mobile banking."
	/>
	<meta property="og:url" content="https://monierate.com/bank-codes/ussd" />
	<meta
		property="og:image"
		content="https://monierate.com/uploads/monierate-ussd-code-og-image.png"
	/>
</svelte:head>

<div class=" mb-10">
	<h1 class="text-2xl md:text-4xl mb-4">Bank USSD Codes</h1>
</div>

<div class="mb-6">
	<div class="relative w-full md:max-w-[320px]">
		<input
			bind:value={searchTerm}
			on:input={filterBanks}
			type="search"
			placeholder="Search for a bank"
			class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
		/>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-4.35-4.35m1.15-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>
	</div>
</div>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-x-12 items-stretch">
	{#if filteredBanksData.length === 0}
		<p class="text-gray-500 dark:text-gray-400 col-span-full p-16 text-center">
			No banks found. Please try another search term.
		</p>
	{:else}
		{#each filteredBanksData as bankData, i}
			<BankCard {bankData} countryCode="ng" multiCountry={false} />
		{/each}
	{/if}
</div>
