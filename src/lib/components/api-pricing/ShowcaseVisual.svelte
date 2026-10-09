<script lang="ts">
	let { variant }: { variant: 'speed' | 'developer' | 'stablecoin' | 'reliable' | 'markets' } = $props();

	const stableRows = [
		{ name: 'Binance P2P', icon: 'binance_p2p.svg', buy: '1,613.00', sell: '1,608.50' },
		{ name: 'Bybit', icon: 'bybit.svg', buy: '1,611.40', sell: '1,606.90' },
		{ name: 'Quidax', icon: 'quidax.svg', buy: '1,609.00', sell: '1,604.00' },
		{ name: 'Busha', icon: 'busha.svg', buy: '1,608.20', sell: '1,603.10' }
	];

	const bars = [42, 55, 48, 63, 58, 70, 66, 74, 69, 80, 77, 85];
</script>

<div class="visual">
	<div class="blob"></div>

	{#if variant === 'speed'}
		<div class="panel">
			<div class="label">Median response time</div>
			<div class="big">4<span class="unit">ms</span></div>
			<div class="track"><div class="fill" style="width: 12%"></div></div>
			<div class="row-list">
				{#each [['Latest rates', '4ms'], ['Pairs list', '6ms'], ['Daily history', '11ms']] as r}
					<div class="row"><span>{r[0]}</span><span class="mono ok">{r[1]}</span></div>
				{/each}
			</div>
		</div>
	{:else if variant === 'developer'}
		<div class="panel dark">
			<div class="mono code">
				<div><span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(url, {'{'}</div>
				<div>&nbsp;&nbsp;headers: {'{'} Authorization: <span class="str">`Bearer $&#123;KEY&#125;`</span> {'}'}</div>
				<div>{'}'});</div>
				<div><span class="kw">const</span> {'{'} results {'}'} = <span class="kw">await</span> res.<span class="fn">json</span>();</div>
				<div class="cm">// results.binance_p2p = 1613.00</div>
			</div>
			<div class="badge-ok">200 OK in 4ms</div>
		</div>
	{:else if variant === 'stablecoin'}
		<div class="panel">
			<div class="flex items-center justify-between mb-3">
				<div class="label !mb-0">USDT to NGN</div>
				<div class="live"><span class="pulse"></span>Live</div>
			</div>
			<div class="row head"><span>Provider</span><span>Buy</span><span>Sell</span></div>
			{#each stableRows as r}
				<div class="row three">
					<span class="flex items-center gap-2 min-w-0">
						<img src="/icons/svg/{r.icon}" alt="" width="18" height="18" class="w-[18px] h-[18px] rounded shrink-0" />
						<span class="truncate">{r.name}</span>
					</span>
					<span class="mono">{r.buy}</span>
					<span class="mono">{r.sell}</span>
				</div>
			{/each}
		</div>
	{:else if variant === 'reliable'}
		<div class="panel">
			<div class="label">Providers reporting</div>
			<div class="big">90<span class="unit">+</span></div>
			<div class="chips">
				{#each ['P2P', 'Spot', 'Fintech', 'Remittance', 'Bureau', 'Official'] as c}
					<span class="chip">{c}</span>
				{/each}
			</div>
			<div class="row"><span>Refresh cadence</span><span class="mono ok">Continuous</span></div>
		</div>
	{:else}
		<div class="panel">
			<div class="flex items-center justify-between mb-3">
				<div class="label !mb-0">USD to NGN</div>
				<div class="flex gap-3 text-[10px]" style="color: var(--text-muted);">
					<span class="flex items-center gap-1"><span class="sw" style="background: var(--accent);"></span>Parallel</span>
					<span class="flex items-center gap-1"><span class="sw" style="background: var(--positive);"></span>Official</span>
				</div>
			</div>
			<div class="bars">
				{#each bars as b, i}
					<div class="bar-pair">
						<div class="bar" style="height: {b}%; background: var(--accent);"></div>
						<div class="bar" style="height: {b - 12 - (i % 3) * 3}%; background: var(--positive);"></div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.visual {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 32px 12px;
		min-height: 300px;
	}
	.blob {
		position: absolute;
		inset: 10% 8%;
		border-radius: 40% 60% 55% 45% / 50% 40% 60% 50%;
		background: var(--accent-light);
		transform: rotate(-8deg);
	}
	.panel {
		position: relative;
		width: 100%;
		max-width: 340px;
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: 16px;
		padding: 20px;
		box-shadow: 0 20px 50px rgba(56, 97, 251, 0.15);
		transform: perspective(900px) rotateY(-6deg) rotateX(3deg);
	}
	.panel.dark {
		background: #0d0d0d;
		border-color: rgba(255, 255, 255, 0.08);
	}
	.label {
		font-family: var(--font-head);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 8px;
	}
	.big {
		font-family: var(--font-head);
		font-size: 44px;
		font-weight: 800;
		line-height: 1;
		color: var(--accent);
		margin-bottom: 14px;
	}
	.unit {
		font-size: 18px;
		margin-left: 2px;
		color: var(--text-secondary);
	}
	.track {
		height: 6px;
		border-radius: 3px;
		background: var(--badge-neutral-bg);
		margin-bottom: 14px;
		overflow: hidden;
	}
	.fill {
		height: 100%;
		background: var(--positive);
	}
	.row-list {
		display: flex;
		flex-direction: column;
	}
	.row {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		padding: 8px 0;
		font-size: 12px;
		color: var(--text-secondary);
		border-top: 1px solid var(--card-border);
	}
	.row.three,
	.row.head {
		display: grid;
		grid-template-columns: 1.6fr 1fr 1fr;
		text-align: right;
	}
	.row.three > :first-child,
	.row.head > :first-child {
		text-align: left;
	}
	.row.three {
		color: var(--text-primary);
	}
	.row.head {
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-muted);
	}
	.mono {
		font-family: 'JetBrains Mono', 'Consolas', monospace;
	}
	.ok {
		color: var(--positive);
		font-weight: 600;
	}
	.code {
		font-size: 11.5px;
		line-height: 1.9;
		color: #d1d5db;
		white-space: nowrap;
		overflow-x: auto;
	}
	.kw { color: #ff7b72; }
	.fn { color: #d2a8ff; }
	.str { color: #a5d6ff; }
	.cm { color: #6e7681; }
	.badge-ok {
		display: inline-block;
		margin-top: 14px;
		font-size: 11px;
		font-weight: 600;
		color: #4ade80;
		background: rgba(74, 222, 128, 0.1);
		padding: 3px 10px;
		border-radius: 999px;
	}
	.live {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 11px;
		font-weight: 600;
		color: var(--positive);
	}
	.pulse {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--positive);
		animation: pulse 2s ease-in-out infinite;
	}
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 12px;
	}
	.chip {
		font-size: 11px;
		font-weight: 500;
		padding: 3px 10px;
		border-radius: 999px;
		background: var(--accent-light);
		color: var(--accent);
	}
	.sw {
		width: 8px;
		height: 8px;
		border-radius: 2px;
		display: inline-block;
	}
	.bars {
		display: flex;
		align-items: flex-end;
		gap: 6px;
		height: 160px;
	}
	.bar-pair {
		flex: 1;
		display: flex;
		align-items: flex-end;
		gap: 2px;
		height: 100%;
	}
	.bar {
		flex: 1;
		border-radius: 3px 3px 0 0;
	}
</style>
