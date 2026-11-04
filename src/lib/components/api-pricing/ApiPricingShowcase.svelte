<script lang="ts">
	import { ACCOUNT_URL } from '$lib/config';
	import ShowcaseVisual from './ShowcaseVisual.svelte';
	import { isNaira, type PricingCurrency } from './currency';

	let { currency }: { currency: PricingCurrency } = $props();

	const ng = $derived(isNaira(currency));

	type Point = { title: string; body: string };
	type Section = {
		title: string;
		intro: string;
		visual: 'speed' | 'developer' | 'mcp' | 'stablecoin' | 'reliable' | 'markets';
		points: Point[];
		cta?: boolean;
	};

	const sections: Section[] = $derived([
		{
			title: 'Currency API is fast.',
			intro:
				'Slow responses are a drag. They slow down your checkout, your dashboards and your users. Our responses are served from cache close to your servers, so rates arrive in milliseconds.',
			visual: 'speed',
			points: [
				{
					title: 'Secure by Default',
					body: 'Every request is served over HTTPS and authenticated with a private API key, sent in the api_key header, that you can rotate at any time.'
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
			title: 'Built for AI agents, with MCP.',
			intro:
				'Monierate runs a remote MCP server, so Claude, ChatGPT, Cursor and other AI assistants can read our rates for you. Connect once, then ask in plain language.',
			visual: 'mcp',
			points: [
				{
					title: 'Connect in One Step',
					body: 'Add https://mcp.monierate.xyz/mcp as a connector and sign in. Clients that cannot sign in can use your API key instead.'
				},
				{
					title: 'Same Rates, Same Billing',
					body: 'Agents get the same up to date provider rates as the API, labelled by market, billed to your plan or wallet like any other call.'
				},
				{
					title: 'Read Only by Design',
					body: 'The connector can only read rates. It cannot see your account details or API keys, and it cannot move money.'
				}
			]
		},
		{
			title: 'Stablecoin rates included.',
			intro:
				`Get up to date USDT and USDC ${ng ? 'to Naira ' : ''}pricing from P2P desks, spot exchanges and OTC apps. We combine buy and sell quotes so you always see the true market.`,
			visual: 'stablecoin',
			points: [
				{
					title: 'Up to Date Stablecoin Rates',
					body: 'Buy and sell prices for every venue we track, kept up to date and returned in a single response.'
				},
				{
					title: 'Exchange Rates for Any Pair We Cover',
					body: ng
						? 'Convert between stablecoins, Naira and 170+ currencies including USD, GBP, EUR and CAD.'
						: 'Convert between stablecoins, USD and 170+ currencies including EUR, GBP, CAD and JPY.'
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
				`Finding a good exchange rate API for ${ng ? 'Nigerian' : 'emerging'} markets is hard. Official feeds lag the real market, and single venue feeds miss the bigger picture. We aggregate 100+ sources across 170+ currencies into one dependable feed.`,
			visual: 'reliable',
			cta: true,
			points: []
		},
		{
			title: 'Trusted parallel and midpoint rates.',
			intro:
				`Compare the parallel market with the mid-market rate and the ${ng ? 'CBN' : 'central bank'} official rate. Perfect for treasury, compliance and pricing teams.`,
			visual: 'markets',
			points: [
				{
					title: 'Every Market Side by Side',
					body: 'Request parallel or mid-market rates with one parameter, or fill gaps in one market from the other.'
				},
				{
					title: 'Spread and Volatility Built In',
					body: 'Dedicated endpoints for per-provider spread analysis and volatility, so you do not have to compute them yourself.'
				},
				{
					title: 'OHLC Down to 10 Minutes',
					body: 'Open, high, low and close candles in intervals as short as 10 minutes for charts and backtests.'
				},
				{
					title: 'History for Every Market',
					body: 'Pull daily history for each market to chart trends, backtest pricing rules or reconcile past transactions.'
				}
			]
		}
	]);
</script>

{#each sections as s, i}
	<section class="py-14" style={i % 2 === 0 ? 'background: var(--table-header-bg);' : ''}>
		<div class="container">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
				<div class={i % 2 === 0 ? 'md:order-1' : 'md:order-2'}>
					<ShowcaseVisual variant={s.visual} {ng} />
				</div>

				<div class={i % 2 === 0 ? 'md:order-2' : 'md:order-1'}>
					<h2 class="section-title font-head font-extrabold mb-4" style="color: var(--text-primary);">{s.title}</h2>

					{#if s.cta}
						<a href="{ACCOUNT_URL}/auth/signup" target="_blank" rel="noopener noreferrer" class="button inline-block font-semibold px-6 py-3 text-base mb-6">
							Get Free API Key
						</a>
					{/if}

					<p class="text-[17px] leading-relaxed mb-7" style="color: var(--text-secondary);">{s.intro}</p>

					<ul class="flex flex-col gap-5">
						{#each s.points as p}
							<li class="flex gap-3">
								<span class="w-6 h-6 shrink-0 rounded-full flex items-center justify-center mt-0.5" style="background: var(--accent-light);">
									<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
										<path d="M2.5 6l2.5 2.5 4.5-5" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span>
									<span class="font-head block text-base font-bold mb-1" style="color: var(--text-primary);">{p.title}</span>
									<span class="block text-[15px] leading-relaxed" style="color: var(--text-secondary);">{p.body}</span>
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
