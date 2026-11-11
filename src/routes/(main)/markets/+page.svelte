<script lang="ts">
	import Seo from '$lib/components/seo/Seo.svelte';
	import MarketRow from '$lib/components/markets/MarketRow.svelte';
	import { MARKET_GROUPS, groupFor, groupPairs, searchPairs, type MarketCard } from '$lib/utils/marketPairs';

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

	<!-- One row per currency. Each row slides on by itself; the rows start a
	     little apart so the page never moves all at once. -->
	{#each sections as { group, pairs }, i (group.key)}
		<section class="mt-9">
			<h2 class="mb-3 flex items-baseline gap-2 text-[16px] font-semibold" style="color: var(--text-primary);">
				{group.label}
				<span class="text-[13px] font-normal tabular-nums" style="color: var(--text-muted);">{pairs.length}</span>
			</h2>
			<MarketRow cards={pairs} delay={i * 500} />
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
