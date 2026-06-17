<script lang="ts">
	let activeTab: 'curl' | 'js' = 'curl';
	let copied = false;

	const curlCode = `curl -X GET "https://api.monierate.com/v1/rates?from=USDT&to=NGN" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Accept: application/json"`;

	const jsCode = `const res = await fetch(
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

	$: activeCode = activeTab === 'curl' ? curlCode : jsCode;

	function esc(s: string): string {
		return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	// Uses single-quoted attributes so the string regex ("...") won't match them
	function highlightJson(code: string): string {
		return esc(code).replace(
			/("(?:\\u[0-9a-fA-F]{4}|\\[^u]|[^"\\])*"(?:\s*:)?|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\btrue\b|\bfalse\b|\bnull\b)/g,
			(m) => {
				if (m.startsWith('"')) {
					return /"\s*:$/.test(m)
						? `<span class='hl-key'>${m}</span>`
						: `<span class='hl-str'>${m}</span>`;
				}
				if (m === 'true' || m === 'false') return `<span class='hl-bool'>${m}</span>`;
				if (m === 'null') return `<span class='hl-null'>${m}</span>`;
				return `<span class='hl-num'>${m}</span>`;
			}
		);
	}

	function highlightCurl(code: string): string {
		return esc(code)
			.replace(/^(curl)/m, "<span class='hl-kw'>$1</span>")
			.replace(/ (-[A-Za-z]+)/g, " <span class='hl-flag'>$1</span>")
			.replace(/\b(GET|POST|PUT|DELETE|PATCH|HEAD)\b/g, "<span class='hl-method'>$1</span>")
			.replace(/"([^"]*)"/g, `<span class='hl-str'>"$1"</span>`);
	}

	function highlightJs(code: string): string {
		return esc(code)
			.replace(/\b(const|let|var|await|async|return|new|function)\b/g, "<span class='hl-kw'>$1</span>")
			.replace(/\b([a-z][a-zA-Z]*)(?=\()/g, "<span class='hl-fn'>$1</span>")
			.replace(/"([^"]*)"/g, `<span class='hl-str'>"$1"</span>`);
	}

	$: highlightedCode = activeTab === 'curl' ? highlightCurl(activeCode) : highlightJs(activeCode);
	$: highlightedJson = highlightJson(jsonResponse);

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
		<!-- Request panel -->
		<div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
			<div class="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
				<div class="flex gap-1">
					<button
						on:click={() => (activeTab = 'curl')}
						class="tab-btn"
						class:active={activeTab === 'curl'}
					>cURL</button>
					<button
						on:click={() => (activeTab = 'js')}
						class="tab-btn"
						class:active={activeTab === 'js'}
					>JavaScript</button>
				</div>
				<button on:click={copyCode} class="copy-btn">
					{#if copied}
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
							<path d="M1.5 6l3 3 6-6" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
						<span style="color:#22c55e">Copied</span>
					{:else}
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
							<rect x="1" y="3.5" width="7.5" height="7.5" rx="1.2" stroke="currentColor" stroke-width="1.2" />
							<path d="M3.5 1h6.5a1 1 0 011 1v6.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
						</svg>
						Copy
					{/if}
				</button>
			</div>
			<pre class="code-pre"><code>{@html highlightedCode}</code></pre>
		</div>

		<!-- Response panel -->
		<div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
			<div class="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
				<span class="inline-flex items-center gap-1.5 text-xs font-semibold text-green-500">
					<span class="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
					200 OK
				</span>
				<span class="text-xs text-gray-400">application/json</span>
			</div>
			<pre class="code-pre"><code>{@html highlightedJson}</code></pre>
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
		line-height: 1.7;
		padding: 20px;
		margin: 0;
		overflow-x: auto;
		white-space: pre;
		background: #111827;
		color: #abb2bf;
		scrollbar-width: thin;
		scrollbar-color: #374151 transparent;
	}

	.code-pre::-webkit-scrollbar { height: 4px; }
	.code-pre::-webkit-scrollbar-track { background: transparent; }
	.code-pre::-webkit-scrollbar-thumb {
		background: #374151;
		border-radius: 2px;
	}

	:global(.dark) .code-pre {
		background: #030712;
		scrollbar-color: #1f2937 transparent;
	}

	:global(.dark) .code-pre::-webkit-scrollbar-thumb { background: #1f2937; }

	.tab-btn {
		padding: 0.2rem 0.75rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		border: none;
		background: transparent;
		color: #9ca3af;
		transition: background 0.15s, color 0.15s;
	}

	.tab-btn.active {
		background: white;
		color: #111827;
	}

	:global(.dark) .tab-btn.active {
		background: #374151;
		color: white;
	}

	.copy-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.75rem;
		color: #9ca3af;
		background: transparent;
		border: none;
		cursor: pointer;
		transition: color 0.15s;
	}

	.copy-btn:hover { color: #6b7280; }
	:global(.dark) .copy-btn:hover { color: #d1d5db; }

	/* One Dark–inspired syntax colors */
	:global(.hl-key)    { color: #e06c75; } /* JSON keys */
	:global(.hl-str)    { color: #98c379; } /* strings */
	:global(.hl-num)    { color: #d19a66; } /* numbers */
	:global(.hl-bool)   { color: #56b6c2; } /* booleans */
	:global(.hl-null)   { color: #56b6c2; } /* null */
	:global(.hl-kw)     { color: #c678dd; } /* keywords */
	:global(.hl-fn)     { color: #61afef; } /* function names */
	:global(.hl-flag)   { color: #56b6c2; } /* CLI flags */
	:global(.hl-method) { color: #e5c07b; } /* HTTP method */
</style>
