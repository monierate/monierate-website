<script lang="ts">
	import { formatNumber, friendlyDate, setUrlParam } from '$lib/functions';

	type PairMap = Record<string, Record<string, any>>;

	function extractPairs(pairs: PairMap) {
		return Object.entries(pairs).map(([pair, data]) => ({
			pair_code: pair,
			...data
		}));
	}

	export let data: {
		pairs: any;
		currencySymbols: Record<string, string>;
	};

	$: pairs = (extractPairs(data.pairs || {}) || []) as any[];
	$: currency = 'ngn';
	$: currencySymbols = data.currencySymbols || {};
</script>

<div class="container p-0 w-full m-0 md:max-w-[1200px] md:m-auto">
	<div
		class="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200/80 dark:border-gray-700/80"
	>
		<table class="text-sm text-gray-800 min-w-full table-auto">
			<thead
				class="bg-gray-50 dark:bg-gray-800/50 text-xs text-black dark:text-gray-400 tracking-wider"
			>
				<tr>
					<th class="px-6 py-4 text-left font-bold">Name</th>
					<th class="px-6 py-4 text-left font-bold">Buying</th>
					<th class="px-6 py-4 text-left font-bold">Selling</th>
					<th class="px-6 py-4 text-left font-bold">Last Updated</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100 dark:divide-gray-800">
				{#each pairs as pair}
					<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
						<!-- Currency Pair -->
						<td class="px-6 py-4">
							<div class="flex items-center gap-2">
								<img
									src={`https://stablerate.app/icons/currencies/${currency}.png`}
									class="w-5 h-5 rounded-full object-fit"
									alt={currency}
								/>
								<span class="font-medium text-gray-900 dark:text-gray-100">
									{pair.pair_code.toUpperCase()}
								</span>
							</div>
						</td>

						<!-- Buy Price -->
						<td class="px-6 py-4 text-left">
							{#if pair.price_buy > 0}
								<div class="space-y-0.5 inline-flex items-center">
									<div class="font-medium text-gray-900 dark:text-gray-100 text-base">
										₦{formatNumber(pair.price_buy)}
									</div>
									{#if pair.price_change_percent_1hr >= 0}
										<div
											class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20"
										>
											<svg
												class="w-3 h-3 text-green-600 dark:text-green-400"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fill-rule="evenodd"
													d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
													clip-rule="evenodd"
												/>
											</svg>
											<span class="text-xs font-medium text-green-600 dark:text-green-400"
												>{pair.price_change_percent_1hr}%</span
											>
										</div>
									{:else}
										<div
											class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20"
										>
											<svg
												class="w-3 h-3 text-red-600 dark:text-red-400"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fill-rule="evenodd"
													d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
													clip-rule="evenodd"
												/>
											</svg>
											<span class="text-xs font-medium text-red-600 dark:text-red-400"
												>{pair.price_change_percent_1hr}%</span
											>
										</div>
									{/if}
								</div>
							{:else}
								<span class="text-gray-400 dark:text-gray-600">-</span>
							{/if}
						</td>

						<!-- Sell Price -->
						<td class="px-6 py-4 text-left">
							{#if pair.price_sell > 0}
								<div class="space-y-0.5 inline-flex items-center">
									<div class="font-medium text-gray-900 dark:text-gray-100 text-base">
										₦{formatNumber(pair.price_sell)}
									</div>
									{#if pair.price_change_percent_1hr >= 0}
										<div
											class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20"
										>
											<svg
												class="w-3 h-3 text-green-600 dark:text-green-400"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fill-rule="evenodd"
													d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
													clip-rule="evenodd"
												/>
											</svg>
											<span class="text-xs font-medium text-green-600 dark:text-green-400"
												>{pair.price_change_percent_1hr}%</span
											>
										</div>
									{:else}
										<div
											class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20"
										>
											<svg
												class="w-3 h-3 text-red-600 dark:text-red-400"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fill-rule="evenodd"
													d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
													clip-rule="evenodd"
												/>
											</svg>
											<span class="text-xs font-medium text-red-600 dark:text-red-400"
												>{pair.price_change_percent_1hr}%</span
											>
										</div>
									{/if}
								</div>
							{:else}
								<span class="text-gray-400 dark:text-gray-600">-</span>
							{/if}
						</td>

						<!-- Last Updated -->
						<td class="px-6 py-4 text-left text-gray-600 dark:text-gray-400 text-sm">
							{friendlyDate(pair.updated_at)}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
