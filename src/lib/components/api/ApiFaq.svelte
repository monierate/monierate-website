<script lang="ts">
	const items = [
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

	let open: number | null = null;

	function toggle(i: number) {
		open = open === i ? null : i;
	}
</script>

<div>
	<div class="container py-14">
		<h2 class="text-2xl font-bold text-center mb-8">Frequently asked questions</h2>

		<div class="max-w-2xl mx-auto">
			{#each items as item, i}
				<div style="border-bottom: 1px solid var(--card-border);">
					<button
						on:click={() => toggle(i)}
						class="w-full flex items-center justify-between gap-3 py-4 text-left bg-transparent border-none cursor-pointer"
					>
						<span class="font-head text-sm font-medium" style="color: var(--text-primary);">{item.q}</span>
						<svg
							width="15" height="15" viewBox="0 0 15 15" fill="none"
							class="shrink-0 transition-transform duration-200"
							style="transform: rotate({open === i ? 180 : 0}deg); color: var(--text-muted);"
						>
							<path d="M3 5l4.5 4.5L12 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</button>
					{#if open === i}
						<p class="pb-4 text-sm leading-relaxed" style="color: var(--text-secondary);">{item.a}</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
