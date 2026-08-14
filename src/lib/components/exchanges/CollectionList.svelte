<script lang="ts">
	import ProviderIcon from '$lib/components/ProviderIcon.svelte';

	/**
	 * The listing used by both the collection pages and the directory index.
	 *
	 * Deliberately compact — name, badges and tags only. Bios run from one line
	 * to a full paragraph depending on the changer, which made every card a
	 * different height and buried the thing people actually scan for. The bio
	 * lives on the profile page the card links to.
	 *
	 * `ranked` renders an `<ol>` rather than a `<ul>`. There are no visible
	 * position numbers — the order still carries the ranking, and it matches the
	 * order the page's ItemList JSON-LD declares, so change one and change the
	 * other. The index passes `false`: its list is filterable, so claiming an
	 * order there would be a lie.
	 *
	 * Surfaces come from the design tokens (`.card`, `--text-secondary`) rather
	 * than Tailwind's gray scale, which is blue-tinted and reads as a different
	 * colour against the near-neutral page background.
	 */
	let { changers = [], ranked = true }: { changers: any[]; ranked?: boolean } = $props();

	const activeLicences = (changer: any) =>
		(changer.licenses ?? []).filter((l: any) => l?.authority);
</script>

<svelte:element
	this={ranked ? 'ol' : 'ul'}
	class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5"
>
	{#each changers as changer (changer.code)}
		<li>
			<a
				href="/exchanges/{changer.code}"
				class="card h-full flex items-center gap-3 p-3 hover:border-[var(--accent)] transition-colors"
			>
				<span
					class="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg overflow-hidden
					       bg-[var(--badge-neutral-bg)]"
				>
					<ProviderIcon icon={changer.icon} alt={changer.name} class="h-10 w-10 object-contain" />
				</span>

				<span class="min-w-0 flex-1">
					<span class="flex flex-wrap items-center gap-x-2 gap-y-1">
						<span class="truncate text-sm font-medium text-[var(--text-primary)]">
							{changer.name}
						</span>

						{#if changer.is_verified}
							<span
								class="inline-flex items-center rounded-full bg-[var(--accent-light)]
								       px-1.5 py-0.5 text-[10px] font-medium text-[var(--accent)]"
							>
								Verified
							</span>
						{/if}

						{#each activeLicences(changer) as license}
							<span
								class="inline-flex items-center gap-1 rounded-full bg-[var(--badge-positive-bg)]
								       px-1.5 py-0.5 text-[10px] font-medium text-[var(--positive)]"
							>
								Licensed by {license.authority}
								{#if license.status && license.status !== 'active'}
									<span class="opacity-70 capitalize">({license.status})</span>
								{/if}
							</span>
						{/each}

						{#if changer.rating_score}
							<span class="text-[11px] text-[var(--text-muted)]">
								★ {Number(changer.rating_score).toFixed(1)}
							</span>
						{/if}
					</span>

					{#if changer.changer_tags?.length}
						<span class="mt-1 flex flex-wrap gap-1">
							{#each changer.changer_tags.slice(0, 3) as tag}
								<span
									class="rounded bg-[var(--badge-neutral-bg)] px-1.5 py-px text-[10px] capitalize
									       text-[var(--text-muted)]"
								>
									{tag}
								</span>
							{/each}
						</span>
					{/if}
				</span>
			</a>
		</li>
	{/each}
</svelte:element>

<style>
	/* The base layer paints every anchor blue; these cards carry their own colour. */
	a {
		color: inherit;
	}
</style>
