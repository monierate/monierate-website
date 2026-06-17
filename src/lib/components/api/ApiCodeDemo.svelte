<script lang="ts">
	let activeTab: 'curl' | 'js' = 'curl';
	let copied = false;

	const curlExample = `curl -X GET "https://api.monierate.com/v1/rates?from=USDT&to=NGN" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Accept: application/json"`;

	const jsExample = `const res = await fetch(
  "https://api.monierate.com/v1/rates?from=USDT&to=NGN",
  { headers: { Authorization: "Bearer YOUR_API_KEY" } }
);
const data = await res.json();`;

	const jsonResponse = `{
  "status": "success",
  "data": [
    {
      "changer": "binance",
      "pair": "USDT/NGN",
      "price_buy": 1613.00,
      "price_sell": 1608.50,
      "source": "p2p",
      "updated_at": "2025-06-17T10:42:00Z"
    },
    {
      "changer": "quidax",
      "pair": "USDT/NGN",
      "price_buy": 1609.00,
      "price_sell": 1604.00,
      "source": "spot",
      "updated_at": "2025-06-17T10:41:37Z"
    }
  ]
}`;

	$: activeCode = activeTab === 'curl' ? curlExample : jsExample;

	function copyCode() {
		navigator.clipboard.writeText(activeCode).then(() => {
			copied = true;
			setTimeout(() => (copied = false), 2000);
		});
	}
</script>

<div class="container mb-16">
	<div class="text-center mb-8">
		<h2 class="text-2xl font-bold mb-2">See it in action</h2>
		<p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
			One request returns live rates across every provider we track.
		</p>
	</div>

	<div class="grid md:grid-cols-2 gap-3 max-w-4xl mx-auto">
		<!-- Request -->
		<div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
			<div class="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
				<div class="flex gap-1">
					<button
						on:click={() => (activeTab = 'curl')}
						class="px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer border-none"
						class:bg-white={activeTab === 'curl'}
						class:dark:bg-gray-700={activeTab === 'curl'}
						class:text-gray-900={activeTab === 'curl'}
						class:dark:text-white={activeTab === 'curl'}
						class:text-gray-400={activeTab !== 'curl'}
						class:bg-transparent={activeTab !== 'curl'}
					>cURL</button>
					<button
						on:click={() => (activeTab = 'js')}
						class="px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer border-none"
						class:bg-white={activeTab === 'js'}
						class:dark:bg-gray-700={activeTab === 'js'}
						class:text-gray-900={activeTab === 'js'}
						class:dark:text-white={activeTab === 'js'}
						class:text-gray-400={activeTab !== 'js'}
						class:bg-transparent={activeTab !== 'js'}
					>JavaScript</button>
				</div>
				<button
					on:click={copyCode}
					class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border-none bg-transparent cursor-pointer transition-colors"
				>
					{#if copied}
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
							<path d="M1.5 6l3 3 6-6" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
						Copied
					{:else}
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
							<rect x="1" y="3.5" width="7.5" height="7.5" rx="1.2" stroke="currentColor" stroke-width="1.2" />
							<path d="M3.5 1h6.5a1 1 0 011 1v6.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
						</svg>
						Copy
					{/if}
				</button>
			</div>
			<pre class="code-pre">{activeCode}</pre>
		</div>

		<!-- Response -->
		<div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
			<div class="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
				<span class="inline-flex items-center gap-1.5 text-xs font-semibold text-green-500">
					<span class="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
					200 OK
				</span>
				<span class="text-xs text-gray-400">application/json</span>
			</div>
			<pre class="code-pre">{jsonResponse}</pre>
		</div>
	</div>

	<div class="text-center mt-5">
		<a
			href="https://monierate.apidog.io"
			target="_blank"
			rel="noopener noreferrer"
			class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
		>
			View full API documentation →
		</a>
	</div>
</div>

<style>
	.code-pre {
		font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
		font-size: 0.75rem;
		line-height: 1.625;
		padding: 20px;
		margin: 0;
		overflow-x: auto;
		white-space: pre;
		background: #111827;
		color: #d1d5db;
	}

	:global(.dark) .code-pre {
		background: #030712;
	}
</style>
