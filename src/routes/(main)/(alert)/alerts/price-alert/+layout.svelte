<script lang="ts">
	enum CurrentView {
		PERIODIC = 'periodic',
		THRESHOLD = 'threshold'
	}

	export let data: any;
	$: currentView = data.slug;
</script>

<div class="container">
	<div
		class="bg-white border border-gray-300 dark:border-none dark:bg-gray-900/50 dark:shadow-[0_4px_6px_rgba(0,0,0,0.1)] rounded-xl p-2 md:p-6"
	>
		<!-- <div class="flex justify-center items-center mb-10">
			<div class="w-full md:w-1/2">
				<div
					class="flex justify-between bg-accent-100 border dark:border-gray-700 rounded-[30px] p-2 mb-4 text-sm text-gray-600"
					id="tabs"
				>
					<a
						class="button tab-button {currentView === CurrentView.PERIODIC
							? 'active'
							: ''} text-[0.8em] md:text-sm"
						href="/alert/price-alert/periodic"
					>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
  <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clip-rule="evenodd" />
</svg>

						Periodic
					</a>
					<a
						class="button tab-button {currentView === CurrentView.THRESHOLD
							? 'active'
							: ''} text-[0.8em] md:text-sm"
						href="/alert/price-alert/threshold"
					>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
  <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clip-rule="evenodd" />
</svg>

						Price
					</a>
				</div>
			</div>
		</div> -->

		<slot />
	</div>
</div>

<style>
	.tab-button {
		@apply block w-full bg-transparent p-2 md:py-2 md:px-4 rounded-[20px] text-gray-500 dark:text-gray-400 mr-2 text-center;
	}
	.tab-button:last-child {
		@apply mr-0;
	}
	.tab-button:hover {
		@apply bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-200;
	}

	.tab-button.active {
		@apply bg-gray-600 dark:bg-gray-200 text-white dark:text-dark;
	}
</style>
