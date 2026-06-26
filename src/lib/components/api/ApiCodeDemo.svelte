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

	// Single-quoted span attributes so the string regex ("...") never matches inside them
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

<div class="demo-section">
	<div class="container mb-16">
		<div class="text-center mb-8">
			<h2 class="text-2xl font-bold mb-2">See it in action</h2>
			<p class="section-desc">
				One request returns <span class="live-tag">live</span> rates across every provider we track.
			</p>
		</div>

		<div class="demo-grid max-w-5xl mx-auto">
			<!-- Request panel -->
			<div class="demo-panel panel-request">
				<div class="panel-bar">
					<div class="window-chrome">
						<span class="chrome-dot" style="background:#ff5f57"></span>
						<span class="chrome-dot" style="background:#febc2e"></span>
						<span class="chrome-dot" style="background:#28c840"></span>
					</div>
					<div class="tabs">
						<button
							on:click={() => (activeTab = 'curl')}
							class="tab"
							class:tab-active={activeTab === 'curl'}
						>cURL</button>
						<button
							on:click={() => (activeTab = 'js')}
							class="tab"
							class:tab-active={activeTab === 'js'}
						>JavaScript</button>
					</div>
					<button on:click={copyCode} class="copy-btn">
						{#if copied}
							<svg width="13" height="13" viewBox="0 0 12 12" fill="none">
								<path d="M1.5 6l3 3 6-6" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
							<span class="copy-ok">Copied</span>
						{:else}
							<svg width="13" height="13" viewBox="0 0 12 12" fill="none">
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
			<div class="demo-panel panel-response">
				<div class="panel-bar">
					<div class="window-chrome">
						<span class="chrome-dot" style="background:#ff5f57"></span>
						<span class="chrome-dot" style="background:#febc2e"></span>
						<span class="chrome-dot" style="background:#28c840"></span>
					</div>
					<span class="status-badge">
						<span class="status-dot"></span>
						200 OK
					</span>
					<span class="content-type">application/json</span>
				</div>
				<pre class="code-pre"><code>{@html highlightedJson}</code></pre>
			</div>
		</div>

		<div class="text-center mt-5">
			<a
				href="https://docs.monierate.com"
				target="_blank"
				rel="noopener noreferrer"
				class="docs-link"
			>
				View full API documentation →
			</a>
		</div>
	</div>
</div>

<style>
	.demo-section {
		position: relative;
	}

	.section-desc {
		font-size: 0.875rem;
		color: #6b7280;
	}

	:global(.dark) .section-desc {
		color: #9ca3af;
	}

	.live-tag {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		color: #4ade80;
		font-weight: 600;
	}

	.live-tag::before {
		content: '';
		display: inline-block;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #4ade80;
		animation: pulse-dot 2s ease-in-out infinite;
	}

	.demo-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	@media (max-width: 768px) {
		.demo-grid { grid-template-columns: 1fr; }
	}

	.demo-panel {
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.07);
		background: #0d0d0d;
		display: flex;
		flex-direction: column;
		height: 270px;
		transition: box-shadow 0.2s ease, border-color 0.2s ease;
	}

	.panel-request {
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
	}

	.panel-request:hover {
		border-color: rgba(96, 165, 250, 0.2);
		box-shadow: 0 4px 32px rgba(96, 165, 250, 0.08), 0 2px 8px rgba(0,0,0,0.3);
	}

	.panel-response {
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
	}

	.panel-response:hover {
		border-color: rgba(74, 222, 128, 0.2);
		box-shadow: 0 4px 32px rgba(74, 222, 128, 0.08), 0 2px 8px rgba(0,0,0,0.3);
	}

	.panel-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 14px;
		height: 40px;
		background: #0d0d0d;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		flex-shrink: 0;
	}

	.window-chrome {
		display: flex;
		align-items: center;
		gap: 5px;
		flex-shrink: 0;
	}

	.chrome-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		opacity: 0.85;
	}

	.tabs {
		display: flex;
		gap: 2px;
	}

	.tab {
		padding: 4px 12px;
		border-radius: 6px;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
		border: none;
		background: transparent;
		color: #6e7681;
		transition: background 0.15s, color 0.15s;
	}

	.tab:hover { color: #c9d1d9; }

	.tab-active {
		background: #21262d;
		color: #e6edf3;
		box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
	}

	.copy-btn {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 12px;
		color: #6e7681;
		background: transparent;
		border: none;
		cursor: pointer;
		transition: color 0.15s;
		padding: 0;
	}

	.copy-btn:hover { color: #c9d1d9; }

	.copy-ok { color: #4ade80; }

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 600;
		color: #4ade80;
	}

	.status-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #4ade80;
		box-shadow: 0 0 6px #4ade80;
		animation: pulse-dot 2s ease-in-out infinite;
	}

	@keyframes pulse-dot {
		0%, 100% { opacity: 1; transform: scale(1); }
		50%       { opacity: 0.55; transform: scale(0.85); }
	}

	.content-type {
		font-size: 12px;
		color: #6e7681;
	}

	.code-pre {
		font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
		font-size: 0.75rem;
		line-height: 1.75;
		padding: 18px 20px;
		margin: 0;
		overflow-x: auto;
		white-space: pre;
		background: #0d0d0d;
		color: #d1d5db;
		flex: 1;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: #30363d transparent;
	}

	.code-pre::-webkit-scrollbar { height: 4px; width: 4px; }
	.code-pre::-webkit-scrollbar-track { background: transparent; }
	.code-pre::-webkit-scrollbar-thumb {
		background: #30363d;
		border-radius: 2px;
	}

	.docs-link {
		font-size: 0.875rem;
		font-weight: 500;
		color: #60a5fa;
		text-decoration: none;
		transition: color 0.15s, text-decoration 0.15s;
	}

	.docs-link:hover {
		color: #93c5fd;
		text-decoration: underline;
	}

	/* One Dark–inspired syntax colors */
	:global(.hl-key)    { color: #79c0ff; }
	:global(.hl-str)    { color: #a5d6ff; }
	:global(.hl-num)    { color: #d19a66; }
	:global(.hl-bool)   { color: #56b6c2; }
	:global(.hl-null)   { color: #56b6c2; }
	:global(.hl-kw)     { color: #ff7b72; }
	:global(.hl-fn)     { color: #d2a8ff; }
	:global(.hl-flag)   { color: #56b6c2; }
	:global(.hl-method) { color: #7ee787; }
</style>
