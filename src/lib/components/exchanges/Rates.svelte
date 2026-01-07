<script lang="ts">
	import { formatNumber, friendlyDate, setUrlParam } from '$lib/functions';
	import { browser } from '$app/environment';

	export let data: {
		rates: any[];
		currency: string;
		currencySymbols: Record<string, string>;
	};
	export let pagination: boolean = true;
	export let currentPage: number = 1;
	export let rowsPerPage: number = 100;

	$: rates = data.rates || [];
	$: currency = data.currency || 'usd';
	$: currencySymbols = data.currencySymbols || {};

	// Pagination
	$: totalPages = Math.ceil((rates.length || 0) / rowsPerPage);
	$: paginatedRows = rates.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

	let sortDirection: 'asc' | 'desc' | 'default' = 'asc';
	let sortColumn: string | null = null;
	let originalRows: any = null;

	const sortTable = (column: string) => {
		if (!originalRows) originalRows = [...paginatedRows];

		// Toggle sort direction
		if (column === 'price_buy') {
			if (sortDirection === 'desc') {
				sortDirection = 'default';
			}
			sortDirection = sortDirection !== 'default' ? 'default' : 'asc';
			sortColumn = 'price_buy';
		} else if (column === 'price_sell') {
			if (sortDirection === 'asc') {
				sortDirection = 'default';
			}
			sortDirection = sortDirection !== 'default' ? 'default' : 'desc';
			sortColumn = 'price_sell';
		}

		if (sortDirection === 'default') {
			paginatedRows = [...originalRows];
			return;
		}

		paginatedRows = [...paginatedRows].sort((a, b) => {
			if (column === 'price_buy') {
				if (a.price_buy === 0 && b.price_buy !== 0) return 1;
				if (a.price_buy !== 0 && b.price_buy === 0) return -1;
				return a.price_buy - b.price_buy;
			}
			if (column === 'price_sell') {
				if (a.price_sell === 0 && b.price_sell !== 0) return 1;
				if (a.price_sell !== 0 && b.price_sell === 0) return -1;
				return b.price_sell - a.price_sell;
			}
			return 0;
		});
	};

	let content: HTMLElement | null = null;
	const scrollToContent = () => {
		const offset = 200;
		if (browser && content) {
			const top = content.getBoundingClientRect().top + window.scrollY - offset;
			window.scrollTo({ top, behavior: 'smooth' });
		}
	};

	const gotoPage = (page: number) => {
		currentPage = page;
		setUrlParam('page', page);
		scrollToContent();
	};

	function getPageButtons(): (number | string)[] {
		if (totalPages <= 5) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}
		if (currentPage <= 3) {
			return [1, 2, 3, '...', totalPages];
		}
		if (currentPage >= totalPages - 2) {
			return [1, '...', totalPages - 2, totalPages - 1, totalPages];
		}
		return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
	}

	// Generate mock sparkline data for demo purposes
	function generateSparklineData() {
		return Array.from({ length: 20 }, () => Math.random() * 40 + 30);
	}

	function createSparklinePath(data: number[], width: number = 100, height: number = 30) {
		const max = Math.max(...data);
		const min = Math.min(...data);
		const range = max - min || 1;

		const points = data.map((value, i) => {
			const x = (i / (data.length - 1)) * width;
			const y = height - ((value - min) / range) * height;
			return `${x},${y}`;
		});

		return `M ${points.join(' L ')}`;
	}
</script>

