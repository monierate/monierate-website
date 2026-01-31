<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { pushState } from '$app/navigation';

	const dispatch = createEventDispatcher();

	export let open = false;
	export let title = '';
	export let closeOnBackdrop = true;

	let prevOverflow: string;
	let popStateListener: (() => void) | null = null;
	let modalStatePushed = false;

	onMount(() => {
		if (!browser) return;

		if (open) {
			document.body.style.overflow = 'hidden';
			pushModalState();
			addPopstateHandler();
		}
	});

	$: if (browser) {
		if (open) {
			prevOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';

			if (!modalStatePushed) {
				pushModalState();
			}
			addPopstateHandler();
		} else {
			document.body.style.overflow = prevOverflow || '';
			removePopstateHandler();
		}
	}

	function handleBackdropClick() {
		if (closeOnBackdrop) closeSheet();
	}

	function closeSheet() {
		dispatch('close');

		if (browser && modalStatePushed) {
			modalStatePushed = false;
			history.back();
		}
	}

	function pushModalState() {
		pushState(window.location.pathname, { modalOpen: true });
		modalStatePushed = true;
	}

	function addPopstateHandler() {
		if (popStateListener) return;
		popStateListener = () => {
			if (open) dispatch('close');
		};
		window.addEventListener('popstate', popStateListener);
	}

	function removePopstateHandler() {
		if (popStateListener) {
			window.removeEventListener('popstate', popStateListener);
			popStateListener = null;
		}
	}

	onDestroy(removePopstateHandler);
</script>

{#if open}
	<div
		class="fixed inset-0 z-[200] w-full flex items-end md:items-center justify-center
      bg-black/40 dark:bg-black/70
      backdrop-blur-sm transition-opacity duration-200"
		on:click={handleBackdropClick}
		on:keydown={() => {}}
		tabindex="0"
		role="dialog"
	>
		<div
			class="w-full max-h-[85vh] overflow-y-auto
        bg-white dark:bg-gray-900
        rounded-t-3xl md:rounded-2xl
        px-4 py-6 pb-8 md:p-6
        shadow-xl dark:shadow-black/40
        border border-gray-200 dark:border-gray-800
        transform transition-all duration-300
        sm:w-[90%] md:max-w-[480px]
        animate-slideUp"
			on:click|stopPropagation
			on:keydown={() => {}}
			tabindex="0"
			role="dialog"
		>
			<!-- Header -->
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
					{title}
				</h2>

				<button
					class="text-sm font-medium
            text-gray-500 hover:text-gray-700
            dark:text-gray-400 dark:hover:text-gray-200
            active:scale-95 transition"
					on:click={closeSheet}
				>
					Done
				</button>
			</div>

			<slot />
		</div>
	</div>
{/if}

<style>
	@keyframes slideUp {
		from {
			transform: translateY(100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.animate-slideUp {
		animation: slideUp 0.3s ease-out forwards;
	}
</style>
