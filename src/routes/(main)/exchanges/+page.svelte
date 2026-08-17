<script lang="ts">
	// SEO commented out while the directory layer is disabled — the page serves,
	// it just emits no head metadata or JSON-LD. Restore both this import and the
	// <Seo /> below alongside COLLECTIONS_ENABLED.
	// import Seo from '$lib/components/seo/Seo.svelte';
	import CollectionList from '$lib/components/exchanges/CollectionList.svelte';
	import ProviderIcon from '$lib/components/ProviderIcon.svelte';

	let { data } = $props();

	const featured = $derived(data.collections.filter((c: any) => c.featured));
	const others = $derived(data.collections.filter((c: any) => !c.featured));

	// The whole directory fits in one batch today (94 changers). The "show more"
	// control stays wired up so the page degrades gracefully as it grows.
	const PAGE_SIZE = 100;
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

<!-- <Seo {...data.seo} /> -->

<div class="container space-y-12 py-8">
	<header class="space-y-4">
		<h1 class="text-2xl md:text-3xl font-semibold">
			Crypto Exchanges &amp; Money Transfer Platforms
		</h1>
		<p class="max-w-4xl text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
			Every platform Monierate tracks — crypto exchanges, OTC desks, remittance apps, virtual card
			issuers and banks — with live rates, fees, licences and a full profile for each.
			<!-- The closing line points at the collection strips, which render only when
			     the collection layer is enabled and something clears the threshold. -->
			{#if data.collections.length}Start from a collection below, or search the full list.{:else}Search
				the full list below.{/if}
		</p>
	</header>

	{#if featured.length}
		<section class="space-y-4">
			<h2 class="text-lg font-semibold">Popular collections</h2>

			<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
				{#each featured as collection (collection.slug)}
					<a
						href="/exchanges/{collection.slug}"
						class="card block p-4 space-y-1 hover:border-[var(--accent)] transition-colors"
					>
						<span class="flex items-center justify-between gap-2">
							<span class="font-medium text-[var(--text-primary)]">{collection.label}</span>

							<!-- A random few members, overlapping, with the total as the final chip.
							     The logo is inset inside its round well rather than cropped to fill
							     it — the source art runs edge to edge, so cropping cut into marks
							     that reach the corners. -->
							<span class="flex shrink-0 items-center -space-x-1.5">
								{#each collection.previews as preview (preview.code)}
									<span
										class="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full
										       bg-[var(--badge-neutral-bg)] ring-2 ring-[var(--card-bg)]"
									>
										<ProviderIcon
											icon={preview.icon}
											alt={preview.name}
											class="h-[18px] w-[18px] rounded-full object-contain"
										/>
									</span>
								{/each}
								<span
									class="flex h-7 min-w-[1.75rem] items-center justify-center rounded-full px-1.5
									       bg-[var(--badge-neutral-bg)] ring-2 ring-[var(--card-bg)]
									       text-[11px] font-medium text-[var(--text-secondary)]"
								>
									{collection.count}
								</span>
							</span>
						</span>
						<span class="block text-sm leading-relaxed line-clamp-2 text-[var(--text-secondary)]">
							{collection.description}
						</span>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	{#if others.length}
		<section class="space-y-3">
			<h2 class="text-lg font-semibold">More collections</h2>
			<ul class="flex flex-wrap gap-2">
				{#each others as collection (collection.slug)}
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
		</section>
	{/if}

	<section class="space-y-4">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<h2 class="text-lg font-semibold">All platforms ({data.changers.length})</h2>

			<input
				type="search"
				bind:value={query}
				placeholder="Search platforms"
				aria-label="Search platforms"
				class="w-full sm:w-64 rounded-lg px-3 py-1.5 text-sm"
				style="background: var(--input-bg); border: 1px solid var(--input-border); color: var(--text-primary);"
			/>
		</div>

		{#if shown.length}
			<CollectionList changers={shown} ranked={false} />

			{#if filtered.length > shown.length}
				<button
					type="button"
					onclick={() => (visible += PAGE_SIZE)}
					class="w-full rounded-lg border border-[var(--card-border)] py-2 text-sm
					       text-[var(--text-secondary)] hover:border-[var(--accent)]
					       hover:text-[var(--text-primary)] transition-colors"
				>
					Show more
				</button>
			{/if}
		{:else}
			<p class="p-12 text-center text-sm text-[var(--text-muted)]">
				No platform matches “{query}”.
			</p>
		{/if}
	</section>
</div>

<style>
	/* The base layer paints every anchor blue; these cards carry their own colour. */
	.card {
		color: inherit;
	}
</style>
