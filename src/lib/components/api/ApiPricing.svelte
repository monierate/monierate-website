<script lang="ts">
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
</script>

<div class="border-t border-gray-100 dark:border-gray-700" id="pricing">
	<div class="container py-14">
		<div class="text-center mb-8">
			<h2 class="text-2xl font-bold mb-2">Simple, transparent pricing</h2>
			<p class="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
				Dashboard is free for everyone. Only pay when you make API calls, export data, or execute
				trades. Pro and Max remove all per-action fees.
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
						<div class="mb-4">
							<div class="text-[11px] font-semibold tracking-widest text-gray-400 dark:text-gray-500 mb-1">{plan.label}</div>
							<div class="text-[17px] font-bold text-gray-900 dark:text-gray-100 mb-0.5">{plan.name}</div>
							<div class="text-[12px] font-medium text-blue-500">{plan.tagline}</div>
						</div>

						<div class="mb-5">
							<span class="price-num text-[30px] font-bold text-gray-900 dark:text-gray-100">{plan.price}</span>
							<span class="text-[12px] text-gray-400 ml-1">{plan.period}</span>
						</div>

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

<style>
	.price-num {
		font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
	}
</style>
