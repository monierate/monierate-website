<script lang="ts">
	import { browser } from '$app/environment';
	import MiniCurrencyDropdown from '../MiniCurrencyDropdown.svelte';
	import { NumberFormatter } from '$lib/numberFormat';
	import { onMount } from 'svelte';

	export let cryptoList = ['USDT'];
	export let fiatList = ['NGN'];

	export let base = 'USDT';
	export let quote = 'NGN';
	export let rate = 1500;

	export let allowInternalRateUpdate: boolean = false;
	export let onQuoteChange: (currency: string) => void = () => {};
	export let onBaseChange: (currency: string) => void = () => {};

	const fromAmount: any = new NumberFormatter('1');
	const toAmount: any = new NumberFormatter();
	let isFetching: boolean = false;

	const fetchRate = async () => {};

	const updateFrom = () => {
		const num = parseFloat(fromAmount.raw || '0');
		toAmount.handler = (num * rate).toString();
	};

	const updateTo = () => {
		const num = parseFloat(toAmount.raw || '0');
		fromAmount.handler = (num / rate).toFixed(6);
	};

	const updateBase = (currency: string) => {
		onBaseChange(currency);
		if (allowInternalRateUpdate) fetchRate();
	};

	const updateQuote = (currency: string) => {
		onQuoteChange(currency);
		if (allowInternalRateUpdate) fetchRate();
	};

	onMount(() => {
		if (browser) {
			updateFrom();
		}
	});
</script>

<!-- CARD -->
<div
	class="bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-800
    rounded-xl p-5 space-y-5"
>
	<!-- FROM -->
	<div
		class="bg-gray-50 dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
      rounded-lg p-3 space-y-1"
	>
		<div class="flex justify-between items-center">
			<span class="text-gray-700 dark:text-gray-300 text-sm font-medium"> From </span>

			<div
				class="flex items-center gap-2
          bg-gray-100 dark:bg-gray-700
          rounded-full p-2"
			>
				<MiniCurrencyDropdown bind:selected={base} onSelect={updateBase} options={cryptoList} />
			</div>
		</div>

		<input
			type="text"
			placeholder="0"
			bind:value={fromAmount.handler}
			on:input={updateFrom}
			class="w-full h-10 bg-transparent
        text-xl font-semibold
        tracking-tight
        text-gray-900 dark:text-gray-100
        placeholder-gray-400 dark:placeholder-gray-500
        focus:outline-none"
			bind:this={fromAmount.inputElement}
		/>
	</div>

	<!-- RATE -->
	<div class="text-center text-sm text-gray-500 dark:text-gray-400">
		1 {base} = {rate.toLocaleString()}
		{quote}
		{#if isFetching}
			<span class="ml-1 text-xs text-gray-400 dark:text-gray-500"> (updating…) </span>
		{/if}
	</div>

	<!-- TO -->
	<div
		class="bg-gray-50 dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
      rounded-lg p-3 space-y-1"
	>
		<div class="flex justify-between items-center">
			<span class="text-gray-700 dark:text-gray-300 text-sm font-medium"> To </span>

			<div
				class="flex items-center gap-2
          bg-gray-100 dark:bg-gray-700
          rounded-full p-2"
			>
				<MiniCurrencyDropdown bind:selected={quote} onSelect={updateQuote} options={fiatList} />
			</div>
		</div>

		<input
			type="text"
			placeholder="10 – 50,000"
			bind:value={toAmount.handler}
			on:input={updateTo}
			class="w-full h-10 bg-transparent
        text-xl font-semibold
        tracking-tight
        text-gray-900 dark:text-gray-100
        placeholder-gray-400 dark:placeholder-gray-500
        focus:outline-none"
			bind:this={toAmount.inputElement}
		/>
	</div>

	<!-- INFO -->
	<span class="flex gap-2 p-4">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
			/>
		</svg>

		<span class="text-gray-600 dark:text-gray-300 text-sm">
			We aggregate and weigh exchange rates from popular exchanges for this conversion. This might
			not be exactly what you will receive.
		</span>
	</span>
</div>
