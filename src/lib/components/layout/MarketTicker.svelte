<script lang="ts">
	import { onMount } from 'svelte';
	import Money from "$lib/money";

	export let top_pairs: Record<
		string,
		{
			from: string;
			to: string;
			name: string;
			price: number;
			price_change_percent_24hr: number;
		}
	>;

	// Pixels per second the strip travels. A narrow screen fits about one pair at a time,
	// so the same speed reads as much faster there — ease off when the strip is cramped.
	const SPEED_NARROW = 55;
	const SPEED_WIDE = 80;
	const WIDE_FROM = 700;

	let viewport: HTMLDivElement;
	let copies: HTMLDivElement[] = [];
	let prefersReducedMotion = false;

	// Width of one full pass, in px. 0 keeps the strip static: the list already fits,
	// the user asked for less motion, or we haven't measured yet (SSR / first paint).
	let shift = 0;
	let duration = 0;

	$: pairs = Object.entries(top_pairs ?? {});
	$: isSliding = shift > 0;
	// A second copy trailing the first is what makes the loop seamless.
	$: passes = isSliding ? [false, true] : [false];

	const measure = () => {
		if (!viewport || !copies[0]) return;

		const width = copies[0].getBoundingClientRect().width;

		// Nothing to slide past if the whole list is already on screen.
		shift = !prefersReducedMotion && width > viewport.clientWidth ? width : 0;
		duration = shift / (viewport.clientWidth >= WIDE_FROM ? SPEED_WIDE : SPEED_NARROW);
	};

	onMount(() => {
		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

		const onMotionChange = () => {
			prefersReducedMotion = motionQuery.matches;
			measure();
		};

		onMotionChange();

		const observer = new ResizeObserver(measure);
		observer.observe(viewport);
		if (copies[0]) observer.observe(copies[0]);

		motionQuery.addEventListener('change', onMotionChange);

		return () => {
			observer.disconnect();
			motionQuery.removeEventListener('change', onMotionChange);
		};
	});
</script>

{#if pairs.length}
<div
	class="w-full py-2.5 whitespace-nowrap"
	style="background: var(--page-bg); border-bottom: 1px solid var(--card-border);"
>
	<div
		bind:this={viewport}
		class="ticker w-[95%] md:max-w-[1500px] mx-auto px-4"
		class:is-sliding={isSliding}
		class:overflow-x-auto={!isSliding}
		class:no-scrollbar={!isSliding}
		style="--ticker-shift: {shift}px; --ticker-duration: {duration}s;"
	>
		<div class="ticker-track">
			{#each passes as isClone, pass (pass)}
				<!-- The clone is decoration: keep it out of the tab order and the a11y tree. -->
				<div
					bind:this={copies[pass]}
					class="ticker-pass"
					inert={isClone}
					aria-hidden={isClone ? 'true' : undefined}
				>
					{#each pairs as [code, value] (code)}
						<a
							data-sveltekit-reload
							href="/markets/{code}"
							class="mr-6 text-[90%] md:text-sm"
							style="color: var(--text-primary);"
						>
							<span class="font-medium mr-1">{value.name}</span>
							<span class="font-mono font-normal mr-1" style="color: var(--text-secondary);">{Money.format(value.price, 2)}</span>
							<!-- display 24hr price change in green or red -->
							{#if value.price_change_percent_24hr > 0}
								<span class="inline-block font-mono text-sm" style="color: var(--positive);">
									<svg
										viewBox="0 0 320 512"
										width="16"
										height="16"
										class="inline-block bg-transparent text-2xl"
										fill="green"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z"
										/>
									</svg>
									{Money.format(value.price_change_percent_24hr, 2)}%
								</span>
							{:else}
								<span class="inline-block font-mono text-sm" style="color: var(--negative);">
									<svg
										viewBox="0 0 320 512"
										width="16"
										height="16"
										class="inline-block bg-transparent text-2xl"
										fill="red"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z"
										/>
									</svg>
									{Money.format(value.price_change_percent_24hr, 2)}%
								</span>
							{/if}
						</a>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>
{/if}

<style>
	.ticker.is-sliding {
		overflow: hidden;
		/* Soften the edges so rates fade out instead of being cut off mid-glyph. */
		-webkit-mask-image: linear-gradient(to right, transparent, #000 2rem, #000 calc(100% - 2rem), transparent);
		mask-image: linear-gradient(to right, transparent, #000 2rem, #000 calc(100% - 2rem), transparent);
	}

	.ticker-track {
		display: flex;
		width: max-content;
	}

	.ticker-pass {
		display: flex;
		align-items: center;
	}

	.is-sliding .ticker-track {
		animation: ticker-scroll var(--ticker-duration) linear infinite;
		will-change: transform;
	}

	/* Hold still while someone is reading a rate or tabbing through the links. */
	.is-sliding:hover .ticker-track,
	.is-sliding:focus-within .ticker-track {
		animation-play-state: paused;
	}

	@keyframes ticker-scroll {
		to {
			transform: translateX(calc(-1 * var(--ticker-shift)));
		}
	}
</style>
