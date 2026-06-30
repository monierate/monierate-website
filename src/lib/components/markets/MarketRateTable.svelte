<script lang="ts">
	import type { MarketCurrencyRate, RateMode } from '$lib/types/market';
	import currencySymbols from '$data/currency-symbols.json';

	export let rates: MarketCurrencyRate[] = [];
	export let rateMode: RateMode = 'single';
	export let base = 'NGN';

	$: symbol = (currencySymbols as Record<string, string>)[base] ?? '';

	const PAGE_SIZE = 20;

	let query = '';
	let visible = PAGE_SIZE;

	$: filtered = (() => {
		const q = query.trim().toLowerCase();
		if (!q) return rates;
		return rates.filter(
			(r) => r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)
		);
	})();

	// Reset pagination whenever the search changes.
	$: query, (visible = PAGE_SIZE);

	$: shown = filtered.slice(0, visible);
	$: hasMore = filtered.length > visible;

	const fmt = (value: number | undefined): string => {
		if (value === undefined || value === null || Number.isNaN(value)) return '—';
		const decimals = value >= 100 ? 2 : value >= 1 ? 3 : 5;
		const formatted = new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: decimals
		}).format(value);
		return `${symbol}${formatted}`;
	};

	const flagSrc = (cc: string, size: 'w40' | 'w80') =>
		`https://flagcdn.com/${size}/${cc.toLowerCase()}.png`;

	const showMore = () => (visible += PAGE_SIZE);
</script>

