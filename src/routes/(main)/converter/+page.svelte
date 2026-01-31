<script lang="ts">
	import type { PageData } from './$types';
	import Money from '$lib/money';
	import { round, chain } from 'mathjs';
	import { changeParam } from '$lib/functions';
	import ChangerRates from '$lib/components/ChangerRates.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import AdBanner from '$lib/components/AdBanner.svelte';

	interface Currency {
		code: string;
		name: string;
		icon: string;
	}

	enum CurrentView {
		CONVERT = 'convert',
		BUY = 'buy',
		SELL = 'sell',
		SEND = 'send'
	}

	export let data: PageData;
	let changers = data.changers;
	let pairs = data.pairs;
	let pair_rates: any = {};
	let convert = data.convert;
	let currencies: Currency[] = data.currencies;
	let countries = data.countries;
	let countriesToCurrencies = data.countriesToCurrencies;
	let countryCodeByCurrency = data.countryCodeByCurrency;

	let convertFrom = convert.From.toUpperCase();
	let convertTo = convert.To.toUpperCase();
	let convertAmount = parseFloat(`${convert.Amount}`);
	let unit_currency = convertFrom;
	let convertResult = {
		rate: 0,
		rate_inverse: 0,
		conversion: 0
	};

	var currencyFrom: any = {};
	var currencyTo: any = {};
	var updated_at = '';
	let currentView: string = CurrentView.CONVERT;
	let userCountry: string = '';

	var moreConversions: any = {
		from: [],
		to: []
	};

	function convertNow() {
		const from = convertFrom.toLowerCase();
		const to =
			currentView === CurrentView.SEND
				? countriesToCurrencies[convertTo.toUpperCase()].toLowerCase()
				: convertTo.toLowerCase();

		let rate = 1; // 1:1
		let rate_inverse = 1;

		if (from != to) {
			/** Get the rate */
			let pair_code = `${from}${to}`.toLowerCase();
			let pair = pairs.find((p: any) => p.code === pair_code);
			if (pair) {
				updated_at = pair.updatedAt; // get last update time
				rate = pair.price.current;
				rate_inverse = 1 / rate;
				unit_currency = from.toUpperCase();

				// get rates of a pair
				pair_rates = sortRates(pair.changers || {});
			} else {
				pair_code = `${to}${from}`.toLowerCase();
				pair = pairs.find((p: any) => p.code === pair_code);
				if (pair) {
					updated_at = pair.updatedAt; // get last update time
					rate_inverse = pair.price.current;
					rate = 1 / rate_inverse;
					unit_currency = to.toUpperCase();

					// get rates of a pair
					pair_rates = sortRates(pair.changers || {});
				} else {
					rate = 0;
					rate_inverse = 0;
					unit_currency = from.toUpperCase();
				}
			}
		}

		/** Calcuate the conversion*/
		convertResult.rate = rate;
		convertResult.rate_inverse = rate_inverse;
		convertResult.conversion = round(chain(rate).multiply(convertAmount).done(), 8);

		currencyFrom = currencies.find((c) => c.code === from);
		currencyTo = currencies.find((c) => c.code === to);

		getMoreConversions();
	}

	async function getMoreConversions() {
		let series = [
			1, 3, 5, 7, 10, 12, 15, 25, 30, 45, 50, 75, 100, 300, 400, 500, 750, 1000, 3000, 5000, 7500,
			10000, 15000, 25000, 50000, 75000, 100000
		];
		let conversions: any = {
			from: [],
			to: []
		};

		series.forEach((serie) => {
			let rate = convertResult.rate;
			conversions.from.push({
				amount: serie,
				conversion: round(chain(rate).multiply(serie).done(), 8)
			});

			let rate_inverse = convertResult.rate_inverse;
			conversions.to.push({
				amount: serie,
				conversion: round(chain(rate_inverse).multiply(serie).done(), 8)
			});
		});

		moreConversions = conversions;
	}

	function sortRates(rates: any) {
		// sort rates in decending order by price_sell;
		rates.sort((a: any, b: any) => b.price_sell - a.price_sell);
		// filter out rate with price_sell as 0
		const filtered_non_zero_rates = rates.filter((rate: any) => rate.price_sell > 0);
		const filtered_zero_rates = rates.filter((rate: any) => rate.price_sell <= 0);
		// soirt rates in descending order by price_buy
		filtered_zero_rates.sort((a: any, b: any) => a.price_buy - b.price_buy);
		// merge both rates
		rates = filtered_non_zero_rates.concat(filtered_zero_rates);

		return rates;
	}

	async function getPairChangers(pair_code: string, changer_service: string) {
		const response = await fetch(
			`/api/pairs/changers?code=${pair_code}&changer_service=${changer_service}`
		);
		const changers = await response.json();
		return changers;
	}

	async function changeTabView(event: Event) {
		let currentViewButton = event.currentTarget as HTMLButtonElement;
		let viewTabs = document.getElementById('converter-tabs');
		let buttons = viewTabs?.getElementsByTagName('button');
		let currentViewData: any = currentViewButton.getAttribute('data-view');
		if (currentViewButton && viewTabs && buttons && currentViewData) {
			for (let i = 0; i < buttons.length; i++) {
				buttons[i].classList.remove('active');
			}
			currentViewButton?.classList.add('active');
			currentView = currentViewData;
			await setUserLocation();
		}
	}

	function viewAction() {
		if (currentView) {
			let view = null;
			if (convertAmount > 1 && sessionStorage) {
				sessionStorage.setItem('convertAmount', convertAmount.toString());
			}
			if (currentView === CurrentView.BUY) {
				view = `/buy/${convertFrom.toLowerCase()}-with-${convertTo.toLowerCase()}-best-buying-rate`;
			} else if (currentView === CurrentView.SELL) {
				view = `/sell/${convertFrom.toLowerCase()}-get-${convertTo.toLowerCase()}-best-selling-rate`;
			} else if (currentView === CurrentView.SEND) {
				view = `/send/${convertFrom.toLowerCase()}-to-${convertTo.toLowerCase()}-best-rate`;
			}
			if (view) {
				goto(view);
			}
		}
	}

	function swapConversionInputs() {
		let getConvertFrom = convertFrom;
		let getConvertTo = convertTo;
		convertFrom = getConvertTo;
		convertTo = getConvertFrom;
		convertNow();
	}

	async function getUserCountry() {
		try {
			const res = await fetch('https://ipapi.co/json/');
			if (res.ok) {
				const data = await res.json();
				if (data.country) return data.country.toUpperCase();
			}
		} catch (error) {
			console.error('Error fetching country:', error);
		}
		return false;
	}

	function findCurrencyByCountryCode(countryCode: string) {
		for (const [currency, countries] of Object.entries(countryCodeByCurrency)) {
			if (
				countries === countryCode ||
				(Array.isArray(countries) && countries.includes(countryCode))
			) {
				return currency;
			}
		}
		return null;
	}

	async function setUserLocation() {
		userCountry = await getUserCountry();
		if (userCountry) {
			if (currentView === CurrentView.SEND) {
				convertTo = userCountry ?? convertTo;
			} else {
				let countryCurrency = findCurrencyByCountryCode(userCountry.toUpperCase());
				convertTo = countryCurrency ?? convertTo;
			}
			convertNow();
		}
	}

	onMount(async () => {
		await setUserLocation();
	});

	convertNow();
