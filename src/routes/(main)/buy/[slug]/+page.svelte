<script lang="ts">
	import type { PageData } from './$types';
	import { changePath, scrollToSection } from '$lib/functions';
	import Money from '$lib/money';
	import { onMount } from 'svelte';
	import AdBanner from '$lib/components/AdBanner.svelte';

	export let data: PageData;

	interface Changer {
		code: string;
		name: string;
		link: string;
		pairs: any;
	}

	interface PairChanger {
		changer_code: string;
		price_buy: number;
		price_sell: number;
		updated_at: string;
	}

	interface ChangerRate {
		rate: PairChanger;
		changer: Changer;
	}

	interface Currency {
		code: string;
		name: string;
		symbol?: string;
	}

	let isLoading = true;
	let hasResults = false;
	let currencyToBuyInput = 'USD';
	let currencyToPayInput = 'NGN';
	let changers: Record<string, Changer> = data.changers || {};
	let pairChangers: PairChanger[] = data.pair_changers || {};
	let currencies: Currency[] = data.currencies || [];
	let convertAmount = 1;
	$: convert = data.convert || { From: 'USD', To: 'NGN', Amount: 1 };
	$: convertFrom = convert.From?.toUpperCase().trim();
	$: convertTo = convert.To?.toUpperCase().trim();
	$: inverse = convert.Inverse;

	$: currencyFrom = currencies.find((c) => c.code.toUpperCase() === convertFrom) || {
		code: convertFrom,
		name: convertFrom,
		symbol: convertFrom
	};
	$: currencyTo = currencies.find((c) => c.code.toUpperCase() === convertTo) || {
		code: convertTo,
		name: convertTo,
		symbol: convertTo
	};

	let convertResult: ChangerRate[] = [];

	async function getPairChangers(pair_code: string, changer_service: string) {
		const response = await fetch(
			`/api/pairs/changers?pair_code=${pair_code}&changer_service=${changer_service}`
		);
		const changers = await response.json();

		pairChangers = changers;

		return changers;
	}

	function findSupportedPlatforms(): ChangerRate[] {
		let platform_rates: ChangerRate[] = [];

		try {
			if (changers && pairChangers.length > 0) {
				pairChangers.map((changerRate) => {
					const changer = changers[changerRate.changer_code];
					platform_rates.push({
						rate: changerRate,
						changer: changer
					});
				});
			}
		} catch (error) {
			console.error('Error finding platforms:', error);
		}

		platform_rates = platform_rates.filter((a) => a.rate.price_buy > 0);
		platform_rates.sort((a, b) => a.rate.price_buy - b.rate.price_buy);

		return platform_rates;
	}

	$: {
		isLoading = true;
		hasResults = false;

		try {
			if (convertFrom && convertTo && convertAmount) {
				convertResult = findSupportedPlatforms();
				hasResults = convertResult.length > 0;
			}
		} catch (error) {
			console.error('Conversion calculation error:', error);
		} finally {
			// Only hide loading after we've determined if we have results
			setTimeout(() => {
				isLoading = false;
			}, 300);
		}
	}

	// URL pathname update function
	async function updateUrlPath() {
		try {
			isLoading = true;
			await getPairChangers(`${currencyToBuyInput}${currencyToPayInput}`, 'ramp');
			if (!(pairChangers?.length > 0)) {
				await getPairChangers(`${currencyToPayInput}${currencyToBuyInput}`, 'ramp');
				convert.Inverse = true;
			} else {
				convert.Inverse = false;
			}
			changePath(
				`/buy/${currencyToBuyInput.toLowerCase()}-with-${currencyToPayInput.toLowerCase()}-best-buying-rate`
			);
		} catch (error) {
			console.error('URL update error:', error);
		}
	}

	let getInputValue = convertAmount;
	async function handleAmountChange(event: Event) {
		try {
			const target = event.target as HTMLInputElement;
			const inputValue = target.value.trim();

			if (inputValue !== '') {
				const newAmount = parseFloat(inputValue);
				convertAmount = isNaN(newAmount) || newAmount <= 0 ? 1 : newAmount;
				getInputValue = newAmount;
			} else {
				getInputValue = 0;
			}

			// await updateUrlPath();
			isLoading = false;
		} catch (error) {
			console.error('Amount change error:', error);
		}
	}

	async function handleCurrencyChange(type: any) {
		scrollToSection('convert-section');
		await updateUrlPath();
	}

	onMount(async () => {
		try {
			if (window) {
				const [currencyToBuyCode, _, currencyToPayCode] = window.location.pathname
					.replace('/buy/', '')
					.split('-');
				currencyToBuyInput = currencyToBuyCode.toUpperCase();
				currencyToPayInput = currencyToPayCode.toUpperCase();

				if (sessionStorage && sessionStorage.getItem('convertAmount')) {
					convertAmount = Number(sessionStorage.getItem('convertAmount'));
					sessionStorage.removeItem('convertAmount');
				}
			}
		} catch (error) {
			console.log('There was an error set initial input values:', error);
		}

		// referesh the pair changers rate every 10 minutes
		setInterval(() => {
			getPairChangers(`${currencyToBuyInput}${currencyToPayInput}`, 'ramp');
		}, 60000 * 10);
	});

	let openQuestion: any = null;
	function toggleQuestion(index: any) {
		openQuestion = openQuestion === index ? null : index;
	}
	const fractionalLength = (number: number) => (number > 0.009 ? 2 : 6);
