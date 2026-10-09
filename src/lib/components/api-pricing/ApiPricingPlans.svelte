<script lang="ts">
	import { formatNumber } from '$lib/functions';
	import { ACCOUNT_URL, BOOKING_URL } from '$lib/config';

	let { plans = [] }: { plans?: any[] } = $props();

	const PAYG_PER_REQUEST = 0.01;
	const steps = [1_000, 5_000, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000];

	let stepIndex = $state(2);
	let billing = $state<'monthly' | 'yearly'>('monthly');

	const copy: Record<string, { tagline: string; cta: string; features: string[] }> = {
		free: {
			tagline: 'Only pay when you call the API.',
			cta: 'Get Started Free',
			features: [
				'$10 free credit on signup',
				'$0.01 per API request',
				'No monthly request cap',
				'Market Insight, view only',
				'Analytics Dashboard, view only',
				'Data exports from $1 per year of history',
				'Offramp at $0.08 per trade'
			]
		},
		pro: {
			tagline: 'Unlimited access. Predictable cost.',
			cta: 'Start Pro',
			features: [
				'No per-request fees',
				'Full Market Insight access',
				'Full Analytics Dashboard access',
				'Unlimited data exports',
				'Offramp at $0.05 per trade',
				'Email support'
			]
		},
		max: {
			tagline: 'Pro, at production scale.',
			cta: 'Start Max',
			features: [
				'Everything in Pro',
				'Higher monthly request volume',
				'Higher per-minute throughput',
				'Offramp at $0.01 per trade',
				'Priority support'
			]
		}
	};

	const apiPlans = $derived(
		(plans || []).filter((p) => ['free', 'pro', 'max'].includes(p.code)).sort((a, b) => a.price_usd - b.price_usd)
	);

	const volume = $derived(steps[stepIndex]);

	function monthlyCost(plan: any): number {
		if (plan.billing_model === 'usage') return volume * PAYG_PER_REQUEST;
		if (volume > plan.requests_limit_per_month) return Infinity;
		return billing === 'yearly' && plan.prices_by_cycle?.yearly?.usd
			? plan.prices_by_cycle.yearly.usd / 12
			: plan.price_usd;
	}

	const bestCode = $derived.by(() => {
		let best: any = null;
		let bestCost = Infinity;
		for (const p of apiPlans) {
			const c = monthlyCost(p);
			if (c < bestCost) {
				best = p;
				bestCost = c;
			}
		}
		return best?.code ?? null;
	});

	const savePct = $derived.by(() => {
		const paid = apiPlans.find((p) => p.billing_model === 'flat' && p.prices_by_cycle?.yearly?.usd);
		if (!paid) return 0;
		return Math.round(((paid.price_usd - paid.prices_by_cycle.yearly.usd / 12) / paid.price_usd) * 100);
	});

	function displayPrice(plan: any): string {
		if (plan.billing_model === 'usage') return '$0';
		const v = billing === 'yearly' && plan.prices_by_cycle?.yearly?.usd ? plan.prices_by_cycle.yearly.usd / 12 : plan.price_usd;
		return `$${Math.round(v)}`;
	}

	function limitLines(plan: any): string[] {
		if (plan.billing_model === 'usage') return ['Unlimited requests, billed per call'];
		return [
			`${formatNumber(plan.requests_limit_per_month)} requests / month`,
			`${plan.requests_limit_per_minute} requests / minute`
		];
	}

	function fmtMoney(n: number): string {
		return `$${n.toLocaleString(undefined, { maximumFractionDigits: n < 100 ? 2 : 0 })}`;
	}
</script>

