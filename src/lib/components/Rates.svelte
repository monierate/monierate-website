<script lang="ts">
	import { formatNumber, friendlyDate, setUrlParam } from '$lib/functions';
	import { browser } from '$app/environment';

	export let data: {
		rates: any[];
		providers: Record<string, any>;
		currency: string;
		currencySymbols: Record<string, string>;
	};
	export let pagination: boolean = true;
	export let currentPage: number = 1;
	export let rowsPerPage: number = 100;
	export let rateType: 'buy' | 'sell' = 'sell';

	$: rates =
		data.rates
			.filter(
				(rate) => providers[rate.changer_code] && !excludedPlatforms.includes(rate.changer_code)
			)
			.sort((a: any, b: any) => {
				if (a.price_sell === 0 && b.price_sell !== 0) return 1;
				if (rateType === 'buy') {
					return a.price_buy - b.price_buy;
				} else {
					return b.price_sell - a.price_sell;
				}
			}) || [];
	$: providers = data.providers || {};
	$: currency = data.currency || 'usd';
	$: currencySymbols = data.currencySymbols || {};

	const excludedPlatforms = ['market', 'binance'];

	// Pagination
	$: totalPages = Math.ceil((rates.length || 0) / rowsPerPage);
	$: paginatedRows = rates.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

	let sortDirection: 'asc' | 'desc' | 'default' = 'asc';
	let sortColumn: string | null = null;
	let originalRows: any = null;

	const sortTable = (column: string) => {
		if (!originalRows) originalRows = [...paginatedRows];

		// Toggle sort direction
		if (column === 'rate') {
			if (sortDirection === 'asc') {
				sortDirection = 'default';
			}
			sortDirection = sortDirection !== 'default' ? 'default' : 'desc';
			sortColumn = 'rate';
		} else if (column === 'provider') {
			if (sortColumn !== 'provider') {
				sortDirection = 'default';
			}
			if (sortDirection === 'asc') sortDirection = 'desc';
			else if (sortDirection === 'desc') sortDirection = 'default';
			else sortDirection = 'asc';
			sortColumn = 'provider';
		}

		if (sortDirection === 'default') {
			paginatedRows = [...originalRows];
			return;
		}

		paginatedRows = [...paginatedRows].sort((a, b) => {
			if (column === 'rate') {
				// push 0 below all positives
				if (rateType === 'sell') {
					if (a.price_sell === 0 && b.price_sell !== 0) return 1;
					if (a.price_sell !== 0 && b.price_sell === 0) return -1;
					// both > 0 → sort ascending
					return b.price_sell - a.price_sell;
				} else {
					if (a.price_buy === 0 && b.price_buy !== 0) return 1;
					if (a.price_buy !== 0 && b.price_buy === 0) return -1;
					// both > 0 → sort ascending
					return b.price_buy - a.price_buy;
				}
			}

			if (column === 'provider') {
				const providerA = providers[a.changer_code]?.name.toLowerCase() || '';
				const providerB = providers[b.changer_code]?.name.toLowerCase() || '';
				return sortDirection === 'asc'
					? providerA.localeCompare(providerB)
					: providerB.localeCompare(providerA);
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

		// Near the start
		if (currentPage <= 3) {
			return [1, 2, 3, '...', totalPages];
		}

		// Near the end
		if (currentPage >= totalPages - 2) {
			return [1, '...', totalPages - 2, totalPages - 1, totalPages];
		}

		// Middle
		return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
	}
</script>

<div class="container p-0 w-full m-0 md:md:max-w-[1200px] md:m-auto" bind:this={content}>
	<div class="overflow-x-auto bg-inherit dark:bg-gray-900/60">
		<table class="text-sm text-gray-800 min-w-full table-auto">
			<thead
				class="bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-200 font-semibold whitespace-nowrap"
			>
				<tr>
					<th class="px-4 py-6 md:text-[15px] w-10 hidden md:table-cell text-left">#</th>
					<th class="px-4 py-6 md:text-[15px] text-left">
						<span class="flex items-center">
							Provider
							<button
								class="ml-2"
								on:click={() => {
									sortTable('provider');
								}}
								aria-label="Sort table"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="size-5"
								>
									<path
										fill-rule="evenodd"
										d="M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
						</span>
					</th>
					<th class="px-4 py-6 md:text-[15px] text-right">
						<span class="inline-flex flex items-center">
							Rate
							<button
								class="ml-2"
								on:click={() => {
									sortTable('rate');
								}}
								aria-label="Sort table"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="size-5"
								>
									<path
										fill-rule="evenodd"
										d="M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
						</span>
					</th>
					<th class="px-4 py-6 md:text-[15px] text-right">Last Updated</th>
				</tr>
			</thead>
			<tbody>
				{#each paginatedRows as rate, i}
					<tr class="border-t dark:border-gray-700 whitespace-nowrap">
						<!-- Index -->
						<td class="px-4 py-3 w-10 hidden md:table-cell text-left dark:text-gray-200">{i + 1}</td
						>

						<!-- Name with icon and link -->
						<td class="px-4 py-3 text-left dark:text-gray-200 font-bold md:text-[17px]">
							<a
								href={`/converter/${rate.changer_code}?Amount=1&From=usd&To=ngn`}
								class="flex items-center gap-2 text-gray-700 dark:text-gray-200"
							>
								<picture class="h-6 w-6 rounded-full overflow-hidden">
									<source srcset={`/icons/svg/${rate.changer_code}.svg`} type="image/svg+xml" />
									<source srcset={`/icons/svg/${rate.changer_code}.png`} type="image/png" />
									<img
										src={`/icons/svg/${rate.changer_code}.png`}
										alt={providers[rate.changer_code].name}
										class="h-6 w-6 rounded-full"
									/>
								</picture>
								<span class="font-semibold">{providers[rate.changer_code].name}</span>
							</a>
						</td>

						<!-- Rate -->
						<td class="px-4 py-3 text-right dark:text-gray-200 font-bold md:text-[17px]">
							{#if rateType === 'buy'}
								{#if rate.price_buy > 0}
									<div class="space-y-1">
										<div class="font-semibold">
											₦{formatNumber(rate.price_buy, 'en-US', { maximumFractionDigits: 0 })}
										</div>
										<div class="text-gray-400 text-xs">
											per {currencySymbols[currency] || currency + ' '}1
										</div>
									</div>
								{:else}
									-
								{/if}
							{:else if rate.price_sell > 0}
								<div class="space-y-1">
									<div class="font-semibold">
										₦{formatNumber(rate.price_sell, 'en-US', { maximumFractionDigits: 0 })}
									</div>
									<div class="text-gray-400 text-xs">
										per {currencySymbols[currency] || currency + ' '}1
									</div>
								</div>
							{:else}
								-
							{/if}
						</td>

						<!-- Last Updated -->
						<td class="px-4 py-3 text-right dark:text-gray-200">
							{friendlyDate(rate.updated_at)}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- PAGINATION -->
	{#if pagination}
		<div
			class="flex flex-wrap justify-center md:justify-between items-center px-4 py-3 pt-8 md:pt-10 border-t dark:border-gray-700 text-sm text-gray-600 bg-inherit dark:bg-gray-900/60"
		>
			<!-- Count -->
			<div class="hidden md:block">
				Showing {(currentPage - 1) * rowsPerPage + 1}
				to {Math.min(currentPage * rowsPerPage, rates.length)}
				of {rates.length} results
			</div>

			<!-- Buttons -->
			{#if rates.length > 10}
				<div class="flex items-center gap-1">
					<!-- Prev -->
					<button
						class="px-3 py-1 rounded bg-gray-100 dark:bg-gray-900/60 hover:bg-gray-200 border-gray-200 dark:border-gray-700 border text-[11px]"
						on:click={() => (gotoPage(Math.max(1, currentPage - 1)), scrollToContent())}
						disabled={currentPage === 1}
						aria-label="Previous page"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="size-5"
						>
							<path
								fill-rule="evenodd"
								d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>

					{#each getPageButtons() as page}
						{#if typeof page === 'string'}
							<span class="px-2 py-1 text-gray-400">…</span>
						{:else}
							<button
								class={`px-3 py-1 rounded ${
									page === currentPage
										? 'bg-blue-600 text-white border-blue-700'
										: 'bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 border-gray-400 dark:border-gray-700'
								} border`}
								on:click={() => (gotoPage(page), scrollToContent())}
								aria-label="Page ${page}"
							>
								{page}
							</button>
						{/if}
					{/each}

					<!-- Next -->
					<button
						class="px-3 py-1 rounded bg-gray-100 dark:bg-gray-900/60 hover:bg-gray-200 border-gray-200 dark:border-gray-700 border text-[11px]"
						on:click={() => (gotoPage(Math.min(totalPages, currentPage + 1)), scrollToContent())}
						disabled={currentPage === totalPages}
						aria-label="Next page"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="size-5"
						>
							<path
								fill-rule="evenodd"
								d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</div>
			{/if}

			<!-- Row count -->
			<div class="flex items-center gap-2 hidden md:block">
				<span>Row</span>
				<select
					class="border rounded px-2 py-1 text-sm dark:bg-gray-900/60 border-gray-200 dark:border-gray-700 dark:text-gray-200"
					bind:value={rowsPerPage}
					on:change={() => (gotoPage(1), scrollToContent())}
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
