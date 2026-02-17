<script lang="ts">
	import { onMount } from 'svelte';
	import BulkDeleteDialog from '$lib/components/price-alert/BulkDeleteDialog.svelte';
	import CustomSelectBox from '$lib/components/CustomSelectBox.svelte';

	export let searchText: string = '';
	export let isRecent: boolean = true;
	export let pairList: string[] = [];
	export let selectedFilter: string = '';
	export let onToggleSort: () => void = () => {};
	export let onFilterByPair: (filter: string) => void = () => {};
	export let onSearch: (input: string) => void = () => {};

	let showSearch: boolean = false;
	let showConfirmAllAlertDeletion: boolean = false;
	let showConfirmDisabledAlertDeletion: boolean = false;
	let showConfirmEnabledAlertDeletion: boolean = false;
	let showAllAlertOptions: boolean = false;

	onMount(() => {
		window.addEventListener('click', (e) => {
			if (e.target instanceof HTMLElement && !e.target.closest('.all-alert-options')) {
				showAllAlertOptions = false;
			}
		});
	});
</script>

<div class="flex items-center justify-between mb-4 relative">
	<div class="flex gap-2 items-center">
		<span class="text-gray-800 dark:text-gray-400">Sort:</span>
		<button
			class="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded inline-flex items-center gap-2"
			on:click={onToggleSort}
		>
			{#if isRecent}
				<!-- Sort Descending -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M11 5h10" />
					<path d="M11 9h7" />
					<path d="M11 13h4" />
					<path d="M3 17l3 3 3-3" />
					<path d="M6 4v16" />
				</svg>
			{:else}
				<!-- Sort Ascending -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M11 11h4" />
					<path d="M11 15h7" />
					<path d="M11 19h10" />
					<path d="M3 7l3-3 3 3" />
					<path d="M6 4v16" />
				</svg>
			{/if}
			{isRecent ? 'Most Recent' : 'Oldest'}
		</button>
		<span class="hidden md:inline">
			<CustomSelectBox
				options={pairList}
				className="!py-1"
				on:select={() => onFilterByPair(selectedFilter)}
				bind:selected={selectedFilter}
				placeholder="Filter by Pairs"
			/>
			<button
				class="text-blue-500 mx-2 {selectedFilter === '' ? 'hidden' : ''}"
				on:click={() => {
					selectedFilter = '';
					onFilterByPair(selectedFilter);
				}}>Clear filter</button
			>
		</span>
		<span class="flex md:inline items-center justify-center md:justify-start">
			<button
				class="bg-transpareent p-2 md:hidden"
				on:click={() => (showSearch = !showSearch)}
				aria-label="Search"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="size-5 cursor-pointer"
				>
					<path
						fill-rule="evenodd"
						d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			<span
				class="flex items-center gap-2 md:flex-none w-full md:w-auto bg-gray-50 dark:bg-gray-800 p-2 md:p-0 absolute md:static -top-1 left-0 transition-opacity duration-300 md:inline z-50"
				class:hidden={!showSearch}
			>
				<input
					type="search"
					class="input border-none w-10 m-0 w-auto bg-gray-200 dark:bg-gray-700 text-gray-500 px-3 py-1 rounded"
					placeholder="Search..."
					bind:value={searchText}
					on:input={() => onSearch(searchText)}
				/>
				<button on:click={() => (showSearch = false)} class="button md:hidden" aria-label="Close"
					>Cancel</button
				>
			</span>
		</span>
	</div>
	<div class="flex items-center gap-5">
		<span class="relative all-alert-options pr-5 md:pr-0">
			<button
				on:click={() => (showAllAlertOptions = !showAllAlertOptions)}
				aria-label="All alert options"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="size-5"
				>
					<path
						fill-rule="evenodd"
						d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			<span
				class="{showAllAlertOptions
					? 'flex'
					: 'hidden'} flex-col gap-4 w-64 z-[70] absolute top-5 right-0 md:left-1/2 md:transform md:-translate-x-1/2 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-lg"
			>
				<button
					class="hover:bg-gray-200 dark:hover:bg-gray-800"
					on:click={() => (showConfirmAllAlertDeletion = true)}>Delete all alerts</button
				>
				<button
					class="hover:bg-gray-200 dark:hover:bg-gray-800"
					on:click={() => (showConfirmEnabledAlertDeletion = true)}
					>Delete all enabled alerts</button
				>
				<button
					class="hover:bg-gray-200 dark:hover:bg-gray-800"
					on:click={() => (showConfirmDisabledAlertDeletion = true)}
					>Delete all disabled alerts</button
				>
			</span>
		</span>
		<a href="/alerts/price-alert/" class="button hidden md:inline-block">Create alert</a>
	</div>
</div>

<div class="md:hidden mb-8">
	<span class="text-gray-800 dark:text-gray-400">Filter:</span>
	<CustomSelectBox
		options={pairList}
		className="!py-1"
		on:select={() => onFilterByPair(selectedFilter)}
		bind:selected={selectedFilter}
		placeholder="Filter by Pairs"
	/>
	<button
		class="text-blue-500 mx-2 {selectedFilter === '' ? 'hidden' : ''}"
		on:click={() => {
			selectedFilter = '';
			onFilterByPair(selectedFilter);
		}}>Clear filter</button
	>
</div>

<BulkDeleteDialog
	bind:showConfirmAllAlertDeletion
	bind:showConfirmDisabledAlertDeletion
	bind:showConfirmEnabledAlertDeletion
/>
