<script lang="ts">
	import { ACCOUNT_URL } from '$lib/config';
	import TrustBadges from './TrustBadges.svelte';
	import { isNaira, type PricingCurrency } from './currency';

	let { currency }: { currency: PricingCurrency } = $props();

	const ng = $derived(isNaira(currency));

	const features = $derived([
		{
			title: 'Up to Date Provider Rates',
			body: 'Provider rates are kept up to date around the clock, every day of the year, on every plan.',
			icon: 'M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z'
		},
		{
			title: '100+ Providers, One API',
			body: 'P2P desks, exchanges, fintech apps and remittance services through a single JSON API.',
			icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'
		},
		{
			title: 'Trusted Parallel and Midpoint Rates',
			body: 'Parallel and mid-market rates side by side, each labelled with the market it came from.',
			icon: 'M18 20V10M12 20V4M6 20v-6'
		},
		{
			title: '170+ Fiat and Crypto Currencies',
			body: 'Rates for 170+ currencies, plus USDT and USDC buy and sell prices from every major P2P and spot venue we track.',
			icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM9 8h6M12 8v8'
		},
		{
			title: 'Years of History',
			body: ng
				? 'Daily mid-market history back to 2013, plus parallel history for key Naira pairs, for backtesting and reporting.'
				: 'Daily mid-market history back to 2013, plus parallel market history, for backtesting and reporting.',
			icon: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2'
		},
		{
			title: 'OHLC Down to 10 Minutes',
			body: 'Open, high, low and close candles in intervals as short as 10 minutes, ready for charts and backtests.',
			icon: 'M6 3v18M6 7h-2v8h2M12 5v14M12 9h-2v4h2M18 3v18M18 6h-2v10h2'
		},
		{
			title: 'Spread and Volatility Data',
			body: 'Ready-made per-provider spread analysis and volatility endpoints so you can see how far apart the markets are.',
			icon: 'M22 12h-4l-3 9L9 3l-3 9H2'
		},
		{
			title: 'CSV Exports',
			body: 'Prefer spreadsheets? Download any rate history as CSV straight from the dashboard.',
			icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8'
		},
		{
			title: 'Simple REST and JSON',
			body: 'Send your key in the api_key header and get predictable JSON back. Most teams ship their first call in minutes.',
			icon: 'M16 18l6-6-6-6M8 6l-6 6 6 6'
		},
		{
			title: 'MCP Server for AI Agents',
			body: 'Connect Claude, ChatGPT, Cursor and other MCP clients, then ask for rates in plain language.',
			icon: 'M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4zM9 13h.01M15 13h.01'
		},
		{
			title: 'Dashboard Included Free',
			body: 'Market Insight and the Analytics Dashboard come free on every plan, always.',
			icon: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z'
		},
		{
			title: ng ? 'Simple Naira Billing' : 'Simple USD Billing',
			body: ng
				? 'Top up your wallet or subscribe in Naira, with clear pricing and no conversion surprises.'
				: 'Top up your wallet or subscribe in US Dollars, with clear pricing and no conversion surprises.',
			icon: 'M2 7h20v12H2zM2 11h20M6 15h4'
		}
	]);
</script>

<section class="container py-16">
	<div class="text-center mb-12">
		<h2 class="section-title font-head font-extrabold mb-4" style="color: var(--text-primary);">
			The exchange rate API built for developers
		</h2>
		<p class="text-[17px] max-w-2xl mx-auto leading-relaxed" style="color: var(--text-secondary);">
			Monierate tracks the rates people actually get, not just the official one. Fiat and crypto, 170+ currencies and 100+
			providers in one API, whether you are pricing checkout, settling payouts or reporting to finance.
		</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
		{#each features as f}
			<div class="text-center px-2">
				<div class="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style="background: var(--accent-light);">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
						<path d={f.icon} />
					</svg>
				</div>
				<h3 class="font-head text-base font-bold mb-2" style="color: var(--text-primary);">{f.title}</h3>
				<p class="text-[15px] leading-relaxed" style="color: var(--text-secondary);">{f.body}</p>
			</div>
		{/each}
	</div>

	<div class="text-center mt-12">
		<a href="{ACCOUNT_URL}/auth/signup" target="_blank" rel="noopener noreferrer" class="button inline-block font-semibold px-6 py-3 text-base">
			Get Free API Key
		</a>
		<TrustBadges center />
	</div>
</section>

<style>
	.section-title {
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
	}
</style>
