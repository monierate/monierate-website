<script lang="ts">
	import { extractBaseDomain } from '$lib/functions';

	export let exchanges: any;
</script>

<div class="max-w-6xl">
	<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Related Exchanges</h3>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each exchanges as changer}
			<a
				href="/exchanges/{changer.code}"
				rel="noopener noreferrer"
				class="flex items-center gap-3 p-3 rounded-xl border
               border-gray-200 dark:border-gray-800
               bg-gray-50/60 dark:bg-gray-900
               hover:shadow-sm transition"
			>
				<!-- LOGO -->
				<span
					class="h-14 w-14 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 overflow-hidden border border-gray-100 dark:border-gray-700"
				>
					<img src="/icons/{changer.icon}" alt={changer.name} class="h-14 w-14 object-contain" />
				</span>

				<!-- INFO -->
				<span class="min-w-0 flex flex-col gap-1">
					<span class="flex items-center gap-1">
						<span class="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
							{changer.name}
						</span>

						{#if changer.verified}
							<svg class="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M12 2l2.39 2.39L18 4l1.61 3.61L22 12l-2.39 4.39L18 20l-3.61-1.61L12 22l-4.39-2.39L4 20l-1.61-3.61L2 12l2.39-4.39L4 4l3.61 1.61L12 2z"
								/>
								<path d="M10.5 14.5l-2-2 1.41-1.41L10.5 11.67l3.59-3.59L15.5 9.5z" fill="white" />
							</svg>
						{/if}
					</span>

					<span class="text-xs text-gray-500 dark:text-gray-400 truncate">
						{extractBaseDomain(changer.link)}
					</span>
				</span>
			</a>
		{/each}
	</div>
</div>