<section id="pricing" class="py-16" style="background: var(--table-header-bg); border-top: 1px solid var(--card-border);">
	<div class="container">
		<div class="text-center mb-10">
			<h2 class="section-title font-head font-extrabold italic mb-3" style="color: var(--text-primary);">
				Best Value Exchange Rate API
			</h2>
			<p class="text-sm max-w-2xl mx-auto leading-relaxed" style="color: var(--text-secondary);">
				All accounts get live rates from 90+ providers and the full dashboard.
				<a href="{ACCOUNT_URL}/auth/signup" target="_blank" rel="noopener noreferrer" class="font-semibold hover:underline" style="color: var(--accent);">Get a free API key</a>
				with $10 of credit and pay per request, or switch to a flat plan when your volume grows.
			</p>
		</div>

		<!-- Controls -->
		<div class="card rounded-2xl p-5 mb-6 max-w-6xl mx-auto flex flex-col md:flex-row md:items-center gap-5">
			<div class="flex-1 min-w-0">
				<label for="req-slider" class="font-head block text-sm font-semibold mb-3" style="color: var(--text-primary);">
					I want <span style="color: var(--accent);">{formatNumber(volume)}</span> requests / month
				</label>
				<input
					id="req-slider"
					type="range"
					min="0"
					max={steps.length - 1}
					step="1"
					bind:value={stepIndex}
					class="slider w-full"
					style="--pct: {(stepIndex / (steps.length - 1)) * 100}%"
				/>
				<div class="flex justify-between text-[10px] mt-1" style="color: var(--text-muted);">
					<span>{formatNumber(steps[0])}</span>
					<span>{formatNumber(steps[steps.length - 1])}</span>
				</div>
			</div>

			<div class="flex items-center gap-1 p-1 rounded-full self-start md:self-center" style="background: var(--badge-neutral-bg);">
				{#each ['monthly', 'yearly'] as b}
					<button
						onclick={() => (billing = b as 'monthly' | 'yearly')}
						class="font-head px-4 py-1.5 rounded-full text-sm font-medium transition-all {billing === b ? 'shadow-sm' : ''}"
						style="background: {billing === b ? 'var(--card-bg)' : 'transparent'}; color: {billing === b ? 'var(--text-primary)' : 'var(--text-secondary)'};"
					>
						{b === 'monthly' ? 'Monthly' : 'Yearly'}
						{#if b === 'yearly' && savePct > 0}
							<span class="ml-1 text-[10px] font-bold" style="color: var(--positive);">Save {savePct}%</span>
						{/if}
					</button>
				{/each}
			</div>
		</div>

		{#if apiPlans.length === 0}
			<p class="text-center text-sm py-10" style="color: var(--text-muted);">
				Pricing is unavailable right now. <a href="/pricing" style="color: var(--accent);" class="hover:underline">See all plans</a>.
			</p>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
				{#each apiPlans as plan (plan.code)}
					{@const best = plan.code === bestCode}
					{@const cost = monthlyCost(plan)}
					{@const tooSmall = cost === Infinity}
					{@const c = copy[plan.code] ?? { tagline: '', cta: 'Subscribe', features: [] }}
					<div
						class="plan rounded-2xl flex flex-col overflow-hidden transition-opacity {tooSmall ? 'opacity-60' : ''}"
						style="background: var(--card-bg); border: {best ? '2px solid var(--accent)' : '1px solid var(--card-border)'};"
					>
						<div class="text-center text-[10px] font-bold tracking-widest uppercase py-1.5 {best ? '' : 'invisible'}" style="background: var(--accent); color: #fff;">
							Best for you
						</div>

						<div class="p-5 flex flex-col flex-1">
							<div class="font-head text-lg font-bold" style="color: var(--text-primary);">{plan.name}</div>
							<div class="text-[12px] font-medium mb-4" style="color: var(--accent);">{c.tagline}</div>

							<div class="mb-1">
								<span class="price font-bold" style="color: var(--text-primary);">{displayPrice(plan)}</span>
								<span class="text-[12px] ml-1" style="color: var(--text-muted);">
									{plan.billing_model === 'usage' ? 'no monthly fee' : billing === 'yearly' ? '/ month, billed yearly' : '/ month'}
								</span>
							</div>
							<div class="text-[11px] mb-4 min-h-[1rem]" style="color: var(--text-muted);">
								{#if tooSmall}
									Not enough requests for {formatNumber(volume)} / month
								{:else}
									About {fmtMoney(cost)} / month at {formatNumber(volume)} requests
								{/if}
							</div>

							<div class="flex flex-col gap-0.5 mb-4 p-3 rounded-lg" style="background: var(--badge-neutral-bg);">
								{#each limitLines(plan) as line}
									<div class="text-[12px] font-semibold" style="color: var(--text-primary);">{line}</div>
								{/each}
							</div>

							<a
								href="{ACCOUNT_URL}/auth/signup"
								target="_blank"
								rel="noopener noreferrer"
								class="font-head block w-full text-center py-2.5 rounded-lg text-[13px] font-semibold transition-all mb-5"
								style={best
									? 'background: var(--accent); color: #fff;'
									: 'border: 1px solid var(--accent); color: var(--accent);'}
							>
								{c.cta}
							</a>

							<ul class="flex flex-col gap-2.5">
								{#each c.features as f}
									<li class="flex gap-2 text-[12px] leading-snug" style="color: var(--text-secondary);">
										<svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="shrink-0 mt-px">
											<circle cx="7" cy="7" r="7" fill="var(--positive)" fill-opacity="0.15" />
											<path d="M4 7l2 2 4-4" stroke="var(--positive)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
										</svg>
										{f}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				{/each}

				<!-- Enterprise -->
				<div
					class="plan rounded-2xl flex flex-col overflow-hidden"
					style="background: var(--card-bg); border: {bestCode === null ? '2px solid var(--accent)' : '1px solid var(--card-border)'};"
				>
					<div class="text-center text-[10px] font-bold tracking-widest uppercase py-1.5 {bestCode === null ? '' : 'invisible'}" style="background: var(--accent); color: #fff;">
						Best for you
					</div>
					<div class="p-5 flex flex-col flex-1">
						<div class="font-head text-lg font-bold" style="color: var(--text-primary);">Enterprise</div>
						<div class="text-[12px] font-medium mb-4" style="color: var(--accent);">Custom volume and data feeds.</div>
						<div class="mb-1">
							<span class="price font-bold" style="color: var(--text-primary);">Custom</span>
						</div>
						<div class="text-[11px] mb-4 min-h-[1rem]" style="color: var(--text-muted);">Priced to your volume</div>
						<div class="flex flex-col gap-0.5 mb-4 p-3 rounded-lg" style="background: var(--badge-neutral-bg);">
							<div class="text-[12px] font-semibold" style="color: var(--text-primary);">Custom request limits</div>
							<div class="text-[12px] font-semibold" style="color: var(--text-primary);">Dedicated throughput</div>
						</div>
						<a
							href={BOOKING_URL}
							target="_blank"
							rel="noopener noreferrer"
							class="font-head block w-full text-center py-2.5 rounded-lg text-[13px] font-semibold transition-all mb-5"
							style={bestCode === null
								? 'background: var(--accent); color: #fff;'
								: 'border: 1px solid var(--accent); color: var(--accent);'}
						>
							Talk to Sales
						</a>
						<ul class="flex flex-col gap-2.5">
							{#each ['Everything in Max', 'WebSocket and custom feeds', 'Custom providers and pairs', 'Invoiced billing in NGN or USD', 'Dedicated account manager'] as f}
								<li class="flex gap-2 text-[12px] leading-snug" style="color: var(--text-secondary);">
									<svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="shrink-0 mt-px">
										<circle cx="7" cy="7" r="7" fill="var(--positive)" fill-opacity="0.15" />
										<path d="M4 7l2 2 4-4" stroke="var(--positive)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
									{f}
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.section-title {
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
	}
	.price {
		font-family: var(--font-head);
		font-size: 34px;
	}
	.slider {
		-webkit-appearance: none;
		appearance: none;
		height: 6px;
		border-radius: 3px;
		background: linear-gradient(to right, var(--accent) var(--pct), var(--badge-neutral-bg) var(--pct));
		outline: none;
		cursor: pointer;
	}
	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #fff;
		border: 3px solid var(--accent);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
	}
	.slider::-moz-range-thumb {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #fff;
		border: 3px solid var(--accent);
	}
</style>
