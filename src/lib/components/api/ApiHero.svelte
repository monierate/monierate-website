<script lang="ts">
	import { ACCOUNT_URL } from '$lib/config';

	const trustItems = [
		'$10 free credit on signup',
		'No credit card required',
		'Dashboard free always',
		'40+ providers tracked live'
	];
</script>

<div class="container mt-10 mb-16">
	<div class="text-center">
		<span class="font-head inline-block text-xs font-semibold tracking-widest uppercase mb-5 px-3 py-1 rounded-full" style="background: var(--accent-light); color: var(--accent);">
			Currency Rates API
		</span>

		<h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight" style="color: var(--text-primary);">
			Real-time NGN exchange rates.<br class="hidden md:block" />
			<span style="color: var(--accent);">One API.</span>
		</h1>

		<p class="text-base max-w-xl mx-auto mb-8 leading-relaxed" style="color: var(--text-secondary);">
			Live rates, historical data, and offramp execution across 40+ providers — Binance P2P, Luno,
			Quidax, and more.
		</p>

		<div class="flex flex-col sm:flex-row gap-3 justify-center mb-10">
			<a
				href="{ACCOUNT_URL}/auth/signup"
				target="_blank"
				rel="noopener noreferrer"
				class="button font-semibold px-6 py-2.5 text-sm"
			>
				Get API Key Free
			</a>
			<a
				href="https://calendar.app.google/RMRzzUG7AprXMNwg6"
				target="_blank"
				rel="noopener noreferrer"
				class="font-head inline-flex items-center justify-center rounded-xl font-semibold px-6 py-2.5 text-sm"
				style="background: transparent; border: 1px solid var(--card-border); color: var(--text-primary);"
			>
				Talk to Sales
			</a>
		</div>

		<div class="flex flex-wrap justify-center gap-x-6 gap-y-2">
			{#each trustItems as t}
				<span class="inline-flex items-center gap-1.5 text-xs" style="color: var(--text-muted);">
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
