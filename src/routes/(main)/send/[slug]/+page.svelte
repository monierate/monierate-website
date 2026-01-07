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

	let supportedCountries: string[] = ['NG'];
	let isLoading = true;
	let hasResults = false;
	let convertFromInput = 'USD';
	let convertToInput = 'NG';
	let changers: Record<string, Changer> = data.changers || {};
	let pairChangers: PairChanger[] = data.pair_changers || {};
	let currencies: Currency[] = data.currencies || [];
	let countriesToCurrencies: any = data.countriesToCurrencies;
	let convertAmount = 1;
	$: convert = data.convert || { From: 'USD', To: 'NGN', Amount: 1 };
	$: countryToName = data.countryToName || 'Nigeria';
	$: countries = data.countries;
	$: convertFrom = convert.From?.toUpperCase().trim();
	$: convertTo = convert.To?.toUpperCase().trim();
	$: currencyToCode = countriesToCurrencies[convertToInput.toUpperCase()];

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
			if (changers && pairChangers) {
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

		platform_rates.sort((a, b) => b.rate.price_sell - a.rate.price_sell);

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
			await getPairChangers(
				`${convertFromInput.toLowerCase()}${currencyToCode.toLowerCase()}`,
				'remittance'
			);
			changePath(
				`/send/${convertFromInput.toLowerCase()}-to-${convertToInput.toLowerCase()}-best-rate`
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
				const [currencyFromCode, _, countryToCode] = window.location.pathname
					.replace('/send/', '')
					.split('-');
				convertFromInput = currencyFromCode.toUpperCase();
				convertToInput = countryToCode.toUpperCase();

				if (sessionStorage && sessionStorage.getItem('convertAmount')) {
					convertAmount = Number(sessionStorage.getItem('convertAmount'));
					sessionStorage.removeItem('convertAmount');
				}
			}
		} catch (error) {
			console.log('There was an error set initial input values:', error);
		}

		// referesh the pair changers rate every 10 minutes
		setInterval(async () => {
			await getPairChangers(
				`${convertFrom.toLowerCase()}${currencyToCode.toLowerCase()}`,
				'remittance'
			);
		}, 60000 * 10);
	});

	let openQuestion: any = null;
	function toggleQuestion(index: any) {
		openQuestion = openQuestion === index ? null : index;
	}
</script>

<svelte:head>
	<title>
		Send {currencyFrom?.name} to {countryToName} - Compare the best {convertTo} rates
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
		content="Send {currencyFrom?.name} to {countryToName} - Compare the best {convertTo} rates"
	/>
	<meta
		property="og:description"
		content="Convert {currencyFrom.name} to {currencyTo.name} on Monierate. Enter any amount in {convertFrom} to see the conversion in {convertTo}."
	/>
</svelte:head>

<!-- partner -->
<div class="bg-white dark:bg-gray-800">
	<AdBanner name="compare" />
</div>

