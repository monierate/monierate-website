<script lang="ts">
	import { ACCOUNT_URL } from '$lib/config';

	const features = [
		{
			title: 'Rates That Never Sleep',
			body: 'Provider rates are refreshed around the clock, every day of the year, on every plan.',
			icon: 'M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z'
		},
		{
			title: '90+ Providers, One API',
			body: 'P2P desks, exchanges, fintech apps and remittance services through a single JSON endpoint.',
			icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'
		},
		{
			title: 'Official and Parallel Markets',
			body: 'Get the CBN official rate next to parallel and mid-market rates without stitching sources together.',
			icon: 'M18 20V10M12 20V4M6 20v-6'
		},
		{
			title: 'Stablecoin Rates',
			body: 'USDT and USDC to Naira buy and sell prices from every major P2P and spot venue we track.',
			icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM9 8h6M12 8v8'
		},
		{
			title: 'Years of History',
			body: 'Pull historical rates by day for backtesting, reconciliation, compliance and reporting.',
			icon: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2'
		},
		{
			title: 'Spread and Volatility Data',
			body: 'Ready-made spread index and volatility endpoints so you can see how far apart the markets are.',
			icon: 'M22 12h-4l-3 9L9 3l-3 9H2'
		},
		{
			title: 'CSV Exports',
			body: 'Prefer spreadsheets? Download any rate history as CSV straight from the dashboard.',
			icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8'
		},
		{
			title: 'Offramp Execution',
			body: 'Go beyond quotes. Execute stablecoin to Naira offramp trades through the same API.',
			icon: 'M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4'
		},
		{
			title: 'Simple REST and JSON',
			body: 'Bearer token auth, predictable responses and clear docs. Most teams ship their first call in minutes.',
			icon: 'M16 18l6-6-6-6M8 6l-6 6 6 6'
		},
		{
			title: 'Dashboard Included Free',
			body: 'Market Insight and the Analytics Dashboard come free on every plan, always.',
			icon: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z'
		},
		{
			title: 'Pay in Naira or Dollars',
			body: 'Top up your wallet or subscribe in NGN or USD, whichever suits your business.',
			icon: 'M2 7h20v12H2zM2 11h20M6 15h4'
		},
		{
			title: 'Built for AI Agents',
			body: 'Clean, typed JSON that LLMs and agents can call as a tool with no custom parsing.',
			icon: 'M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4zM9 13h.01M15 13h.01'
		}
	];
</script>

<section class="container py-16">
	<div class="text-center mb-12">
		<h2 class="section-title font-head font-extrabold italic mb-3" style="color: var(--text-primary);">
			The Naira rate API built for builders
		</h2>
		<p class="text-sm max-w-2xl mx-auto leading-relaxed" style="color: var(--text-secondary);">
			Monierate tracks the rates people actually get, not just the official one. We provide a fast, reliable API for your
			application, whether you are pricing checkout, settling payouts or reporting to finance.
		</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 max-w-6xl mx-auto">
		{#each features as f}
			<div class="text-center px-2">
				<div class="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style="background: var(--accent-light);">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
						<path d={f.icon} />
					</svg>
				</div>
				<h3 class="font-head text-sm font-bold mb-2" style="color: var(--text-primary);">{f.title}</h3>
				<p class="text-[13px] leading-relaxed" style="color: var(--text-secondary);">{f.body}</p>
			</div>
		{/each}
	</div>

	<div class="text-center mt-12">
		<a href="{ACCOUNT_URL}/auth/signup" target="_blank" rel="noopener noreferrer" class="button inline-block font-semibold px-6 py-3 text-sm">
			Get Free API Key
		</a>
		<p class="text-[11px] mt-2" style="color: var(--text-muted);">No credit card required. Cancel anytime.</p>
	</div>
</section>

<style>
	.section-title {
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
	}
</style>
