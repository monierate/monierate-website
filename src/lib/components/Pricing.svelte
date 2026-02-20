<script lang="ts">
	import { formatNumber, capitalizeAndJoin } from '$lib/functions';

	export let data: any;
	let currencySymbols: any = data.currencySymbols;
	let subscriptionPlans: any = data.subscriptionPlans
		.sort((a: any, b: any) => b.price - a.price)
		.slice(0, 4);
</script>

<div class="flex flex-wrap gap-5 mb-16 justify-center">
	{#if subscriptionPlans}
		{#each subscriptionPlans as plan, i}
			<div
				class="w-full md:basis-[calc(33.333%-1.25rem)] bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 {i ===
				1
					? 'border-blue-500/50 outline outline-2 outline-blue-500/10 outline-offset-2'
					: 'border-gray-200 dark:border-gray-700'} rounded-lg shadow-md p-6 hover:scale-105 transition-all duration-300"
			>
				<div class="">
					<div class="mb-6">
						<span
							class="inline-block text-lg {i === 0
								? 'text-yellow-800 dark:text-yellow-200 bg-yellow-800/10'
								: i === 1
									? 'text-blue-500 bg-blue-800/10'
									: i === 2
										? 'text-green-500 bg-green-800/10'
										: 'text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-800'} rounded-lg p-1 px-4"
						>
							{plan.name}
						</span>
					</div>
					<p class="mt-2 text-5xl font-bold text-gray-900 dark:text-gray-100">
						{currencySymbols[plan.currency]
							? currencySymbols[plan.currency]
							: plan.currency}{formatNumber(plan.price)}<span
							class="text-lg text-gray-500 dark:text-gray-400"
						>
							/ yr</span
						>
					</p>
				</div>
				<ul class="mt-6 space-y-4">
					<li class="flex items-center text-gray-800 dark:text-gray-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6 text-blue-500 mr-2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
						<span class="font-medium"
							>{formatNumber(plan.requests_limit_per_month)} request per month</span
						>
					</li>
					<li class="flex items-center text-gray-800 dark:text-gray-400">
						{#if plan.features.minute_updates}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6 text-blue-500 mr-2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>
							<span class="font-medium">
								{formatNumber(plan.features.minute_updates)}
								minute updates
							</span>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6 text-red-500 mr-3"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>

							<span class="font-medium"> No limit updates </span>
						{/if}
					</li>
					<li class="flex items-center text-gray-800 dark:text-gray-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6 text-blue-500 mr-2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
						<span class="font-medium"
							>{formatNumber(plan.requests_limit_per_minute)} request limit per minute</span
						>
					</li>
					<li class="flex items-center text-gray-800 dark:text-gray-400">
						{#if plan.features.supports_premium_currencies === true}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6 text-blue-500 mr-2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>
							<span class="font-medium"> Supports premium currencies </span>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6 text-red-500 mr-3"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>

							<span class="font-medium"> Does not support premium currencies </span>
						{/if}
					</li>
					<li class="flex items-center text-gray-800 dark:text-gray-400">
						{#if plan.features.custom_reports === true}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6 text-blue-500 mr-2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>
							<span class="font-medium"> With custom historical reports </span>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6 text-red-500 mr-3"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>

							<span class="font-medium"> No custom historical reports </span>
						{/if}
					</li>
					<li class="flex items-center text-gray-800 dark:text-gray-400">
						{#if plan.features.available_markets}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6 text-blue-500 mr-2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>
							<span class="font-medium">
								Rate supported: {capitalizeAndJoin(plan.features.available_markets)}</span
							>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6 text-red-500 mr-3"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>

							<span class="font-medium"> No rate supported </span>
						{/if}
					</li>
				</ul>
				<div class="mt-6">
					<a
						href="https://account.monierate.com/subscription/{plan._id}"
						class="w-full button block text-center {i === 1
							? 'bg-blue-500 hover:bg-blue-600 text-white'
							: 'bg-transparent hover:bg-blue-500/5 border border-blue-500 text-blue-500'} font-medium py-3 px-4 rounded"
						>Select Plan</a
					>
				</div>
			</div>
		{/each}
	{/if}
</div>
