<script lang="ts">
	import { goto } from '$app/navigation';
	import CurrencyCombobox from './CurrencyCombobox.svelte';
	import { conversionPath, MAX_AMOUNT } from '$lib/utils/conversionSlug';
	import {
		formatAmountInput,
		countSignificant,
		caretPositionAfterFormat,
		parseAmountInput
	} from '$lib/utils/amountInput';
	import type { ConverterCurrency } from '$lib/utils/converterCurrencies';

	/**
	 * Amount / From / To, and nothing else — the whole point of XE's form is that
	 * there is no third decision to make before you get a number.
	 *
	 * Every change navigates to the conversion's own URL rather than mutating local
	 * state, so the address bar, the SSR'd markup and what you see can never
	 * disagree, and any conversion is shareable. The amount is debounced because
	 * typing "1000" would otherwise be four navigations.
	 */

	let {
		currencies,
		amount,
		from,
		to
	}: {
		currencies: ConverterCurrency[];
		amount: number;
		/** Uppercase codes. */
		from: string;
		to: string;
	} = $props();

	// Local so typing stays responsive; the URL is the source of truth once it settles.
	// Holds the *formatted* text — "1,000" — and is parsed back before navigating.
	let draft = $state(formatAmountInput(String(amount)));
	let timer: ReturnType<typeof setTimeout> | undefined;

	// A navigation (back button, a ladder link) must win over a stale draft.
	$effect(() => {
		draft = formatAmountInput(String(amount));
	});

	function navigate(nextAmount: number, nextFrom: string, nextTo: string) {
		// Converting a currency to itself has no page; swap instead of 404ing.
		if (nextFrom === nextTo) {
			[nextFrom, nextTo] = [nextTo, nextFrom === from ? to : from];
		}

		goto(conversionPath(nextAmount, nextFrom.toLowerCase(), nextTo.toLowerCase()), {
			keepFocus: true,
			noScroll: true
		});
	}

	/**
	 * Reformat under the caret on every keystroke.
	 *
	 * The element is written directly rather than left to Svelte: the value we want
	 * is often the value already in the DOM (typing "0" into "1,00" produces "1,000",
	 * which differs from the raw text by more than the keystroke), so waiting for a
	 * reactive update would leave the caret at the end of the field. Setting value and
	 * selection together in the same handler keeps typing continuous across an
	 * inserted comma.
	 */
	function onAmountInput(event: Event) {
		const el = event.currentTarget as HTMLInputElement;

		const significant = countSignificant(el.value.slice(0, el.selectionStart ?? el.value.length));
		const formatted = formatAmountInput(el.value);

		draft = formatted;
		el.value = formatted;

		const caret = caretPositionAfterFormat(formatted, significant);
		el.setSelectionRange(caret, caret);

		clearTimeout(timer);
		timer = setTimeout(() => {
			const parsed = parseAmountInput(formatted);
			if (!Number.isFinite(parsed) || parsed <= 0 || parsed > MAX_AMOUNT) return;
			if (parsed === amount) return;

			navigate(parsed, from, to);
		}, 450);
	}

	function swap() {
		navigate(amount, to, from);
	}
</script>

<div class="flex flex-col md:flex-row md:items-end gap-3">
	<div class="flex-1 min-w-0">
		<label
			for="converter-amount"
			class="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
			style="color: var(--text-secondary);">Amount</label
		>
		<input
			id="converter-amount"
			type="text"
			inputmode="decimal"
			autocomplete="off"
			value={draft}
			oninput={onAmountInput}
			class="w-full px-3.5 h-[54px] rounded-xl text-[20px] font-bold outline-none transition-colors"
			style="background: var(--input-bg); border: 1px solid var(--input-border); color: var(--text-primary); font-family: var(--font-mono);"
			placeholder="1"
		/>
	</div>

	<div class="flex-1 min-w-0">
		<CurrencyCombobox
			id="converter-from"
			label="From"
			{currencies}
			value={from}
			onSelect={(code) => navigate(amount, code, to)}
		/>
	</div>

	<div class="flex md:block justify-center">
		<button
			type="button"
			onclick={swap}
			aria-label="Swap {from} and {to}"
			title="Swap currencies"
			class="w-10 h-10 md:mb-[7px] rounded-full flex items-center justify-center transition-colors flex-shrink-0"
			style="background: var(--card-bg); border: 1px solid var(--card-border); color: var(--text-secondary);"
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<polyline points="17 1 21 5 17 9" />
				<path d="M3 11V9a4 4 0 0 1 4-4h14" />
				<polyline points="7 23 3 19 7 15" />
				<path d="M21 13v2a4 4 0 0 1-4 4H3" />
			</svg>
		</button>
	</div>

	<div class="flex-1 min-w-0">
		<CurrencyCombobox
			id="converter-to"
			label="To"
			{currencies}
			value={to}
			onSelect={(code) => navigate(amount, from, code)}
		/>
	</div>
</div>
