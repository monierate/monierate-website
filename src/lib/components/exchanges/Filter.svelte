<script lang="ts">
	import { setUrlParam } from '$lib/functions';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let search: string = '';
	export let onSearch: (a: any) => void = () => {};
	export let selectedCurrency = 'NGN';
	export let onChangeCurrency: (currency: any) => void = () => {};
	export let disableSearch: boolean = false;

	let currencies = ['NGN', 'GHS', 'KES'];

	let currencyTabContainer: HTMLDivElement;
	let showCurrencyTabLeftScrollButton: boolean = false;
	let showCurrencyTabRightScrollButton: boolean = false;

	function checkCurrencyTabScroll() {
		if (!currencyTabContainer) return;

		const tolerance = 1; // buffer for rounding errors
		showCurrencyTabLeftScrollButton = currencyTabContainer.scrollLeft > tolerance;
		showCurrencyTabRightScrollButton =
			currencyTabContainer.scrollLeft + currencyTabContainer.clientWidth <
			currencyTabContainer.scrollWidth - tolerance;
	}

	function currencyTabScrollByLeft(amount = 150) {
		currencyTabContainer.scrollBy({ left: -amount, behavior: 'smooth' });
	}

	function currencyTabScrollByRight(amount = 150) {
		currencyTabContainer.scrollBy({ left: amount, behavior: 'smooth' });
	}

	onMount(() => {
		try {
			checkCurrencyTabScroll();
			currencyTabContainer.addEventListener('scroll', checkCurrencyTabScroll);
			window.addEventListener('resize', checkCurrencyTabScroll);
		} catch (error) {
			console.error('Error setting up scroll listeners:', error);
		}

		return () => {
			try {
				currencyTabContainer.removeEventListener('scroll', checkCurrencyTabScroll);
				window.removeEventListener('resize', checkCurrencyTabScroll);
			} catch (error) {
				console.error('Error removing scroll listeners:', error);
			}
		};
	});
</script>

<!-- Top Section: Currency Tabs + Search on desktop -->
<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
	<!-- Currency Tabs (scrollable) -->
	<div class="relative">
		{#if showCurrencyTabLeftScrollButton}
			<span
				class="absolute -left-1 top-1/2 -translate-y-1/2 h-full pl-2 pr-4 bg-gradient-to-r from-white to-white/10 dark:from-gray-800 dark:to-gray-800/10 z-2"
			>
				<button
					class="relative -top-1 w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-full bg-white/80 dark:bg-gray-800/80"
					on:click={() => currencyTabScrollByLeft()}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6 text-gray-700 dark:text-gray-200"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
					</svg>
				</button>
			</span>
		{/if}

		<div bind:this={currencyTabContainer} class="overflow-x-auto no-scrollbar scroll-smooth">
			<div class="flex flex-nowrap gap-2 border border-[var(--card-border)] rounded-md p-1 min-w-max">
				<button
					class={`px-3 py-1 rounded text-sm whitespace-nowrap gap-2 inline-flex items-center ${
						selectedCurrency === 'all'
							? 'bg-[var(--accent)] text-white font-medium'
							: 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
					}`}
					on:click={async () => {
						selectedCurrency = 'all';
						onChangeCurrency('all');
						setUrlParam('currency', 'all');
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
						/>
					</svg>

					<span> All </span>
				</button>
				{#each currencies as currency}
					<button
						class={`px-3 py-1 rounded text-sm whitespace-nowrap gap-2 inline-flex items-center ${
							selectedCurrency === currency
								? 'bg-[var(--accent)] text-white font-medium'
								: 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
						}`}
						on:click={async () => {
							selectedCurrency = currency;
							onChangeCurrency(currency);
							setUrlParam('currency', currency);
						}}
					>
						<img
							src={`https://stablerate.app/icons/currencies/${currency.toLowerCase()}.png`}
							class="w-4 h-4 rounded-full object-fit"
							alt={currency}
						/>
						<span>
							{currency}
						</span>
					</button>
				{/each}
			</div>
		</div>

		{#if showCurrencyTabRightScrollButton}
			<span
				class="absolute -right-1 top-1/2 -translate-y-1/2 h-full pl-4 pr-2 bg-gradient-to-l from-white to-white/10 dark:from-gray-800 dark:to-gray-800/10 z-2"
			>
				<button
					class="relative -top-1 w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-full bg-white/80 dark:bg-gray-800/80"
					on:click={() => currencyTabScrollByRight()}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6 text-gray-700 dark:text-gray-200"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
					</svg>
				</button>
			</span>
		{/if}
	</div>

	{#if !disableSearch}
		<!-- Search (desktop only) -->
		<div class="hidden md:flex items-center gap-1">
			<div
				class="flex relative items-center rounded-md bg-[var(--input-bg)] border border-[var(--input-border)] px-3 py-2 w-full md:w-72"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-5 mr-2 text-gray-400"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					/>
				</svg>

				<input
					type="text"
					class="flex-1 outline-none text-sm text-gray-700 dark:text-gray-200 bg-transparent"
					placeholder="Search providers..."
					on:input={onSearch}
					bind:value={search}
					id="search"
				/>
			</div>
			<button
				class="rounded-md bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-1.5 inline-flex items-center gap-2"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="size-5"
				>
					<path
						d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
					/>
				</svg>
				Filter
			</button>
		</div>
	{/if}
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		scrollbar-width: none;
	}
	.category-link {
		@apply flex items-center gap-2 px-3 py-1 text-sm rounded whitespace-nowrap font-bold;
	}
	.category-link.active {
		@apply bg-blue-50 text-primary font-semibold;
	}
	.category-link.normal {
		@apply text-gray-500 dark:text-gray-300 hover:text-primary;
	}
</style>
