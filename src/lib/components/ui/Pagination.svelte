<script lang="ts">
	let { currentPage, totalPages, onChange }: {
		currentPage: number;
		totalPages: number;
		onChange: (page: number) => void;
	} = $props();

	// Windowed page list: first, last, current ± 1, with '...' filling the gaps —
	// keeps the control usable when history spans dozens of pages.
	const pages = $derived.by(() => {
		const delta = 1;
		const result: (number | '...')[] = [1];

		const start = Math.max(2, currentPage - delta);
		const end = Math.min(totalPages - 1, currentPage + delta);

		if (start > 2) result.push('...');
		for (let i = start; i <= end; i++) result.push(i);
		if (end < totalPages - 1) result.push('...');

		if (totalPages > 1) result.push(totalPages);
		return result;
	});
</script>

{#if totalPages > 1}
	<div class="flex items-center gap-1 flex-wrap">
		<button
			type="button"
			disabled={currentPage <= 1}
			onclick={() => onChange(currentPage - 1)}
			aria-label="Previous page"
			class="text-[12px] font-medium px-2.5 py-1.5 rounded-md border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
			style="background: transparent; border-color: var(--card-border); color: var(--text-secondary);"
		>Prev</button>

		{#each pages as p}
			{#if p === '...'}
				<span class="text-[12px] px-1.5" style="color: var(--text-muted);">…</span>
			{:else}
				<button
					type="button"
					onclick={() => onChange(p)}
					aria-current={p === currentPage ? 'page' : undefined}
					class="text-[12px] font-medium min-w-[28px] px-2 py-1.5 rounded-md border cursor-pointer transition-colors"
					style="
						background: {p === currentPage ? 'var(--table-header-bg)' : 'transparent'};
						border-color: var(--card-border);
						color: {p === currentPage ? 'var(--text-primary)' : 'var(--text-secondary)'};
						font-weight: {p === currentPage ? '700' : '500'};
					"
				>{p}</button>
			{/if}
		{/each}

		<button
			type="button"
			disabled={currentPage >= totalPages}
			onclick={() => onChange(currentPage + 1)}
			aria-label="Next page"
			class="text-[12px] font-medium px-2.5 py-1.5 rounded-md border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
			style="background: transparent; border-color: var(--card-border); color: var(--text-secondary);"
		>Next</button>
	</div>
{/if}
