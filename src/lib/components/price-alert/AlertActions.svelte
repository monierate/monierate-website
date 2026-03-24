<script lang="ts">
	import Dialog from '../Dialog.svelte';
	import { current_screen, CurrentScreen } from '$lib/components/alert/useAlertForm';

	import { goto } from '$app/navigation';

	export let alertId: string;
	export let alertStatus: string;
	export let alertType: string;
	export let onDelete: () => void;
	export let onStatusChange: () => void;

	/* -----------------------------
		State
	------------------------------*/
	let showOptions = false;
	let showConfirmDelete = false;

	/* -----------------------------
		Actions
	------------------------------*/
	function toggleOptions() {
		showOptions = !showOptions;
	}

	function closeOptions(e: MouseEvent) {
		if (e.target instanceof HTMLElement && !e.target.closest('.alert-options')) {
			showOptions = false;
		}
	}

	function editAlert() {
		current_screen.set(CurrentScreen.FIRST_SCREEN);
		goto(`/alerts/price-alert/${alertType}?edit_alert=${alertId}`);
	}

	const callDelete = () => {
		onDelete();
		showConfirmDelete = false;
	};
</script>

<svelte:window on:click={closeOptions} />

<div>
	<!-- Mobile options button -->
	<div class="md:hidden ml-1 alert-options">
		<button
			class="text-gray-400 hover:text-red-500"
			aria-label="Options"
			on:click|stopPropagation={toggleOptions}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="size-5"
			>
				<path
					fill-rule="evenodd"
					d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</div>

	<!-- Options panel -->
	<div
		class="alert-options fixed md:static left-0 bottom-0 z-[60] w-full md:w-auto
		       bg-gray-100 dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent
		       p-5 md:p-0 flex flex-col md:flex-row gap-4
		       {showOptions ? '' : 'hidden md:flex'}"
	>
		<!-- Toggle -->
		<span class="flex items-center gap-4">
			<button
				class="w-12 h-6 rounded-full relative"
				style="background-color: {alertStatus === 'active' ? '#4CAF50' : '#c0c0c0'}"
				on:click={onStatusChange}
				aria-label="Enable or disable alert"
			>
				<span
					class="absolute top-0.5 left-1 w-5 h-5 bg-white rounded-full transition-transform"
					style="transform: translateX({alertStatus === 'active' ? '24px' : '0px'})"
				></span>
			</button>
			<button class="md:hidden" on:click={onStatusChange}> Enable / Disable alert </button>
		</span>

		<!-- Edit -->
		<span class="flex items-center gap-4">
			<button class="text-gray-400 hover:text-gray-500" aria-label="Edit" on:click={editAlert}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="size-5"
				>
					<path
						d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"
					/>
					<path
						d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"
					/>
				</svg>
			</button>
			<button class="md:hidden" on:click={editAlert}>Edit alert</button>
		</span>

		<!-- Delete -->
		<span class="flex items-center gap-4">
			<button
				class="text-gray-400 hover:text-red-500"
				aria-label="Delete"
				on:click={() => (showConfirmDelete = true)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="size-5"
				>
					<path
						fill-rule="evenodd"
						d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			<button class="md:hidden" on:click={() => (showConfirmDelete = true)}> Delete alert </button>
		</span>
	</div>

	<!-- Delete confirmation dialog -->
	<Dialog
		bind:isOpen={showConfirmDelete}
		title="Are you sure you want to delete this alert?"
		actions={[
			{
				label: 'Confirm',
				callback: callDelete
			}
		]}
	>
		<p class="mb-4">Please confirm alert deletion.</p>
	</Dialog>
</div>
