<script lang="ts">
	import { ACCOUNT_URL } from '$lib/config';
	import ShowcaseVisual from './ShowcaseVisual.svelte';

	type Point = { title: string; body: string };
	type Section = {
		title: string;
		intro: string;
		visual: 'speed' | 'developer' | 'stablecoin' | 'reliable' | 'markets';
		points: Point[];
		cta?: boolean;
	};

	const sections: Section[] = [
		{
			title: 'Currency API is fast.',
			intro:
				'Slow responses are a drag. They slow down your checkout, your dashboards and your users. Our responses are served from cache close to your servers, so rates arrive in milliseconds.',
			visual: 'speed',
			points: [
				{
					title: 'Secure by Default',
					body: 'Every request is served over HTTPS and authenticated with a private Bearer token you can rotate at any time.'
				},
				{
					title: 'Real People Behind the API',
					body: 'Questions about an endpoint or a provider? Our team answers by email and will hop on a call when you need it.'
				}
			]
		},
		{
			title: 'An exchange rate API that puts developers first.',
			intro:
				'We know speed and reliability matter to you. Our documentation is written and tested by developers, so you can integrate quickly and get back to building your product.',
			visual: 'developer',
			points: [
				{
					title: 'Reliable, Powerful API',
					body: 'One request returns every provider for a pair, already normalised to the same shape. No scraping, no stitching, no surprises.'
				},
				{
					title: 'Keep It Simple',
					body: 'Clean REST endpoints and plain JSON. Copy the example, drop in your key, and you are live in under ten minutes.'
				}
			]
		},
		{
			title: 'Stablecoin rates included.',
			intro:
				'Get real-time USDT and USDC to Naira pricing from P2P desks, spot exchanges and OTC apps. We combine buy and sell quotes so you always see the true market.',
			visual: 'stablecoin',
			points: [
				{
					title: 'Real-time Stablecoin API',
					body: 'Buy and sell prices for every venue we track, refreshed continuously and returned in a single response.'
				},
				{
					title: 'Exchange Rates for Any Pair We Cover',
					body: 'Convert between stablecoins, Naira and major fiat currencies including USD, GBP, EUR and CAD.'
				},
				{
					title: 'Missing a Provider?',
					body: 'Tell us which venue you need and we will look at adding it. Every plan gets new providers automatically.'
				}
			]
		},
		{
			title: 'Reliable Exchange Rate API.',
			intro:
				'Finding a good exchange rate API for Nigerian markets is hard. Official feeds lag the real market, and single venue feeds miss the bigger picture. We aggregate 90+ sources into one dependable feed.',
			visual: 'reliable',
			cta: true,
			points: []
		},
		{
			title: 'Official, Parallel and Mid-market Rates.',
			intro:
				'See the CBN official rate next to the parallel market and the mid-market average, all from the same API. Perfect for treasury, compliance and pricing teams.',
			visual: 'markets',
			points: [
				{
					title: 'Every Market Side by Side',
					body: 'Request official, parallel or mid-market rates with one parameter and compare them in your own tools.'
				},
				{
					title: 'Spread and Volatility Built In',
					body: 'Dedicated endpoints for the spread between markets and daily volatility so you do not have to compute it yourself.'
				},
				{
					title: 'History for Every Market',
					body: 'Pull daily history for each market to chart trends, backtest pricing rules or reconcile past transactions.'
				}
			]
		}
	];
</script>

{#each sections as s, i}
	<section class="py-14" style={i % 2 === 0 ? 'background: var(--table-header-bg);' : ''}>
		<div class="container">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
				<div class={i % 2 === 0 ? 'md:order-1' : 'md:order-2'}>
					<ShowcaseVisual variant={s.visual} />
				</div>

				<div class={i % 2 === 0 ? 'md:order-2' : 'md:order-1'}>
					<h2 class="section-title font-head font-extrabold italic mb-4" style="color: var(--text-primary);">{s.title}</h2>

					{#if s.cta}
						<a href="{ACCOUNT_URL}/auth/signup" target="_blank" rel="noopener noreferrer" class="button inline-block font-semibold px-5 py-2.5 text-sm mb-5">
							Get Free API Key
						</a>
					{/if}

					<p class="text-sm leading-relaxed mb-6" style="color: var(--text-secondary);">{s.intro}</p>

					<ul class="flex flex-col gap-5">
						{#each s.points as p}
							<li class="flex gap-3">
								<span class="w-6 h-6 shrink-0 rounded-full flex items-center justify-center mt-0.5" style="background: var(--accent-light);">
									<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
										<path d="M2.5 6l2.5 2.5 4.5-5" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span>
									<span class="font-head block text-sm font-bold mb-1" style="color: var(--text-primary);">{p.title}</span>
									<span class="block text-[13px] leading-relaxed" style="color: var(--text-secondary);">{p.body}</span>
								</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</section>
{/each}

<style>
	.section-title {
		font-size: clamp(1.6rem, 3vw, 2.25rem);
		line-height: 1.15;
	}
</style>
