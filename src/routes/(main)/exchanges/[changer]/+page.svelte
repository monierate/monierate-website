<script lang="ts">
	import Money from '$lib/money';
	import Chart from './Chart.svelte';
	import AdBanner from '$lib/components/AdBanner.svelte';

	export let data;
	const currencies = data.currencies;
	const changer = data.changer;
	const changerName = 'GT Bank';

	const currencyOptions = [
		{ code: 'ngn', name: 'Nigerian Naira' },
		{ code: 'usd', name: 'US Dollar' },
		{ code: 'eur', name: 'Euro' },
		{ code: 'gbp', name: 'British Pound' },
		{ code: 'cad', name: 'Canadian Dollar' }
	];

	let amount: number = 1;
	let fromCurrency: string = 'usd';
	let toCurrency: string = 'ngn';

	let getFromCurrencyName = () => {
		return currencies[fromCurrency.toUpperCase()] || currencies['USD'] || '';
	};
	let getToCurrencyName = () => {
		return currencies[toCurrency.toUpperCase()] || currencies['USD'] || '';
	};

	let rate: number = 1510;

	let price = 2850;
	let dollar = 1;
	let rateChange = -0.24;

	let historicalRates = [
		{ label: '24hours', value: 2800.28, change: 0.24 },
		{ label: '7days', value: 2800.28, change: 0.24 },
		{ label: 'All Time', value: 2800.28, change: 0.24 }
	];
	let activeTab = '24hrs';
</script>

<svelte:head>
	<title>{changerName} Exchange Rate</title>
</svelte:head>

