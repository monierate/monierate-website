<script lang="ts">
	import ProviderIcon from '$lib/components/ProviderIcon.svelte';

	/**
	 * The listing used by both the collection pages and the directory index.
	 *
	 * `ranked` renders it as an ordered list with position badges, matching the
	 * order the page's ItemList JSON-LD declares — change one and change the
	 * other. The index passes `false`: its list is filterable, so a position
	 * number there would claim a ranking that does not exist.
	 *
	 * Surfaces come from the design tokens (`.card`, `--text-secondary`) rather
	 * than Tailwind's gray scale, which is blue-tinted and reads as a different
	 * colour against the near-neutral page background.
	 */
	let { changers = [], ranked = true }: { changers: any[]; ranked?: boolean } = $props();

	const activeLicences = (changer: any) =>
		(changer.licenses ?? []).filter((l: any) => l?.authority);
</script>

<svelte:element this={ranked ? 'ol' : 'ul'} class="grid grid-cols-1 lg:grid-cols-2 gap-3">
	{#each changers as changer, i (changer.code)}
		<li>
			<a
				href="/exchanges/{changer.code}"
				class="card h-full flex gap-4 p-4 hover:border-[var(--accent)] transition-colors"
			>
				{#if ranked}
					<span
						class="hidden sm:flex h-6 w-6 shrink-0 items-center justify-center self-center rounded-full
						       bg-[var(--badge-neutral-bg)] text-xs font-semibold text-[var(--text-secondary)]"
						aria-hidden="true"
					>
						{i + 1}
					</span>
				{/if}

				<span
					class="h-14 w-14 shrink-0 flex items-center justify-center rounded-lg overflow-hidden
					       bg-[var(--badge-neutral-bg)]"
				>
					<ProviderIcon
						icon={changer.icon}
						alt={changer.name}
						class="h-14 w-14 object-contain"
					/>
				</span>

				<span class="min-w-0 flex-1 space-y-1.5">
					<span class="flex flex-wrap items-center gap-x-2 gap-y-1">
						<span class="font-medium text-[var(--text-primary)]">{changer.name}</span>

						{#if changer.is_verified}
							<span
								class="inline-flex items-center rounded-full bg-[var(--accent-light)]
								       px-2 py-0.5 text-[11px] font-medium text-[var(--accent)]"
							>
								Verified
							</span>
						{/if}

						{#each activeLicences(changer) as license}
							<span
								class="inline-flex items-center gap-1 rounded-full bg-[var(--badge-positive-bg)]
								       px-2 py-0.5 text-[11px] font-medium text-[var(--positive)]"
							>
								Licensed by {license.authority}
								{#if license.status && license.status !== 'active'}
									<span class="opacity-70 capitalize">({license.status})</span>
								{/if}
							</span>
						{/each}

						{#if changer.rating_score}
							<span class="text-xs text-[var(--text-muted)]">
								★ {Number(changer.rating_score).toFixed(1)}
							</span>
						{/if}
					</span>

					{#if changer.bio}
						<span
							class="block text-sm leading-relaxed line-clamp-2 text-[var(--text-secondary)]"
						>
							{changer.bio}
						</span>
					{/if}

					{#if changer.changer_tags?.length}
						<span class="flex flex-wrap gap-1.5 pt-0.5">
							{#each changer.changer_tags.slice(0, 4) as tag}
								<span
									class="rounded bg-[var(--badge-neutral-bg)] px-1.5 py-0.5 text-[11px] capitalize
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
