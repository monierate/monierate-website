<script lang="ts">
	import currencies from '$data/currencies.json';

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
		hrefFor = (code: string) => `/markets/${code}`
	}: {
		/** Uppercase currency codes for the pair currently shown, e.g. USD / NGN. */
		base: string;
		quote: string;
		/** Lowercase code of the pair currently shown, e.g. usdngn. */
		pairCode: string;
		options?: PairOption[];
		/** Where selecting a pair navigates to. */
		hrefFor?: (code: string) => string;
	} = $props();

	const NAMES: Record<string, string> = { ...currencies.fiat, ...currencies.coins };

	const pairDisplay = $derived(`${base}/${quote}`);
	const hasOptions = $derived(options.length > 1);

	let open = $state(false);
	let wrap = $state<HTMLDivElement>();

	function close() {
		open = false;
	}

	function onWindowClick(e: MouseEvent) {
		if (open && wrap && !wrap.contains(e.target as Node)) close();
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
				onclick={() => (open = !open)}
				aria-haspopup="listbox"
				aria-expanded={open}
				class="inline-flex items-center gap-1 -mx-1 px-1 rounded-md cursor-pointer transition-colors hover:bg-[var(--table-hover)]"
				style="font: inherit; color: inherit;"
			>
				{pairDisplay}
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="transition-transform {open ? 'rotate-180' : ''}"
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
			role="listbox"
			tabindex="-1"
			class="absolute left-0 top-full z-30 mt-1.5 max-h-[320px] w-[240px] overflow-y-auto rounded-xl border py-1 shadow-lg"
			style="background: var(--card-bg); border-color: var(--card-border);"
		>
			{#each options as opt (opt.code)}
				{@const current = opt.code === pairCode}
				<a
					href={hrefFor(opt.code)}
					role="option"
					aria-selected={current}
					onclick={close}
					class="flex items-center justify-between gap-3 px-3 py-2 text-[13px] transition-colors hover:bg-[var(--table-hover)]"
					style="color: {current ? 'var(--text-primary)' : 'var(--text-secondary)'};"
				>
					<span class="tabular-nums font-semibold" style="font-family: var(--font-mono);">
						{opt.base}/{opt.quote}
					</span>
					<span class="min-w-0 truncate text-right text-[12px]" style="color: var(--text-muted);">
						{NAMES[opt.base] ?? opt.base} / {NAMES[opt.quote] ?? opt.quote}
					</span>
				</a>
			{/each}
		</div>
	{/if}
</div>
