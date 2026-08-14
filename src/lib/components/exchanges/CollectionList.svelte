<script lang="ts">
	import ProviderIcon from '$lib/components/ProviderIcon.svelte';

	/**
	 * The listing used by both the collection pages and the directory index.
	 *
	 * `ranked` renders it as an ordered list with position badges, matching the
	 * order the page's ItemList JSON-LD declares — change one and change the
	 * other. The index passes `false`: its list is filterable, so a position
	 * number there would claim a ranking that does not exist.
	 */
	let { changers = [], ranked = true }: { changers: any[]; ranked?: boolean } = $props();

	const activeLicences = (changer: any) =>
		(changer.licenses ?? []).filter((l: any) => l?.authority);
</script>

<svelte:element this={ranked ? 'ol' : 'ul'} class="space-y-3">
	{#each changers as changer, i (changer.code)}
		<li>
			<a
				href="/exchanges/{changer.code}"
				class="flex gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800
				       bg-white dark:bg-gray-900 hover:shadow-sm transition"
			>
				{#if ranked}
					<span
						class="hidden sm:flex h-6 w-6 shrink-0 items-center justify-center self-center rounded-full
						       bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400"
						aria-hidden="true"
					>
						{i + 1}
					</span>
				{/if}

				<span
					class="h-14 w-14 shrink-0 flex items-center justify-center rounded-lg overflow-hidden
					       bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
				>
					<ProviderIcon
						icon={changer.icon}
						alt={changer.name}
						class="h-14 w-14 object-contain"
					/>
				</span>

				<span class="min-w-0 flex-1 space-y-1.5">
					<span class="flex flex-wrap items-center gap-x-2 gap-y-1">
						<span class="font-medium text-gray-900 dark:text-gray-100">{changer.name}</span>

						{#if changer.is_verified}
							<span
								class="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-500/10
								       px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-400"
							>
								Verified
							</span>
						{/if}

						{#each activeLicences(changer) as license}
							<span
								class="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10
								       px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
							>
								Licensed by {license.authority}
								{#if license.status && license.status !== 'active'}
									<span class="opacity-70 capitalize">({license.status})</span>
								{/if}
							</span>
						{/each}

						{#if changer.rating_score}
							<span class="text-xs text-gray-500 dark:text-gray-400">
								★ {Number(changer.rating_score).toFixed(1)}
							</span>
						{/if}
					</span>

					{#if changer.bio}
						<span class="block text-sm leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-2">
							{changer.bio}
						</span>
					{/if}

					{#if changer.changer_tags?.length}
						<span class="flex flex-wrap gap-1.5 pt-0.5">
							{#each changer.changer_tags.slice(0, 4) as tag}
								<span
									class="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[11px]
									       text-gray-500 dark:text-gray-400 capitalize"
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
