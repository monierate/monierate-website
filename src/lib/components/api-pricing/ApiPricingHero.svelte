<script lang="ts">
	import { ACCOUNT_URL } from '$lib/config';

	let { fromPrice = null }: { fromPrice?: number | null } = $props();

	const highlights = [
		{
			title: 'Simple, Great Value Pricing',
			body: 'Start free with $10 credit. Flat monthly plans when you need volume.',
			icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'
		},
		{
			title: 'Accurate and Up to Date',
			body: 'Live NGN rates from 90+ providers including P2P desks, exchanges and remittance apps.',
			icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3'
		},
		{
			title: 'Stablecoin, Official and Parallel Rates',
			body: 'USDT, USDC, USD, GBP and EUR against the Naira, plus years of history.',
			icon: 'M18 20V10M12 20V4M6 20v-6'
		}
	];

	const request = `GET /v1/rates/current?pair=USDT/NGN`;
</script>

<section class="container pt-10 pb-16">
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
		<div>
			<h1 class="hero-title font-head font-extrabold italic leading-[1.05] mb-4" style="color: var(--text-primary);">
				Exchange Rate API<br />
				<span style="color: var(--accent);">FAST</span>
				<span class="hero-sub not-italic font-bold" style="color: var(--text-primary);">
					(from only {fromPrice ? `$${fromPrice}/month` : 'free'})
				</span>
			</h1>

			<p class="text-[15px] leading-relaxed mb-7 max-w-lg" style="color: var(--text-secondary);">
				Real-time, secure JSON API for <strong style="color: var(--text-primary);">Naira exchange rates</strong>
				across stablecoins, fiat and parallel markets. One endpoint, every provider we track.
			</p>

			<ul class="flex flex-col gap-4 mb-8">
				{#each highlights as h}
					<li class="flex gap-3">
						<span class="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center" style="background: var(--accent-light);">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d={h.icon} />
							</svg>
						</span>
						<span>
							<span class="font-head block text-sm font-semibold" style="color: var(--accent);">{h.title}</span>
							<span class="block text-[13px] leading-relaxed" style="color: var(--text-secondary);">{h.body}</span>
						</span>
					</li>
				{/each}
			</ul>

			<a
				href="{ACCOUNT_URL}/auth/signup"
				target="_blank"
				rel="noopener noreferrer"
				class="button inline-block font-semibold px-6 py-3 text-sm"
			>
				Get Free API Key
			</a>
			<p class="text-[11px] mt-2" style="color: var(--text-muted);">No credit card required. Cancel anytime.</p>
		</div>

		<!-- Terminal -->
		<div class="terminal">
			<div class="term-bar">
				<span class="flex gap-1.5">
					<span class="dot" style="background:#ff5f57"></span>
					<span class="dot" style="background:#febc2e"></span>
					<span class="dot" style="background:#28c840"></span>
				</span>
				<span class="term-title">api.monierate.com</span>
				<span class="term-live"><span class="pulse"></span>Live</span>
			</div>

			<div class="term-request">
				<span class="method">GET</span>
				<span class="url">{request.replace('GET ', '')}</span>
				<span class="send">Send</span>
			</div>

			<pre class="term-body"><code><span class="c">$ curl https://api.monierate.com/v1/rates/current?pair=USDT/NGN \
    -H "Authorization: Bearer YOUR_API_KEY"</span>

{'{'}
  <span class="k">"status"</span>: <span class="s">"success"</span>,
  <span class="k">"base"</span>: <span class="s">"USDT"</span>,
  <span class="k">"quote"</span>: <span class="s">"NGN"</span>,
  <span class="k">"results"</span>: {'{'}
    <span class="k">"binance_p2p"</span>: <span class="n">1613.00</span>,
    <span class="k">"bybit"</span>: <span class="n">1611.40</span>,
    <span class="k">"quidax"</span>: <span class="n">1609.00</span>,
    <span class="k">"luno"</span>: <span class="n">1607.25</span>
  {'}'},
  <span class="k">"updated_at"</span>: <span class="s">"2026-10-09T10:42:00Z"</span>,
  <span class="k">"ms"</span>: <span class="n">4</span>
{'}'}</code></pre>
		</div>
	</div>
</section>

<style>
	.hero-title {
		font-size: clamp(2.25rem, 5vw, 3.5rem);
	}
	.hero-sub {
		font-size: clamp(1rem, 2vw, 1.35rem);
		font-family: var(--font-head);
	}

	.terminal {
		background: #0d0d0d;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(56, 97, 251, 0.18), 0 4px 16px rgba(0, 0, 0, 0.3);
		min-width: 0;
	}
	.term-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		height: 40px;
		padding: 0 14px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}
	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}
	.term-title {
		font-size: 12px;
		color: #6e7681;
		font-family: 'JetBrains Mono', 'Consolas', monospace;
	}
	.term-live {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
		font-weight: 600;
		color: #4ade80;
	}
	.pulse {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #4ade80;
		box-shadow: 0 0 6px #4ade80;
		animation: pulse 2s ease-in-out infinite;
	}
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.45; }
	}
	.term-request {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 14px 14px 0;
		padding: 8px 10px;
		border-radius: 8px;
		background: #161b22;
		border: 1px solid #21262d;
		font-family: 'JetBrains Mono', 'Consolas', monospace;
		font-size: 12px;
	}
	.method {
		color: #7ee787;
		font-weight: 700;
	}
	.url {
		color: #c9d1d9;
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.send {
		background: var(--accent);
		color: #fff;
		font-weight: 600;
		padding: 3px 10px;
		border-radius: 6px;
		font-size: 11px;
	}
	.term-body {
		margin: 0;
		padding: 16px 20px 20px;
		font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
		font-size: 12px;
		line-height: 1.75;
		color: #d1d5db;
		overflow-x: auto;
		white-space: pre;
	}
	.c { color: #6e7681; }
	.k { color: #79c0ff; }
	.s { color: #a5d6ff; }
	.n { color: #d19a66; }
</style>
