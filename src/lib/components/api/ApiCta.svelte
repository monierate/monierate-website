<script lang="ts">
	import { ACCOUNT_URL } from '$lib/config';
</script>

<div class="bg-gray-50 dark:bg-gray-900/70">
	<div class="container py-14 text-center">
		<h2 class="text-2xl font-bold mb-3">Ready to integrate?</h2>
		<p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-7 leading-relaxed">
			Create a free account and get your API key in minutes. $10 credit included, no card required.
		</p>

		<div class="flex flex-col sm:flex-row gap-3 justify-center mb-8">
			<a
				href="{ACCOUNT_URL}/auth/signup"
				target="_blank"
				rel="noopener noreferrer"
				class="button bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 text-sm"
			>
				Create Free Account
			</a>
			<a
				href="https://docs.monierate.com"
				target="_blank"
				rel="noopener noreferrer"
				class="button bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold px-6 py-2.5 text-sm"
			>
				Read the Docs
			</a>
		</div>

		<div class="flex flex-wrap items-center justify-center gap-4">
			<a
				href="https://cal.com/monierate/activation-call"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
			>
				<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
					<rect x="3" y="4" width="18" height="18" rx="2" />
					<line x1="16" y1="2" x2="16" y2="6" />
					<line x1="8" y1="2" x2="8" y2="6" />
					<line x1="3" y1="10" x2="21" y2="10" />
				</svg>
				Book a call
			</a>
			<span class="text-gray-200 dark:text-gray-700">|</span>
			<a
				href="mailto:sales@monierate.com"
				class="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
			>
				<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
					<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
					<polyline points="22,6 12,13 2,6" />
				</svg>
				sales@monierate.com
			</a>
		</div>
	</div>
</div>
