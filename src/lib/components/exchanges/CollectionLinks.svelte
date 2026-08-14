<script lang="ts">
	/**
	 * Cross-links into the directory collections. Used from collection pages
	 * (sibling collections), from changer profiles (the collections that changer
	 * belongs to), and from the /exchanges index.
	 */
	let {
		heading,
		collections = []
	}: { heading: string; collections: { slug: string; label: string }[] } = $props();
</script>

{#if collections.length}
	<div class="space-y-3">
		<h3 class="text-lg font-semibold">{heading}</h3>

		<ul class="flex flex-wrap gap-2">
			{#each collections as collection (collection.slug)}
				<li>
					<a
						href="/exchanges/{collection.slug}"
						class="card inline-flex items-center !rounded-full px-3 py-1.5 text-sm
						       text-[var(--text-secondary)] hover:border-[var(--accent)]
						       hover:text-[var(--text-primary)] transition-colors"
					>
						{collection.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}
