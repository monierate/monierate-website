<script lang="ts">
	import { page } from '$app/stores';
	import { getCookie, setCookie } from '$lib/functions';
	import { browser } from '$app/environment';

	export let marketAvgRate: number;

	const market_avg_rate = parseFloat(`${marketAvgRate}`);

	// get the current page path
	$: paths = $page.url.pathname.split('/');
	$: paths.shift();
	$: path = paths[0] ?? 'home';

	let showPromotionBar = getCookie('promotion_bar') == null ? true : false;

	// hide promotion bar on alert page
	$: showPromotionBar = path == 'alerts' ? false : true;

	function hidePromotionBar() {
		if (browser) {
			let element = document.querySelector('#promotion-bar');
			element?.classList.add('hidden');

			setCookie('promotion_bar', 'hide', 7);
		}
	}
</script>

{#if showPromotionBar}
	<div class="fixed inset-x-0 bottom-0 pb-2 sm:pb-5 z-50" id="promotion-bar">
		<div class="mx-auto w-[95%] md:w-[500px] px-2 sm:px-6 lg:px-8">
			<div class="rounded-lg bg-gray-800 p-2 shadow-lg sm:p-3 dark:bg-gray-100">
				<div class="flex flex-wrap items-center justify-between">
					<div class="flex w-0 flex-1 items-center">
						<span class="flex rounded-lg bg-gray-900 dark:bg-gray-600 p-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								aria-hidden="true"
								class="h-6 w-6 text-white"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
								/></svg
							>
						</span>
						<p class="ml-3 truncate font-medium text-white dark:text-gray-900">
							<span class="md:hidden">
								$1 = ₦{Math.round(market_avg_rate)}
							</span>
							<span class="hidden md:inline">
								$1 = ₦{Math.round(market_avg_rate)} (market avg.)
							</span>
						</p>
					</div>
					<div class="w-auto">
						<a
							class="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-900"
							href="https://tinyurl.com/cambridge-currences-top-banner"
							>Send Money
						</a>
					</div>
					<div class="">
						<button
							on:click={hidePromotionBar}
							type="button"
							class="-mr-1 flex rounded-md p-2 hover:bg-gray-500 dark:hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white dark:text-gray-200"
							><span class="sr-only">Dismiss</span><svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
								class="h-6 w-6 text-white dark:text-black"
								><path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/></svg
							></button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
