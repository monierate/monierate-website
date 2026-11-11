<script lang="ts">
	import { onMount, tick } from 'svelte';
	import MarketPairCard from './MarketPairCard.svelte';
	import type { MarketCard } from '$lib/utils/marketPairs';

	let {
		cards,
		interval = 3000,
		delay = 0
	}: {
		cards: MarketCard[];
		/** How often the row moves on by one card, in ms. */
		interval?: number;
		/** Holds back this row's first move, so rows on one page don't all move at once. */
		delay?: number;
	} = $props();

	/** How long one slide takes. */
	const DURATION = 300;
	/** After someone scrolls, hovers or clicks the row, it stays still this long. */
	const IDLE_AFTER_INTERACTION = 6000;

	let track = $state<HTMLDivElement>();
	let canPrev = $state(false);
	let canNext = $state(false);

	let hovering = false;
	let focused = false;
	let onScreen = true;
	let animating = false;
	let lastInteraction = 0;
	let frame = 0;

	function measure() {
		if (!track) return;
		canPrev = track.scrollLeft > 1;
		canNext = track.scrollLeft + track.clientWidth < track.scrollWidth - 1;
	}

	/** One card plus the gap after it. */
	function stepSize(): number {
		const first = track?.firstElementChild as HTMLElement | null;
		if (!track || !first) return 0;
		return first.offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 0);
	}

	// Ease-out: moving from the first frame and settling into place, so the
	// whole DURATION reads as motion (an ease-in-out sits still at both ends).
	const ease = (t: number) => 1 - Math.pow(1 - t, 3);

	// Animated by hand rather than with scrollTo({ behavior: 'smooth' }): the
	// browser picks its own duration for a smooth scroll, and the slide is meant
	// to take exactly DURATION. Snapping is off while it runs, or each frame's
	// position would be snapped back.
	function slideTo(left: number) {
		const el = track;
		if (!el) return;
		cancelAnimationFrame(frame);
		const from = el.scrollLeft;
		const to = Math.max(0, Math.min(left, el.scrollWidth - el.clientWidth));
		if (Math.abs(to - from) < 1) return;

		el.style.scrollSnapType = 'none';
		animating = true;
		const start = performance.now();
		const step = (now: number) => {
			const t = Math.min(1, (now - start) / DURATION);
			el.scrollLeft = from + (to - from) * ease(t);
			if (t < 1) {
				frame = requestAnimationFrame(step);
			} else {
				animating = false;
				el.style.scrollSnapType = '';
				measure();
			}
		};
		frame = requestAnimationFrame(step);
	}

	function by(cardsToMove: number) {
		const size = stepSize();
		if (!track || !size) return;
		const current = Math.round(track.scrollLeft / size);
		slideTo((current + cardsToMove) * size);
	}

	function onArrow(direction: 1 | -1) {
		lastInteraction = Date.now();
		by(direction);
	}

	function onScroll() {
		// A scroll we didn't start is the visitor swiping or using a trackpad.
		if (!animating) lastInteraction = Date.now();
		measure();
	}

	function advance() {
		if (!track || animating || hovering || focused || !onScreen || document.hidden) return;
		if (Date.now() - lastInteraction < IDLE_AFTER_INTERACTION) return;
		measure();
		if (!canPrev && !canNext) return; // everything fits; nothing to slide
		if (canNext) by(1);
		else slideTo(0); // back to the start once the last card is in view
	}

	// A new search or filter changes the cards: start the row from the beginning.
	$effect(() => {
		void cards;
		tick().then(() => {
			if (track) track.scrollLeft = 0;
			measure();
		});
	});

	onMount(() => {
		measure();
		const resize = new ResizeObserver(measure);
		if (track) resize.observe(track);

		const visibility = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
		if (track) visibility.observe(track);

		let timer: ReturnType<typeof setInterval> | undefined;
		let starter: ReturnType<typeof setTimeout> | undefined;
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			starter = setTimeout(() => (timer = setInterval(advance, interval)), delay);
		}

		return () => {
			resize.disconnect();
			visibility.disconnect();
			clearTimeout(starter);
			clearInterval(timer);
			cancelAnimationFrame(frame);
		};
	});
</script>

<div
	class="relative"
	role="group"
	onpointerenter={(e) => e.pointerType === 'mouse' && (hovering = true)}
	onpointerleave={(e) => e.pointerType === 'mouse' && (hovering = false)}
	onfocusin={() => (focused = true)}
	onfocusout={() => (focused = false)}
>
	<div
		bind:this={track}
		onscroll={onScroll}
		class="track -my-1 flex snap-x snap-mandatory gap-4 overflow-x-auto py-1"
	>
		{#each cards as card (card.code)}
			<div class="w-[78vw] max-w-[280px] shrink-0 snap-start sm:w-[280px]">
				<MarketPairCard {card} />
			</div>
		{/each}
	</div>

	{#if canPrev}
		<button
			type="button"
			onclick={() => onArrow(-1)}
			aria-label="Previous pairs"
			class="arrow absolute -left-4 top-1/2 hidden -translate-y-1/2 sm:flex"
		>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="m15 18-6-6 6-6" />
			</svg>
		</button>
	{/if}
	{#if canNext}
		<button
			type="button"
			onclick={() => onArrow(1)}
			aria-label="More pairs"
			class="arrow absolute -right-4 top-1/2 hidden -translate-y-1/2 sm:flex"
		>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="m9 18 6-6-6-6" />
			</svg>
		</button>
	{/if}
</div>

<style>
	.track {
		scrollbar-width: none;
	}
	.track::-webkit-scrollbar {
		display: none;
	}

	.arrow {
		width: 40px;
		height: 40px;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		border: 1px solid var(--card-border);
		background: var(--card-bg);
		color: var(--text-primary);
		box-shadow: 0 2px 10px rgb(0 0 0 / 0.12);
		cursor: pointer;
		transition: background-color 0.15s;
	}
	.arrow:hover {
		background: var(--table-hover);
	}
</style>
