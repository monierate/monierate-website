<script lang="ts">
	type Faq = {
		question: string;
		answer: string;
	};

	export let name: string;
	export let faqs: Faq[] = [];
</script>

{#if faqs.length > 0}
	<div class="space-y-4">
		<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
			{name} FAQs
		</h3>

		<div
			class="border border-gray-200 dark:border-gray-700/60 rounded-xl divide-y divide-gray-200 dark:divide-gray-700/60"
		>
			{#each faqs as faq}
				<details class="group">
					<summary
						class="flex items-center justify-between gap-4 cursor-pointer list-none p-4 text-sm font-medium text-gray-800 dark:text-gray-100 [&::-webkit-details-marker]:hidden"
					>
						<span>{faq.question}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="w-4 h-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
						</svg>
					</summary>
					<p class="px-4 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
						{faq.answer}
					</p>
				</details>
			{/each}
		</div>
	</div>
{/if}