</script>

<svelte:head>
	<title>
		{Money.format(convertAmount)}
		{convertFrom} to {convertTo} - Convert {currencyFrom.name} to {currencyTo.name}
	</title>
	<meta
		name="description"
		content="Convert {currencyFrom.name} to {currencyTo.name} on Monierate. This is the average exchange rate price of {currencyFrom.name} to {currencyTo.name} in the market right now. It is for information purposes only."
	/>
	<meta
		name="keywords"
		content="{currencyFrom.name} to {currencyTo.name}, {currencyFrom.name} to {currencyTo.name} exchange rate, {currencyFrom.name} to {currencyTo.name} black market, {currencyFrom.name} to {currencyTo.name} rate, {currencyFrom.name} to {currencyTo.name} converter."
	/>

	<meta property="og:type" content="website" />
	<meta
		property="og:title"
		content="{Money.format(
			convertAmount
		)} {convertFrom} to {convertTo} - Convert {currencyFrom.name} to {currencyTo.name}"
	/>
	<meta
		property="og:description"
		content="Convert {currencyFrom.name} to {currencyTo.name} on Monierate. Enter any amount in {convertFrom} to see the conversion in {convertTo}."
	/>
</svelte:head>

<div class="bg-white dark:bg-gray-800">
	<AdBanner name="converter" isMobile={data.isMobile} />
