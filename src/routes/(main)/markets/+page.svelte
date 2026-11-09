<script lang="ts">
	import Seo from '$lib/components/seo/Seo.svelte';
	import { CURRENCY_SYMBOLS } from '$lib/constants/currency';
	import { formatRate } from '$lib/utils/rateFormat';
	import {
		MARKET_GROUPS,
		currencyName,
		displayCode,
		groupFor,
		groupPairs,
		pairLabel,
		searchPairs,
		type MarketCard
	} from '$lib/utils/marketPairs';

	let { data } = $props();

	const cards: MarketCard[] = $derived(data.cards ?? []);

	let query = $state('');
	let filter = $state('ALL');

	const CHIP_LABEL: Record<string, string> = { CFA: 'XAF / XOF', OTHER: 'Other' };

	const chips = $derived([
		{ key: 'ALL', label: 'All', count: cards.length },
		...MARKET_GROUPS.map((g) => ({
			key: g.key,
			label: CHIP_LABEL[g.key] ?? g.key,
			count: cards.filter((c) => groupFor(c.quote).key === g.key).length
		})).filter((c) => c.count > 0)
	]);

	const visible = $derived.by(() => {
		const inGroup = filter === 'ALL' ? cards : cards.filter((c) => groupFor(c.quote).key === filter);
		return query.trim() ? searchPairs(inGroup, query) : inGroup;
	});
	const sections = $derived(groupPairs(visible));

	// Stablecoins and cNGN have no symbol of their own (USDT's `$` would read as
	// dollars), so those quotes, and any without a symbol, get the code after the number.
	const STABLE_QUOTES = new Set(['usdt', 'usdc', 'cngn']);
	function money(value: number, quote: string): string {
		const q = quote.toLowerCase();
		const symbol = STABLE_QUOTES.has(q) ? '' : CURRENCY_SYMBOLS[q];
		return symbol ? `${symbol}${formatRate(value)}` : `${formatRate(value)} ${displayCode(quote)}`;
	}

	const pct = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(2)}%`;

	// Fixed to UTC so the server render and the browser agree on the text.
	const updated = $derived(
		data.updatedAt
			? new Date(data.updatedAt).toLocaleString('en-GB', {
					timeZone: 'UTC',
					day: 'numeric',
					month: 'short',
					hour: '2-digit',
					minute: '2-digit'
				}) + ' UTC'
			: null
	);
</script>

<Seo {...data.seo} />

<!-- The quote currency's icon is a small badge over the base's, ringed in the card
     colour so the two read as one mark. -->
{#snippet currencyIcon(code: string, size: number, badge = false)}
	<span
		class="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold {badge
			? 'absolute -bottom-1 -right-1.5'
			: 'relative'}"
		style="width: {size}px; height: {size}px; font-size: {Math.round(size * 0.32)}px; background: var(--badge-neutral-bg); color: var(--text-secondary); border: {badge
			? '2px solid var(--card-bg)'
			: '1px solid var(--card-border)'};"
		aria-hidden="true"
	>
		{displayCode(code).slice(0, 3)}
		<img
			src="/icons/currencies/{code.toLowerCase()}.png"
			alt=""
			loading="lazy"
			onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
			class="absolute inset-0 h-full w-full object-cover"
		/>
	</span>
{/snippet}

<!-- Container mirrors Breadcrumb.svelte so the page gutter lines up with the breadcrumb bar. -->
<div class="mx-auto w-[95%] px-4 py-8 md:max-w-[1200px]">
	<header class="max-w-[720px]">
		<h1 class="text-[28px] font-bold leading-tight md:text-[34px]" style="font-family: var(--font-head); color: var(--text-primary);">
			Markets
		</h1>
		<p class="mt-2 text-[15px] leading-relaxed" style="color: var(--text-secondary);">
			Every currency pair Monierate tracks, {cards.length} in all. Each rate is built from live quotes across
			exchanges, P2P desks and money transfer apps. Open a pair to compare its providers, history and converter.
		</p>
		{#if updated}
			<p class="mt-1 text-[13px]" style="color: var(--text-muted);">Updated {updated}</p>
		{/if}
	</header>

	<div class="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
		<label class="relative block w-full md:max-w-[340px]">
			<span class="sr-only">Search pairs</span>
			<svg
				class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				style="color: var(--text-muted);"
				aria-hidden="true"
			>
				<circle cx="11" cy="11" r="7" />
				<path d="m20 20-3.5-3.5" />
			</svg>
			<input
				bind:value={query}
				type="search"
				placeholder="Search, e.g. USDT ZAR or rand"
				autocomplete="off"
				spellcheck="false"
				class="w-full rounded-lg border py-2.5 pl-9 pr-3 text-[14px] outline-none focus:border-[var(--accent)]"
				style="background: var(--input-bg); border-color: var(--input-border); color: var(--text-primary);"
			/>
		</label>

		<div class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:pb-0" role="group" aria-label="Filter by currency">
			{#each chips as chip (chip.key)}
				{@const on = filter === chip.key}
				<button
					type="button"
					onclick={() => (filter = chip.key)}
					aria-pressed={on}
					class="shrink-0 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors"
					style="border-color: {on ? 'var(--text-primary)' : 'var(--card-border)'}; background: {on
						? 'var(--text-primary)'
						: 'var(--card-bg)'}; color: {on ? 'var(--page-bg)' : 'var(--text-secondary)'};"
				>
					{chip.label}
					<span class="ml-0.5 tabular-nums" style="opacity: 0.6;">{chip.count}</span>
				</button>
			{/each}
		</div>
	</div>

	{#each sections as { group, pairs } (group.key)}
		<section class="mt-8">
			<h2 class="mb-3 flex items-baseline gap-2 text-[16px] font-semibold" style="color: var(--text-primary);">
				{group.label}
				<span class="text-[13px] font-normal tabular-nums" style="color: var(--text-muted);">{pairs.length}</span>
			</h2>

			<ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each pairs as c (c.code)}
					<li>
						<a
							href="/markets/{c.code}"
							class="flex h-full flex-col gap-4 rounded-xl border p-4 transition-colors hover:bg-[var(--table-hover)]"
							style="background: var(--card-bg); border-color: var(--card-border);"
						>
							<div class="flex items-start justify-between gap-2">
								<div class="flex min-w-0 items-center gap-2.5">
									<span class="relative mr-1 inline-flex shrink-0">
										{@render currencyIcon(c.base, 30)}
										{@render currencyIcon(c.quote, 18, true)}
									</span>
									<div class="min-w-0">
										<div class="text-[15px] font-semibold tabular-nums" style="font-family: var(--font-mono); color: var(--text-primary);">
											{pairLabel(c)}
										</div>
										<div class="truncate text-[12px]" style="color: var(--text-muted);">
											{currencyName(c.base)} / {currencyName(c.quote)}
										</div>
									</div>
								</div>

								{#if c.change24h === null}
									<span class="shrink-0 text-[12px]" style="color: var(--text-muted);" title="No rate from 24 hours ago yet">—</span>
								{:else}
									{@const tone = c.change24h > 0 ? 'positive' : c.change24h < 0 ? 'negative' : 'neutral'}
									<span
										class="shrink-0 rounded-md px-1.5 py-0.5 text-[12px] font-semibold tabular-nums"
										style="font-family: var(--font-mono); background: var(--badge-{tone}-bg); color: {tone === 'neutral'
											? 'var(--text-secondary)'
											: `var(--${tone})`};"
										title="24-hour change"
									>
										{pct(c.change24h)}
									</span>
								{/if}
							</div>

							<div class="mt-auto flex items-end justify-between gap-2">
								<span class="text-[20px] font-bold leading-none tabular-nums" style="font-family: var(--font-mono); color: var(--text-primary);">
									{money(c.rate, c.quote)}
								</span>
								<span class="shrink-0 text-[12px]" style="color: var(--text-muted);">
									{c.providers} {c.providers === 1 ? 'provider' : 'providers'}
								</span>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{:else}
		<div class="mt-10 rounded-xl border px-6 py-12 text-center" style="background: var(--card-bg); border-color: var(--card-border);">
			{#if cards.length === 0}
				<p class="text-[15px]" style="color: var(--text-secondary);">Rates are unavailable right now. Try again in a minute.</p>
			{:else}
				<p class="text-[15px]" style="color: var(--text-secondary);">No pair matches “{query.trim()}”.</p>
				<button
					type="button"
					onclick={() => {
						query = '';
						filter = 'ALL';
					}}
					class="mt-3 text-[14px] font-medium underline underline-offset-2"
					style="color: var(--text-primary);"
				>
					Show all pairs
				</button>
			{/if}
		</div>
	{/each}
</div>
