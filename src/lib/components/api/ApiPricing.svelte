<script lang="ts">
	import { formatNumber } from '$lib/functions';

	export let pageData: any = {};

	let billing: 'monthly' | 'yearly' = 'monthly';

	const designConfig: Record<string, any> = {
		free: {
			label: 'START FREE',
			tagline: 'Only pay when you act.',
			description:
				"Full dashboard access for free. You're only charged when you make API calls, download data, or execute trades.",
			cta: 'Get Started Free',
			ctaHref: 'https://account.monierate.com/auth/signup',
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
			ctaHref: 'https://account.monierate.com/auth/signup',
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
			ctaHref: 'https://account.monierate.com/auth/signup',
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
		if (apiPlans.length === 0) {
			return [
				{
					...designConfig.free,
					code: 'free',
					name: 'Free – PAYG',
					monthlyPrice: '$0',
					yearlyPrice: '$0',
					apiLimitLines: ['Unlimited requests / month / min']
				},
				{
					...designConfig.pro,
					code: 'pro',
					name: 'Pro',
					monthlyPrice: '$47',
					yearlyPrice: '$39',
					apiLimitLines: ['10,000 requests / month', '10 requests / minute']
				},
				{
					...designConfig.max,
					code: 'max',
					name: 'Max',
					monthlyPrice: '$147',
					yearlyPrice: '$122',
					apiLimitLines: ['100,000 requests / month', '50 requests / minute']
				}
			];
		}

		return apiPlans.map((apiPlan) => {
			const config = designConfig[apiPlan.code] || {};
			const currencyApiValue = getCurrencyApiValue(apiPlan);

			const platformAccess = (config.platformAccess || []).map((item: any) =>
				item.value === null ? { ...item, value: currencyApiValue } : item
			);

			return {
				...config,
				code: apiPlan.code,
				name: apiPlan.name,
				monthlyPrice: getMonthlyPrice(apiPlan),
				yearlyPrice: getYearlyPrice(apiPlan),
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
			<p class="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
				Dashboard is free for everyone. Only pay when you make API calls, export data, or execute
				trades. Pro and Max remove all per-action fees.
			</p>
		</div>

		<!-- Billing toggle -->
		<div class="flex items-center justify-center mb-8">
			<div
				class="relative flex items-center gap-1 p-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
			>
				<button
					on:click={() => (billing = 'monthly')}
					class="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
					class:bg-white={billing === 'monthly'}
					class:dark:bg-gray-700={billing === 'monthly'}
					class:shadow-sm={billing === 'monthly'}
					class:text-gray-900={billing === 'monthly'}
					class:dark:text-white={billing === 'monthly'}
					class:text-gray-500={billing !== 'monthly'}
					class:dark:text-gray-400={billing !== 'monthly'}
				>
					Monthly
				</button>
				<div class="relative">
					<span
						class="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap z-10"
						style="background-color: #10b981; color: white;"
					>Save {savePct}%</span>
					<button
						on:click={() => (billing = 'yearly')}
						class="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
						class:bg-white={billing === 'yearly'}
						class:dark:bg-gray-700={billing === 'yearly'}
						class:shadow-sm={billing === 'yearly'}
						class:text-gray-900={billing === 'yearly'}
						class:dark:text-white={billing === 'yearly'}
						class:text-gray-500={billing !== 'yearly'}
						class:dark:text-gray-400={billing !== 'yearly'}
					>
						Yearly
					</button>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
			{#each plans as plan}
				<div
					class="rounded-xl border flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900/70"
					style="border-color: {plan.highlighted
						? '#3662ff'
						: ''}; border-width: {plan.highlighted ? '1.5px' : '1px'};"
					class:border-gray-200={!plan.highlighted}
					class:dark:border-gray-700={!plan.highlighted}
				>
					<div class="p-5 flex flex-col flex-1">
						<!-- Label badge -->
						<div class="flex items-center gap-1.5 mb-3">
							<span
								class="{plan.labelAccent
									? 'bg-emerald-500 text-white'
									: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'} text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full"
							>{plan.label}</span>
						</div>

						<!-- Plan name & tagline -->
						<div class="text-[17px] font-bold text-gray-900 dark:text-gray-100">{plan.name}</div>
						<div class="text-[12px] font-medium text-blue-500 mb-2">{plan.tagline}</div>

						<!-- Description -->
						<p class="text-[11px] text-gray-500 dark:text-gray-400 mb-4 leading-relaxed min-h-[3.5rem]">
							{plan.description}
						</p>

						<!-- Price -->
						<div class="mb-4">
							<span class="price-num text-[30px] font-bold text-gray-900 dark:text-gray-100">
								{billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
							</span>
							<span class="text-[12px] text-gray-400 ml-1">
								{billing === 'yearly' ? plan.yearlyPeriod : plan.monthlyPeriod}
							</span>
						</div>

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
						<div class="text-[11px] text-center text-gray-400 dark:text-gray-500 mt-1 mb-4 min-h-[1rem]">
							{#if plan.note}{plan.note}{/if}
						</div>

						<!-- Divider -->
						<div class="border-t border-gray-100 dark:border-gray-700 mb-3"></div>

						<!-- Platform Access -->
						<div
							class="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-2 uppercase"
						>
							Platform Access
						</div>
						<ul class="flex flex-col gap-2 mb-4">
							{#each plan.platformAccess as f}
								<li class="text-[12px] text-gray-500 dark:text-gray-400 leading-snug">
									{f.label}
									<span
										class="inline-block align-middle ml-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
									>{f.value}</span>
								</li>
							{/each}
						</ul>

						<!-- Divider -->
						<div class="border-t border-gray-100 dark:border-gray-700 mb-3"></div>

						<!-- Currency Rates API Limits -->
						<div
							class="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-2 uppercase"
						>
							Currency Rates API Limits
						</div>
						<div class="flex flex-col gap-1 mb-2">
							{#each plan.apiLimitLines as line}
								<div class="text-[12px] font-medium text-gray-700 dark:text-gray-300">{line}</div>
							{/each}
						</div>
						<p class="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
							{plan.apiLimitsNote}
						</p>
					</div>
				</div>
			{/each}
		</div>

		<p class="text-center text-[12px] text-gray-400 dark:text-gray-500 mt-6">
			Need higher volume, WebSockets, or custom data feeds?
			<a
				href="https://cal.com/monierate/activation-call"
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-500 hover:underline">Talk to us</a
			>.
			Full comparison at <a href="/pricing" class="text-blue-500 hover:underline">/pricing</a>.
		</p>
	</div>
</div>

<style>
	.price-num {
		font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
	}
</style>
