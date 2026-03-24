<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	interface Tip {
		label: string;
		value: string;
	}

	export let tip: Tip;
	export let trigger: 'click' | 'hover' = 'click';

	const isOpen = writable(false);

	function toggle() {
		if (trigger === 'click') {
			isOpen.update((v) => !v);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			toggle();
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (!(event.target as HTMLElement).closest('.tip-container')) {
			isOpen.set(false);
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<div
	class="relative w-fit cursor-pointer tip-container"
	on:click={toggle}
	on:keydown={handleKeydown}
	on:mouseenter={() => trigger === 'hover' && isOpen.set(true)}
	on:mouseleave={() => trigger === 'hover' && isOpen.set(false)}
	tabindex="0"
	role="button"
	aria-expanded={$isOpen}
>
	<div class="flex items-center gap-2">
		<span>{tip.label}</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			class="size-5 w-4 h-4 transition-transform"
			style="transform: rotate({$isOpen ? '180deg' : '0deg'})"
		>
			<path
				fill-rule="evenodd"
				d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
				clip-rule="evenodd"
			/>
		</svg>
	</div>
	<div
		class="absolute left-0 mt-2 w-56 p-2 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 transition-opacity duration-200 z-10"
		class:hidden={!$isOpen}
	>
		{tip.value}
	</div>
</div>
