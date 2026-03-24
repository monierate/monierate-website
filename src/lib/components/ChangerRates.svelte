<script lang="ts">
	interface Changer {
		code: string;
		name: string;
		link: string;
		pairs: Record<string, unknown>;
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

	export let changers: Record<string, Changer> = {};

	export let rates: Record<string, PairChanger[]> = {
		remittance: [],
		ramp: [],
		card: []
	};
	export let from: any;
	export let to: any;
	export let amount: any;
	export let userCountry: string;

	let isLoading = true;
	let hasResults = false;
	let resultsLoaded = false;

	let sendingResult: ChangerRate[] = [];
	let buyingResult: ChangerRate[] = [];
	let sellingResult: ChangerRate[] = [];
	let fundingResult: ChangerRate[] = [];

	async function getPairChangers(
		pair_code: string,
		changer_service: string
	): Promise<PairChanger[]> {
		try {
			const response = await fetch(
				`/api/pairs/changers?pair_code=${pair_code}&changer_service=${changer_service}`
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error('Error fetching pair changers:', error);
			return [];
		}
	}

	function findSupportedPlatforms(
		changers: Record<string, Changer>,
		rates: PairChanger[],
		sortDesc = false,
		useBuying = false
	): ChangerRate[] {
		const platformRates: ChangerRate[] = rates
			.filter(
				(rate) =>
					rate.changer_code !== 'market' &&
					rate.changer_code !== 'binance' &&
					(rate.price_buy > 0 || rate.price_sell > 0)
			)
			.map((rate) => ({
				rate,
				changer: changers[rate.changer_code]
			}))
			.filter((item) =>
				item.changer && useBuying === true ? item.rate.price_buy > 0 : item.rate.price_sell > 0
			);

		if (useBuying === true) {
			return sortDesc
				? platformRates.sort((a, b) => b.rate.price_buy - a.rate.price_buy)
				: platformRates.sort((a, b) => a.rate.price_buy - b.rate.price_buy);
		} else {
			return sortDesc
				? platformRates.sort((a, b) => b.rate.price_sell - a.rate.price_sell)
				: platformRates.sort((a, b) => a.rate.price_sell - b.rate.price_sell);
		}
	}

	$: {
		if (rates.remittance && rates.ramp && rates.card && Object.keys(changers).length > 0) {
			isLoading = true;
			hasResults = false;

			try {
				if(rates.remittance.length > 0) {
					sendingResult = findSupportedPlatforms(changers, rates.remittance, false, false).slice(
						0,
						5
					);
				}
				if(rates.ramp.length > 0) {
					buyingResult = findSupportedPlatforms(changers, rates.ramp, false, true).slice(0, 5);
					sellingResult = findSupportedPlatforms(changers, rates.ramp, true, false).slice(0, 5);
				}
				if(rates.card.length > 0) {
					fundingResult = findSupportedPlatforms(changers, rates.card, false, true).slice(0, 5);
				}

				hasResults = sendingResult.length > 0;
				resultsLoaded = true;
			} catch (error) {
				console.error('Results processing error:', error);
			} finally {
				setTimeout(() => {
					isLoading = false;
				}, 300);
			}
		}
	}

	async function updatePairChangers() {
		rates.remittance = await getPairChangers(`${from.code}${to.code}`, 'remittance');

		// Fetch buying and selling (ramp) rates
		rates.ramp = await getPairChangers(`${from.code}${to.code}`, 'ramp');

		// Fetch funding (card) rates
		rates.card = await getPairChangers(`${from.code}${to.code}`, 'card');
	}

	let oldFromCode = from.code;
	let oldToCode = to.code;
	$: {
		if (oldFromCode !== from.code || oldToCode !== to.code) {
			if (typeof window !== 'undefined') {
				oldFromCode = from.code;
				oldToCode = to.code;
				updatePairChangers();
			}
		}
	}
</script>

<div class="max-w-[100%] md:max-w-7xl mx-auto md:p-6">
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Sending Rates Section -->
		{#if sendingResult.length > 0}
			<div
				class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
			>
				<h2
					class="text-xl font-semibold p-4 border-b bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
				>
					Send {from.code.toUpperCase()}
				</h2>
				<div class="p-4 overflow-x-auto">
					{#if isLoading}
						<div class="text-center text-gray-500">Loading...</div>
					{:else}
						<table class="table-auto w-full text-sm text-left">
							<tbody class="changers">
								{#each sendingResult as { rate, changer }}
									<tr class="py-32 mb-4 border-b border-gray-150 dark:border-gray-800">
										<td>
											<a
												href="/converter/{rate.changer_code}?Amount={amount}&From={from.code.toUpperCase()}&To={to.code.toUpperCase()}"
												class="flex items-center"
												title="{changer.name} dollar to naira rate."
											>
												<span class="changer-icon">
													<picture>
														<source
															srcset="/icons/svg/{rate.changer_code}.svg"
															type="image/svg+xml"
														/>
														<source srcset="/icons/png/{rate.changer_code}.png" type="image/png" />
														<img
															width="22px"
															height="22px"
															src="/icons/svg/{rate.changer_code}.svg"
															class="rounded-full"
															alt="{changer.name} icon"
														/>
													</picture>
												</span>
												<span class="changer-title ml-2">{changer.name}</span>
											</a>
										</td>
										<td class="text-right pl-6 pr-6">
											<span class="changer-rate">
												{#if Math.round(rate.price_sell) === 0}
													-
												{:else}
													{Math.round(rate.price_sell)} {to.code.toUpperCase()}
												{/if}
											</span>
											<small class="changer-rate-base ml-1">per 1 {from.code.toUpperCase()}</small>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
					<div class="dark:border-gray-700 border-t text-center">
						<a
							href="/send/{from.code}-to-{userCountry ? userCountry.toLowerCase() : 'ng'}-best-rate"
							class="w-full mt-4 inline-block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
						>
							See More
						</a>
					</div>
				</div>
			</div>
		{/if}

		<!-- Buying Rates Section -->
		{#if buyingResult.length > 0}
			<div
				class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
			>
				<h2
					class="text-xl font-semibold p-4 border-b bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
				>
					Buy {from.code.toUpperCase()}
				</h2>
				<div class="p-4 overflow-x-auto">
					{#if isLoading}
						<div class="text-center text-gray-500">Loading...</div>
					{:else}
						<table class="table-auto w-full text-sm text-left">
							<tbody class="changers">
								{#each buyingResult as { rate, changer }}
									<tr class="py-32 mb-4 border-b border-gray-150 dark:border-gray-800">
										<td>
											<a
												href="/converter/{rate.changer_code}?Amount={amount}&From={from.code.toUpperCase()}&To={to.code.toUpperCase()}"
												class="flex items-center"
												title="{changer.name} dollar to naira rate."
											>
												<span class="changer-icon">
													<picture>
														<source
															srcset="/icons/svg/{rate.changer_code}.svg"
															type="image/svg+xml"
														/>
														<source srcset="/icons/png/{rate.changer_code}.png" type="image/png" />
														<img
															width="22px"
															height="22px"
															src="/icons/svg/{rate.changer_code}.svg"
															class="rounded-full"
															alt="{changer.name} icon"
														/>
													</picture>
												</span>
												<span class="changer-title ml-2">{changer.name}</span>
											</a>
										</td>
										<td class="text-right pl-6 pr-6">
											<span class="changer-rate">
												{#if Math.round(rate.price_buy) === 0}
													-
												{:else}
													{Math.round(rate.price_buy)} {to.code.toUpperCase()}
												{/if}
											</span>
											<small class="changer-rate-base ml-1">per 1 {from.code.toUpperCase()}</small>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
					<div class="dark:border-gray-700 border-t text-center">
						<a
							href="/buy/{from.code}-with-{to.code}-best-buying-rate"
							class="w-full mt-4 inline-block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
						>
							See More
						</a>
					</div>
				</div>
			</div>
		{/if}

		<!-- Selling Rates Section -->
		{#if sellingResult.length > 0}
			<div
				class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
			>
				<h2
					class="text-xl font-semibold p-4 border-b bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
				>
					Sell {from.code.toUpperCase()}
				</h2>
				<div class="p-4 overflow-x-auto">
					{#if isLoading}
						<div class="text-center text-gray-500">Loading...</div>
					{:else}
						<table class="table-auto w-full text-sm text-left">
							<tbody class="changers">
								{#each sellingResult as { rate, changer }}
									<tr class="py-32 mb-4 border-b border-gray-150 dark:border-gray-800">
										<td>
											<a
												href="/converter/{rate.changer_code}?Amount={amount}&From={from.code.toUpperCase()}&To={to.code.toUpperCase()}"
												class="flex items-center"
												title="{changer.name} dollar to naira rate."
											>
												<span class="changer-icon">
													<picture>
														<source
															srcset="/icons/svg/{rate.changer_code}.svg"
															type="image/svg+xml"
														/>
														<source srcset="/icons/png/{rate.changer_code}.png" type="image/png" />
														<img
															width="22px"
															height="22px"
															src="/icons/svg/{rate.changer_code}.svg"
															class="rounded-full"
															alt="{changer.name} icon"
														/>
													</picture>
												</span>
												<span class="changer-title ml-2">{changer.name}</span>
											</a>
										</td>
										<td class="text-right pl-6 pr-6">
											<span class="changer-rate">
												{#if Math.round(rate.price_sell) === 0}
													-
												{:else}
													{Math.round(rate.price_sell)} {to.code.toUpperCase()}
												{/if}
											</span>
											<small class="changer-rate-base ml-1">per 1 {from.code.toUpperCase()}</small>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
					<div class="dark:border-gray-700 border-t text-center">
						<a
							href="/sell/{from.code}-get-{to.code}-best-selling-rate"
							class="w-full mt-4 inline-block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
						>
							See More
						</a>
					</div>
				</div>
			</div>
		{/if}

		<!-- Funding Rates Section -->
		{#if fundingResult.length > 0}
			<div
				class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
			>
				<h2
					class="text-xl font-semibold p-4 border-b bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
				>
					Fund {from.code.toUpperCase()} card
				</h2>
				<div class="p-4 overflow-x-auto">
					{#if isLoading}
						<div class="text-center text-gray-500">Loading...</div>
					{:else}
						<table class="table-auto w-full text-sm text-left">
							<tbody class="changers">
								{#each fundingResult as { rate, changer }}
									<tr class="py-32 mb-4 border-b border-gray-150 dark:border-gray-800">
										<td>
											<a
												href="/converter/{rate.changer_code}?Amount={amount}&From={from.code.toUpperCase()}&To={to.code.toUpperCase()}"
												class="flex items-center"
												title="{changer.name} dollar to naira rate."
											>
												<span class="changer-icon">
													<picture>
														<source
															srcset="/icons/svg/{rate.changer_code}.svg"
															type="image/svg+xml"
														/>
														<source srcset="/icons/png/{rate.changer_code}.png" type="image/png" />
														<img
															width="22px"
															height="22px"
															src="/icons/svg/{rate.changer_code}.svg"
															class="rounded-full"
															alt="{changer.name} icon"
														/>
													</picture>
												</span>
												<span class="changer-title ml-2">{changer.name}</span>
											</a>
										</td>
										<td class="text-right pl-6 pr-6">
											<span class="changer-rate">
												{#if Math.round(rate.price_buy) === 0}
													-
												{:else}
													{Math.round(rate.price_buy)} {to.code.toUpperCase()}
												{/if}
											</span>
											<small class="changer-rate-base ml-1">per 1 {from.code.toUpperCase()}</small>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
					<div class="dark:border-gray-700 border-t text-center">
						<a
							href="/card/{from.code}-{to.code}-best-funding-rate"
							class="w-full mt-4 inline-block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
						>
							See More
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	table tbody tr td {
		@apply py-2 whitespace-nowrap;
	}
	table tr td:first-child {
		@apply pl-0;
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
</style>
