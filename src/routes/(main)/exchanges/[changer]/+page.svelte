<script lang="ts">
	import Rates from '$lib/components/exchanges/Rates.svelte';
	import AdBanner from '$lib/components/AdBanner.svelte';
	import ViewMoreText from '$lib/components/ViewMoreText.svelte';
	import FeaturedNews from '$lib/components/exchanges/FeaturedNews.svelte';
	import AboutCard from '$lib/components/exchanges/AboutCard.svelte';
	import RelatedExchanges from '$lib/components/exchanges/RelatedExchanges.svelte';

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
		}
	];
</script>

<svelte:head>
	<title>{changerName} Exchange Rate</title>
</svelte:head>

<!-- <AdBanner name="footer" /> -->

<div class="flex flex-col md:flex-row md:justify-between md:container">
	<div class="md:w-1/3">
		<div
			class="container space-y-6 md:px-6 md:py-8 md:mx-0 md:mr-10 md:sticky md:top-[80px] md:border md:border-gray-200/80 md:dark:border-gray-700/60 md:rounded-xl"
		>
			<div class="flex flex-col md:flex-row justify-between items-center gap-4">
				<div class="w-full md:w-auto">
					<h2 class="text-xl md:text-2xl font-bold flex items-center gap-1">
						<img
							src="/icons/{changer}.png"
							alt="{changerName} Logo"
							class="w-10 h-10 rounded-full object-contain"
						/>
						<span>{changerName}</span>
					</h2>
				</div>
				<div class="w-full md:w-auto">
					<a
						href="/404"
						class="w-full block md:inline-block md:w-auto text-center border border-geay-200/80 dark:border-gray-700/60 rounded-full px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-100 transition-colors hover:bg-gray-100/10 dark:hover:bg-gray-700/60"
						>Visit website</a
					>
				</div>
			</div>

			<div class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
				<ViewMoreText
					text="GT Bank is a leading financial institution in Nigeria, known for its innovative banking
								solutions and commitment to customer satisfaction. Established in 1990, GT Bank has
								grown to become one of the largest banks in Africa, offering a wide range of services
								including personal banking, corporate banking, and investment services."
				/>
			</div>

			<div class="w-full flex flex-col gap-3">
				<a
					href="/link"
					aria-label="link"
					class="inline-flex gap-2 items-center text-primary hover:text-primary/90"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="size-5"
					>
						<path
							d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z"
						/>
						<path
							d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z"
						/>
					</svg>

					<span>https://gtbank.com</span>
				</a>
				<a
					href="/link"
					aria-label="link"
					class="inline-flex gap-2 items-center text-primary hover:text-primary/90"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="1em"
						height="1em"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.804-7.584-6.63 7.584H.477l8.602-9.84L0 1.153h7.594l5.243 6.932zM17.61 20.644h2.04L6.486 3.24H4.298z"
						/>
					</svg>

					<span>@gtbankhnadle</span>
				</a>
				<a
					href="/link"
					aria-label="link"
					class="inline-flex gap-2 items-center text-primary hover:text-primary/90"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="1em"
						height="1em"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 23.5h4V7.5h-4v16zM8.5 7.5h3.8v2.2h.1c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1v9.9h-4v-8.8c0-2.1-.04-4.8-2.93-4.8-2.94 0-3.39 2.29-3.39 4.65v8.95h-4v-16z"
						/>
					</svg>

					<span>@gtbank</span>
				</a>
			</div>
		</div>
	</div>
	<div class="md:w-2/3 space-y-16">
		<div class="space-y-6 container px-0 mx-0 w-full md:px-6 md:mx-auto">
			<div class="px-4 md:px-0">
				<div class="space-y-5">
					<div class="">
						<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
							GT Bank Exchange Rates
						</h2>
					</div>
				</div>
			</div>
			<Rates data={{ rates: testData, currency: 'NGN', currencySymbols: data.currencySymbols }} />
		</div>

		<div class="container md:px-0 md:w-full md:mx-0 space-y-16">
			<div class="w-full md:px-6 text-gray-500">
				<AboutCard
					changerName="GT Bank"
					description="Moniepoint is a comprehensive business banking and financial services platform
built to power the growth of entrepreneurs, SMEs, and large businesses across
Africa, with a strong presence in Nigeria and Kenya. The platform provides
reliable, secure, and scalable financial tools that help businesses manage
payments, access credit, and streamline their day-to-day operations.

Through its wide range of offerings, Moniepoint enables businesses to open and
manage bank accounts, process digital and card payments, and access flexible
working capital loans tailored to their unique cash-flow needs. Its point-of-sale
(POS) terminals are widely adopted for their speed, reliability, and nationwide
coverage, making payment collection seamless for merchants across urban and
rural locations.

Beyond payments and lending, Moniepoint empowers business owners with
value-added services such as transaction analytics, invoicing tools, inventory
support, and real-time reporting. These insights help merchants make informed
decisions, optimize operations, and plan for sustainable growth. By combining
technology, financial expertise, and deep local market understanding, Moniepoint
continues to redefine how businesses access and experience financial services
across the continent."
					industry="Finance"
					companyType="Commercial Bank"
					foundedYear="1990"
					companySize="1,000+ employees"
				/>
			</div>

			<div class="md:px-6 space-y-5">
				<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Featured News</h3>
				<FeaturedNews
					posts={[
						{
							id: '1',
							title: 'How We Scaled Our API to 10M Requests',
							excerpt: 'Lessons learned from optimizing performance and reliability.',
							published_at: '2026-01-12',
							url: '/blog/scaling-our-api'
						},
						{
							id: '2',
							title: 'Announcing StableRate v2',
							excerpt: 'Faster rates, better UX, and more integrations.',
							published_at: '2026-01-05',
							url: '/blog/stablerate-v2'
						}
					]}
				/>
			</div>

			<div class="md:px-6 space-y-5">
				<RelatedExchanges />
			</div>

			<div class="md:px-6 space-y-3">
				<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Disclaimer</h3>

				<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
					All information provided on this page is for general informational purposes only. While we
					strive to keep the information accurate and up to date, we make no representations or
					warranties of any kind, express or implied, about the completeness, accuracy, reliability,
					suitability, or availability of the information displayed.
				</p>

				<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
					Any reliance you place on such information is strictly at your own risk. We shall not be
					held responsible or liable for any loss, damage, or inconvenience arising from the use of,
					or reliance on, the information presented, including but not limited to exchange rates,
					financial data, or third-party content.
				</p>
			</div>
		</div>
	</div>
</div>
