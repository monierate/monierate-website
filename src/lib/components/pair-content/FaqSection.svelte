<script lang="ts">
	import type { FaqEntry } from '$lib/utils/seo';

	/**
	 * Rendered questions for the pair and pair×provider pages.
	 *
	 * The FAQPage JSON-LD is emitted by the page's `<Seo>` block from this same
	 * array — schema that describes questions a visitor cannot see is exactly what
	 * gets a page's rich results pulled, so the two must come from one source.
	 *
	 * Built on <details>, which means every answer is in the HTML a crawler
	 * receives whether or not it is open, and keyboard support comes for free.
	 */
	let { faqs, heading = 'Frequently asked questions' }: { faqs: FaqEntry[]; heading?: string } =
		$props();
</script>

{#if faqs.length}
	<section
		class="rounded-xl border overflow-hidden"
		style="background: var(--page-bg); border-color: var(--card-border);"
	>
		<div class="px-5 py-3 border-b" style="border-color: var(--card-border);">
			<h2 class="text-[14px] font-semibold" style="color: var(--text-primary);">{heading}</h2>
		</div>

		{#each faqs as faq, i}
			<details
				class="group"
				style={i > 0 ? 'border-top: 1px solid var(--card-border);' : ''}
				open={i === 0}
			>
				<summary
					class="flex items-center justify-between gap-3 px-5 py-3.5 cursor-pointer list-none text-[14px] font-semibold transition-colors hover:bg-[var(--table-hover)]"
					style="color: var(--text-primary);"
				>
					<span>{faq.question}</span>
					<svg
						class="flex-shrink-0 transition-transform group-open:rotate-180"
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
						stroke-linejoin="round"
						style="color: var(--text-muted);"
						aria-hidden="true"
					>
						<polyline points="6 9 12 15 18 9" />
					</svg>
				</summary>
				<p class="px-5 pb-4 text-[14px] leading-relaxed" style="color: var(--text-secondary);">
					{faq.answer}
				</p>
			</details>
		{/each}
	</section>
{/if}

<style>
	/* Safari still paints its own disclosure triangle without this. */
	summary::-webkit-details-marker {
		display: none;
	}
</style>
