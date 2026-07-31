<script lang="ts">
	import { parsePairCode } from '$lib/utils/pairs';

	let { pairCodes, selectedPair, onSelect }: {
		pairCodes: string[];
		selectedPair: string;
		onSelect: (pair: string) => void;
	} = $props();
</script>

<div>
	<div class="flex items-center gap-2 mb-2.5">
		<h2
			class="text-[12px] font-semibold uppercase tracking-wider"
			style="color: var(--text-muted); font-family: var(--font-head);"
		>Supported Pairs</h2>
		<span
			class="text-[11px] px-1.5 py-0.5 rounded-full"
			style="background: var(--table-header-bg); color: var(--text-muted);"
		>{pairCodes.length}</span>
	</div>

	<div
		class="inline-flex flex-wrap items-center gap-0.5 p-1 rounded-full"
		style="background: var(--table-header-bg); border: 1px solid var(--card-border);"
	>
		{#each pairCodes as pairCode}
			{@const { base, quote } = parsePairCode(pairCode)}
			{@const isActive = selectedPair === pairCode}
			<button
				onclick={() => onSelect(pairCode)}
				class="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer transition-all"
				style={isActive
					? 'background: var(--accent); color: #fff;'
					: 'background: transparent; color: var(--text-secondary);'}
			>
				{#if isActive}
					<span class="text-[10px]">✓</span>
				{/if}
				{base.toUpperCase()}/{quote.toUpperCase()}
			</button>
		{/each}
	</div>
</div>
