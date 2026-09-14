<script context="module" lang="ts">
	import Adverts from '$data/adverts.json';

	function isValid(ad: any) {
		return ad && ad.image && !ad.disabled;
	}

	// Whether a slot has an advert that will actually render. Pages use this to
	// keep their own top spacing when the slot is empty.
	export function hasActiveAd(name: keyof typeof Adverts): boolean {
		const raw = Adverts[name];
		return Array.isArray(raw) ? raw.some(isValid) : isValid(raw);
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { bannerStore } from '$lib/stores/banner-store';

	export let name: keyof typeof Adverts;
	export let width: string | null = null;
	export let height: string | null = null;
	export let mobileOnly: boolean = false;
	export let showLabel: boolean = false;
	// Get server-provided banner index from data (if available)
	export let bannerIndexes: any = {};
	export let isMobile: boolean = false;
	export let cover: boolean = false;

	// While the visitor stays on the page, auto-advance to the next banner
	// (sliding up) rather than only swapping on navigation.
	const SWAP_INTERVAL_MS = 6000;
	const SWAP_DURATION_MS = 450;

	let banners: any[] = [];
	let current = 0;
	let isFirstVisit = true;

	const raw = Adverts[name];
	const notFound = !(name in Adverts);

	if (Array.isArray(raw)) {
		banners = raw.filter(isValid);
	} else if (isValid(raw)) {
		banners = [raw];
	}

	// Initialize with server data if available
	if (bannerIndexes && name in bannerIndexes) {
		current = bannerIndexes[name];
		bannerStore.initIndex(name, current);
		isFirstVisit = false;
	}

	let interval: ReturnType<typeof setInterval> | null = null;

	function swap() {
		current = bannerStore.getNextIndex(name, banners.length, false);
	}

	// Keep swapping banners at a fixed interval while the visitor stays put.
	function startInterval() {
		if (interval) clearInterval(interval);
		if (banners.length > 1) {
			interval = setInterval(swap, SWAP_INTERVAL_MS);
		}
	}

	function handleMouseEnter() {
		if (interval) clearInterval(interval);
	}

	function handleMouseLeave() {
		// Don't make the visitor wait out a fresh interval before it changes.
		swap();
		startInterval();
	}

	onMount(() => {
		current = bannerStore.getNextIndex(name, banners.length, isFirstVisit);
		isFirstVisit = false;

		// Set up page navigation tracking for subsequent page views
		const unsubscribe = page.subscribe(() => {
			current = bannerStore.getNextIndex(name, banners.length, false);
		});

		startInterval();

		return () => {
			unsubscribe();
			if (interval) clearInterval(interval);
		};
	});

	const getExtension = (url: string) => url.split('.').pop() ?? 'png';
	const replaceExt = (url: string, ext: string) => url.replace(/\.\w+$/, `.${ext}`);
</script>

<div class={mobileOnly ? 'md:hidden' : ''}>
	{#if banners.length > 0}
		<div
			role="presentation"
			style="display: grid; overflow: hidden; width: 100%;"
			on:mouseenter={handleMouseEnter}
			on:mouseleave={handleMouseLeave}
		>
		{#key current}
			<div
				class="container {banners[current].mobile_only ? 'md:hidden' : ''} text-center {cover ? 'p-0 m-0' : ''}"
				style="grid-area: 1 / 1; width: 100%;"
				in:fly={{ y: 24, duration: SWAP_DURATION_MS, easing: quintOut }}
				out:fly={{ y: -24, duration: SWAP_DURATION_MS, easing: quintOut }}
			>
				{#if banners[current].url}
					<a
						href={banners[current].url}
						target="_blank"
						rel="noopener noreferrer sponsored"
						class="inline-block text-center {showLabel
							? 'inline-block max-w-full relative text-center bg-gray-50 dark:bg-gray-900/10 p-4 rounded-md text-black dark:text-white'
							: ''}"
					>
						{#if showLabel}
							<span
								class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[var(--page-bg)] px-2 py-1 font-semibold text-xs rounded"
								>Partner Display</span
							>
						{/if}
						<picture>
							{#each banners[current].formats ?? [getExtension(banners[current].image)] as format}
								<source
									srcset="{replaceExt(banners[current].image, format)}?v={banners[current]._v}"
									type="image/{format}"
								/>
							{/each}
							<img
								src="{replaceExt(
									banners[current].image,
									(banners[current].formats ?? [getExtension(banners[current].image)]).at(-1)
								)}?v={banners[current]._v}"
								alt={banners[current].label ?? 'Advertisement'}
								style="width: {width ??
									(isMobile
										? banners[current].mobileWidth ?? '700px'
										: banners[current].width ?? '800px')}; height: {height ??
									(isMobile
										? banners[current].mobileHeight ?? '70px'
										: banners[current].height ?? '99px')};"
								class="w-full"
							/>
						</picture>
					</a>
				{:else}
					<picture>
						{#each banners[current].formats ?? [getExtension(banners[current].image)] as format}
							<source
								srcset="{replaceExt(banners[current].image, format)}?v={banners[current]._v}"
								type="image/{format}"
							/>
						{/each}
						<img
							src="{replaceExt(
								banners[current].image,
								(banners[current].formats ?? [getExtension(banners[current].image)]).at(-1)
							)}?v={banners[current]._v}"
							alt={banners[current].label ?? 'Advertisement'}
							style="width: {width ??
								(isMobile
									? banners[current].mobileWidth ?? '700px'
									: banners[current].width ?? '800px')}; height: {height ??
								(isMobile
									? banners[current].mobileHeight ?? '70px'
									: banners[current].height ?? '99px')};"
							class="mx-auto max-w-full"
						/>
					</picture>
				{/if}
			</div>
		{/key}
		</div>
	{:else if notFound}
		<div class="text-center text-red-600 text-sm italic">Advert "{name}" not found.</div>
	{/if}
</div>
