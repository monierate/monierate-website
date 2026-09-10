<script lang="ts">
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { untrack } from 'svelte';
	import { defaultCurrencyStore } from '$lib/stores/defaultCurrency';
	import { parsePairCode } from '$lib/utils/pairs';
	import currencies from '$data/currencies.json';

	let { data, children } = $props();

	const NAMES: Record<string, string> = { ...currencies.fiat, ...currencies.coins };
	const label = (code: string) => {
		const { base, quote } = parsePairCode(code);
		return `${base.toUpperCase()}/${quote.toUpperCase()}`;
	};

	const currentCode = $derived($page.params.code ?? '');

	function pathFor(code: string) {
		return $page.url.pathname.replace(`/markets/${currentCode}`, `/markets/${code}`);
	}

	// The header currency selector (NGN / KES) is deferred to via a macrotask so the
	// `invalidate('params:quote')` it fires alongside the cookie write settles first
	// — otherwise a concurrent goto() here is dropped.
	function navigateSoon(href: string) {
		setTimeout(() => goto(href), 0);
	}

	// --- Quote-currency switch handling -------------------------------------
	// The selector only writes the cookie + invalidates; it doesn't navigate. On a
	// market page the pair has to follow: keep the base, swap the quote. If no such
	// pair exists, ask before jumping to a supported one.

	// Plain (non-reactive) — a "previous value" latch the effect updates itself.
	let lastQuote = ($defaultCurrencyStore || '').toUpperCase();

	let dialogOpen = $state(false);
	let dialogTitle = $state('');
	let dialogBody = $state('');
	let dialogConfirmLabel = $state('');
	let pendingHref = $state('');
	let revertTo = $state('');

	$effect(() => {
		const next = ($defaultCurrencyStore || '').toUpperCase();
		if (!next || next === lastQuote) return;
		const prev = lastQuote;
		lastQuote = next;
		untrack(() => handleQuoteSwitch(prev, next));
	});

	function handleQuoteSwitch(prevQuote: string, nextQuote: string) {
		const code = currentCode;
		if (!code) return;

		const { base } = parsePairCode(code);
		const target = `${base.toLowerCase()}${nextQuote.toLowerCase()}`;
		if (target === code) return;

		const options: { code: string; base: string; quote: string }[] = data.pairOptions ?? [];

		if (options.some((o) => o.code === target)) {
			navigateSoon(pathFor(target));
			return;
		}

		// The current base isn't quoted in the new currency — offer a fallback.
		const forQuote = options.filter((o) => o.quote.toUpperCase() === nextQuote.toUpperCase());
		const fallback =
			forQuote.find((o) => o.base === 'USD') ??
			forQuote.find((o) => o.base === 'USDT') ??
			forQuote[0];

		if (!fallback) {
			// Nothing at all for this quote — just undo the selector.
			revert(prevQuote);
			return;
		}

		const baseName = NAMES[base.toUpperCase()] ?? base.toUpperCase();
		dialogTitle = `${nextQuote.toUpperCase()} doesn't support ${base.toUpperCase()}`;
		dialogBody = `There's no ${baseName} (${base.toUpperCase()}) pair quoted in ${nextQuote.toUpperCase()}. Switch to ${label(fallback.code)} instead?`;
		dialogConfirmLabel = `Switch to ${label(fallback.code)}`;
		pendingHref = pathFor(fallback.code);
		revertTo = prevQuote;
		dialogOpen = true;
	}

	function revert(quote: string) {
		defaultCurrencyStore.set(quote);
		invalidate('params:quote');
	}

	function confirmSwitch() {
		dialogOpen = false;
		navigateSoon(pendingHref);
	}

	function cancelSwitch() {
		dialogOpen = false;
		revert(revertTo);
	}
</script>

<!--
	Pair pages build their `insight` actions object once (untracked) in the page
	script, so a client-side navigation to another pair/provider on the same route
	would otherwise keep the old pair in the header, chart and converter. Keying on
	the pathname remounts the page subtree on every pair switch.
-->
{#key $page.url.pathname}
	{@render children()}
{/key}

<svelte:window onkeydown={(e) => dialogOpen && e.key === 'Escape' && cancelSwitch()} />

{#if dialogOpen}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
		role="presentation"
		onclick={(e) => e.target === e.currentTarget && cancelSwitch()}
	>
		<div
			class="w-full max-w-sm rounded-2xl p-6"
			style="background: var(--card-bg); border: 1px solid var(--card-border); box-shadow: 0 10px 40px rgba(0,0,0,0.2);"
			role="alertdialog"
			aria-labelledby="qs-title"
			aria-describedby="qs-body"
		>
			<h2 id="qs-title" class="text-base font-semibold" style="color: var(--text-primary);">
				{dialogTitle}
			</h2>
			<p id="qs-body" class="mt-2 text-sm leading-relaxed" style="color: var(--text-secondary);">
				{dialogBody}
			</p>
			<div class="mt-6 flex justify-end gap-2">
				<button
					type="button"
					onclick={cancelSwitch}
					class="rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[var(--table-hover)]"
					style="background: transparent; border: 1px solid var(--card-border); color: var(--text-primary); font-family: var(--font-head);"
				>
					Cancel
				</button>
				<button type="button" onclick={confirmSwitch} class="button px-4 py-2.5">
					{dialogConfirmLabel}
				</button>
			</div>
		</div>
	</div>
{/if}