</script>

<svelte:head>
	<title>
		Buy {convertFrom} with {convertTo} - Compare the best {convertTo} rates
	</title>
	<meta
		name="description"
		content="Convert {currencyFrom.name} in {currencyTo.name} on Monierate. This is the average exchange rate price of {currencyFrom.name} to {currencyTo.name} in the market right now. It is for information purposes only."
	/>
	<meta
		name="keywords"
		content="{currencyFrom.name} in {currencyTo.name}, {currencyFrom.name} to {currencyTo.name} exchange rate, {currencyFrom.name} to {currencyTo.name} black market, {currencyFrom.name} to {currencyTo.name} rate, {currencyFrom.name} to {currencyTo.name} converter."
	/>

	<meta property="og:type" content="website" />
	<meta
		property="og:title"
		content="Buy {convertFrom} with {convertTo} - Compare the best {convertTo} rates"
	/>
	<meta
		property="og:description"
		content="Convert {currencyFrom.name} in {currencyTo.name} on Monierate. Enter any amount in {convertFrom} to see the conversion in {convertTo}."
	/>
</svelte:head>

<!-- partner -->
<div class="bg-white dark:bg-gray-800">
	<AdBanner name="compare" />
</div>

<div class="mb-24">
	<div class="container mb-4 text-center">
		<h1 class="text-2xl md:text-4xl">
			Buy {convertFrom} with {convertTo} - Compare the best {convertTo} rates
		</h1>
	</div>

	<div id="changer-rate-wrapper" class="container">
		<div
			class="flex justify-center item-center shadow-sm bg-gray-50 dark:bg-gray-900 rounded-lg px-8 py-6"
		>
			<div class="w-full">
				<div class="block md:flex md:justify-between md:items-center">
					<span class="block md:w-[30%]">
						<label class="label" for="field-convert-from">You Buy</label>

						<span class="select">
							<select
								id="field-convert-from"
								class="text-gray-700 dark:text-gray-500 text-lg font-medium bg-transparent border-none focus:border-none focus:outline-none w-full"
								bind:value={currencyToBuyInput}
								on:change={handleCurrencyChange}
							>
								{#each currencies as currency}
									<option value={currency.code.toUpperCase()}>
										{currency.code.toUpperCase()} - {currency.name}
									</option>
								{/each}
							</select>
						</span>
					</span>
					<span class="block md:w-[30%]">
						<label class="label" for="field-convert-to">You Pay</label>
						<span class="select">
							<select
								id="field-convert-to"
								class="text-gray-700 dark:text-gray-500 text-lg font-medium bg-transparent border-none focus:border-none focus:outline-none w-full"
								bind:value={currencyToPayInput}
								on:change={handleCurrencyChange}
							>
								{#each currencies as currency}
									<option value={currency.code.toUpperCase()}>
										{currency.code.toUpperCase()} - {currency.name}
									</option>
								{/each}
							</select>
						</span>
					</span>
					<span class="block md:w-[30%]">
						<label class="label" for="field-convert-amount">Amount</label>
						<div class="flex items-center input">
							<!-- Numeric Input -->
							<input
								type="number"
								id="field-convert-amount"
								class="flex-1 text-gray-700 dark:text-gray-500 text-lg bg-transparent border-none focus:border-none font-medium focus:outline-none"
								value={convertAmount}
								on:input={handleAmountChange}
								step="0.01"
								min="0.01"
							/>
							<!-- Currency Label -->
							<span class="ml-2 text-gray-500 text-sm font-semibold">
								{convertFrom}
							</span>
						</div>
					</span>
				</div>
			</div>
		</div>
	</div>

	<!--FOR ACCURATE SCROLL PURPOSE-->
	<span id="convert-section" />
	<!------------------------------->
</div>

{#if getInputValue > 0}
	<!-- Platforms Table -->
	<div class="container">
		{#if isLoading}
			<div
				class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
			>
				<div class="flex flex-col items-center justify-center p-8">
					<div class="loader" />
					<p class="text-gray-600 dark:text-gray-400 mt-4">Loading exchange rates...</p>
				</div>
			</div>
		{:else if !hasResults}
			<div
				class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
			>
				<div class="text-center p-8">
					<svg
						class="mx-auto h-12 w-12 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01"
						/>
					</svg>
					<h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
						No Data Available
					</h3>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
						No platform for buying {convertFrom} with {convertTo}.
					</p>
				</div>
			</div>
		{:else}
			{#each convertResult as result, i}
				{#if result.rate.price_buy > 0}
					<div
						class="flex flex-wrap gap-4 px-8 py-4 w-full bg-white dark:bg-gray-900 shadow-md rounded-lg mb-8 relative overflow-hidden border {i ===
						0
							? 'border-gray-800 dark:border-light'
							: 'border-transparent'}"
					>
						<div class="flex-1 min-w-full md:min-w-[30%] md:flex md:items-center md:justify-start">
							<div class="flex justify-start items-center">
								<a
									href="/converter/{result.changer
										.code}?Amount={convertAmount}&From={currencyFrom.code.toUpperCase()}&To={currencyTo.code.toUpperCase()}"
								>
									<img
										src="/icons/svg/{result.changer.code}.svg"
										alt="{result.changer.name} icon"
										class="h-12 mr-2 rounded-full"
									/>
								</a>
								<a
									href="/converter/{result.changer
										.code}?Amount={convertAmount}&From={currencyFrom.code.toUpperCase()}&To={currencyTo.code.toUpperCase()}"
									class="text-gray-600 dark:text-gray-300 hover:underline text-lg"
								>
									{result.changer.name}
								</a>
							</div>
						</div>
						<div class="flex-1 min-w-full md:min-w-[30%]">
							<div class="text-left">
								<span class="block text-sm"
									>{convertAmount} {currencyToBuyInput.toUpperCase()} =</span
								>
								<span class="block text-4xl text-gray-800 dark:text-gray-200 py-3">
									{#if inverse}
										{Money.formatMoney(
											convertAmount / result.rate.price_buy,
											fractionalLength(convertAmount / result.rate.price_buy)
										)}
									{:else}
										{Money.formatMoney(result.rate.price_buy * convertAmount, 2)}
									{/if}
									{currencyTo?.symbol || convertTo}
								</span>
								<span class="block text-sm">
									<span class="pr-3"> Indicative Rate </span>
									1 {currencyToBuyInput.toUpperCase()} =
									{#if inverse}
										{Money.formatMoney(
											1 / result.rate.price_buy,
											fractionalLength(1 / result.rate.price_buy)
										)}
									{:else}
										{Money.formatMoney(result.rate.price_buy, 2)}
									{/if}
									{currencyTo?.symbol || convertTo}
								</span>
							</div>
						</div>
						<div
							class="flex-1 min-w-full md:min-w-[30%] md:text-right md:flex md:items-center md:justify-end"
						>
							<div>
								<a
									href="{result.changer
										.link}?utm_source=monierate&utm_medium=website&utm_campaign=monierate"
									class="block button w-full md:inline-block md:w-auto mr-4 mb-4 text-center"
								>
									Buy {convertFrom} now
								</a>
								{#if i === 0}
									<span
										class="absolute top-0 right-0 bg-gray-800 dark:bg-light text-white dark:text-dark text-xs px-2 py-1"
									>
										Best rate
									</span>
								{/if}
							</div>
						</div>
					</div>
				{/if}
			{/each}
		{/if}
	</div>
{/if}

<style>
	.loader {
		width: 48px;
		height: 48px;
		border: 5px solid #f3f3f3;
		border-top: 5px solid #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
