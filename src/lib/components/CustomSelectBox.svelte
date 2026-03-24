<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';

	export let options: any = [];
	export let className = '';
	export let selected: any = '';
	export let labelValues: boolean = false;
	export let id = '';
	export let multiple: boolean = false;
	export let placeholder: string = '';
	export let fullbox: boolean = false;
	export let isDropdownOpen: boolean = false;

	let selectedItems: any = multiple ? (Array.isArray(selected) ? [...selected] : []) : '';
	let selectedIcon: string;
	let searchQuery = '';
	let filtered = options;

	let isOpen = false;
	let dropdown: any;
	const dispatch = createEventDispatcher();

	const toggleDropdown = () => {
		isOpen = !isOpen;
	};

	const selectOption = (option: any) => {
		if (multiple) {
			const value = option.value ? option.value : option.label;
			const index = selectedItems.indexOf(value);

			if (index === -1) {
				selectedItems = [...selectedItems, value];
			} else {
				selectedItems = selectedItems.filter((item: any) => item !== value);
			}
			selected = [...selectedItems];
			selectedItems = [...selectedItems];
		} else {
			selected = option.value ? option.value : option.label;
			selectedIcon = option.icon;
			isOpen = false;
		}

		dispatch('select', multiple ? { selectedItems } : option);
	};

	$: getSelectionText = () => {
		if (!multiple || selectedItems.length === 0) {
			let getSelected = options.find(
				(option: any) => option.value === selected || option.label === selected
			);
			if (getSelected) {
				return getSelected.label;
			}
			return placeholder || 'Select an option';
		}

		if (selectedItems.length === 1) {
			const selectedOption = options.find(
				(option: any) => option.value === selectedItems[0] || option.label === selectedItems[0]
			);
			return selectedOption?.label || selectedItems[0];
		}

		return `${selectedItems.length} items selected`;
	};

	const isSelected = (option: any) => {
		if (!multiple) return false;
		const value = option.value ? option.value : option.label;
		return selectedItems.includes(value);
	};

	const handleClickOutside = (event: any) => {
		if (dropdown && !dropdown.contains(event.target)) {
			isOpen = false;
		}
	};

	$: filtered = options.filter(
		(option: any) =>
			option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
			option?.value?.toLowerCase()?.includes(searchQuery.toLowerCase())
	);

	$: {
		if (multiple && Array.isArray(selected)) {
			selectedItems = [...selected];
			filtered = filtered;
		} else if (!multiple && selected) {
			const selectedOption = options.find(
				(option: any) => option.label === selected || option?.value === selected
			);
			if (selectedOption) {
				selectedIcon = selectedOption.icon;
			}
		}
		isDropdownOpen = isOpen;
	}

	const isImage = (icon: string) =>
		icon && /^(https?:\/\/|\/|\.\/|\.\.).*\.(png|jpg|jpeg|gif|svg)$/.test(icon);

	onMount(() => {
		if (!multiple && selected && options.length > 0) {
			const selectedOption = options.find(
				(option: any) => option.label === selected || option?.value === selected
			);
			if (selectedOption) {
				selectedIcon = selectedOption.icon;
			}
		} else if (multiple && Array.isArray(selected)) {
			selectedItems = [...selected];
		}

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class={`relative w-auto inline-block ${fullbox ? 'w-full' : ''}`} bind:this={dropdown} {id}>
	<button
		class="w-full bg-gray-50 dark:bg-gray-800 text-dark dark:text-white px-4 py-2 rounded-md flex justify-between items-center border border-gray-300 dark:border-gray-600 hover:border-gray-400 w-64 {className}"
		on:click={toggleDropdown}
	>
		{#if multiple && placeholder && placeholder !== ''}
			<span>{placeholder}</span>
		{:else}
			<span class="inline-flex truncate max-w-full">
				{#if !multiple && selectedIcon}
					{#if isImage(selectedIcon)}
						<img src={selectedIcon} alt="icon" class="mr-2 w-5 h-5" />
					{:else}
						<i class={`mr-2 ${selectedIcon}`} />
					{/if}
				{/if}
				{getSelectionText()}
			</span>
			<svg
				class="w-4 h-4 ml-2 transform {isOpen ? 'rotate-180' : ''}"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 011.08 1.04l-4.24 4.24a.75.75 0 01-1.08 0l-4.24-4.24a.75.75 0 01.02-1.06z"
					clip-rule="evenodd"
				/>
			</svg>
		{/if}
	</button>

	{#if isOpen}
		<div
			class="absolute z-10 mt-2 w-full bg-gray-50 text-dark dark:bg-gray-800 dark:text-white rounded-md shadow-lg border border-gray-300 dark:border-gray-600 min-w-64 max-w-[350px]"
		>
			{#if options.length > 10}
				<div class="p-4">
					<div
						class="flex items-center px-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>

						<input
							type="text"
							class="w-full px-4 py-2 text-dark dark:text-white focus:outline-none bg-gray-50 dark:bg-gray-700"
							placeholder="Search..."
							bind:value={searchQuery}
						/>
					</div>
				</div>
			{/if}
			<ul class="max-h-48 overflow-y-auto custom-scrollbar">
				{#each filtered as option}
					<li
						class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
						on:click={() => selectOption(option)}
					>
						<div class="flex items-center flex-grow">
							{#if option.icon}
								{#if isImage(option.icon)}
									<img src={option.icon} alt="icon" class="mr-2 w-5 h-5" />
								{:else}
									<i class={`mr-2 ${option.icon}`} />
								{/if}
							{/if}
							<span class={option.description ? 'text-left' : ''}>
								<div>
									{option.label}
									{labelValues ? `(${option.value})` : ''}
								</div>
								{#if option.description}
									<div class="text-sm text-gray-500 dark:text-gray-400 pl-1">
										{option.description}
									</div>
								{/if}
							</span>
						</div>
						{#if multiple && isSelected(option)}
							<div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center ml-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="white"
									stroke-width="3"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							</div>
						{/if}
					</li>
				{/each}
			</ul>
			{#if multiple}
				<div class="flex justify-between border-t border-gray-300 dark:border-gray-600 p-2">
					<button
						class="px-3 py-1 text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
						on:click={() => {
							selectedItems = [];
							selected = [];
							dispatch('select', { selectedItems: [] });
						}}
					>
						Clear all
					</button>
					<button
						class="button px-3 py-1 text-sm"
						on:click={() => {
							isOpen = false;
						}}
					>
						Done
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.rotate-180 {
		transform: rotate(180deg);
	}
	.custom-scrollbar::-webkit-scrollbar {
		width: 8px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: #888;
		border-radius: 4px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
</style>
