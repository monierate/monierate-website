<script lang="ts">
	import { marketContent } from '$lib/content/markets';

	// The visitor's quote currency. The discover pages are NGN-only and pass nothing.
	export let quote: string = 'NGN';
	// The region's main providers (its index contributors), as the footer lists them.
	export let providerNames: string[] = [];

	$: market = marketContent(quote);
	$: providerList =
		providerNames.length > 1
			? `${providerNames.slice(0, -1).join(', ')} and ${providerNames[providerNames.length - 1]}`
			: (providerNames[0] ?? '');
</script>

<div class="container dark:text-gray-300 mt-16">
	<span class="block mb-4">
		<h2>What is a Provider?</h2>
		<p>
			A provider is an entity that helps facilitate the exchange of currencies. If you have 100 USDT
			and want to exchange it for {market.currency}, you will need an exchange provider to convert your
			USDT to {market.currency}. Most providers in {market.country} pay out by {market.payout}. A provider
			can be an individual or entity. On Monierate, we only list trusted entities for you to choose
			from, not individual traders.
		</p>
	</span>
	<span class="block mb-4">
		<h3>What is Buy Price?</h3>
		<p>
			The buy price is the rate at which you pay to convert {market.currency} to dollars. It represents
			the amount of {market.currency} you pay for every dollar obtained. For instance, if you have
			{market.currency} but need USDT to pay a bill, you exchange your {market.currency} for USDT, and the
			provider credits USDT to you at the buy price.
		</p>
	</span>
	<span class="block mb-4">
		<h3>What is Sell Price?</h3>
		<p>
			The sell price is the rate at which you convert dollars to {market.currency}. It represents the
			amount of {market.currency} you get for every dollar exchanged. For instance, if you have USDT but
			need {market.currency} to pay a bill, you exchange your USDT for {market.currency}, and the provider
			credits {market.currency} to you at the sell price.
		</p>
	</span>
	<span class="block mb-4">
		<h3>Why is the buy price usually higher than the sell price?</h3>
		<p>
			Exchange providers make money from the difference between the buying and selling prices of the
			dollar. This is commonly known as arbitrage or trading profit—buying low and selling high. If
			you have USDT but need {market.currency}, they buy the USDT from you at a lower price and sell it
			at a higher price to someone else who needs USDT.
		</p>
	</span>
	<span class="block">
		<h3>How Monierate works</h3>
		<p class="mb-2">
			Monierate operates as a platform for comparing dollar prices across various providers in
			{market.country}.
		</p>
		<p class="mb-2">Here&#39;s how it works:</p>
		<ul class="list-inside ml-2">
			<li class="mb-2">
				<p>
					<strong>Comparison Functionality:</strong>
					Monierate gathers and displays the prices of the dollar from multiple providers in
					{market.country}. You can compare these prices to find the best rates available in the market.
				</p>
			</li>
			<li class="mb-2">
				<p>
					<strong>Exchange Rate Information:</strong>
					You can use Monierate to obtain daily information on the exchange rate of the dollar to
					{market.currency}.
				</p>
			</li>
			<li class="mb-2">
				<p>
					<strong>Order Arrangement:</strong>
					Prices are presented by default from the lowest to the highest, allowing you to easily identify
					the most cost-effective rates.
				</p>
			</li>
			<li class="mb-2">
				<p>
					<strong>Buy and Sell Options:</strong>
					Monierate helps you get more dollars for your {market.currency} or vice versa by presenting both
					buy and sell options.
				</p>
			</li>
			<li class="mb-2">
				<p>
					<strong>Customizable Sorting:</strong>
					You have the flexibility to customize the order of the displayed rates, choosing between low
					to high or sorting by buy or sell prices.
				</p>
			</li>
			<li class="mb-2">
				<p>
					<strong>Provider Tracking:</strong>
					Monierate actively tracks the 24-hour prices of the dollar across a diverse range of providers
					in {market.country}{#if providerList}, including {providerList}{/if}.
				</p>
			</li>
		</ul>
		<p>
			In essence, we simplify the process of finding the most favorable dollar exchange rates in
			{market.country} by providing a user-friendly platform for comparison and real-time rate tracking.
		</p>
	</span>
</div>
