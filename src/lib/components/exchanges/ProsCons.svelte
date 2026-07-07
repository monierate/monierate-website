<script lang="ts">
	export let name: string;
	export let pros: string[] = [];
	export let cons: string[] = [];
</script>

{#if pros.length > 0 || cons.length > 0}
	<div class="space-y-4">
		<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
			{name} Pros & Cons
		</h3>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#if pros.length > 0}
				<div
					class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 rounded-xl p-5 space-y-3"
				>
					<p class="text-sm font-semibold text-gray-800 dark:text-gray-100">Pros</p>
					<ul class="space-y-2">
						{#each pros as pro}
							<li class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="w-4 h-4 shrink-0 mt-0.5 text-green-600 dark:text-green-400"
								>
									<path
										fill-rule="evenodd"
										d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
										clip-rule="evenodd"
									/>
								</svg>
								<span>{pro}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if cons.length > 0}
				<div
					class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 rounded-xl p-5 space-y-3"
				>
					<p class="text-sm font-semibold text-gray-800 dark:text-gray-100">Cons</p>
					<ul class="space-y-2">
						{#each cons as con}
							<li class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="w-4 h-4 shrink-0 mt-0.5 text-red-500 dark:text-red-400"
								>
									<path
										d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
									/>
								</svg>
								<span>{con}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</div>
{/if}
