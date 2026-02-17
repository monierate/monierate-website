<script lang="ts">
	import { formatNumber } from '$lib/functions';
	interface Rate {
		changer_code: string;
		price_buy: number;
		price_sell: number;
	}

	interface Changer {
		name: string;
		icon?: string;
	}

	interface HighlightItem {
		rate: Rate;
		changer: Changer;
	}

	export let highlightData: HighlightItem[] = [];
	export let highlightType: 'buy' | 'sell' | 'auto' = 'auto';
	export let base: string;
	export let quote: string;
	export let title: string = 'Highlight';
	export let link: string = '';
	export let mobileOnly: boolean = false;
	export let currencyCode: string = 'usd';
</script>

{#if highlightData && highlightData.length}
	<div
		class="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 {mobileOnly
			? 'md:hidden'
			: ''}"
	>
		<div class="flex justify-between items-center mb-4">
			<span class="block text-[0.8em] md:text-[1em] font-semibold text-gray-800 dark:text-white">
				{title}
			</span>
			{#if link && link !== ''}
				<a href="/buy/usd-with-ngn-best-buying-rate" class="text-sm">See more</a>
			{/if}
		</div>

		<ul>
			{#each highlightData as { rate, changer }}
				<li class="flex justify-between text-sm text-gray-800 dark:text-gray-200 mb-2 text-nowrap">
					<a
						href={`/converter/${rate.changer_code}?Amount=1&From=${currencyCode.toLowerCase()}&To=ngn`}
						class="flex items-center"
						title={`${changer.name} dollar to naira rate.`}
					>
						<span class="changer-icon-sm">
							<picture>
								<source srcset={`/icons/svg/${rate.changer_code}.svg`} type="image/svg+xml" />
								<source srcset={`/icons/png/${rate.changer_code}.png`} type="image/png" />
								<img
									width="16"
									height="16"
									src={`/icons/svg/${rate.changer_code}.svg`}
									class="rounded-full"
									alt={`${changer.name} icon`}
								/>
							</picture>
						</span>
						<span class="text-gray-500 dark:text-gray-300 text-sm ml-2">{changer.name}</span>
					</a>
					<div class="text-right flex items-center gap-1">
						<span class="text-sm">
							{#if highlightType === 'buy'}
								{#if Math.round(rate.price_buy) !== 0}
									{quote} {formatNumber(Math.round(rate.price_buy))}
								{:else}
									-
								{/if}
							{:else if highlightType === 'sell'}
								{#if Math.round(rate.price_sell) !== 0}
									{quote} {formatNumber(Math.round(rate.price_sell))}
								{:else}
									-
								{/if}
							{:else if Math.round(rate.price_buy) !== 0}
								{quote} {formatNumber(Math.round(rate.price_buy))}
							{:else if Math.round(rate.price_sell) !== 0}
								{quote} {formatNumber(Math.round(rate.price_sell))}
							{:else}
								-
							{/if}
						</span>
						<small class="changer-rate-base block text-xs text-gray-500">per {base}1</small>
					</div>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.changer-icon-sm {
		@apply bg-transparent border border-black rounded-full w-[16px] h-[16px] mr-2;
	}
</style>
