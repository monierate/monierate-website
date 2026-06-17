<script lang="ts">
	export let data: any;

	let activeTab: 'curl' | 'js' = 'curl';
	let copied = false;
	let openFaq: number | null = null;

	const curlExample = `curl -X GET "https://api.monierate.com/v1/rates?from=USDT&to=NGN" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Accept: application/json"`;

	const jsExample = `const res = await fetch(
  "https://api.monierate.com/v1/rates?from=USDT&to=NGN",
  { headers: { Authorization: "Bearer YOUR_API_KEY" } }
);
const data = await res.json();`;

	$: activeCode = activeTab === 'curl' ? curlExample : jsExample;

	function copyCode() {
		navigator.clipboard.writeText(activeCode).then(() => {
			copied = true;
			setTimeout(() => (copied = false), 2000);
		});
	}

	function toggleFaq(i: number) {
		openFaq = openFaq === i ? null : i;
	}

	const faqItems = [
		{
			q: 'What currencies and markets are supported?',
			a: 'Official, mid-market, and black market NGN rates from 40+ providers — Binance P2P, Bybit, Luno, Quidax, Chipper Cash, and more. Stablecoins (USDT, USDC) and fiat (USD, EUR, GBP) included.'
		},
		{
			q: 'How do I authenticate?',
			a: 'All requests use a Bearer token in the Authorization header. Your API key is available immediately after creating a free account — no credit card required.'
		},
		{
			q: 'What are the rate limits?',
			a: 'Free (PAYG): unlimited requests billed at $0.01 each. Pro: 10,000 req/month, 10 req/min, included in the flat fee. Max: 100,000 req/month, 50 req/min.'
		},
		{
			q: 'Is there a free tier?',
			a: 'Yes. Every new account starts with a $10 wallet credit — no card needed. The dashboard is free forever. You only pay when you make API calls, export data, or execute offramp trades.'
		},
		{
			q: 'How does billing work?',
			a: 'Free users are charged per action from their wallet. Pro and Max are flat monthly subscriptions with no per-request fees. Accepted in USD or NGN.'
		},
		{
			q: 'Can I pay in NGN?',
			a: 'Yes. Wallet top-ups and plan subscriptions can be settled in either NGN or USD.'
		}
	];

	const plans = [
		{
			label: 'START FREE',
			name: 'Free – PAYG',
			tagline: 'Only pay when you act',
			price: '$0',
			period: 'no monthly fee',
			cta: 'Get Started Free',
			ctaHref: 'https://account.monierate.com/auth/signup',
			highlighted: false,
			note: 'Deduct from wallet',
			features: [
				{ label: 'Market Insight', value: 'View only', accent: false },
				{ label: 'Analytics Dashboard', value: 'View only', accent: false },
				{ label: 'Historical data exports', value: '$1 / yr', accent: false },
				{ label: 'Offramp payments', value: '$0.08 fee', accent: false },
				{ label: 'Currency rates API', value: '$0.01 / req', accent: false },
				{ label: 'API requests / month', value: 'Unlimited', accent: true }
			]
		},
		{
			label: 'PROFESSIONAL',
			name: 'Pro',
			tagline: 'Unlimited access. Predictable cost.',
			price: '$47',
			period: '/ month',
			cta: 'Start Pro',
			ctaHref: 'https://account.monierate.com/auth/signup',
			highlighted: true,
			note: 'Deduct from wallet',
			features: [
				{ label: 'Market Insight', value: 'Full Access', accent: true },
				{ label: 'Analytics Dashboard', value: 'Full Access', accent: true },
				{ label: 'Historical data exports', value: 'Unlimited', accent: true },
				{ label: 'Offramp payments', value: '$0.05 fee', accent: false },
				{ label: 'Currency rates API', value: '10,000 req / mo', accent: false },
				{ label: 'Rate limit', value: '10 req / min', accent: false }
			]
		},
		{
			label: 'ENTERPRISE',
			name: 'Max',
			tagline: 'Pro, but 20× the scale.',
			price: '$147',
			period: '/ month',
			cta: 'Start Max',
			ctaHref: 'https://account.monierate.com/auth/signup',
			highlighted: false,
			note: null,
			features: [
				{ label: 'Market Insight', value: 'Full Access', accent: true },
				{ label: 'Analytics Dashboard', value: 'Full Access', accent: true },
				{ label: 'Historical data exports', value: 'Unlimited', accent: true },
				{ label: 'Offramp payments', value: '$0.01 fee', accent: false },
				{ label: 'Currency rates API', value: '100,000 req / mo', accent: false },
				{ label: 'Rate limit', value: '50 req / min', accent: false }
			]
		}
	];

	const valueProps = [
		{
			title: 'Real-time rates, 40+ providers',
			body: 'Live NGN rates from Binance P2P, Bybit, Luno, Quidax, and dozens more — updated continuously.',
			icon: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z'
		},
		{
			title: 'Historical data exports',
			body: 'Pull years of rate history via API or download as CSV — for backtesting, compliance, and reporting.',
			icon: 'M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z'
		},
		{
			title: 'Offramp execution',
			body: 'Execute stablecoin-to-NGN offramp trades directly through the API. No manual steps.',
			icon: 'M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4'
		},
		{
			title: 'Multiple rate markets',
			body: 'Official, mid-market, and parallel market rates — all from a single endpoint.',
			icon: 'M18 20V10M12 20V4M6 20v-6'
		},
		{
			title: 'Simple REST API',
			body: 'Standard JSON, predictable pagination, and full docs on Apidog. First call in minutes.',
			icon: 'M16 18 22 12 16 6M8 6 2 12 8 18'
		},
		{
			title: 'Dashboard included free',
			body: 'Market Insight and Analytics Dashboard access is free on every plan, always.',
			icon: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z'
		}
	];

	const jsonResponse = `{
  "status": "success",
  "data": [
    {
      "changer": "binance",
      "pair": "USDT/NGN",
      "price_buy": 1613.00,
      "price_sell": 1608.50,
      "source": "p2p",
      "updated_at": "2025-06-17T10:42:00Z"
    },
    {
      "changer": "quidax",
      "pair": "USDT/NGN",
      "price_buy": 1609.00,
      "price_sell": 1604.00,
      "source": "spot",
      "updated_at": "2025-06-17T10:41:37Z"
    }
  ]
}`;
</script>

