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
		<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">{heading}</h3>

		<ul class="flex flex-wrap gap-2">
			{#each collections as collection (collection.slug)}
				<li>
					<a
						href="/exchanges/{collection.slug}"
						class="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800
						       bg-gray-50 dark:bg-gray-900 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300
						       hover:border-gray-300 dark:hover:border-gray-700 transition"
					>
						{collection.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}
