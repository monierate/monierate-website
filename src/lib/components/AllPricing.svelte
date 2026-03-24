<script lang="ts">
	import { formatNumber, capitalizeAndJoin } from '$lib/functions';

	export let data: any;
	let currencySymbols: any = data.currencySymbols;
	let subscriptionPlans: any = data.subscriptionPlans
		.sort((a: any, b: any) => b.price - a.price)
		.slice(0, 3);
</script>

<div class="grid md:grid-cols-3 gap-4 mb-8">
	{#if subscriptionPlans}
		{#each subscriptionPlans as plan, i}
			<div
				class="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-xl shadow-md py-6 {plan.code ===
				'free'
					? 'md:col-span-3 md:place-self-center'
					: ''}"
			>
				<div class="mb-6 px-6">
					<span class="block text-2xl font-bold mb-2 text-blue-500">
						{plan.name}
					</span>
					{#if plan.description}
						<span class="block text-md">
							{plan.description}
						</span>
					{/if}
				</div>
				<div class="px-6 bg-blue-500/5 dark:bg-blue-500/10 py-4 mb-4">
					<p class="mt-2 text-4xl font-bold text-gray-900 dark:text-gray-100 mb-5">
						{currencySymbols[plan.currency]
							? currencySymbols[plan.currency]
							: plan.currency}{formatNumber(plan.price)}<span
							class="text-lg text-gray-500 dark:text-gray-400"
						>
							/ yr</span
						>
					</p>
					<a
						href="https://account.monierate.com/subscription/{plan._id}"
						class="w-full button block text-center text-[17px] font-md bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md mb-2"
						>Sign up now</a
					>
				</div>
				<div class="px-6 py-4">
					<p class="text-gray-700 dark:text-gray-300 font-bold text-md">Currency API:</p>
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
				</div>
				<div class="px-6 py-4">
					<p class="text-gray-700 dark:text-gray-300 font-bold text-md">Featured offerings:</p>
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

							<span class="font-medium"> Instant Currency Swaps </span>
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

							<span class="font-medium"> Platform rate listing (Discounted) </span>
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

							<span class="font-medium"> Unlimited rate alert </span>
						</li>
					</ul>
				</div>
			</div>
		{/each}
	{/if}
</div>