<div class="container">
	<div>
		<h1 class="text-2xl md:text-4xl mb-4 mt-0 pt-0 flex items-center gap-2">
			<span>1 {fromCurrency.toUpperCase()} to {toCurrency.toUpperCase()} on</span>
			<span class="inline-flex items-center gap-1">
				<img
					src="/icons/{changer}.png"
					alt="{changerName} Logo"
					class="w-8 h-8 rounded-full object-contain"
				/>
				<span class="text-gray-500/60 dark:text-gray-200/60 text-2xl">{changerName}</span>
			</span>
		</h1>
	</div>

	<div
		class="bg-gray-400/10 dark:bg-gray-900/80 p-4 rounded-lg flex flex-col md:flex-row gap-4 md:items-center justify-between mb-6"
	>
		<div class="w-full md:w-1/3">
			<label class="text-sm text-gray-700" for="amount">Amount</label>
			<div>
				<input
					type="number"
					id="amount"
					class="input border-gray-500/20 dark:border-gray-600/20 focus:border-gray-500/30 hover:border-gray-500/30 focus:ring-0"
					autocomplete="off"
					placeholder="Enter amount in USD"
					bind:value={amount}
				/>
			</div>
		</div>
		<div class="w-full md:w-1/3">
			<label class="text-sm text-gray-700" for="from-currency">From</label>
			<div
				class="input py-0 px-4 border-gray-500/20 dark:border-gray-600/20 focus:border-gray-500/30 hover:border-gray-500/30 focus:ring-0 w-full flex items-center"
			>
				<img
					src="https://wise.com/public-resources/assets/flags/rectangle/{fromCurrency.toLowerCase()}.png"
					alt="{fromCurrency.toUpperCase()} Logo"
					class="w-6 h-3 rounded-md object-contain"
				/>
				<select
					id="from-currency"
					class="w-full bg-transparent focus:outline-none py-[1.1rem]"
					bind:value={fromCurrency}
				>
					{#each currencyOptions as currency}
						<option value={currency.code}>
							{currency.code.toUpperCase()} - {currency.name}
						</option>
					{/each}
				</select>
			</div>
		</div>
		<div class="w-full md:w-1/3">
			<label class="text-sm text-gray-700" for="to-currency">To</label>
			<div
				class="input py-0 px-4 border-gray-500/20 dark:border-gray-600/20 focus:border-gray-500/30 hover:border-gray-500/30 focus:ring-0 w-full flex items-center"
			>
				<img
					src="https://wise.com/public-resources/assets/flags/rectangle/{toCurrency.toLowerCase()}.png"
					alt="{toCurrency.toUpperCase()} Logo"
					class="w-6 h-3 rounded-md object-contain"
				/>
				<select
					id="to-currency"
					class="w-full bg-transparent focus:outline-none py-[1.1rem]"
					bind:value={toCurrency}
				>
					{#each currencyOptions as currency}
						<option value={currency.code}>
							{currency.code.toUpperCase()} - {currency.name}
						</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<div class="bg-gray-400/10 dark:bg-gray-900/80 rounded-lg mb-6 overflow-hidden">
		<div class="p-4">
			<div class="flex flex-col md:flex-row gap-4 md:items-center justify-between w-full">
				<div>
					<div class="font-medium text-gray-700 dark:text-gray-300 mb-2">
						{Money.format(amount)}
						{getFromCurrencyName()} =
					</div>
					<div class="text-xl font-bold mb-2">
						{Money.format(amount * rate)}
						{getToCurrencyName()}
					</div>
					<div class="text-sm text-gray-500/60 dark:text-gray-200/70 flex flex-col">
						<span
							>1 {fromCurrency.toUpperCase()} = {Money.format(rate)}
							{toCurrency.toUpperCase()}</span
						>
						<span
							>1 {toCurrency.toUpperCase()} = {Money.format(1 / rate)}
							{fromCurrency.toUpperCase()}</span
						>
					</div>
				</div>
				<div>
					<div class="text-sm text-primary bg-primary/10 p-3 rounded-md flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
							/>
						</svg>
						We use the exchange rate from {changerName} for this conversion.
						<br /> This is for informational purposes only.
					</div>
					<div class="mt-6 flex items-center gap-4">
						<a href="/exchanges/gtbank" class="button">
							Open {changerName}
						</a>
						<a
							href="/exchanges/gtbank"
							class="button bg-green-600 hover:bg-green-700 flex items-center gap-2"
						>
							Get the best rate on Cedar Money <svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-4"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
								/>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</div>
		<div class="text-sm text-gray-800 dark:text-gray-200 mt-8 text-left md:text-center bg-gray-200/80 dark:bg-gray-200/10 p-2 rounded-md">
			{getFromCurrencyName()} to {getToCurrencyName()} conversion on {changerName}
			- Last updated {new Date()}
		</div>
	</div>

	<div class="flex flex-col-reverse md:flex-row md:items-end gap-6 mt-16">
		<!-- LEFT SIDEBAR -->
		<div class="w-full md:w-1/3 flex flex-col gap-6">
			<div class="hidden md:block">
				<h2 class="text-lg font-bold flex items-center gap-1">
					<img
						src="/icons/{changer}.png"
						alt="{changerName} Logo"
						class="w-6 h-6 rounded-full object-contain"
					/>
					<span class="text-gray-500/60 dark:text-gray-200/60">{changerName}</span>
				</h2>
				<div class="flex flex-row items-center justify-between mt-2">
					<span class="flex items-center gap-3">
						<span class="text-2xl font-bold dark:text-gray-100">₦{price.toLocaleString()}</span>
						<span
							class="{rateChange.toString().includes('-')
								? 'text-red-500'
								: 'text-green-500'} text-xs">{rateChange}%</span
						>
					</span>
					<span class="text-sm text-gray-500 dark:text-gray-300">
						${dollar} Dollar
					</span>
				</div>
			</div>

			<div class="flex items-center justify-between gap-2 text-sm font-bold text-gray-700 dark:text-gray-100">
				<span>INFO</span>
				<span class="border-b border-gray-200/80 dark:border-gray-700/60 -mt-1 block w-3/4" />
			</div>

			<div class="space-y-4 text-sm">
				<div class="flex items-center justify-between">
					<span class="text-gray-400 dark:text-gray-300">Website</span> <a href="#" class="link">Gtbank.com</a>
				</div>
				<div class="flex items-center justify-between">
					<div>
						<span class="text-gray-400 dark:text-gray-300">Social Media</span>
					</div>
					<div class="flex items-center gap-2">
						<a href="#" class="link !p-1 rounded-xl">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="currentColor"
								role="img"
								aria-label="Facebook"
							>
								<path
									d="M13.5 8h1.5V5.5h-1.8c-2.2 0-3.2 1.3-3.2 3.3V11H8v2.5h2v5h2.5v-5h2.1l.4-2.5h-2.5V8.8c0-.5.2-.8.8-.8z"
								/>
							</svg>
						</a>
						<a href="#" class="link !p-1 rounded-xl">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="currentColor"
								role="img"
								aria-label="X (Twitter)"
							>
								<path
									d="M16.98 4h2.27l-5 5.73L20 20h-4.44l-3.48-5.46L8.1 20H5.83l5.35-6.1L4 4h4.53l3.15 4.94L16.98 4zM15.96 18h1.18L8.12 6h-1.2l9.04 12z"
								/>
							</svg>
						</a>
						<a href="#" class="link !p-1 rounded-xl"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="currentColor"
								role="img"
								aria-label="Instagram"
							>
								<path
									d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zm0 2A3.5 3.5 0 1 1 12 17a3.5 3.5 0 0 1 0-7zm4.75-3a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z"
								/>
							</svg>
						</a>
						<a href="#" class="link !p-1 rounded-xl"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="currentColor"
								role="img"
								aria-label="LinkedIn"
							>
								<path
									d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 9h4v12H3V9zm7 0h3.6v1.6h.05c.5-.9 1.7-1.85 3.5-1.85 3.7 0 4.4 2.35 4.4 5.4V21h-4v-6.2c0-1.5-.03-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.3V21h-4V9z"
								/>
							</svg>
						</a>
					</div>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-gray-400 dark:text-gray-300">Email</span>
					<a href="mailto:gtbank@support.com" class="link">gtbank@support.com</a>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-gray-400 dark:text-gray-300">Services</span>
					<span class="inline-flex gap-1"
						><span class="link">Investment</span><span class="link"> Banking</span></span
					>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-gray-400 dark:text-gray-300">Fees</span> <span class="link">$1</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-gray-400 dark:text-gray-300">Monierate ID</span> <span class="link">#886573</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-gray-400 dark:text-gray-300">Tags</span>
					<span class="inline-flex gap-1">
						<span class="link">Virtual Cards</span>
						<span class="link">Cross Border Remittance</span>
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-gray-400 dark:text-gray-300">Currency Offerings</span>
					<span class="inline-flex gap-1">
						<span class="link">$</span>
						<span class="link">€</span>
						<span class="link">£</span>
					</span>
				</div>
			</div>

			<div>
				<h3 class="text-sm font-bold text-gray-700 dark:text-gray-100 mb-4">GT Bank Historical Rate</h3>
				<ul class="mt-2 space-y-4 text-sm">
					{#each historicalRates as r}
						<li class="flex items-center justify-between">
							<span class="text-gray-400 dark:text-gray-300">{r.label}</span>
							<span class="flex items-center gap-2">
								₦{r.value.toLocaleString()}
								<span
									class="{r.change.toString().includes('-')
										? 'text-red-500 bg-red-100/50 dark:bg-red-900/30'
										: 'text-green-500 bg-green-100/50 dark:bg-green-900/30'} text-xs rounded-md px-1 py-0.5"
									>+{r.change}%</span
								>
							</span>
						</li>
					{/each}
				</ul>
			</div>

			<div class="flex flex-col md:flex-row md:items-center gap-3">
				<button
					class="button border border-gray-500 bg-transparent hover:bg-gray-100 text-black dark:text-white md:w-1/2"
					>Get Price Alert</button
				>
				<button class="button md:w-1/2 flex items-center justify-center gap-2"
					>Buy USDT <svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
						/>
					</svg></button
				>
			</div>
		</div>

		<div class="w-full md:w-2/3">
			<!-- RIGHT CONTENT (Chart + Tabs) -->
			<div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
				<div>
					<div class="flex items-center gap-2 mb-4">
						<button class="tab-link active">Overview</button>
						<button class="tab-link"
							>About</button
						>
					</div>
					<div class="md:hidden my-4">
					<h2 class="text-lg font-bold flex items-center gap-1">
						<img
							src="/icons/{changer}.png"
							alt="{changerName} Logo"
							class="w-6 h-6 rounded-full object-contain"
						/>
						<span class="text-gray-500/60">{changerName}</span>
					</h2>
					<div class="flex flex-row items-center justify-between mt-2">
						<span class="flex items-center gap-3">
							<span class="text-2xl font-bold">₦{price.toLocaleString()}</span>
							<span
								class="{rateChange.toString().includes('-')
									? 'text-red-500'
									: 'text-green-500'} text-xs">{rateChange}%</span
							>
						</span>
						<span class="text-sm text-gray-500">
							${dollar} Dollar
						</span>
					</div>
				</div>
				</div>
				<div class="flex gap-4 mb-4 text-sm bg-gray-200/50 dark:bg-gray-900/50 p-1 rounded-md">
					{#each ['24hrs', '7days', '2weeks', 'All Time'] as tab}
						<button
							class="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800/20 {activeTab == tab
								? 'text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-700/60'
								: 'text-gray-400'} text-sm"
							on:click={() => (activeTab = tab)}
						>
							{tab}
						</button>
					{/each}
				</div>
				
			</div>
			<div class="w-full flex items-center justify-center text-gray-500">
				<Chart />
			</div>
		</div>
	</div>

	<div class="mt-16 flex flex-col md:flex-row gap-6">
		<div class="hidden md:block w-1/3">
			<AdBanner name="footer" cover={true} />
		</div>
		<div class="w-full md:w-2/3 space-y-6">
			<h3 class="text-sm font-bold text-gray-700 dark:text-gray-100">What is {changerName}?</h3>
			<p class="text-gray-500 dark:text-gray-300">
				GT Bank is a leading financial institution in Nigeria, known for its innovative banking
				solutions and commitment to customer satisfaction. Established in 1990, GT Bank has grown to
				become one of the largest banks in Africa, offering a wide range of services including
				personal banking, corporate banking, and investment services. With a strong focus on
				technology and digital transformation, GT Bank provides its customers with convenient and
				secure banking options through its extensive network of branches and ATMs, as well as its
				robust online and mobile banking platforms. The bank is also recognized for its corporate
				social responsibility initiatives, contributing to the development of communities across
				Nigeria.
			</p>

			<h3 class="text-sm font-bold text-gray-700 dark:text-gray-100">Where is {changerName}?</h3>
			<p class="text-gray-500 dark:text-gray-300">
				GT Bank, or Guaranty Trust Bank, is headquartered in Lagos, Nigeria. The bank has a strong
				presence throughout Nigeria with numerous branches and ATMs across the country. In addition
				to its operations in Nigeria, GT Bank has expanded its footprint internationally, with
				branches and subsidiaries in several other countries including the United Kingdom, Ghana,
				Kenya, Rwanda, Sierra Leone, and The Gambia. This international presence allows GT Bank to
				serve a diverse customer base and facilitate cross-border banking services for individuals
				and businesses alike.
			</p>
		</div>
	</div>
</div>

<style>
	.link {
		@apply text-primary dark:text-gray-300 bg-primary/10 dark:bg-gray-900/50 hover:bg-primary/20 dark:hover:bg-gray-900/50 py-1 px-3 rounded-md transition-colors duration-300;
	}
	.tab-link {
		@apply text-gray-500 dark:text-gray-300 bg-transparent hover:bg-primary/10 py-1 px-3 rounded-md transition-colors duration-300 text-sm;
	}
	.tab-link.active {
		@apply text-primary bg-primary/10;
	}
</style>