</div>

<div class="mb-24">
	<div class="w-[100%] md:w-[100%] px-8 pb-4 mx-auto mb-4 text-center">
		<h1 class="text-2xl md:text-4xl">
			{Money.format(convertAmount)}
			{convertFrom} to {currentView === CurrentView.SEND
				? countriesToCurrencies[convertTo.toUpperCase()]
				: convertTo} - Convert {currencyFrom.name} to {currencyTo.name}
		</h1>
	</div>

	<div id="changer-rate-wrapper" class="section">
		<div class="flex justify-center items-center">
			<div class="w-full">
				<!-- Tabs -->
				<div
					class="flex justify-between bg-accent-100 border dark:border-gray-700 rounded-[30px] p-2 mb-4 text-sm text-gray-600"
					id="converter-tabs"
				>
					<button
						class="button converter-tab-button active text-[0.8em] md:text-sm"
						data-view={CurrentView.CONVERT}
						on:click={changeTabView}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							width="24"
							height="24"
							class="hidden md:inline md:mr-2 w-full md:w-auto"
						>
							<path
								d="M18 7h-9.59l2.3-2.29a1 1 0 1 0-1.42-1.42l-4 4a1 1 0 0 0 0 1.42l4 4a1 1 0 1 0 1.42-1.42L8.41 9H18a2 2 0 0 1 0 4h-2a1 1 0 1 0 0 2h2a4 4 0 0 0 0-8zM6 17h9.59l-2.3 2.29a1 1 0 1 0 1.42 1.42l4-4a1 1 0 0 0 0-1.42l-4-4a1 1 0 1 0-1.42 1.42L15.59 15H6a2 2 0 0 1 0-4h2a1 1 0 1 0 0-2H6a4 4 0 0 0 0 8z"
							/>
						</svg>
						Convert
					</button>
					<button
						class="button converter-tab-button text-[0.8em] md:text-sm"
						data-view={CurrentView.BUY}
						on:click={changeTabView}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							width="24"
							height="24"
							class="hidden md:inline md:mr-2 w-full md:w-auto"
						>
							<path
								d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM3 4h2l3.6 7.59-1.35 2.44A1 1 0 0 0 8 16h11v-2H8.42l.93-1.68L19 6H6.21L5.27 4H3z"
							/>
						</svg>
						Buy
					</button>
					<button
						class="button converter-tab-button text-[0.8em] md:text-sm"
						data-view={CurrentView.SELL}
						on:click={changeTabView}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							width="24"
							height="24"
							class="hidden md:inline md:mr-2 w-full md:w-auto"
						>
							<path
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v1.5h1.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H11v2h1v1.5h-1.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5H13V9h-1V7.5h1.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"
							/>
						</svg>
						Sell
					</button>
					<button
						class="button converter-tab-button text-[0.8em] md:text-sm"
						data-view={CurrentView.SEND}
						on:click={changeTabView}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							width="24"
							height="24"
							class="hidden md:inline md:mr-2 w-full md:w-auto"
						>
							<path d="M2 21l21-9-21-9v7l15 2-15 2z" />
						</svg>
						Send
					</button>
				</div>

				<!-- Form -->
				<div class="flex flex-wrap flex-col md:flex-row items-center md:gap-4">
					<div class="flex-1 w-full">
						<label class="block text-sm text-gray-600 mb-1" for="field-convert-amount">Amount</label
						>
						<div class="flex-1 flex items-center input w-full p-0">
							<input
								type="number"
								id="field-convert-amount"
								class="text-lg bg-transparent border-none focus:border-none font-medium focus:outline-none w-full p-3"
								bind:value={convertAmount}
								on:input={() => convertNow()}
								on:input={() => changeParam('Amount', convertAmount)}
							/>
							<span class="mx-2 text-gray-500 text-sm font-semibold">
								{convertFrom}
							</span>
						</div>
					</div>
					<div class="flex-1 w-full">
						<label class="block text-sm text-gray-600 mb-1" for="field-convert-from">
							{#if currentView === CurrentView.SEND}
								You Send
							{:else if currentView === CurrentView.BUY}
								You Buy
							{:else if currentView === CurrentView.SELL}
								You Sell
							{:else}
								From
							{/if}
						</label>
						<div class="relative">
							<select
								id="field-convert-from"
								class="w-full p-4 select"
								bind:value={convertFrom}
								on:change={convertNow}
								on:change={() => changeParam('From', convertFrom)}
							>
								{#each Object.entries(currencies) as [index, currency]}
									<option value={currency.code.toUpperCase()}
										>{currency.code.toUpperCase()} - {currency.name}</option
									>
								{/each}
							</select>
							<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
								<!-- Arrow Icon -->
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</div>
						</div>
					</div>
					{#if currentView !== CurrentView.SEND}
						<div class="flex items-center">
							<button
								class="text-sm p-1 pl-2 md:mt-3 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-dark rounded-full"
								on:click={swapConversionInputs}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									width="24"
									height="24"
									class="inline mr-2"
								>
									<path
										d="M16.59 7H4a1 1 0 1 1 0-2h12.59L13.3 2.71a1 1 0 0 1 1.42-1.42l4 4a1 1 0 0 1 0 1.42l-4 4a1 1 0 0 1-1.42-1.42L16.59 7zM7.41 17H20a1 1 0 1 1 0 2H7.41l3.3 3.29a1 1 0 0 1-1.42 1.42l-4-4a1 1 0 0 1 0-1.42l4-4a1 1 0 0 1 1.42 1.42L7.41 17z"
									/>
								</svg>
							</button>
						</div>
					{/if}
					<div class="flex-1 w-full">
						<label class="block text-sm text-gray-600 mb-1" for="field-convert-to">
							{#if currentView === CurrentView.SEND}
								To
							{:else if currentView === CurrentView.BUY}
								You Pay
							{:else if currentView === CurrentView.SELL}
								To Get
							{:else}
								To
							{/if}
						</label>
						<div class="relative">
							<select
								id="field-convert-to"
								class="w-full p-4 select"
								bind:value={convertTo}
								on:change={convertNow}
								on:change={() => changeParam('To', convertTo)}
							>
								{#if currentView === CurrentView.SEND}
									{#each Object.entries(countries) as [key, name]}
										<option value={key.toUpperCase()}>{name}</option>
									{/each}
								{:else}
									{#each Object.entries(currencies) as [index, currency]}
										<option value={currency.code.toUpperCase()}
											>{currency.code.toUpperCase()} - {currency.name}</option
										>
									{/each}
								{/if}
							</select>
							<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
								<!-- Arrow Icon -->
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>

				<div>
					{#if currentView === CurrentView.CONVERT}
						<div id="convert-result" class="mt-8 mb-8">
							<span class="block font-semibold text-lg text-gray-600 dark:text-gray-300 mb-2">
								{Money.format(convertAmount)}
								{currencyFrom.name} =
							</span>
							<span class="block font-bold text-3xl mb-2 dark:text-gray-200">
								{Money.format(convertResult.conversion)}
								{currencyTo.name}
							</span>
							<span class="block text-gray-500 dark:text-gray-400">
								1 {convertFrom} = {Money.format(convertResult.rate)}
								{convertTo}
							</span>
							<span class="block text-gray-500 dark:text-gray-400">
								1 {convertTo} = {Money.format(convertResult.rate_inverse)}
								{convertFrom}
							</span>
						</div>
						<div class="block md:flex md:justify-between md:items-center">
							<!-- only show this if the from currency or to currency is BTC -->
							{#if convertFrom === 'BTC' || convertTo === 'BTC'}
								<span
									class="flex justify-between items-center bg-accent-100 md:hidden border dark:border-gray-700 rounded-lg p-4 mb-8"
								>
									<span class="block text-gray-600 dark:text-gray-300 text-sm">
										99% of Bitcoin price predictions are wrong, signup on
										<a href="https://tinyurl.com/everybitcoin-text-link">Every Bitcoin Newsletter</a
										>
										and get the 1% useful ones every Monday.

										<p class="mt-4">
											<a
												href="https://tinyurl.com/everybitcoin-text-link"
												class="underline text-semibold">Get Bitcoin Price Updates</a
											>
										</p>
									</span>
								</span>
							{/if}
							<span
								class="flex justify-between items-center bg-accent-100 md:w-[40%] border dark:border-gray-700 rounded-lg p-4 mb-8 md:mb-0"
							>
								<span class="inline-block mr-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-6 h-6"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
										/>
									</svg>
								</span>
								<span class="text-gray-600 dark:text-gray-300 text-sm">
									We aggregate and weigh exchange rates from popular exchanges for this conversion.
									This is for informational purposes only.
								</span>
							</span>
							<span class="block text-sm md:w-[50%] p-4">
								{currencyFrom.name} to {currencyTo.name} conversion — Last updated {new Date(
									updated_at
								)}
							</span>
						</div>
					{/if}
				</div>

				<span class="block mt-12 mb-4">
					<a
						href="https://tinyurl.com/mavapay-monierate-link"
						class="block button buy font-bold w-full md:inline-block md:w-auto"
					>
						Get the best rate on Mavapay
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="inline-block w-4 h-4 ml-2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
							/>
						</svg>
					</a>

					{#if currentView === CurrentView.CONVERT}
						<!-- <button class="button w-full md:max-w-[250px]" on:click={convertNow}> Convert </button> -->
					{:else}
						<button class="button w-full md:max-w-[250px]" on:click={viewAction}>
							{#if currentView === CurrentView.BUY}
								Buy
							{:else if currentView === CurrentView.SELL}
								Sell
							{:else if currentView === CurrentView.SEND}
								Send
							{/if}
						</button>
					{/if}
				</span>
			</div>
		</div>
	</div>

	<div class="mt-8 md:mt-0">
		<AdBanner name="converter_mobile_only" mobileOnly={true} showLabel={true} />
	</div>

	{#if currencyFrom.code !== currencyTo.code && pair_rates.length > 0}
		<div
			class="container mt-16 border border-none py-[10px] dark:text-light dark:border-none w-full overflow-x-scroll md:overflow-x-hidden overflow-y-scroll md:overflow-y-hidden"
		>
			<h2 class="mb-8 text-center text-2xl">
				Best {convertFrom} to {currentView === CurrentView.SEND
					? countriesToCurrencies[convertTo.toUpperCase()]
					: convertTo} rates
			</h2>
			<ChangerRates
				rates={{ remittance: data.remittanceRates, ramp: data.rampRates, card: data.cardRates }}
				{changers}
				from={currencyFrom}
				to={currencyTo}
				amount={convertAmount}
				{userCountry}
			/>
		</div>
	{/if}

	<div class="more-conversion">
		<div class="entry">
			<span class="header">
				<h2 class="text-center text-lg">
					Convert {currencyFrom.name} to {currencyTo.name}
				</h2>
			</span>
			<div class="pb-4">
				{#await moreConversions}
					<span class="block text-center py-8 px-4">Loading...</span>
				{:then conversions}
					<table class="w-full text-center px-8">
						<thead>
							<tr>
								<th class="py-4">{convertFrom}</th>
								<th class="py-4"
									>{currentView === CurrentView.SEND
										? countriesToCurrencies[convertTo.toUpperCase()]
										: convertTo}</th
								>
							</tr>
						</thead>
						<tbody>
							{#each Object.entries(conversions.from) as [index, convert]}
								<tr>
									<td class="py-2.5">
										<a
											data-sveltekit-reload
											href="/converter/?Amount={convert.amount}&From={convertFrom}&To={convertTo}"
										>
											{Money.format(convert.amount)}
											{convertFrom}
										</a>
									</td>
									<td class="py-2.5">
										{Money.format(convert.conversion)}
										{currentView === CurrentView.SEND
											? countriesToCurrencies[convertTo.toUpperCase()]
											: convertTo}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/await}
			</div>
		</div>
		<div class="entry">
			<span class="header">
				<h2 class="text-center text-lg">Convert {currencyTo.name} to {currencyFrom.name}</h2>
			</span>
			<div class="pb-4">
				{#await moreConversions}
					<span class="block text-center py-8 px-4">Loading...</span>
				{:then conversions}
					<table class="w-full text-center px-8">
						<thead class="">
							<tr>
								<th class="py-4"
									>{currentView === CurrentView.SEND
										? countriesToCurrencies[convertTo.toUpperCase()]
										: convertTo}</th
								>
								<th class="py-4">{convertFrom}</th>
							</tr>
						</thead>
						<tbody>
							{#each Object.entries(conversions.to) as [index, convert]}
								<tr>
									<td class="py-2.5">
										<a
											data-sveltekit-reload
											href="/converter?Amount={convert.amount}&From={convertTo}&To={convertFrom}"
										>
											{Money.format(convert.amount)}
											{currentView === CurrentView.SEND
												? countriesToCurrencies[convertTo.toUpperCase()]
												: convertTo}
										</a>
									</td>
									<td class="py-2.5">
										{Money.format(convert.conversion)}
										{convertFrom}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/await}
			</div>
		</div>
	</div>

	<div class="w-[95%] mx-auto md:w-[70%] mt-24">
		<h2 class="text-2xl mb-6 text-center">Currency Infomation</h2>
		<div class="block md:flex md:justify-between md:items-center">
			<div class="shadow-lg md:w-[45%] p-8 bg-white dark:bg-gray-900">
				<h2 class="text-2xl">{convertFrom} - {currencyFrom.name}</h2>
				<span class="block mt-6">
					{currencyFrom.description}
				</span>
			</div>
			<div class="shadow-lg md:w-[45%] p-8 bg-white dark:bg-gray-900">
				<h2 class="text-2xl">
					{currentView === CurrentView.SEND
						? countriesToCurrencies[convertTo.toUpperCase()]
						: convertTo} - {currencyTo.name}
				</h2>
				<span class="block mt-6">
					{currencyTo.description}
				</span>
			</div>
		</div>
	</div>
</div>

<style>
	.section {
		@apply w-[95%] md:w-[70%] bg-white dark:bg-gray-900 shadow-lg rounded-lg px-4 py-4 mx-auto;
	}

	.more-conversion {
		@apply w-[95%] mx-auto md:w-[70%] md:flex md:justify-between md:items-center mt-16;
	}
	.more-conversion .entry {
		@apply bg-white dark:bg-gray-900 shadow-lg rounded-lg md:w-[40%] mb-4;
	}
	.more-conversion .entry .header {
		@apply border-b border-gray-200 dark:border-gray-700 block py-4 px-8;
	}

	table thead th {
		@apply dark:text-gray-300 text-black whitespace-nowrap;
	}
	table tbody tr td {
		@apply py-2 whitespace-nowrap;
	}
	table tr td:first-child,
	table thead th:first-child {
		@apply pl-0;
	}

	.changer {
		@apply flex justify-between items-center py-2 border-b border-gray-200;
	}
	.changer:last-child {
		@apply border-b-0;
	}
	.changer-icon {
		@apply bg-transparent border border-black rounded-full w-[24px] h-[24px] mr-2;
	}
	.changer-title {
		@apply font-semibold text-sm md:text-lg whitespace-nowrap capitalize text-gray-800 dark:text-gray-300;
	}
	.changer-rate-base {
		@apply text-gray-500 dark:text-gray-400;
	}
	.changer-rate {
		@apply block font-semibold text-sm md:text-lg whitespace-nowrap text-gray-800 dark:text-light;
	}
	.converter-tab-button {
		@apply block w-full bg-transparent p-2 md:py-2 md:px-4 rounded-[20px] text-gray-500 dark:text-gray-400 mr-2;
	}
	.converter-tab-button:last-child {
		@apply mr-0;
	}
	.converter-tab-button:hover {
		@apply bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-200;
	}

	.converter-tab-button.active {
		@apply bg-gray-600 dark:bg-gray-200 text-white dark:text-dark;
	}
</style>
