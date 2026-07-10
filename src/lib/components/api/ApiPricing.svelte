<script lang="ts">
	import { formatNumber } from '$lib/functions';
	import { ACCOUNT_URL } from '$lib/config';

	export let pageData: any = {};

	let billing: 'monthly' | 'yearly' = 'monthly';

	const designConfig: Record<string, any> = {
		free: {
			label: 'START FREE',
			tagline: 'Only pay when you act.',
			description:
				"Full dashboard access for free. You're only charged when you make API calls, download data, or execute trades.",
			cta: 'Get Started Free',
			ctaHref: `${ACCOUNT_URL}/auth/signup`,
			highlighted: false,
			note: 'Deduct from wallet',
			monthlyPeriod: 'no monthly fee',
			yearlyPeriod: 'no monthly fee',
			platformAccess: [
				{ label: 'Market Insight', value: 'View only', accent: false },
				{ label: 'Analytics Dashboard', value: 'View only', accent: false },
				{ label: 'Historical data download / exports', value: '$1/yr', accent: false },
				{ label: 'Offramp payments', value: '$0.08 fee', accent: false },
				{ label: 'Currency rates API', value: '$0.01/request', accent: false }
			],
			apiLimitsNote:
				'No limits applies to currency rates and FX data requests only on the pay-as-you-go plan.'
		},
		pro: {
			label: 'PROFESSIONAL',
			tagline: 'Unlimited access. Predictable cost.',
			description: 'Unlimited API access and data exports. 0% discount on offramp fees vs PAYG.',
			cta: 'Start Pro',
			ctaHref: `${ACCOUNT_URL}/auth/signup`,
			highlighted: false,
			note: 'Deduct from wallet',
			monthlyPeriod: '/ month',
			yearlyPeriod: '/ month, billed yearly',
			platformAccess: [
				{ label: 'Market Insight', value: 'Full Access', accent: true },
				{ label: 'Analytics Dashboard', value: 'Full Access', accent: true },
				{ label: 'Historical data download / exports', value: 'Unlimited', accent: true },
				{ label: 'Offramp payments', value: '$0.05 fee', accent: false },
				{ label: 'Currency rates API', value: null, accent: false }
			],
			apiLimitsNote: 'Limits apply to currency rates and FX data requests only.'
		},
		max: {
			label: 'ENTERPRISE',
			tagline: 'Pro, but 20× the scale.',
			description:
				'Same unlimited platform access as Pro with 50x more API requests and 5x higher throughput for production workloads.',
			cta: 'Start Max',
			ctaHref: `${ACCOUNT_URL}/auth/signup`,
			highlighted: false,
			note: null,
			monthlyPeriod: '/ month',
			yearlyPeriod: '/ month, billed yearly',
			platformAccess: [
				{ label: 'Market Insight', value: 'Full Access', accent: true },
				{ label: 'Analytics Dashboard', value: 'Full Access', accent: true },
				{ label: 'Historical data download / exports', value: 'Unlimited', accent: true },
				{ label: 'Offramp payments', value: '$0.01 fee', accent: false },
				{ label: 'Currency rates API', value: null, accent: false }
			],
			apiLimitsNote: 'Limits apply to currency rates and FX data requests only.'
		}
	};

	function getMonthlyPrice(plan: any): string {
		if (!plan || plan.billing_model === 'usage') return '$0';
		return `$${plan.price_usd}`;
	}

	function getYearlyPrice(plan: any): string {
		if (!plan || plan.billing_model === 'usage') return '$0';
		if (plan.prices_by_cycle?.yearly?.usd) {
			return `$${Math.round(plan.prices_by_cycle.yearly.usd / 12)}`;
		}
		return `$${plan.price_usd}`;
	}

	function getApiLimitLines(plan: any): string[] {
		if (!plan || plan.billing_model === 'usage') {
			return ['Unlimited requests / month / min'];
		}
		return [
			`${formatNumber(plan.requests_limit_per_month)} requests / month`,
			`${plan.requests_limit_per_minute} requests / minute`
		];
	}

	function getCurrencyApiValue(plan: any): string {
		if (!plan || plan.billing_model === 'usage') return '$0.01/request';
		return `${formatNumber(plan.requests_limit_per_month)} req/mo`;
	}

	$: apiPlans = ((pageData?.subscriptionPlans as any[]) || [])
		.filter((p) => ['free', 'pro', 'max'].includes(p.code))
		.sort((a, b) => a.price_usd - b.price_usd);

	$: savePct = (() => {
		const paidPlan = apiPlans.find((p) => p.billing_model === 'flat');
		if (!paidPlan?.prices_by_cycle?.yearly?.usd) return 17;
		const monthly = paidPlan.price_usd;
		const yearlyMonthly = paidPlan.prices_by_cycle.yearly.usd / 12;
		return Math.round(((monthly - yearlyMonthly) / monthly) * 100);
	})();

	$: plans = (() => {
		return apiPlans.map((apiPlan) => {
			const config = designConfig[apiPlan.code] || {};
			const currencyApiValue = getCurrencyApiValue(apiPlan);

			const platformAccess = (config.platformAccess || []).map((item: any) =>
				item.value === null ? { ...item, value: currencyApiValue } : item
			);

			const yearlySavings =
				apiPlan.billing_model === 'flat' && apiPlan.prices_by_cycle?.yearly?.usd
					? apiPlan.price_usd * 12 - apiPlan.prices_by_cycle.yearly.usd
					: 0;

			const yearlyTotal =
				apiPlan.billing_model === 'flat' && apiPlan.prices_by_cycle?.yearly?.usd
					? apiPlan.prices_by_cycle.yearly.usd
					: 0;

			return {
				...config,
				code: apiPlan.code,
				name: apiPlan.name,
				monthlyPrice: getMonthlyPrice(apiPlan),
				yearlyPrice: getYearlyPrice(apiPlan),
				yearlySavings,
				yearlyTotal,
				platformAccess,
				apiLimitLines: getApiLimitLines(apiPlan)
			};
		});
	})();
