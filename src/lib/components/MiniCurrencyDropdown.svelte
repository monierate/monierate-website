<script lang="ts">
	import BottomSheet from './BottomSheet.svelte';

	export let options: string[] = [];
	export let selected: string | null = null;
	export let onSelect: (option: string) => void = () => {};

	let open = false;

	const icon = (c: string) => `https://stablerate.app/icons/currencies/${c.toLowerCase()}.png`;

	function choose(c: string) {
		selected = c;
		onSelect(c);
		open = false;
	}
</script>

<div class="relative">
	<button
		type="button"
		class="flex items-center gap-2 px-2 py-1 rounded-md
			transition"
		on:click={() => (open = !open)}
	>
		{#if selected}
			<img src={icon(selected)} alt={selected} class="w-5 h-5 rounded-full" />
			<span class="text-sm font-semibold text-gray-800 dark:text-gray-100">
				{selected}
			</span>
		{/if}

		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform"
			class:rotate-180={open}
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fill-rule="evenodd"
				d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>

	<!-- Desktop dropdown -->
	{#if open}
		<ul
			class="hidden md:block absolute right-0 mt-2 w-36
				bg-white dark:bg-gray-900
				border border-gray-200 dark:border-gray-800
				rounded-lg shadow-lg dark:shadow-black/40
				z-20 max-h-56 overflow-auto"
		>
			{#each options as c}
				<li>
					<button
						class="flex items-center gap-2 w-full px-3 py-2 text-sm
							hover:bg-gray-100 dark:hover:bg-gray-800
							transition"
						on:click={() => choose(c)}
					>
						<img src={icon(c)} class="w-5 h-5 rounded-full" alt={c} />
						<span class="text-gray-800 dark:text-gray-100">{c}</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<!-- Mobile Bottom Sheet -->
<BottomSheet {open} title="Select Currency" on:close={() => (open = false)}>
	<ul class="divide-y divide-gray-100 dark:divide-gray-800">
		{#each options as c}
			<li>
				<button
					type="button"
					class="flex items-center justify-between w-full py-4 px-2
						active:bg-gray-100 dark:active:bg-gray-800
						transition-colors text-left"
					on:click={() => choose(c)}
				>
					<div class="flex items-center space-x-3">
						<img src={icon(c)} alt={c} class="w-7 h-7 rounded-full" />
						<span class="text-base text-gray-800 dark:text-gray-100">
							{c}
						</span>
					</div>

					{#if selected === c}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-5 h-5 text-blue-600 dark:text-blue-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="3"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					{/if}
				</button>
			</li>
		{/each}
	</ul>
</BottomSheet>
