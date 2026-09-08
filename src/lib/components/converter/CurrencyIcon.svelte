<script lang="ts">
	import { getIconPath } from '$lib/utils';

	/**
	 * A currency's mark, degrading to its code.
	 *
	 * Deliberately not built on `useImageOrDefault`: that resolves in the browser
	 * only and returns the fallback during SSR, which is right for a provider logo
	 * but wrong in a list of 90 currencies — every icon would pop in after hydration.
	 * A plain `<img>` with an error handler paints server-side and falls back only
	 * for the codes we genuinely have no art for.
	 */
	let { code, icon = '', size = 20 }: { code: string; icon?: string; size?: number } = $props();

	let failed = $state(false);

	const src = $derived(icon ? getIconPath(icon) : `/icons/currencies/${code.toLowerCase()}.png`);

	// A new currency gets a fresh attempt — otherwise one miss blanks every icon
	// that reuses the component slot.
	$effect(() => {
		void src;
		failed = false;
	});
</script>

{#if failed}
	<span
		class="inline-flex items-center justify-center flex-shrink-0 font-semibold"
		style="width:{size}px; height:{size}px; border-radius:{Math.max(3, size * 0.25)}px; font-size:{Math.max(
			7,
			size * 0.36
		)}px; background: var(--badge-neutral-bg); color: var(--text-secondary); font-family: var(--font-mono);"
		aria-hidden="true">{code.slice(0, 2)}</span
	>
{:else}
	<img
		{src}
		alt=""
		loading="lazy"
		onerror={() => (failed = true)}
		style="width:{size}px; height:{size}px; border-radius:{Math.max(
			3,
			size * 0.25
		)}px; object-fit: contain; flex-shrink: 0;"
	/>
{/if}