<div class="container p-0 w-full m-0 md:max-w-[1200px] md:m-auto" bind:this={content}>
	<div class="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm">
		<table class="text-sm text-gray-800 min-w-full table-auto">
			<thead
				class="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-600 dark:text-gray-400 tracking-wider"
			>
				<tr>
					<th class="px-6 pr-10 py-4 text-left font-medium w-12 hidden md:inline-block" />
					<th class="px-2 py-4 text-right font-medium w-4 hidden md:inline-block">#</th>
					<th class="px-6 py-4 text-left font-medium">Name</th>
					<th class="px-6 py-4 text-right font-medium">Buy Price</th>
					<th class="px-6 py-4 text-right font-medium">Sell Price</th>
					<th class="px-6 py-4 text-right font-medium">Last Updated</th>
					<th class="px-6 py-4 text-right font-medium"
						>Last 7 Days <span class="text-xs bg-green-500/20 text-green-500 p-1 rounded-md"
							>Buy</span
						></th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100 dark:divide-gray-800">
				{#each paginatedRows as rate, i}
					{@const sparklineData = generateSparklineData()}
					<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
						<!-- Index -->
						<td class="px-6 pr-10 py-4 text-gray-500 dark:text-gray-400 font-medium hidden md:inline-block">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5 -rotate-45"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
								/>
							</svg>
						</td>
						<td class="text-right px-2 py-4 text-gray-500 dark:text-gray-400 font-medium hidden md:inline-block">
							{(currentPage - 1) * rowsPerPage + i + 1}
						</td>

						<!-- Currency Pair -->
						<td class="px-6 py-4">
							<div class="flex items-center gap-2">
								<img
									src={`https://stablerate.app/icons/currencies/${rate.currency_code}.png`}
									class="w-5 h-5 rounded-full object-fit"
									alt={rate.currency_code}
								/>
								<span class="font-medium text-gray-900 dark:text-gray-100">
									{rate.currency_code.toUpperCase()}/{currency.toUpperCase()}
								</span>
							</div>
						</td>

						<!-- Buy Price -->
						<td class="px-6 py-4 text-right">
							{#if rate.price_buy > 0}
								<div class="space-y-0.5 inline-flex items-center">
									<div class="font-medium text-gray-900 dark:text-gray-100 text-base">
										₦{formatNumber(rate.price_buy)}
									</div>
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
										<span class="text-xs font-medium text-green-600 dark:text-green-400">0.42%</span
										>
									</div>
								</div>
							{:else}
								<span class="text-gray-400 dark:text-gray-600">-</span>
							{/if}
						</td>

						<!-- Sell Price -->
						<td class="px-6 py-4 text-right">
							{#if rate.price_sell > 0}
								<div class="space-y-0.5 inline-flex items-center">
									<div class="font-medium text-gray-900 dark:text-gray-100 text-base">
										₦{formatNumber(rate.price_sell)}
									</div>
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
										<span class="text-xs font-medium text-red-600 dark:text-red-400">0.93%</span>
									</div>
								</div>
							{:else}
								<span class="text-gray-400 dark:text-gray-600">-</span>
							{/if}
						</td>

						<!-- Last Updated -->
						<td class="px-6 py-4 text-right text-gray-600 dark:text-gray-400 text-sm">
							{friendlyDate(rate.updated_at)}
						</td>

						<!-- Sparkline Chart -->
						<td class="px-6 py-4 text-right">
							<div class="inline-flex justify-end w-24">
								<svg
									width="100"
									height="30"
									class="text-green-500 dark:text-green-400"
									style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));"
								>
									<path
										d={createSparklinePath(sparklineData)}
										fill="none"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
										opacity="0.8"
									/>
									<path
										d={createSparklinePath(sparklineData) + ` L 100,30 L 0,30 Z`}
										fill="currentColor"
										opacity="0.1"
									/>
								</svg>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- PAGINATION -->
	{#if pagination && rates.length > rowsPerPage}
		<div
			class="flex flex-wrap justify-between items-center px-6 py-4 mt-4 text-sm text-gray-600 dark:text-gray-400"
		>
			<!-- Count -->
			<div class="text-sm">
				Showing <span class="font-medium text-gray-900 dark:text-gray-100"
					>{(currentPage - 1) * rowsPerPage + 1}</span
				>
				to
				<span class="font-medium text-gray-900 dark:text-gray-100"
					>{Math.min(currentPage * rowsPerPage, rates.length)}</span
				>
				of <span class="font-medium text-gray-900 dark:text-gray-100">{rates.length}</span> results
			</div>

			<!-- Buttons -->
			<div class="flex items-center gap-2">
				<!-- Prev -->
				<button
					class="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					on:click={() => gotoPage(Math.max(1, currentPage - 1))}
					disabled={currentPage === 1}
					aria-label="Previous page"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>

				{#each getPageButtons() as page}
					{#if typeof page === 'string'}
						<span class="px-2 py-1 text-gray-400">…</span>
					{:else}
						<button
							class={`px-4 py-2 rounded-lg font-medium transition-colors ${
								page === currentPage
									? 'bg-blue-600 text-white shadow-sm'
									: 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
							}`}
							on:click={() => gotoPage(page)}
							aria-label="Page {page}"
						>
							{page}
						</button>
					{/if}
				{/each}

				<!-- Next -->
				<button
					class="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					on:click={() => gotoPage(Math.min(totalPages, currentPage + 1))}
					disabled={currentPage === totalPages}
					aria-label="Next page"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>

			<!-- Row count -->
			<div class="flex items-center gap-2">
				<label for="rowsPerPage" class="text-sm">Rows per page:</label>
				<select
					class="border rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					bind:value={rowsPerPage}
					on:change={() => gotoPage(1)}
					id="rowsPerPage"
				>
					<option value="10">10</option>
					<option value="25">25</option>
					<option value="50">50</option>
					<option value="100">100</option>
				</select>
			</div>
		</div>
	{/if}
</div>
