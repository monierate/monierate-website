<script lang="ts">
	const trustItems = [
		'$10 free credit on signup',
		'No credit card required',
		'Dashboard free always',
		'40+ providers tracked live'
	];
</script>

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
			{#each trustItems as t}
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
