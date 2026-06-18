<script lang="ts">
	const features = [
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
</script>

<div>
	<div class="container py-14">
		<div class="text-center mb-8">
			<h2 class="text-2xl font-bold mb-2">What you get</h2>
			<p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
				Everything you need to build FX-aware apps on Nigerian markets.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
			{#each features as f}
				<div class="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-5">
					<div class="w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-blue-500/10">
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3662ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d={f.icon} />
						</svg>
					</div>
					<div class="text-[13px] font-semibold text-gray-900 dark:text-gray-100 mb-1">{f.title}</div>
					<div class="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed">{f.body}</div>
				</div>
			{/each}
		</div>
	</div>
</div>
