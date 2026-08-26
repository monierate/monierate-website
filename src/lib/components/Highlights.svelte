<script lang="ts">
	import HighlightCard from '$lib/components/HighlightCard.svelte';
	import { slide } from 'svelte/transition';
	import { setCookie } from '$lib/functions';
	import { beforeNavigate } from '$app/navigation';
	import { tick } from 'svelte';

	export let base: { symbol: string; code: string };
	export let quote: { symbol: string; code: string };
	export let highlights: {
		newResult: any;
		buyingResult: any;
		sellingResult: any;
		sendingResult: any;
		fundingResult: any;
		liquidityResult: any;
	};
	export let isMobile: boolean;
	export let showHighlightsDefault: boolean = true;
	export let inProgress: boolean = false;

	$: newResult = highlights.newResult;
	$: buyingResult = highlights.buyingResult;
	$: sellingResult = highlights.sellingResult;
	$: sendingResult = highlights.sendingResult;
	$: fundingResult = highlights.fundingResult;
	$: liquidityResult = highlights.liquidityResult;

	// Highlighting
	let showHighlights = isMobile ? false : showHighlightsDefault;
	let highlightsAnimationSpeed: number = 0;

	function toggleHighlights(event: Event) {
		let toggle = event.target as HTMLInputElement;
		highlightsAnimationSpeed = 250;
		if (toggle.checked) {
			showHighlights = true;
			if (!isMobile) {
				setCookie('showHighlights', 'true', 30);
			}
		} else {
			showHighlights = false;
			if (!isMobile) {
				setCookie('showHighlights', 'false', 30);
			}
		}
	}

	beforeNavigate(() => (highlightsAnimationSpeed = 0));

	/* -----------------------------
	 * Desktop horizontal scroller
	 * -----------------------------
	 * From `lg` up the cards become a single row scrolling four at a time. Below that
	 * the container stays the stacked/2-up grid, which never overflows — so the scroll
	 * state stays false there and the buttons stay hidden.
	 */

	const CARD_GAP = 16; // matches gap-4
	// A quarter of the row on desktop (4 cards + three 1rem gaps); no effect below `lg`.
	const CARD_CLASS = 'lg:shrink-0 lg:w-[calc(25%-0.75rem)] lg:snap-start';

	let scroller: HTMLDivElement | null = null;
	let showLeftScrollButton: boolean = false;
	let showRightScrollButton: boolean = false;

	function checkHighlightScroll() {
		if (!scroller) return;

		const tolerance = 1; // buffer for rounding errors
		showLeftScrollButton = scroller.scrollLeft > tolerance;
		showRightScrollButton =
			scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - tolerance;
	}

	// Step by exactly one card so cards always come to rest on a boundary.
	function scrollHighlightsBy(direction: -1 | 1) {
		if (!scroller) return;

		const card = scroller.firstElementChild as HTMLElement | null;
		const step = card ? card.getBoundingClientRect().width + CARD_GAP : scroller.clientWidth;
		scroller.scrollBy({ left: direction * step, behavior: 'smooth' });
	}

	// The row lives inside `{#if showHighlights}`, so it mounts and unmounts with the
	// toggle — an action keeps the listeners tied to that lifecycle.
	function trackScroll(node: HTMLDivElement) {
		scroller = node;
		checkHighlightScroll();

		const observer = new ResizeObserver(checkHighlightScroll);
		observer.observe(node);
		for (const child of Array.from(node.children)) observer.observe(child);

		node.addEventListener('scroll', checkHighlightScroll, { passive: true });
		window.addEventListener('resize', checkHighlightScroll);

		return {
			destroy() {
				observer.disconnect();
				node.removeEventListener('scroll', checkHighlightScroll);
				window.removeEventListener('resize', checkHighlightScroll);
				scroller = null;
			}
		};
	}

	// Re-measure when the cards themselves change (e.g. after switching pair).
	$: if (highlights && scroller) tick().then(checkHighlightScroll);
</script>

<!-- Highlight Toggle -->
<div class="flex justify-end items-center mb-6">
	{#if inProgress}
		<span class="mr-2 -mb-1">
			<span
				class="inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"
			></span>
		</span>
	{/if}
	<label class="inline-flex items-center cursor-pointer">
		<span class="mr-2 text-sm text-gray-600 dark:text-gray-400">Highlight</span>
		<input
			type="checkbox"
			value=""
			class="sr-only peer"
			on:change={toggleHighlights}
			bind:checked={showHighlights}
			id="highlight-toggle"
		/>
		<div
			class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
		></div>
	</label>
</div>

{#if showHighlights}
	<div
		class="relative mb-8"
		in:slide={{ duration: highlightsAnimationSpeed }}
		out:slide={{ duration: highlightsAnimationSpeed }}
	>
		{#if showLeftScrollButton}
			<button
				class="hidden lg:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center border border-[var(--card-border)] rounded-full bg-[var(--card-bg)] shadow-md"
				on:click={() => scrollHighlightsBy(-1)}
				aria-label="Scroll highlights left"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6 text-[var(--text-secondary)]"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
				</svg>
			</button>
		{/if}

		<div
			use:trackScroll
			class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:flex lg:flex-nowrap lg:overflow-x-auto lg:scroll-smooth lg:snap-x no-scrollbar"
		>
			<!--New-->
			{#if newResult?.length}
				<div class={CARD_CLASS}>
					<HighlightCard
						highlightData={newResult}
						highlightType="auto"
						title="🔥 New Listing"
						base={base.symbol || base.code}
						quote={quote.symbol || quote.code}
					/>
				</div>
			{/if}

			<!--BUYING-->
			{#if buyingResult?.length}
				<div class={CARD_CLASS}>
					<HighlightCard
						highlightData={buyingResult}
						highlightType="buy"
						title="🔥 Best Buy Rate"
						base={base.symbol || base.code}
						quote={quote.symbol || quote.code}
					/>
				</div>
			{/if}

			<!--SELLING-->
			{#if sellingResult?.length}
				<div class={CARD_CLASS}>
					<HighlightCard
						highlightData={sellingResult}
						highlightType="sell"
						title="🔥 Best Sell Rate"
						base={base.symbol || base.code}
						quote={quote.symbol || quote.code}
					/>
				</div>
			{/if}

			<!--SENDING-->
			{#if sendingResult?.length}
				<div class={CARD_CLASS}>
					<HighlightCard
						highlightData={sendingResult}
						highlightType="sell"
						title="🔥 Best Sending Rate"
						base={base.symbol || base.code}
						quote={quote.symbol || quote.code}
					/>
				</div>
			{/if}

			<!--LIQUIDITY-->
			{#if liquidityResult?.length}
				<div class={CARD_CLASS}>
					<HighlightCard
						highlightData={liquidityResult}
						highlightType="sell"
						title="🔥 Best Liquidity Rate"
						base={base.symbol || base.code}
						quote={quote.symbol || quote.code}
					/>
				</div>
			{/if}

			<!--FUNDING-->
			{#if fundingResult?.length}
				<div class={CARD_CLASS}>
					<HighlightCard
						highlightData={fundingResult}
						highlightType="buy"
						title="🔥 Best Card Rate"
						base={base.symbol || base.code}
						quote={quote.symbol || quote.code}
					/>
				</div>
			{/if}
		</div>

		{#if showRightScrollButton}
			<button
				class="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center border border-[var(--card-border)] rounded-full bg-[var(--card-bg)] shadow-md"
				on:click={() => scrollHighlightsBy(1)}
				aria-label="Scroll highlights right"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6 text-[var(--text-secondary)]"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
				</svg>
			</button>
		{/if}
	</div>
{/if}
