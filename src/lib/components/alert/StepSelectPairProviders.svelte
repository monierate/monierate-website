<script lang="ts">
	import CustomSelectBox from '../CustomSelectBox.svelte';
	import { login_uri } from '$lib/functions';
	import { change_screen, CurrentScreen } from './useAlertForm';
	import type { Provider, DropdownOption } from './useAlertForm';

	export let isEdit: boolean = false;
	export let selectedProviders: string[] = [];
	export let selectedPair: any = '';
	export let pairList: any[];
	export let providers: Provider[];
	export let providersForDropdown: DropdownOption[];
	export let auth: any;

	let isSelectedProvidersDropdownOpen: boolean = false;
</script>

<div>
	{#if isEdit}
		<p class="text-xl mb-4">Please review and apply the necessary updates to refresh this alert.</p>
	{:else}
		<p class="text-xl mb-4">Select a pair and providers to get started.</p>
	{/if}

	<div class="mb-5">
		<label for="pair" class="label">Select a pair</label>
		<CustomSelectBox
			options={pairList}
			className="!w-full"
			bind:selected={selectedPair}
			id="pair"
			fullbox={true}
		/>
	</div>

	<div class="mb-10">
		<label for="providers" class="label">Select providers</label>
		<div
			class="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400"
		>
			{#if !isSelectedProvidersDropdownOpen}
				{#each selectedProviders as provider}
					<span
						class="bg-gray-100 dark:bg-gray-800 text-sm px-2 py-1 rounded-full mr-2 inline-flex items-center mb-2"
					>
						<img
							src="/icons/{Object.entries(providers).find(
								([_, value]) => value.code === provider
							)?.[1]?.icon}"
							alt="icon"
							class="w-4 h-4 mr-2"
						/>

						{Object.entries(providers).find(([_, value]) => value.code === provider)?.[1]?.name ||
							provider}

						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="size-4 ml-2 cursor-pointer"
							on:click={() => (selectedProviders = selectedProviders.filter((p) => p !== provider))}
							role="button"
							on:keydown={() => {}}
							tabindex="0"
						>
							<path
								d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
							/>
						</svg>
					</span>
				{/each}
			{/if}

			<CustomSelectBox
				options={providersForDropdown}
				className="!p-1 !px-2 !rounded-full !bg-gray-100 dark:!bg-gray-800 {selectedProviders.length ===
					0 || isSelectedProvidersDropdownOpen
					? 'block !w-full !justify-center !border-none !py-0'
					: '!text-sm'}"
				bind:selected={selectedProviders}
				multiple={true}
				placeholder={selectedProviders.length === 0 || isSelectedProvidersDropdownOpen
					? 'Select providers'
					: 'Add'}
				bind:isDropdownOpen={isSelectedProvidersDropdownOpen}
				fullbox={selectedProviders.length === 0 || isSelectedProvidersDropdownOpen ? true : false}
				id="providers"
			/>
		</div>
	</div>

	{#if !auth.isLoggedIn}
		<a
			href={login_uri('/alerts')}
			class="block button w-full text-center bg-blue-500 text-white font-semibold hover:bg-blue-600"
			>Login to continue</a
		>
	{:else}
		<button
			class="button w-full"
			disabled={!selectedPair || selectedProviders.length === 0}
			on:click={() => change_screen(CurrentScreen.SECOND_SCREEN)}>Continue</button
		>
	{/if}
</div>
