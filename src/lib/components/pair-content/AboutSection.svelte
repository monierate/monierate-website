<script lang="ts">
	/**
	 * Prose context under the chart and table. Generated from the same figures the
	 * page renders (see `$lib/utils/pairContent`), so it cannot drift from them.
	 */
	let {
		heading,
		paragraphs,
		link = null
	}: {
		heading: string;
		paragraphs: string[];
		/**
		 * Optional route onward. Kept as a prop rather than markup inside the
		 * paragraphs: the same strings feed the FAQ JSON-LD, where HTML is noise.
		 */
		link?: { href: string; label: string } | null;
	} = $props();
</script>

{#if paragraphs.length}
	<section
		class="rounded-xl border p-5 sm:p-6"
		style="background: var(--card-bg); border-color: var(--card-border);"
	>
		<h2
			class="text-[16px] font-semibold mb-3"
			style="color: var(--text-primary); font-family: var(--font-head);"
		>
			{heading}
		</h2>
		<div class="space-y-3 text-[14px] leading-relaxed" style="color: var(--text-secondary);">
			{#each paragraphs as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>

		{#if link}
			<a
				href={link.href}
				class="inline-flex items-center gap-1.5 mt-4 text-[13px] font-semibold hover:underline"
				style="color: var(--accent);"
			>
				{link.label}
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
				</svg>
			</a>
		{/if}
	</section>
{/if}
