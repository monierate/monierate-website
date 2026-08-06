<script lang="ts">
	import { parsePairCode } from '$lib/utils/pairs';

	let { pairCodes, selectedPair, onSelect }: {
		pairCodes: string[];
		selectedPair: string;
		onSelect: (pair: string) => void;
	} = $props();
</script>

<div class="inline-block max-w-full overflow-x-auto no-scrollbar">
	<div
		class="flex flex-nowrap gap-1 bg-[var(--table-header-bg)] border border-[var(--card-border)] rounded-full p-1 min-w-max"
	>
		{#each pairCodes as pairCode}
			{@const { base } = parsePairCode(pairCode)}
			{@const isActive = selectedPair === pairCode}
			<button
				type="button"
				onclick={() => onSelect(pairCode)}
				class={`font-head px-3.5 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
					isActive
						? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow font-semibold'
						: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
				}`}
			>
				{base.toUpperCase()}
			</button>
		{/each}
	</div>
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		scrollbar-width: none;
	}
</style>