<div class="mb-24">
	<div class="container mb-4 text-center">
		<h1 class="text-2xl md:text-4xl">
			{convertFrom} to {convertTo} | Compare the best rate to send {currencyFrom?.name} to {countryToName}
		</h1>
	</div>

	<div id="changer-rate-wrapper" class="container">
		<div
			class="flex justify-center item-center shadow-sm bg-gray-50 dark:bg-gray-900 rounded-lg px-8 py-6"
		>
			<div class="w-full">
				<div class="block md:flex md:justify-between md:items-center">
					<span class="block md:w-[30%]">
						<label class="label" for="field-convert-from">You Send</label>
						<span class="select">
							<select
								id="field-convert-from"
								class="text-gray-700 dark:text-gray-500 text-lg font-medium bg-transparent border-none focus:border-none focus:outline-none w-full"
								bind:value={convertFromInput}
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
						<label class="label" for="field-convert-to">To</label>
						<span class="select">
							<select
								id="field-convert-to"
								class="text-gray-700 dark:text-gray-500 text-lg font-medium bg-transparent border-none focus:border-none focus:outline-none w-full"
								bind:value={convertToInput}
								on:change={handleCurrencyChange}
							>
								{#each Object.entries(countries) as [countryCode, country]}
									{#if supportedCountries.includes(countryCode.toUpperCase())}
										<option value={countryCode.toUpperCase()}>
											{country}
										</option>
									{/if}
								{/each}
							</select>
						</span>
					</span>
					<span class="block md:w-[30%]">
						<!-- Label -->
						<label for="amount" class="label"> Amount </label>

						<!-- Input Field -->
						<div class="flex items-center input">
							<!-- Numeric Input -->
							<input
								type="text"
								id="amount"
								value={convertAmount}
								on:input={handleAmountChange}
								class="flex-1 text-gray-700 dark:text-gray-500 text-lg bg-transparent border-none focus:border-none font-medium focus:outline-none"
								placeholder="Enter amount"
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
						No platform sending {convertFrom} to {convertTo}.
					</p>
				</div>
			</div>
		{:else}
			{#each convertResult as result, i}
				{#if result.rate.price_sell > 0}
					<div
						class="flex flex-wrap gap-4 px-8 py-4 w-full bg-white dark:bg-gray-900 shadow-md rounded-lg mb-8 relative overflow-hidden border {i === 0 ? 'border-gray-800 dark:border-light' : 'border-transparent'}"
					>
						<div class="flex-1 min-w-full md:min-w-[30%] md:flex md:items-center md:justify-start">
							<div class="flex justify-start items-center">
								<a href="/converter/{result.changer.code}?Amount={convertAmount}&From={currencyFrom.code.toUpperCase()}&To={currencyTo.code.toUpperCase()}">
									<img
										src="/icons/svg/{result.changer.code}.svg"
										alt="{result.changer.name} icon"
										class="h-12 mr-2 rounded-full"
									/>
								</a>
								<a
									href="/converter/{result.changer.code}?Amount={convertAmount}&From={currencyFrom.code.toUpperCase()}&To={currencyTo.code.toUpperCase()}"
									class="text-gray-600 dark:text-gray-300 hover:underline text-lg"
								>
									{result.changer.name}
								</a>
							</div>
						</div>

						<div class="flex-1 min-w-full md:min-w-[30%]">
							<div class="text-left">
								<span class="block text-sm">{convertAmount} {convertFromInput.toUpperCase()} =</span
								>
								<span class="block text-4xl text-gray-800 dark:text-gray-200 py-3">
									{Money.formatMoney(result.rate.price_sell * convertAmount, 2)}
									{currencyTo?.symbol || convertTo}
								</span>
								<span class="block text-sm">
									<span class="pr-3"> Indicative Rate </span>
									1 {convertFromInput.toUpperCase()} =
									{Money.formatMoney(result.rate.price_sell, 2)}
									{currencyTo?.symbol || convertTo}
								</span>
							</div>
						</div>

						<div
							class="flex-1 min-w-full md:min-w-[30%] md:text-right md:flex md:items-center md:justify-end"
						>
							<div>
								<a
									href="{result.changer.link}?utm_source=monierate&utm_medium=website&utm_campaign=monierate"
									class="block button w-full md:inline-block md:w-auto mr-4 mb-4 text-center"
								>
									Send money now
								</a>
								{#if i === 0}
								    <span class="absolute top-0 right-0 bg-gray-800 dark:bg-light text-white dark:text-dark text-xs px-2 py-1">
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

<div class="container dark:text-gray-300">
	<span class="block mb-4">
		<h2 class="text-2xl mb-4">
			All you need to know about {currencyFrom.name} to {currencyTo.name} money transfers
		</h2>
		<p>
			Easily compare money transfer providers in one place to send
			{currencyFrom.name} to {countryToName}. Send money overseas to your loved ones by comparing {currencyFrom.name}
			({currencyFrom.code.toUpperCase()}) to {currencyTo.name}
			({currencyTo.code.toUpperCase()}) remittance exchange rates. Transfer online or send cash based on
			services offered by these providers.
		</p>

		<p class="mt-4">
			Monierate compared {Object.entries(pairChangers).length} money transfer operators to get you the
			best FX rates to send {currencyFrom.name} to {countryToName}.
		</p>

		<p class="mt-4">
			The best rate to send {currencyFrom.name} for your loved ones in {countryToName}
			is currently offered by Western Union.
		</p>
	</span>
</div>

<div class="container mt-4">
	<h3 class="text-2xl font-bold mb-4">
		Step by step guide to send {currencyFrom.name} to {countryToName}
	</h3>
	<p class="mb-4">Follow the below easy steps to send {currencyFrom.name} to {countryToName}.</p>
	<ul class="pl-2">
		<li class="text-sm mb-4">
			If you are sending money for the first time with a provider, register an account with them.
			You will likely get a validation email, and optionally a validation text on your mobile as
			well. This ensures that it is indeed you who is creating your account.
		</li>
		<li class="text-sm mb-4">
			You will also need to provide your national ID with a photo, and proof of address. Providing
			this information ensures the security of your account and helps in fraud prevention.
		</li>
		<li class="text-sm mb-4">
			Add your payment method - this is how you pay for your transfer. Generally, you would want to
			use your international bank account to fund your transaction.
		</li>
		<li class="text-sm mb-4">
			Add your recipient - provide details about who will receive the funds (can also be your own
			account in {countryToName}).
		</li>
		<li class="text-sm mb-4">
			Specify delivery method - specify how the recipient will get the proceeds. Choosing a bank
			account is usually the best, if one is available.
		</li>
		<li class="text-sm mb-4">Add the transfer amount and start the transaction.</li>
	</ul>

	<p class="mb-4">
		The provider will then work on your {currencyFrom.code.toUpperCase()} to {currencyTo.code.toUpperCase()}
		remittance, and you should not have any additional action to take. Keep an eye on your email inbox
		as you should get notified about the progress of your transaction.
	</p>
	<p class="mb-4">
		Whilst it's fairly straightforward to make an actual foreign exchange transaction online, the
		harder part may be choosing the right company for your overseas bank transfer. This is where you
		can rely on Monierate to find the best rate to send {currencyFrom.name} to {countryToName}.
	</p>
</div>

<div class="container py-10 px-5">
	<h3 class="text-2xl font-bold mb-4">Frequently asked question?</h3>

	<div class="border-b border-gray-700">
		<button
			on:click={() => toggleQuestion(1)}
			class="w-full text-left py-4 flex justify-between items-center"
		>
			<span class="text-xl font-medium"
				>What's the best way to send {currencyFrom.name} to {countryToName}?</span
			>

			<svg
				class={`w-6 h-6 transition-transform duration-300 ease-in-out ${
					openQuestion === 1 ? 'rotate-180' : ''
				}`}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		<div
			class={`overflow-hidden transition-all duration-500 ease-in-out ${
				openQuestion === 1 ? 'max-h-screen py-4' : 'max-h-0'
			}`}
		>
			<p class="px-4 text-gray-600 dark:text-gray-400">
				There are many good choices when it comes to sending {currencyFrom.name} to {countryToName}.
				The Monierate remittance comparison engine compares many different remittance service
				providers to give you several options. You can easily compare these providers to get the
				best remit rates on your {currencyFrom.name} ({currencyFrom.code.toUpperCase()}) to
				{currencyTo.name} ({currencyTo.code.toUpperCase()}) money transfers.
			</p>
		</div>
	</div>

	<div class="border-b border-gray-700">
		<button
			on:click={() => toggleQuestion(2)}
			class="w-full text-left py-4 flex justify-between items-center"
		>
			<span class="text-xl font-medium"
				>How to get the best rate to transfer {currencyFrom.name} to {currencyTo.name}?</span
			>

			<svg
				class={`w-6 h-6 transition-transform duration-300 ease-in-out ${
					openQuestion === 2 ? 'rotate-180' : ''
				}`}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		<div
			class={`overflow-hidden transition-all duration-500 ease-in-out ${
				openQuestion === 2 ? 'max-h-screen py-4' : 'max-h-0'
			}`}
		>
			<p class="px-4 text-gray-600 dark:text-gray-400">
				When sending money overseas, there are a lot of options at your disposal these days. All of
				them come with various caveats that may include exchange rates, fees, transaction processing
				time, security and privacy, and so on. Monierate helps you to decide which foreign exchange
				operator to pick for your {currencyFrom.code.toUpperCase()} to {currencyTo.code.toUpperCase()}
				money transfer.
			</p>
		</div>
	</div>

	<div class="border-b border-gray-700">
		<button
			on:click={() => toggleQuestion(5)}
			class="w-full text-left py-4 flex justify-between items-center"
		>
			<span class="text-xl font-medium"
				>How to send {currencyFrom.code.toUpperCase()} to {countryToName} fast?</span
			>

			<svg
				class={`w-6 h-6 transition-transform duration-300 ease-in-out ${
					openQuestion === 5 ? 'rotate-180' : ''
				}`}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		<div
			class={`overflow-hidden transition-all duration-500 ease-in-out ${
				openQuestion === 5 ? 'max-h-screen py-4' : 'max-h-0'
			}`}
		>
			<p class="px-4 text-gray-600 dark:text-gray-400 mb-4">
				The speed of your {currencyFrom.name} to {currencyTo.name} funds transfer will depend on various
				factors like which provider you use, how you pay for your transaction, how you choose for your
				recipient to get the funds, etc. You will, therefore, want to compare various options to see
				which one suits your needs best.
			</p>
			<p class="px-4 text-gray-600 dark:text-gray-400 mb-4">
				One possible approach that will help you send money fast to {countryToName} is to rely on cash
				as payment as well as delivery method. This would mean paying for your transfer with cash, most
				likely by walking into your provider's office or agent location. Similarly, your recipient could
				also pick up cash in {countryToName} if they have a pickup location nearby. Dealing with cash
				on both sides will eliminate bank transfers in the middle which generally take longer as money
				has to move between banks.
			</p>
			<p class="px-4 text-gray-600 dark:text-gray-400">
				One drawback of cash transfers is the need to go to physical drop off and pickup locations,
				and the inherent risk involved in carrying cash, especially for larger amounts. Another one
				is that cash transfers generally involve lower exchange rates as compared to online
				transfers. If you do not want to handle cash for the aforementioned reasons, the next
				fastest transfers would be to payout {currencyTo.name} into a mobile wallet, or even do a mobile
				airtime popup. These methods would be faster than international bank to {countryToName} bank
				transfer.
			</p>
		</div>
	</div>

	<div class="border-b border-gray-700">
		<button
			on:click={() => toggleQuestion(6)}
			class="w-full text-left py-4 flex justify-between items-center"
		>
			<span class="text-xl font-medium"
				>Which are the best money transfer companies to transfer {currencyFrom.name} to {countryToName}?</span
			>

			<svg
				class={`w-6 h-6 transition-transform duration-300 ease-in-out ${
					openQuestion === 6 ? 'rotate-180' : ''
				}`}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		<div
			class={`overflow-hidden transition-all duration-500 ease-in-out ${
				openQuestion === 6 ? 'max-h-screen py-4' : 'max-h-0'
			}`}
		>
			<p class="px-4 text-gray-600 dark:text-gray-400 mb-4">
				Since the {currencyFrom.name} to {currencyTo.name} money transfer ecosystem has so many players
				in it, selecting the right company might not be that simple. You have so many to choose from
				- established organizations like Western Union and MoneyGram to multi currency bank accounts
				to up and coming Fintech companies. Then, there is always your local bank that may also be able
				to send money to {countryToName}. With all these possibilities staring at you, it can be
				difficult to pick the company to give your business to.
			</p>
			<p class="px-4 text-gray-600 dark:text-gray-400">
				The Monierate remittance engine will certainly help you to chart a path forward. Once you
				have selected your source and destination countries, we compare numerous companies to
				present you with an easy to digest comparison table. Here, you can easily see which
				companies meet your unique needs.
			</p>
		</div>
	</div>
</div>

<style>
	.label {
		@apply block text-sm font-semibold text-gray-800;
	}

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
