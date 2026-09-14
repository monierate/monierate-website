<script lang="ts">
	import { fmt } from '$lib/utils/format';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	interface ConverterState {
		convertDir: 'buy' | 'sell';
		convertSwapped: boolean;
		sendDisplay: string;
		receiveDisplay: string;
		activeRateValue: number;
		handleSendInput: (val: string) => void;
		handleReceiveInput: (val: string) => void;
		toggleSwap: () => void;
	}

	let { state, base, quote, symbol, currentRate, providerName, tradeUrl = null, rateNote = '' }: {
		state: ConverterState;
		base: string;
		quote: string;
		symbol: string;
		currentRate: any;
		/** Provider display name, used in the "Buy on …" CTA. */
		providerName: string;
		/** Where the CTA sends people — `null` hides it when the profile has no link. */
		tradeUrl?: string | null;
		/**
		 * Qualifier appended to the rate footnote, e.g. `'daily close · Aug 18, 2026'`.
		 * Set on providers that publish once a day, so the conversion isn't read as
		 * a live quote. Empty for live-feed providers.
		 */
		rateNote?: string;
	} = $props();
</script>

<div
	class="rounded-xl border flex flex-col overflow-hidden"
	style="background: var(--page-bg); border-color: var(--card-border);"
>
	<div class="flex items-center justify-between px-4 pt-4 pb-3" style="border-bottom: 1px solid var(--card-border);">
		<span
			style="font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:0.07em; color:var(--text-secondary);"
			>Quick Convert</span
		>
		{#if currentRate}
			<div
				class="inline-flex items-center gap-0.5 p-0.5 rounded-full"
				style="background: var(--table-header-bg); border: 1px solid var(--card-border);"
			>
				{#each [{ dir: 'buy' as const, label: 'Buy' }, { dir: 'sell' as const, label: 'Sell' }] as opt}
					<button
						onclick={() => (state.convertDir = opt.dir)}
						class="px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-all"
						style={state.convertDir === opt.dir
							? 'background: var(--accent); color: #fff;'
							: 'background: transparent; color: var(--text-secondary);'}
					>{opt.label}</button>
				{/each}
			</div>
		{/if}
	</div>

	{#if !currentRate}
		<div class="flex-1 flex items-center justify-center p-6">
			<EmptyState title="No rate available" description="No current rate for this pair." compact />
		</div>
	{:else}
		<div class="px-4 pt-4 pb-3">
			<div class="text-[9px] uppercase tracking-widest font-semibold mb-2" style="color: var(--text-muted);">From</div>
			<div class="flex items-center gap-3">
				<input
					type="text"
					inputmode="decimal"
					value={state.sendDisplay}
					oninput={(e) => state.handleSendInput(e.currentTarget.value)}
					class="flex-1 bg-transparent text-[22px] font-bold outline-none min-w-0"
					style="font-family: var(--font-mono); color: var(--text-primary);"
					placeholder="0"
				/>
				<span
					class="px-3 py-1.5 rounded-lg text-[12px] font-bold flex-shrink-0"
					style="background: var(--table-header-bg); color: var(--text-primary); letter-spacing: 0.02em;"
				>{state.convertSwapped ? quote : base}</span>
			</div>
		</div>

		<div class="relative" style="border-top: 1px solid var(--card-border);">
			<button
				onclick={() => state.toggleSwap()}
				class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full border flex items-center justify-center transition-colors cursor-pointer"
				style="border-color: var(--card-border); background: var(--card-bg); color: var(--text-muted);"
				onmouseenter={(e) => (e.currentTarget.style.background = 'var(--table-header-bg)')}
				onmouseleave={(e) => (e.currentTarget.style.background = 'var(--card-bg)')}
				title="Swap currencies"
			>
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none">
					<path
						d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		</div>

		<div class="px-4 pt-4 pb-3">
			<div class="text-[9px] uppercase tracking-widest font-semibold mb-2" style="color: var(--text-muted);">To</div>
			<div class="flex items-center gap-3">
				<input
					type="text"
					inputmode="decimal"
					value={state.receiveDisplay}
					oninput={(e) => state.handleReceiveInput(e.currentTarget.value)}
					class="flex-1 bg-transparent text-[22px] font-bold outline-none min-w-0"
					style="font-family: var(--font-mono); color: var(--text-primary);"
					placeholder="0"
				/>
				<span
					class="px-3 py-1.5 rounded-lg text-[12px] font-bold flex-shrink-0"
					style="background: var(--table-header-bg); color: var(--text-primary); letter-spacing: 0.02em;"
				>{state.convertSwapped ? base : quote}</span>
			</div>
		</div>

		{#if state.activeRateValue}
			<div class="px-4 pt-2 pb-4 text-[10px]" style="color: var(--text-muted);">
				{#if state.convertSwapped}
					1 {quote} = {(1 / state.activeRateValue).toLocaleString('en-US', { maximumSignificantDigits: 4 })} {base}
				{:else}
					1 {base} = {symbol}{fmt(state.activeRateValue)} {quote}
				{/if}
				<span class="ml-1" style="color: var(--text-muted);"
					>({state.convertDir === 'buy' ? 'buy rate' : 'sell rate'}{rateNote ? `, ${rateNote}` : ''})</span
				>
			</div>
		{/if}
	{/if}

	<!-- Pinned to the card's bottom edge so it lines up with the chart beside it.
	     Outside the rate branches above: worth showing even when we have no quote.
	     Tracks the Buy/Sell toggle, so the CTA always names the side whose rate
	     the reader is looking at. -->
	{#if tradeUrl}
		<a
			href={tradeUrl}
			target="_blank"
			rel="noopener noreferrer sponsored"
			class="mt-auto mx-4 mb-4 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-opacity hover:opacity-90"
			style="background: var(--accent); color: #fff;"
		>
			{state.convertDir === 'buy' ? 'Buy' : 'Sell'} on {providerName}
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M7 17 17 7" />
				<path d="M7 7h10v10" />
			</svg>
		</a>
	{/if}
</div>
