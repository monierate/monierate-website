<script lang="ts">
	import { formatNumber } from '$lib/functions';
	import { slide } from 'svelte/transition';

	export let title: string;
	export let data: {
		base: {
			name: string;
			symbol: string;
		};
		quote: {
			name: string;
			symbol: string;
		};
		rate: {
			now: number;
			last: number;
		};
		currencies: Record<string, string>;
	};

	let readMore: boolean = false;
</script>

<div>
	<h1 class="text-2xl md:text-4xl mb-2 {readMore ? 'mb-4' : ''}">
		{title}
	</h1>
	<div class="font-normal space-y-2" style="color: var(--text-secondary);">
		<p>
			The average rate for {data.base.symbol}1 is {data.quote.symbol}{formatNumber(data.rate.now)},
			compared to {data.quote.symbol}{formatNumber(data.rate.last)} a month ago.
			{#if !readMore}
				<button
					class="mt-2 cursor-pointer font-medium hover:underline"
					style="color: var(--accent);"
					on:click={() => (readMore = true)}>Read More</button
				>
			{/if}
		</p>
		{#if readMore}
			<p in:slide={{ duration: 250 }} out:slide={{ duration: 250 }}>
				Rates provided are for indicative and guidance purposes only. You need at least {data.quote.symbol}{formatNumber(
					(data.rate.now || 0) * 100
				)} to get {data.base.symbol}100 now, and if you have {data.base.symbol}100 you can get {data.quote
					.symbol}{formatNumber(data.rate.now * 100)} or less.
			</p>
			<p>
				<strong>Buy rate:</strong> Used for changing {data.currencies[data.quote.name] ||
					data.quote.name} to {data.currencies[data.base.name] || data.base.name}.
			</p>
			<p>
				<strong>Sell rate:</strong> Used for changing {data.currencies[data.base.name] ||
					data.base.name} to {data.currencies[data.quote.name] || data.quote.name}. Tap on any
				provider for more details.
			</p>
			<button
				class="text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mt-2 cursor-pointer"
				on:click={() => (readMore = false)}>Read Less</button
			>
		{/if}
	</div>
</div>
