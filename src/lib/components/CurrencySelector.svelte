<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';

	export let currencies: string[] = ['NGN', 'KES'];
	export let selected: string = '';
    export let onSelect: (currency: string) => void = () => {};

	let open = false;
	let container: HTMLElement;

	function toggle() {
		open = !open;
	}

	function select(currency: string) {
		selected = currency;
		open = false;
        onSelect(currency);
	}

	function handleClick(event: MouseEvent) {
		if (open && container && !container.contains(event.target as Node)) {
			open = false;
		}
	}

	onMount(() => {
        if (!browser) return;
		document.addEventListener('click', handleClick);
	});

	onDestroy(() => {
        if (!browser) return;
		document.removeEventListener('click', handleClick);
	});
</script>

<div class="relative inline-block" bind:this={container}>
	<button
		type="button"
		class="bg-transparent p-2 md:px-4 flex items-center gap-1"
		on:click={toggle}
	>
		{#if selected}
			<img
				src={`/icons/currencies/${selected.toLowerCase()}.png`}
				alt={selected}
				class="w-6 h-4"
			/>
		{/if}

		<span>{selected || 'Select Currency'}</span>

		<svg
			class="w-4 h-4 transition-transform {open ? 'rotate-180' : ''}"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fill-rule="evenodd"
				d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 011.08 1.04l-4.24 4.24a.75.75 0 01-1.08 0l-4.24-4.24a.75.75 0 01.02-1.06z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>

	{#if open}
		<ul
			class="absolute z-10 mt-2 bg-gray-50 dark:bg-gray-800 rounded-md shadow border dark:border-gray-600"
		>
			{#each currencies as currency}
				<li>
					<button
						type="button"
						class="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-700"
						on:click={() => select(currency)}
					>
						<img
							src={`/icons/currencies/${currency.toLowerCase()}.png`}
							alt={currency}
							class="w-6 h-4"
						/>
						<span>{currency}</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.rotate-180 {
		transform: rotate(180deg);
	}
</style>
