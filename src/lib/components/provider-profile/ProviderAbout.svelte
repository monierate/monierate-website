<script lang="ts">
	interface Provider {
		about?: string;
		categories?: (string | { title?: string; name?: string })[];
		headquarters?: string;
	}

	let { provider }: { provider: Provider } = $props();

	function categoryLabel(cat: string | { title?: string; name?: string }): string {
		if (typeof cat === 'string') return cat;
		return cat.title ?? cat.name ?? '';
	}

	const categories = $derived((provider.categories ?? []).filter((c) => categoryLabel(c)));
</script>

{#if provider.about || categories.length > 0 || provider.headquarters}
	<div class="rounded-xl border p-5" style="background: var(--card-bg); border-color: var(--card-border);">
		<h2
			class="text-[11px] font-semibold uppercase tracking-widest mb-3"
			style="color: var(--text-muted); font-family: var(--font-head);"
		>About the Platform</h2>

		{#if provider.about}
			<p class="text-[13px] leading-relaxed" style="color: var(--text-secondary); max-width: 720px;">
				{provider.about}
			</p>
		{/if}

		{#if categories.length > 0}
			<div class="flex flex-wrap gap-2 mt-3">
				{#each categories as cat}
					<span
						class="px-2.5 py-1 rounded-lg text-[11px] font-medium"
						style="background: var(--table-header-bg); color: var(--text-secondary);"
					>{categoryLabel(cat)}</span>
				{/each}
			</div>
		{/if}

		{#if provider.headquarters}
			<div class="flex items-center gap-1.5 mt-3 text-[12px]" style="color: var(--text-muted);">
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none">
					<path
						d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
						stroke="currentColor"
						stroke-width="2"
					/>
					<circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" />
				</svg>
				{provider.headquarters}
			</div>
		{/if}
	</div>
{/if}
