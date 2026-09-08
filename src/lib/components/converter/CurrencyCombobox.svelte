<script lang="ts">
	import { tick } from 'svelte';
	import CurrencyIcon from './CurrencyIcon.svelte';
	import type { ConverterCurrency } from '$lib/utils/converterCurrencies';

	/**
	 * The currency picker.
	 *
	 * A native `<select>` carrying 90+ options — what this page used to ship — is
	 * unusable on the one currency somebody actually wants: no search, and on mobile
	 * it opens a wheel you scroll for ten seconds. This is a listbox with a filter,
	 * which is what every converter people already know (XE, Wise, Revolut) uses.
	 *
	 * Built as button + popover rather than a `<datalist>` so the pinned block, the
	 * icons and the code/name split all render, and so the value can only ever be a
	 * currency we actually hold — a free-text input would let someone type "dollars"
	 * and land on a 404.
	 */

	let {
		currencies,
		value,
		label,
		id,
		onSelect
	}: {
		currencies: ConverterCurrency[];
		/** Uppercase code. */
		value: string;
		label: string;
		id: string;
		onSelect: (code: string) => void;
	} = $props();

	let open = $state(false);
	let query = $state('');
	let activeIndex = $state(0);
	let container: HTMLElement | null = $state(null);
	let searchInput: HTMLInputElement | null = $state(null);
	let listbox: HTMLElement | null = $state(null);

	const selected = $derived(
		currencies.find((c) => c.code === value) ?? {
			code: value,
			name: value,
			symbol: '',
			description: '',
			icon: '',
			pinned: false
		}
	);

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return currencies;

		// Code matches rank above name matches, so typing "gb" puts GBP first
		// rather than burying it under every currency with "gb" in its name.
		const byCode = currencies.filter((c) => c.code.toLowerCase().startsWith(q));
		const byName = currencies.filter(
			(c) => !c.code.toLowerCase().startsWith(q) && c.name.toLowerCase().includes(q)
		);

		return [...byCode, ...byName];
	});

	// The pinned block only makes sense on the unfiltered list; once somebody is
	// searching, relevance order is the only order that matters.
	const showPinnedDivider = $derived(!query.trim());

	async function toggle() {
		open = !open;
		if (!open) return;

		query = '';
		activeIndex = Math.max(
			0,
			currencies.findIndex((c) => c.code === value)
		);

		await tick();
		searchInput?.focus();
		scrollActiveIntoView();
	}

	function close() {
		open = false;
		query = '';
	}

	function choose(code: string) {
		close();
		if (code !== value) onSelect(code);
	}

	function scrollActiveIntoView() {
		listbox
			?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
			?.scrollIntoView({ block: 'nearest' });
	}

	async function move(delta: number) {
		if (!filtered.length) return;
		activeIndex = (activeIndex + delta + filtered.length) % filtered.length;
		await tick();
		scrollActiveIntoView();
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.stopPropagation();
			close();
			return;
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			move(1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			move(-1);
		} else if (event.key === 'Enter') {
			event.preventDefault();
			const pick = filtered[activeIndex];
			if (pick) choose(pick.code);
		} else if (event.key === 'Home') {
			event.preventDefault();
			activeIndex = 0;
			tick().then(scrollActiveIntoView);
		} else if (event.key === 'End') {
			event.preventDefault();
			activeIndex = filtered.length - 1;
			tick().then(scrollActiveIntoView);
		}
	}

	// Filtering invalidates the old highlight position.
	$effect(() => {
		void query;
		activeIndex = 0;
	});

	$effect(() => {
		if (!open) return;

		const onPointerDown = (event: PointerEvent) => {
			if (container && !container.contains(event.target as Node)) close();
		};

		document.addEventListener('pointerdown', onPointerDown);
		return () => document.removeEventListener('pointerdown', onPointerDown);
	});
</script>

<div class="relative" bind:this={container}>
	<span
		class="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
		style="color: var(--text-secondary);"
		aria-hidden="true">{label}</span
	>

	<button
		{id}
		type="button"
		class="w-full flex items-center gap-2.5 px-3.5 h-[54px] rounded-xl text-left transition-colors"
		style="background: var(--input-bg); border: 1px solid var(--input-border); color: var(--text-primary);"
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-label="{label}: {selected.code} — {selected.name}"
		onclick={toggle}
	>
		<CurrencyIcon code={selected.code} icon={selected.icon} size={22} />
		<span class="min-w-0 flex-1">
			<span class="block text-[15px] font-bold leading-tight" style="font-family: var(--font-mono);"
				>{selected.code}</span
			>
			<span
				class="block text-[11px] leading-tight truncate"
				style="color: var(--text-secondary);">{selected.name}</span
			>
		</span>
		<svg
			class="flex-shrink-0 transition-transform"
			style="color: var(--text-muted); transform: rotate({open ? 180 : 0}deg);"
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.4"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<polyline points="6 9 12 15 18 9" />
		</svg>
	</button>

	{#if open}
		<div
			class="absolute z-30 mt-1.5 w-full rounded-xl overflow-hidden shadow-lg"
			style="background: var(--overlay-bg); border: 1px solid var(--card-border);"
		>
			<div class="p-2" style="border-bottom: 1px solid var(--card-border);">
				<!-- svelte-ignore a11y_autofocus -->
				<input
					bind:this={searchInput}
					bind:value={query}
					onkeydown={onKeydown}
					type="text"
					role="combobox"
					aria-expanded="true"
					aria-controls="{id}-listbox"
					aria-autocomplete="list"
					aria-activedescendant="{id}-option-{activeIndex}"
					placeholder="Search currency or code"
					class="w-full px-3 py-2 rounded-lg text-[14px] outline-none"
					style="background: var(--input-bg); border: 1px solid var(--input-border); color: var(--text-primary);"
				/>
			</div>

			<div
				bind:this={listbox}
				id="{id}-listbox"
				role="listbox"
				aria-label={label}
				class="max-h-[280px] overflow-y-auto"
				tabindex="-1"
			>
				{#each filtered as currency, index (currency.code)}
					{#if showPinnedDivider && index > 0 && filtered[index - 1].pinned && !currency.pinned}
						<div
							class="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider"
							style="color: var(--text-muted); background: var(--table-header-bg); border-top: 1px solid var(--card-border); border-bottom: 1px solid var(--card-border);"
						>
							All currencies
						</div>
					{/if}

					<button
						type="button"
						id="{id}-option-{index}"
						data-index={index}
						role="option"
						aria-selected={currency.code === value}
						class="w-full flex items-center gap-2.5 px-3 py-2 text-left"
						style="background: {index === activeIndex
							? 'var(--table-hover)'
							: 'transparent'}; color: var(--text-primary);"
						onclick={() => choose(currency.code)}
						onmouseenter={() => (activeIndex = index)}
					>
						<CurrencyIcon code={currency.code} icon={currency.icon} size={20} />
						<span
							class="text-[13px] font-bold w-[52px] flex-shrink-0"
							style="font-family: var(--font-mono);">{currency.code}</span
						>
						<span class="text-[13px] truncate" style="color: var(--text-secondary);"
							>{currency.name}</span
						>
						{#if currency.code === value}
							<svg
								class="ml-auto flex-shrink-0"
								style="color: var(--accent);"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<polyline points="20 6 9 17 4 12" />
							</svg>
						{/if}
					</button>
				{:else}
					<p class="px-3 py-6 text-center text-[13px]" style="color: var(--text-muted);">
						No currency matches “{query}”.
					</p>
				{/each}
			</div>
		</div>
	{/if}
</div>
