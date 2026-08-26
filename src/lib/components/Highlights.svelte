<script lang="ts">
	import HighlightCard from '$lib/components/HighlightCard.svelte';
	import { slide } from 'svelte/transition';
	import { setCookie } from '$lib/functions';
	import { beforeNavigate } from '$app/navigation';

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
		class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
		in:slide={{ duration: highlightsAnimationSpeed }}
		out:slide={{ duration: highlightsAnimationSpeed }}
	>
		<!--New-->
		{#if newResult}
			<HighlightCard
				highlightData={newResult}
				highlightType="auto"
				title="🔥 New Listing"
				base={base.symbol || base.code}
				quote={quote.symbol || quote.code}
			/>
		{/if}

		<!--BUYING-->
		{#if buyingResult}
			<HighlightCard
				highlightData={buyingResult}
				highlightType="buy"
				title="🔥 Best Buy Rate"
				base={base.symbol || base.code}
				quote={quote.symbol || quote.code}
			/>
		{/if}

		<!--SELLING-->
		{#if sellingResult}
			<HighlightCard
				highlightData={sellingResult}
				highlightType="sell"
				title="🔥 Best Sell Rate"
				base={base.symbol || base.code}
				quote={quote.symbol || quote.code}
			/>
		{/if}

		<!--SENDING-->
		{#if sendingResult}
			<HighlightCard
				highlightData={sendingResult}
				highlightType="sell"
				title="🔥 Best Sending Rate"
				base={base.symbol || base.code}
				quote={quote.symbol || quote.code}
			/>
		{/if}

		<!--LIQUIDITY-->
		{#if liquidityResult}
			<HighlightCard
				highlightData={liquidityResult}
				highlightType="sell"
				title="🔥 Best Liquidity Rate"
				base={base.symbol || base.code}
				quote={quote.symbol || quote.code}
			/>
		{/if}

		<!--FUNDING-->
		{#if fundingResult}
			<HighlightCard
				highlightData={fundingResult}
				highlightType="buy"
				title="🔥 Best Card Rate"
				mobileOnly={true}
				base={base.symbol || base.code}
				quote={quote.symbol || quote.code}
			/>
		{/if}
	</div>
{/if}
