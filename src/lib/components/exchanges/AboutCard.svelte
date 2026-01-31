<script>
	import { slide } from 'svelte/transition';

	export let changerName;
	export let description;

	export let industry;
	export let companyType;
	export let foundedYear;
	export let companySize;

	let expanded = false;
</script>

<div>
	<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
		About {changerName}
	</h3>

	<div
		class="max-w-4xl bg-gray-50/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 rounded-xl p-6"
	>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- LEFT -->
			<div class="md:col-span-2">
				<!-- CONTENT WRAPPER -->
				<div>
					<!-- COLLAPSED -->
					{#if !expanded}
						<div class="relative max-h-[200px] overflow-hidden">
							<p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
								{description}
							</p>

							<!-- FADE -->
							<div
								class="pointer-events-none absolute inset-x-0 bottom-0 h-12
                       bg-gradient-to-t from-white dark:from-gray-900 to-transparent"
							></div>
						</div>
					{/if}

					<!-- EXPANDED -->
					{#if expanded}
						<div in:slide={{ duration: 250 }} out:slide={{ duration: 200 }}>
							<p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
								{description}
							</p>
						</div>
					{/if}
				</div>

				<!-- BUTTON ALWAYS FLUSH -->
				<button
					on:click={() => (expanded = !expanded)}
					class="my-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
				>
					✨ {expanded ? 'View less' : 'Read more'}...
				</button>
			</div>

			<!-- RIGHT -->
			<div class="space-y-5 text-sm">
				<div class="space-y-1">
					<p class="font-medium text-gray-700 dark:text-gray-100">Brand industry</p>
					<p class="font-bold text-gray-900 dark:text-gray-100">{industry}</p>
				</div>

				<div class="space-y-1">
					<p class="font-medium text-gray-700 dark:text-gray-100">Company type</p>
					<p class="font-bold text-gray-900 dark:text-gray-100">{companyType || 'Suggest company type'}</p>
				</div>

				<div class="space-y-1">
					<p class="font-medium text-gray-700 dark:text-gray-100">Year founded</p>
					<p class="font-bold text-gray-900 dark:text-gray-100">{foundedYear || 'Suggest founded year'}</p>
				</div>

				<div class="space-y-1">
					<p class="font-medium text-gray-700 dark:text-gray-100">Company size</p>
					<p class="font-bold text-gray-900 dark:text-gray-100">{companySize || 'Suggest company size'}</p>
				</div>
			</div>
		</div>
	</div>
</div>
