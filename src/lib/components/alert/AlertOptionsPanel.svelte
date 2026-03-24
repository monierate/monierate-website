<script lang="ts">
    export let note: string;
    export let disableAfterTrigger: boolean;
</script>

<div class="mt-4 space-y-8 flex flex-col items-center">
	<div class="flex gap-4 items-center">
		<label for="add-note">Add a note:</label>
		<input
			id="add-note"
			type="text"
			class="bg-gray-50 text-dark dark:bg-gray-800 dark:text-white p-1 px-2 w-[125px] h-7 rounded-md border border-gray-300 dark:border-gray-600 hover:border-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0"
			placeholder="Optional"
			bind:value={note}
		/>
		<span class="relative group">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="size-5 text-gray-500"
			>
				<path
					fill-rule="evenodd"
					d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
					clip-rule="evenodd"
				/>
			</svg>

			<span
				class="hidden group-hover:inline-block absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 shadow-md text-sm text-white p-1 rounded-md whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
			>
				This will appear along side the alert to help give you context.
			</span>
		</span>
	</div>

	<div class="flex gap-4 items-center">
		<input
			id="alert-spam"
			type="checkbox"
			style="transform: scale(1.5);"
			placeholder="Optional"
			bind:checked={disableAfterTrigger}
		/>
		<label for="alert-spam">Disable this alert after it triggers onces.</label>
	</div>
</div>