<svelte:head>
	<title>Monierate Currency Rates API – Real-time NGN Exchange Rates</title>
	<meta
		name="description"
		content="Integrate real-time NGN stablecoin exchange rates, historical data, and offramp execution into your app. Simple REST API, 40+ providers, free to start."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Monierate Currency Rates API" />
	<meta
		property="og:description"
		content="Real-time NGN exchange rates from 40+ providers. Historical data, offramp execution, analytics dashboard. Free to start."
	/>
	<meta property="og:url" content="https://monierate.com/api" />
	<meta property="og:image" content="https://monierate.com/monierate-og-image.png" />
</svelte:head>

<!-- ── HERO ── -->
<div class="container mt-10 mb-16">
	<div class="text-center">
		<span class="inline-block text-xs font-semibold tracking-widest uppercase mb-5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500">
			Currency Rates API
		</span>

		<h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight text-gray-900 dark:text-gray-100">
			Real-time NGN exchange rates.<br class="hidden md:block" />
			<span class="text-blue-600 dark:text-blue-400">One API.</span>
		</h1>

		<p class="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
			Live rates, historical data, and offramp execution across 40+ providers — Binance P2P, Luno,
			Quidax, and more.
		</p>

		<div class="flex flex-col sm:flex-row gap-3 justify-center mb-10">
			<a
				href="https://account.monierate.com/auth/signup"
				target="_blank"
				rel="noopener noreferrer"
				class="button bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 text-sm"
			>
				Get API Key Free
			</a>
			<a
				href="https://cal.com/monierate/activation-call"
				target="_blank"
				rel="noopener noreferrer"
				class="button bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 font-semibold px-6 py-2.5 text-sm"
			>
				Talk to Sales
			</a>
		</div>

		<div class="flex flex-wrap justify-center gap-x-6 gap-y-2">
			{#each ['$10 free credit on signup', 'No credit card required', 'Dashboard free always', '40+ providers tracked live'] as t}
				<span class="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
					<svg width="13" height="13" viewBox="0 0 13 13" fill="none">
						<circle cx="6.5" cy="6.5" r="6.5" fill="#22c55e" fill-opacity="0.15" />
						<path d="M3.5 6.5l2 2 4-4" stroke="#22c55e" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
					{t}
				</span>
			{/each}
		</div>
	</div>
</div>

<!-- ── API IN ACTION ── -->
<div class="container mb-16">
	<div class="text-center mb-8">
		<h2 class="text-2xl font-bold mb-2">See it in action</h2>
		<p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
			One request returns live rates across every provider we track.
		</p>
	</div>

	<div class="grid md:grid-cols-2 gap-3 max-w-4xl mx-auto">
		<!-- Request -->
		<div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
			<div class="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
				<div class="flex gap-1">
					<button
						on:click={() => (activeTab = 'curl')}
						class="px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer border-none"
						class:bg-white={activeTab === 'curl'}
						class:dark:bg-gray-700={activeTab === 'curl'}
						class:text-gray-900={activeTab === 'curl'}
						class:dark:text-white={activeTab === 'curl'}
						class:text-gray-400={activeTab !== 'curl'}
						class:bg-transparent={activeTab !== 'curl'}
					>cURL</button>
					<button
						on:click={() => (activeTab = 'js')}
						class="px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer border-none"
						class:bg-white={activeTab === 'js'}
						class:dark:bg-gray-700={activeTab === 'js'}
						class:text-gray-900={activeTab === 'js'}
						class:dark:text-white={activeTab === 'js'}
						class:text-gray-400={activeTab !== 'js'}
						class:bg-transparent={activeTab !== 'js'}
					>JavaScript</button>
				</div>
				<button on:click={copyCode} class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border-none bg-transparent cursor-pointer transition-colors">
					{#if copied}
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 6l3 3 6-6" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
						Copied
					{:else}
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="3.5" width="7.5" height="7.5" rx="1.2" stroke="currentColor" stroke-width="1.2" /><path d="M3.5 1h6.5a1 1 0 011 1v6.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" /></svg>
						Copy
					{/if}
				</button>
			</div>
			<pre class="code-pre p-5 text-xs leading-relaxed overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-300 m-0">{activeCode}</pre>
		</div>

		<!-- Response -->
		<div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
			<div class="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
				<span class="inline-flex items-center gap-1.5 text-xs font-semibold text-green-500">
					<span class="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
					200 OK
				</span>
				<span class="text-xs text-gray-400">application/json</span>
			</div>
			<pre class="code-pre p-5 text-xs leading-relaxed overflow-x-auto bg-gray-900 dark:bg-gray-950 text-gray-300 m-0">{jsonResponse}</pre>
		</div>
	</div>

	<div class="text-center mt-5">
		<a href="https://monierate.apidog.io" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
			View full API documentation →
		</a>
	</div>
</div>

<!-- ── WHAT YOU GET ── -->
<div class="border-t border-gray-100 dark:border-gray-700">
	<div class="container py-14">
		<div class="text-center mb-8">
			<h2 class="text-2xl font-bold mb-2">What you get</h2>
			<p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
				Everything you need to build FX-aware apps on Nigerian markets.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
			{#each valueProps as prop}
				<div class="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-5">
					<div class="w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-blue-500/10">
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3662ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d={prop.icon} />
						</svg>
					</div>
					<div class="text-[13px] font-semibold text-gray-900 dark:text-gray-100 mb-1">{prop.title}</div>
					<div class="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed">{prop.body}</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- ── PRICING ── -->
<div class="border-t border-gray-100 dark:border-gray-700" id="pricing">
	<div class="container py-14">
		<div class="text-center mb-8">
			<h2 class="text-2xl font-bold mb-2">Simple, transparent pricing</h2>
			<p class="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
				Dashboard is free for everyone. Only pay when you make API calls, export data, or execute trades. Pro and Max remove all per-action fees.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
			{#each plans as plan}
				<div
					class="rounded-xl border flex flex-col overflow-hidden bg-white dark:bg-gray-800"
					style="border-color: {plan.highlighted ? '#3662ff' : ''}; border-width: {plan.highlighted ? '1.5px' : '1px'};"
					class:border-gray-200={!plan.highlighted}
					class:dark:border-gray-700={!plan.highlighted}
				>
					{#if plan.highlighted}
						<div class="text-center text-[10px] font-bold py-1.5 tracking-widest text-white bg-blue-600">
							POPULAR
						</div>
					{/if}

					<div class="p-5 flex flex-col flex-1">
						<!-- Header -->
						<div class="mb-4">
							<div class="text-[11px] font-semibold tracking-widest text-gray-400 dark:text-gray-500 mb-1">{plan.label}</div>
							<div class="text-[17px] font-bold text-gray-900 dark:text-gray-100 mb-0.5">{plan.name}</div>
							<div class="text-[12px] font-medium text-blue-500">{plan.tagline}</div>
						</div>

						<!-- Price -->
						<div class="mb-5">
							<span class="price-num text-[30px] font-bold text-gray-900 dark:text-gray-100">{plan.price}</span>
							<span class="text-[12px] text-gray-400 ml-1">{plan.period}</span>
						</div>

						<!-- Features -->
						<ul class="flex flex-col gap-2.5 mb-5 flex-1">
							{#each plan.features as f}
								<li class="flex items-center justify-between gap-2">
									<span class="text-[12px] text-gray-500 dark:text-gray-400">{f.label}</span>
									<span
										class="text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0"
										class:text-blue-600={f.accent}
										class:dark:text-blue-400={f.accent}
										class:bg-blue-500={f.accent}
										class:bg-opacity-10={f.accent}
										class:text-gray-500={!f.accent}
										class:dark:text-gray-400={!f.accent}
										class:bg-gray-100={!f.accent}
										class:dark:bg-gray-700={!f.accent}
									>{f.value}</span>
								</li>
							{/each}
						</ul>

						<!-- CTA -->
						<a
							href={plan.ctaHref}
							target="_blank"
							rel="noopener noreferrer"
							class="block w-full text-center py-2 rounded-lg text-[12px] font-semibold transition-all"
							class:bg-blue-600={plan.highlighted}
							class:hover:bg-blue-700={plan.highlighted}
							class:text-white={plan.highlighted}
							class:border={!plan.highlighted}
							class:border-gray-200={!plan.highlighted}
							class:dark:border-gray-600={!plan.highlighted}
							class:text-gray-700={!plan.highlighted}
							class:dark:text-gray-300={!plan.highlighted}
							class:hover:border-blue-500={!plan.highlighted}
							class:hover:text-blue-600={!plan.highlighted}
						>
							{plan.cta}
						</a>

						{#if plan.note}
							<div class="text-[11px] text-center text-gray-400 dark:text-gray-500 mt-2">{plan.note}</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<p class="text-center text-[12px] text-gray-400 dark:text-gray-500 mt-6">
			Need higher volume, WebSockets, or custom data feeds?
			<a href="https://cal.com/monierate/activation-call" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">Talk to us</a>.
			Full comparison at <a href="/pricing" class="text-blue-500 hover:underline">/pricing</a>.
		</p>
	</div>
</div>

<!-- ── FAQ ── -->
<div class="border-t border-gray-100 dark:border-gray-700">
	<div class="container py-14">
		<h2 class="text-2xl font-bold text-center mb-8">Frequently asked questions</h2>

		<div class="max-w-2xl mx-auto">
			{#each faqItems as item, i}
				<div class="border-b border-gray-100 dark:border-gray-700">
					<button
						on:click={() => toggleFaq(i)}
						class="w-full flex items-center justify-between gap-3 py-4 text-left bg-transparent border-none cursor-pointer"
					>
						<span class="text-sm font-medium text-gray-800 dark:text-gray-200">{item.q}</span>
						<svg
							width="15" height="15" viewBox="0 0 15 15" fill="none"
							class="shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-200"
							style="transform: rotate({openFaq === i ? 180 : 0}deg);"
						>
							<path d="M3 5l4.5 4.5L12 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</button>
					{#if openFaq === i}
						<p class="pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.a}</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- ── BOTTOM CTA ── -->
<div class="border-t border-gray-100 dark:border-gray-700">
	<div class="container py-14 text-center">
		<h2 class="text-2xl font-bold mb-3">Ready to integrate?</h2>
		<p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-7 leading-relaxed">
			Create a free account and get your API key in minutes. $10 credit included, no card required.
		</p>

		<div class="flex flex-col sm:flex-row gap-3 justify-center mb-8">
			<a
				href="https://account.monierate.com/auth/signup"
				target="_blank"
				rel="noopener noreferrer"
				class="button bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 text-sm"
			>
				Create Free Account
			</a>
			<a
				href="https://monierate.apidog.io"
				target="_blank"
				rel="noopener noreferrer"
				class="button bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold px-6 py-2.5 text-sm"
			>
				Read the Docs
			</a>
		</div>

		<div class="flex flex-wrap items-center justify-center gap-4">
			<a href="https://cal.com/monierate/activation-call" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
				<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
					<rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
				</svg>
				Book a call
			</a>
			<span class="text-gray-200 dark:text-gray-700">|</span>
			<a href="mailto:sales@monierate.com" class="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
				<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
					<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
				</svg>
				sales@monierate.com
			</a>
		</div>
	</div>
</div>

<style>
	.code-pre {
		font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
		white-space: pre;
	}

	.price-num {
		font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
	}
</style>