</script>

<div id="pricing">
	<div class="container py-14">
		<div class="text-center mb-8">
			<h2 class="text-2xl font-bold mb-2">Simple, transparent pricing</h2>
			<p class="text-sm max-w-lg mx-auto" style="color: var(--text-secondary);">
				Dashboard is free for everyone. Only pay when you make API calls, export data, or execute
				trades. Pro and Max remove all per-action fees.
			</p>
		</div>

		<!-- Billing toggle -->
		<div class="flex items-center justify-center mb-8">
			<div
				class="relative flex items-center gap-1 p-1 rounded-full"
				style="background: var(--table-header-bg); border: 1px solid var(--card-border);"
			>
				<button
					on:click={() => (billing = 'monthly')}
					class="font-head px-4 py-1.5 rounded-full text-sm font-medium transition-all {billing === 'monthly' ? 'shadow-sm' : ''}"
					style="background: {billing === 'monthly' ? 'var(--card-bg)' : 'transparent'}; color: {billing === 'monthly' ? 'var(--text-primary)' : 'var(--text-secondary)'};"
				>
					Monthly
				</button>
				<div class="relative">
					<span
						class="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap z-10"
						style="background-color: var(--positive); color: white;"
					>Save {savePct}%</span>
					<button
						on:click={() => (billing = 'yearly')}
						class="font-head px-4 py-1.5 rounded-full text-sm font-medium transition-all {billing === 'yearly' ? 'shadow-sm' : ''}"
						style="background: {billing === 'yearly' ? 'var(--card-bg)' : 'transparent'}; color: {billing === 'yearly' ? 'var(--text-primary)' : 'var(--text-secondary)'};"
					>
						Yearly
					</button>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
			{#each plans as plan}
				<div
					class="rounded-2xl border flex flex-col overflow-hidden"
					style="background: var(--card-bg); border-color: {plan.highlighted
						? 'var(--accent)'
						: 'var(--card-border)'}; border-width: {plan.highlighted ? '1.5px' : '1px'};"
				>
					<div class="p-5 flex flex-col flex-1">
						<!-- Label badge -->
						<div class="flex items-center gap-1.5 mb-3">
							<span
								class="{plan.labelAccent
									? 'bg-emerald-500 text-white'
									: 'bg-[var(--badge-neutral-bg)] text-[var(--text-secondary)]'} text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full"
							>{plan.label}</span>
						</div>

						<!-- Plan name & tagline -->
						<div class="font-head text-[17px] font-bold" style="color: var(--text-primary);">{plan.name}</div>
						<div class="text-[12px] font-medium mb-2" style="color: var(--accent);">{plan.tagline}</div>

						<!-- Description -->
						<p class="text-[11px] mb-4 leading-relaxed min-h-[3.5rem]" style="color: var(--text-secondary);">
							{plan.description}
						</p>

						<!-- Price -->
						<div class="mb-4">
							<span class="price-num font-mono text-[30px] font-bold" style="color: var(--text-primary);">
								{billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
							</span>
							<span class="text-[12px] ml-1" style="color: var(--text-muted);">
								{billing === 'yearly' ? plan.yearlyPeriod : plan.monthlyPeriod}{#if billing === 'yearly' && plan.yearlyTotal > 0}
									(${plan.yearlyTotal.toLocaleString()}/yr){/if}
							</span>
							{#if billing === 'yearly' && plan.yearlySavings > 0}
								<div class="mt-1.5">
									<span class="text-[10px] font-bold px-2 py-0.5 rounded-full" style="background-color: #10b981; color: white;">
										Save ${plan.yearlySavings} yearly
									</span>
								</div>
							{/if}
						</div>

						<!-- CTA -->
						<a
							href={plan.ctaHref}
							target="_blank"
							rel="noopener noreferrer"
							class="font-head block w-full text-center py-2 rounded-lg text-[12px] font-semibold transition-all {plan.highlighted ? '' : 'border'}"
							style="{plan.highlighted
								? 'background: var(--accent); color: #fff;'
								: 'border-color: var(--card-border); color: var(--text-primary);'}"
						>
							{plan.cta}
						</a>
						<div class="text-[11px] text-center mt-1 mb-4 min-h-[1rem]" style="color: var(--text-muted);">
							{#if plan.note}{plan.note}{/if}
						</div>

						<!-- Divider -->
						<div class="mb-3" style="border-top: 1px solid var(--card-border);"></div>

						<!-- Platform Access -->
						<div
							class="font-head text-[10px] font-bold tracking-widest mb-2 uppercase" style="color: var(--text-muted);"
						>
							Platform Access
						</div>
						<ul class="flex flex-col gap-2 mb-4">
							{#each plan.platformAccess as f}
								<li class="text-[12px] leading-snug" style="color: var(--text-secondary);">
									{f.label}
									<span
										class="inline-block align-middle ml-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--badge-neutral-bg)] text-[var(--text-secondary)]"
									>{f.value}</span>
								</li>
							{/each}
						</ul>

						<!-- Divider -->
						<div class="mb-3" style="border-top: 1px solid var(--card-border);"></div>

						<!-- Currency Rates API Limits -->
						<div
							class="font-head text-[10px] font-bold tracking-widest mb-2 uppercase" style="color: var(--text-muted);"
						>
							Currency Rates API Limits
						</div>
						<div class="flex flex-col gap-1 mb-2">
							{#each plan.apiLimitLines as line}
								<div class="text-[12px] font-medium" style="color: var(--text-primary);">{line}</div>
							{/each}
						</div>
						<p class="text-[11px] leading-relaxed" style="color: var(--text-muted);">
							{plan.apiLimitsNote}
						</p>
					</div>
				</div>
			{/each}
		</div>

		<p class="text-center text-[12px] mt-6" style="color: var(--text-muted);">
			Need higher volume, WebSockets, or custom data feeds?
			<a
				href="https://calendar.app.google/RMRzzUG7AprXMNwg6"
				target="_blank"
				rel="noopener noreferrer"
				style="color: var(--accent);" class="hover:underline">Talk to us</a
			>.
		</p>
	</div>
</div>

<style>
	.price-num {
		font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
	}
</style>
