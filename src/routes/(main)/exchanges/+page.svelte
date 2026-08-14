<script lang="ts">
	import Seo from '$lib/components/seo/Seo.svelte';
	import CollectionList from '$lib/components/exchanges/CollectionList.svelte';

	let { data } = $props();

	const featured = $derived(data.collections.filter((c: any) => c.featured));
	const others = $derived(data.collections.filter((c: any) => !c.featured));

	const PAGE_SIZE = 24;
	let visible = $state(PAGE_SIZE);

	let query = $state('');

	const filtered = $derived(
		query.trim()
			? data.changers.filter((c: any) =>
					`${c.name} ${c.code}`.toLowerCase().includes(query.trim().toLowerCase())
				)
			: data.changers
	);

	const shown = $derived(filtered.slice(0, visible));
</script>

<Seo {...data.seo} />

<div class="container max-w-4xl py-8 space-y-12">
	<header class="space-y-4">
		<h1 class="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
			Crypto Exchanges & Money Transfer Platforms
		</h1>
		<p class="text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-300">
			Every platform Monierate tracks — crypto exchanges, OTC desks, remittance apps, virtual card
			issuers and banks — with live rates, fees, licences and a full profile for each. Start from a
			collection below, or search the full list.
		</p>
	</header>

	{#if featured.length}
		<section class="space-y-4">
			<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Popular collections</h2>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{#each featured as collection (collection.slug)}
					<a
						href="/exchanges/{collection.slug}"
						class="block p-4 rounded-xl border border-gray-200 dark:border-gray-800
						       bg-white dark:bg-gray-900 hover:shadow-sm transition space-y-1"
					>
						<span class="flex items-baseline justify-between gap-2">
							<span class="font-medium text-gray-900 dark:text-gray-100">{collection.label}</span>
							<span class="text-xs text-gray-400 dark:text-gray-500 shrink-0">
								{collection.count}
							</span>
						</span>
						<span class="block text-sm leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-2">
							{collection.description}
						</span>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	{#if others.length}
		<section class="space-y-3">
			<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">More collections</h2>
			<ul class="flex flex-wrap gap-2">
				{#each others as collection (collection.slug)}
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
		</section>
	{/if}

	<section class="space-y-4">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
				All platforms ({data.changers.length})
			</h2>

			<input
				type="search"
				bind:value={query}
				placeholder="Search platforms"
				aria-label="Search platforms"
				class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900
				       px-3 py-1.5 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400
				       focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-700"
			/>
		</div>

		{#if shown.length}
			<CollectionList changers={shown} ranked={false} />

			{#if filtered.length > shown.length}
				<button
					type="button"
					onclick={() => (visible += PAGE_SIZE)}
					class="w-full rounded-lg border border-gray-200 dark:border-gray-800 py-2 text-sm
					       text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
				>
					Show more
				</button>
			{/if}
		{:else}
			<p class="text-center p-12 text-sm text-gray-500 dark:text-gray-400">
				No platform matches “{query}”.
			</p>
		{/if}
	</section>
</div>
