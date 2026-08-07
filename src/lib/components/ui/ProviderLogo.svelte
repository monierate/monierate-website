<script lang="ts">
	import { useImageOrDefault } from '$lib/utils/loadImageOrDefault';
	import { getIconPath } from '$lib/utils';

	let { logo, name, size = 32 }: { logo: string; name: string; size?: number } = $props();

	const initials = $derived(
		name
			.split(' ')
			.slice(0, 2)
			.map((w) => w[0])
			.join('')
			.toUpperCase()
	);

	const imageUrl = $derived(logo ? useImageOrDefault(getIconPath(logo), '') : Promise.resolve(''));
</script>

{#await imageUrl then src}
	{#if src}
		<img
			{src}
			alt={name}
			style="width:{size}px; height:{size}px; border-radius:{Math.max(4, size * 0.25)}px; object-fit:contain; flex-shrink:0;"
		/>
	{:else}
		<div
			style="width:{size}px; height:{size}px; border-radius:{Math.max(4, size * 0.25)}px; display:flex; align-items:center; justify-content:center; font-size:{Math.max(8, size * 0.34)}px; font-weight:700; flex-shrink:0; font-family:var(--font-head); background:var(--table-header-bg); color:var(--text-primary);"
		>
			{initials}
		</div>
	{/if}
{/await}
