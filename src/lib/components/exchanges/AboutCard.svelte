<script lang="ts">
	import { slide } from 'svelte/transition';

	export let changer: any;

	let expanded = false;
</script>

<div>
	<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
		About {changer.name}
	</h3>

	<div
		class="max-w-4xl bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6"
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
								{changer.about}
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
								{changer.about}
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
					<p class="font-medium text-gray-700 dark:text-gray-100">Year launched</p>
					<p class="font-bold text-gray-900 dark:text-gray-100">{changer.year_launched || '-'}</p>
				</div>
				<div class="space-y-1">
					<p class="font-medium text-gray-700 dark:text-gray-100">Year closed</p>
					<p class="font-bold text-gray-900 dark:text-gray-100">{changer.year_closed || '-'}</p>
				</div>
			</div>
		</div>
	</div>
</div>
