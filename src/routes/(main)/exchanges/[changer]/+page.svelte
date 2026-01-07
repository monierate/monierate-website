<script lang="ts">
	import Money from '$lib/money';
	import Filter from '$lib/components/exchanges/Filter.svelte';
	import Rates from '$lib/components/exchanges/Rates.svelte';
	import AdBanner from '$lib/components/AdBanner.svelte';

	export let data;
	const currencies = data.currencies;
	const changer = data.changer;
	const changerName = 'GT Bank';

	let price = 2850;
	let dollar = 1;
	let rateChange = -0.24;

	const testData = [
		{
			currency_code: 'usd',
			price_buy: 1685.5,
			price_sell: 1705.8,
			updated_at: '2026-01-07T10:28:00Z'
		},
		{
			currency_code: 'usdt',
			price_buy: 1683.2,
			price_sell: 1703.45,
			updated_at: '2026-01-07T10:25:00Z'
		},
		{
			currency_code: 'usdc',
			price_buy: 1684.3,
			price_sell: 1704.55,
			updated_at: '2026-01-07T10:27:00Z'
		},
	];
</script>

<svelte:head>
	<title>{changerName} Exchange Rate</title>
</svelte:head>

<AdBanner name="footer" />

<div class="container space-y-16">
	<div class="flex flex-col-reverse md:flex-row gap-6 mt-16">
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
			</div>

			<div
				class="flex items-center justify-between gap-2 text-sm font-bold text-gray-700 dark:text-gray-100"
			>
				<span>INFO</span>
				<span class="border-b border-gray-200/80 dark:border-gray-700/60 -mt-1 block w-3/4" />
			</div>

			<div class="space-y-4 text-sm">
				<div class="flex items-center justify-between">
					<span class="text-gray-400 dark:text-gray-300">Website</span>
					<a href="#" class="link">Gtbank.com</a>
				</div>
				<div class="flex items-center justify-between">
					<div>
						<span class="text-gray-400 dark:text-gray-300">X (Fka Twitter)</span>
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
								aria-label="X (Twitter)"
							>
								<path
									d="M16.98 4h2.27l-5 5.73L20 20h-4.44l-3.48-5.46L8.1 20H5.83l5.35-6.1L4 4h4.53l3.15 4.94L16.98 4zM15.96 18h1.18L8.12 6h-1.2l9.04 12z"
								/>
							</svg>
						</a>
					</div>
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
					<span class="text-gray-400 dark:text-gray-300">Monierate ID</span>
					<span class="link">#886573</span>
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

		<div class="w-full md:w-2/3 space-y-6">
			<!-- RIGHT CONTENT (Chart + Tabs) -->
			<div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
				<div>
					<div class="flex items-center gap-2 mb-4">
						<button class="tab-link active">Overview</button>
						<button class="tab-link">Currency Market</button>
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
			</div>
			<div class="w-full text-gray-500">
				<div class="space-y-6">
					<h3 class="text-sm font-bold text-gray-700 dark:text-gray-100">What is {changerName}?</h3>
					<p class="text-gray-500 dark:text-gray-300">
						GT Bank is a leading financial institution in Nigeria, known for its innovative banking
						solutions and commitment to customer satisfaction. Established in 1990, GT Bank has
						grown to become one of the largest banks in Africa, offering a wide range of services
						including personal banking, corporate banking, and investment services. With a strong
						focus on technology and digital transformation, GT Bank provides its customers with
						convenient and secure banking options through its extensive network of branches and
						ATMs, as well as its robust online and mobile banking platforms. The bank is also
						recognized for its corporate social responsibility initiatives, contributing to the
						development of communities across Nigeria.
					</p>

					<h3 class="text-sm font-bold text-gray-700 dark:text-gray-100">
						Where is {changerName}?
					</h3>
					<p class="text-gray-500 dark:text-gray-300">
						GT Bank, or Guaranty Trust Bank, is headquartered in Lagos, Nigeria. The bank has a
						strong presence throughout Nigeria with numerous branches and ATMs across the country.
						In addition to its operations in Nigeria, GT Bank has expanded its footprint
						internationally, with branches and subsidiaries in several other countries including the
						United Kingdom, Ghana, Kenya, Rwanda, Sierra Leone, and The Gambia. This international
						presence allows GT Bank to serve a diverse customer base and facilitate cross-border
						banking services for individuals and businesses alike.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

	<div class="space-y-6 container px-0 mx-0 w-full md:px-6 md:mx-auto">
		<div class="px-4 md:px-0">
			<div class="space-y-6">
				<div class="">
					<h2 class="text-2xl md:text-3xl mb-2 dark:text-gray-100">GT Currency Market</h2>
					<p class="text-gray-600 font-normal dark:text-gray-300">
						See all the currencies and various pairs they offer.
					</p>
				</div>
				<div class="space-y-6">
					<Filter />
		
				</div>
			</div>
		</div>
		<Rates data={{ rates: testData, currency: 'NGN', currencySymbols: data.currencySymbols }} />

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