<div class="market-table">
	<div class="toolbar">
		<div class="search">
			<svg
				class="search-icon"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
					clip-rule="evenodd"
				/>
			</svg>
			<input
				type="search"
				bind:value={query}
				placeholder="Search currency name or code…"
				aria-label="Search currencies"
			/>
		</div>
		<span class="count">{filtered.length} currencies</span>
	</div>

	<!-- Header row -->
	<div class="row head" class:single={rateMode === 'single'}>
		<div class="col-currency">Currency</div>
		{#if rateMode === 'single'}
			<div class="col-rate">Rate ({base})</div>
		{:else}
			<div class="col-rate">Buy ({base})</div>
			<div class="col-rate">Sell ({base})</div>
		{/if}
		<div class="col-change">24h</div>
	</div>

	{#if shown.length === 0}
		<div class="empty">
			{#if query.trim()}
				No currencies match “{query}”.
			{:else}
				No rates available yet. Check back soon.
			{/if}
		</div>
	{/if}

	{#each shown as r (r.code)}
		<div class="row" class:single={rateMode === 'single'}>
			<div class="col-currency">
				<img
					class="flag"
					src={flagSrc(r.countryCode, 'w40')}
					srcset={`${flagSrc(r.countryCode, 'w40')} 1x, ${flagSrc(r.countryCode, 'w80')} 2x`}
					width="28"
					height="21"
					loading="lazy"
					alt={r.code}
				/>
				<span class="cur-text">
					<span class="cur-code">{r.code}</span>
					<span class="cur-name">{r.name}</span>
				</span>
			</div>

			{#if rateMode === 'single'}
				<div class="col-rate mono">{fmt(r.rate)}</div>
			{:else}
				<div class="col-rate mono">{fmt(r.buy)}</div>
				<div class="col-rate mono">{fmt(r.sell)}</div>
			{/if}

			<div class="col-change">
				{#if r.change !== undefined && r.change !== 0}
					<span class="badge" class:up={r.change > 0} class:down={r.change < 0}>
						{r.change > 0 ? '▲' : '▼'}
						{Math.abs(r.change).toFixed(2)}%
					</span>
				{:else}
					<span class="badge flat">0.00%</span>
				{/if}
			</div>
		</div>
	{/each}

	{#if hasMore}
		<div class="more">
			<button type="button" class="more-btn" on:click={showMore}>
				Show {Math.min(PAGE_SIZE, filtered.length - visible)} more
			</button>
		</div>
	{/if}
</div>

<style>
	.market-table {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: 1rem;
		overflow: hidden;
	}

	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem;
		border-bottom: 1px solid var(--card-border);
	}
	.search {
		position: relative;
		flex: 1;
		max-width: 28rem;
	}
	.search-icon {
		position: absolute;
		left: 0.875rem;
		top: 50%;
		transform: translateY(-50%);
		width: 1.05rem;
		height: 1.05rem;
		color: var(--text-muted);
		pointer-events: none;
	}
	.search input {
		width: 100%;
		padding: 0.65rem 0.9rem 0.65rem 2.5rem;
		border-radius: 0.75rem;
		background: var(--input-bg);
		border: 1px solid var(--input-border);
		color: var(--text-primary);
		font-size: 0.9rem;
	}
	.search input:focus {
		outline: none;
		border-color: var(--accent);
		box-shadow: 0 0 0 3px var(--accent-light);
	}
	.count {
		font-size: 0.8rem;
		color: var(--text-muted);
		white-space: nowrap;
	}

	/* Row grid: currency | rate(s) | change */
	.row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 7.5rem 7.5rem 6rem;
		align-items: center;
		gap: 1rem;
		padding: 0.85rem 1rem;
		border-bottom: 1px solid var(--card-border);
	}
	.row.single {
		grid-template-columns: minmax(0, 1fr) 9rem 6rem;
	}
	.row:last-child {
		border-bottom: none;
	}
	.row:not(.head):hover {
		background: var(--table-hover);
	}
	.row.head {
		position: sticky;
		top: 0;
		background: var(--table-header-bg);
		font-family: var(--font-head);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-muted);
		z-index: 1;
	}

	.col-currency {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-width: 0;
	}
	.col-rate {
		text-align: right;
	}
	.col-change {
		text-align: right;
	}

	.flag {
		width: 28px;
		height: 21px;
		object-fit: cover;
		border-radius: 3px;
		flex-shrink: 0;
		box-shadow: 0 0 0 1px var(--card-border);
	}
	.head .col-currency {
		padding-left: calc(28px + 0.75rem);
	}
	.cur-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.cur-code {
		font-family: var(--font-head);
		font-weight: 600;
		font-size: 0.92rem;
		color: var(--text-primary);
	}
	.cur-name {
		font-size: 0.78rem;
		color: var(--text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.mono {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		color: var(--text-primary);
		font-variant-numeric: tabular-nums;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		font-size: 0.74rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		padding: 0.15rem 0.45rem;
		border-radius: 0.5rem;
	}
	.badge.up {
		color: var(--positive);
		background: var(--badge-positive-bg);
	}
	.badge.down {
		color: var(--negative);
		background: var(--badge-negative-bg);
	}
	.badge.flat {
		color: var(--text-muted);
		background: var(--badge-neutral-bg);
	}

	.empty {
		padding: 2.5rem 1rem;
		text-align: center;
		color: var(--text-muted);
		font-size: 0.9rem;
	}

	.more {
		display: flex;
		justify-content: center;
		padding: 1rem;
		border-top: 1px solid var(--card-border);
	}
	.more-btn {
		font-family: var(--font-head);
		font-weight: 600;
		font-size: 0.85rem;
		padding: 0.6rem 1.4rem;
		border-radius: 0.75rem;
		color: var(--accent);
		background: transparent;
		border: 1px solid var(--card-border);
		transition:
			background 0.15s ease,
			border-color 0.15s ease;
	}
	.more-btn:hover {
		background: var(--accent-light);
		border-color: var(--accent);
	}

	@media (max-width: 640px) {
		.row {
			grid-template-columns: minmax(0, 1fr) 5.5rem 5.5rem;
			gap: 0.5rem;
		}
		.row.single {
			grid-template-columns: minmax(0, 1fr) 7rem;
		}
		.col-change {
			display: none;
		}
		.cur-name {
			display: none;
		}
	}
</style>
