<script lang="ts">
	import { onMount } from 'svelte';
	import { getIconPath } from '$lib/utils';
	import { useImageOrDefault } from '$lib/utils/loadImageOrDefault';

	export let icon: string | undefined;
	export let alt: string = 'icon';

	const fallback = '/icons/png/default.png';
	let src = getIconPath(icon);

	onMount(async () => {
		src = await useImageOrDefault(getIconPath(icon), fallback);
	});
</script>

<img {src} {alt} {...$$restProps} />
