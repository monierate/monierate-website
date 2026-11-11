<script lang="ts">
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';
	import {
		currencyName,
		displayCode,
		groupFor,
		groupPairs,
		pairLabel,
		searchPairs,
		sortPairs
	} from '$lib/utils/marketPairs';

	interface PairOption {
		code: string;
		base: string;
		quote: string;
	}

	let {
		base,
		quote,
		pairCode,
		options = [],
		selectedQuote = '',
		hrefFor = (code: string) => `/markets/${code}`
	}: {
		/** Uppercase currency codes for the pair currently shown, e.g. USD / NGN. */
		base: string;
		quote: string;
		/** Lowercase code of the pair currently shown, e.g. usdngn. */
		pairCode: string;
		options?: PairOption[];
		/**
		 * The quote currency selected in the header (NGN / KES). Its pairs are listed
		 * first; every other pair is still listed below them.
		 */
		selectedQuote?: string;
		/** Where selecting a pair navigates to. */
		hrefFor?: (code: string) => string;
	} = $props();

	const pairDisplay = $derived(`${displayCode(base)}/${displayCode(quote)}`);

	const sorted = $derived(sortPairs(options, selectedQuote ? groupFor(selectedQuote).key : undefined));
	const hasOptions = $derived(options.length > 1);

	let query = $state('');
	const searching = $derived(query.trim().length > 0);
	const results = $derived(searching ? searchPairs(sorted, query) : sorted);
	const groups = $derived(groupPairs(results));

	// Keyboard highlight, an index into `results`. Reset whenever the list changes.
	let active = $state(0);
	$effect(() => {
		void results;
		active = 0;
	});

	let open = $state(false);
	let wrap = $state<HTMLDivElement>();
	let input = $state<HTMLInputElement>();
	let list = $state<HTMLDivElement>();

	async function toggle() {
		open = !open;
		if (!open) return;
		query = '';
		await tick();
		input?.focus();
		// Start with the current pair in view rather than at the top of a long list.
		list?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'center' });
	}

	function close() {
		open = false;
	}

	function onWindowClick(e: MouseEvent) {
		if (open && wrap && !wrap.contains(e.target as Node)) close();
	}

	async function onSearchKey(e: KeyboardEvent) {
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
			if (!results.length) return;
			const step = e.key === 'ArrowDown' ? 1 : -1;
			active = (active + step + results.length) % results.length;
			await tick();
			list?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const target = results[active];
			if (!target) return;
			close();
			goto(hrefFor(target.code));
		}
	}
</script>

<svelte:window onclick={onWindowClick} onkeydown={(e) => e.key === 'Escape' && close()} />

<div class="relative" bind:this={wrap}>
	<h1
		class="text-[18px] font-bold leading-tight tabular-nums"
		style="font-family: var(--font-mono); color: var(--text-primary);"
	>
		{#if hasOptions}
			<button
				type="button"
				onclick={toggle}
				aria-haspopup="listbox"
				aria-expanded={open}
				class="inline-flex items-center gap-1 -mx-1 px-1 rounded-md cursor-pointer transition-colors hover:bg-[var(--table-hover)]"
				style="font: inherit; color: inherit;"
			>
				{pairDisplay}
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="shrink-0 transition-transform {open ? 'rotate-180' : ''}"
					style="color: var(--text-muted);"
					aria-hidden="true"
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			</button>
		{:else}
			{pairDisplay}
		{/if}
	</h1>

	{#if open}
		<div
			class="absolute left-0 top-full z-30 mt-1.5 flex w-[min(320px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border shadow-lg"
			style="background: var(--card-bg); border-color: var(--card-border);"
		>
			<div class="border-b p-2" style="border-color: var(--card-border);">
				<input
					bind:this={input}
					bind:value={query}
					onkeydown={onSearchKey}
					type="search"
					placeholder="Search pairs, e.g. USDT ZAR or rand"
					aria-label="Search pairs"
					aria-controls="pair-switcher-list"
					autocomplete="off"
					spellcheck="false"
					class="w-full rounded-lg border px-3 py-2 text-[13px] outline-none focus:border-[var(--accent)]"
					style="background: var(--input-bg); border-color: var(--input-border); color: var(--text-primary);"
				/>
			</div>

			<div bind:this={list} id="pair-switcher-list" role="listbox" tabindex="-1" class="max-h-[340px] overflow-y-auto py-1">
				{#each groups as { group, pairs } (group.key)}
					<div
						class="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide"
						style="color: var(--text-muted);"
					>
						{group.label}
					</div>
					{#each pairs as opt (opt.code)}
						{@const current = opt.code === pairCode}
						{@const index = results.indexOf(opt)}
						<a
							href={hrefFor(opt.code)}
							role="option"
							aria-selected={current}
							data-index={index}
							onclick={close}
							onmouseenter={() => (active = index)}
							class="flex items-center justify-between gap-3 px-3 py-2 text-[13px] transition-colors"
							style="color: {current ? 'var(--text-primary)' : 'var(--text-secondary)'}; background: {index === active
								? 'var(--table-hover)'
								: 'transparent'};"
						>
							<span class="flex shrink-0 items-center gap-2">
								<img
									src="/icons/currencies/{opt.base.toLowerCase()}.png"
									alt=""
									loading="lazy"
									onerror={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = 'hidden')}
									class="h-4 w-4 rounded-full object-cover"
									style="border: 1px solid var(--card-border);"
								/>
								<span class="tabular-nums font-semibold" style="font-family: var(--font-mono);">
									{pairLabel(opt)}
								</span>
							</span>
							<span class="min-w-0 truncate text-right text-[12px]" style="color: var(--text-muted);">
								{currencyName(opt.base)} / {currencyName(opt.quote)}
							</span>
						</a>
					{/each}
				{:else}
					<p class="px-3 py-6 text-center text-[13px]" style="color: var(--text-muted);">
						No pair matches “{query.trim()}”.
					</p>
				{/each}
			</div>

			<a
				href="/markets"
				onclick={close}
				class="flex items-center justify-between border-t px-3 py-2.5 text-[13px] font-medium transition-colors hover:bg-[var(--table-hover)]"
				style="border-color: var(--card-border); color: var(--text-primary);"
			>
				View all markets
				<span aria-hidden="true">→</span>
			</a>
		</div>
	{/if}
</div>
