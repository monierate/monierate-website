<script lang="ts">
	import { ACCOUNT_URL } from '$lib/config';
	import { isNaira, perRequestLabel, type PricingCurrency } from './currency';
	import TrustBadges from './TrustBadges.svelte';

	let { currency }: { currency: PricingCurrency } = $props();

	const ng = $derived(isNaira(currency));

	const highlights = $derived([
		{
			title: 'Simple, Great Value Pricing',
			body: `Your first 100 requests are free, then ${perRequestLabel(currency)} per request. Upgrade to Pro or Max for fixed monthly pricing.`,
			icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'
		},
		{
			title: 'Accurate and Up to Date',
			body: 'Up to date provider rates from 100+ providers across 170+ fiat and crypto currencies, including P2P desks, exchanges and remittance apps.',
			icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3'
		},
		{
			title: 'Trusted Parallel and Midpoint Rates',
			body: 'Parallel and mid-market rates from one API, with daily mid-market history back to 2013.',
			icon: 'M18 20V10M12 20V4M6 20v-6'
		}
	]);

	// Single-quote example from docs.monierate.com/api-reference/rates/latest (response trimmed)
	const sample = $derived(ng ? { quote: 'NGN', rate: '1608.50' } : { quote: 'USD', rate: '1.0004' });
	const url = $derived(`https://api.monierate.com/core/rates/latest.json?base=USDT&quote=${sample.quote}`);

	const tabs = $derived([
		{
			id: 'curl',
			label: 'cURL',
			code: `<span class="p">$</span> curl \\
  <span class="s">"${url}"</span> \\
  -H <span class="s">"api_key: YOUR_API_KEY"</span>`
		},
		{
			id: 'js',
			label: 'JavaScript',
			code: `<span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(
  <span class="s">"${url}"</span>,
  { headers: { api_key: <span class="s">"YOUR_API_KEY"</span> } }
);
<span class="kw">const</span> { data } = <span class="kw">await</span> res.<span class="fn">json</span>();`
		},
		{
			id: 'python',
			label: 'Python',
			code: `<span class="kw">import</span> requests

res = requests.<span class="fn">get</span>(
  <span class="s">"${url}"</span>,
  headers={<span class="s">"api_key"</span>: <span class="s">"YOUR_API_KEY"</span>},
)
data = res.<span class="fn">json</span>()[<span class="s">"data"</span>]`
		}
	]);

	let active = $state('curl');
	const activeTab = $derived(tabs.find((t) => t.id === active) ?? tabs[0]);
</script>

<section class="container pt-16 md:pt-24 pb-16">
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
		<div>
			<h1 class="hero-title font-head font-extrabold leading-[1.05] mb-5" style="color: var(--text-primary);">
				Exchange Rate API<br />
				<span style="color: var(--accent);">FAST</span>
				<span class="hero-sub font-bold" style="color: var(--text-primary);">
					(from only {perRequestLabel(currency)}/request)
				</span>
			</h1>

			<p class="text-[17px] leading-relaxed mb-8 max-w-xl" style="color: var(--text-secondary);">
				Secure JSON API with up to date provider rates for
				<strong style="color: var(--text-primary);">170+ fiat and crypto currencies</strong>, including trusted parallel
				and midpoint{ng ? ' Naira' : ''} rates. One API, 100+ providers.
			</p>

			<ul class="flex flex-col gap-5 mb-9">
				{#each highlights as h}
					<li class="flex gap-3.5">
						<span class="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center" style="background: var(--accent-light);">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d={h.icon} />
							</svg>
						</span>
						<span>
							<span class="font-head block text-base font-semibold mb-0.5" style="color: var(--text-primary);">{h.title}</span>
							<span class="block text-[15px] leading-relaxed" style="color: var(--text-secondary);">{h.body}</span>
						</span>
					</li>
				{/each}
			</ul>

			<a
				href="{ACCOUNT_URL}/auth/signup"
				target="_blank"
				rel="noopener noreferrer"
				class="button inline-block font-semibold px-6 py-3 text-base"
			>
				Get Free API Key
			</a>
			<TrustBadges />
		</div>

		<!-- Code panel -->
		<div class="editor">
			<div class="editor-bar">
				<div class="tabs" role="tablist" aria-label="Code example language">
					{#each tabs as t}
						<button
							type="button"
							role="tab"
							aria-selected={active === t.id}
							class="tab"
							class:on={active === t.id}
							onclick={() => (active = t.id)}
						>
							{t.label}
						</button>
					{/each}
				</div>
				<span class="status"><span class="dot"></span>200 OK</span>
			</div>

			<pre class="code"><code>{@html activeTab.code}</code></pre>

			<div class="divider"><span>Response</span></div>

			<pre class="code"><code>{'{'}
  <span class="k">"status"</span>: <span class="s">"success"</span>,
  <span class="k">"data"</span>: {'{'}
    <span class="k">"base"</span>: <span class="s">"USDT"</span>,
    <span class="k">"market"</span>: <span class="s">"mid"</span>,
    <span class="k">"rates"</span>: <span class="n">{sample.rate}</span>
  {'}'}
{'}'}</code></pre>
		</div>
	</div>
</section>

<style>
	.hero-title {
		font-size: clamp(2.5rem, 5vw, 3.75rem);
		letter-spacing: -0.03em;
	}
	.hero-sub {
		font-size: clamp(1.05rem, 2vw, 1.4rem);
		font-family: var(--font-head);
		letter-spacing: -0.01em;
	}

	.editor {
		min-width: 0;
		border-radius: 16px;
		overflow: hidden;
		background: #0b1020;
		border: 1px solid #1e2640;
		box-shadow:
			0 0 0 1px rgba(56, 97, 251, 0.08),
			0 24px 64px -12px rgba(15, 23, 42, 0.35);
	}
	.editor-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 0 14px;
		background: #0e1428;
		border-bottom: 1px solid #1e2640;
	}
	.tabs {
		display: flex;
		gap: 2px;
		overflow-x: auto;
	}
	.tab {
		font-family: var(--font-mono);
		font-size: 12.5px;
		font-weight: 500;
		color: #8b95b0;
		padding: 12px 12px 11px;
		border-bottom: 2px solid transparent;
		background: none;
		white-space: nowrap;
		cursor: pointer;
		transition: color 0.15s ease;
	}
	.tab:hover {
		color: #e2e8f0;
	}
	.tab.on {
		color: #ffffff;
		border-bottom-color: var(--accent);
	}
	.status {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-mono);
		font-size: 11.5px;
		font-weight: 600;
		color: #4ade80;
		white-space: nowrap;
	}
	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #4ade80;
	}
	.code {
		margin: 0;
		padding: 16px 18px;
		font-family: var(--font-mono);
		font-size: 12.5px;
		line-height: 1.7;
		color: #cbd5e1;
		/* wrap long URLs instead of scrolling sideways */
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	/* the site sets a body font on every span; keep the code monospaced */
	.code :global(span) { font-family: inherit; }
	.divider {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 18px;
		font-family: var(--font-mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #5b6788;
	}
	.divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: #1e2640;
	}
	.code :global(.k) { color: #93c5fd; }
	.code :global(.s) { color: #86efac; }
	.code :global(.n) { color: #fcd34d; }
	.code :global(.kw) { color: #c4b5fd; }
	.code :global(.fn) { color: #67e8f9; }
	.code :global(.p) { color: #5b6788; }
</style>
