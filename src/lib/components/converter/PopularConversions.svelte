<script lang="ts">
	import CurrencyIcon from './CurrencyIcon.svelte';
	import { conversionPath } from '$lib/utils/conversionSlug';
	import { currencyName, POPULAR_CONVERSIONS } from '$lib/utils/converterCurrencies';

	/**
	 * The crawl path into the rest of the converter, and the way out of a dead end
	 * for a visitor who landed on a pair we hold no rate for.
	 *
	 * Weighted towards corridors where we hold exchange quotes, because those are
	 * the pages that show something no other converter can.
	 */

	let {
		heading = 'Popular conversions',
		exclude = null,
		limit = 12
	}: {
		heading?: string;
		/** Lowercase `from`/`to` of the conversion already on screen. */
		exclude?: { from: string; to: string } | null;
		limit?: number;
	} = $props();

	const items = $derived(
		POPULAR_CONVERSIONS.filter(
			(c) => !exclude || c.from !== exclude.from || c.to !== exclude.to
		).slice(0, limit)
	);
</script>

<section
	class="rounded-xl border overflow-hidden"
	style="background: var(--page-bg); border-color: var(--card-border);"
>
	<div class="px-5 py-3.5 border-b" style="border-color: var(--card-border);">
		<h2 class="text-[15px] font-semibold" style="color: var(--text-primary);">{heading}</h2>
	</div>

	<ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-0 p-0 list-none">
		{#each items as item (item.from + item.to)}
			<li style="border-bottom: 1px solid var(--card-border);">
				<a
					href={conversionPath(1, item.from, item.to)}
					class="flex items-center gap-2 px-5 py-3 no-underline transition-colors"
					style="color: var(--text-primary);"
				>
					<CurrencyIcon code={item.from} size={18} />
					<span class="text-[13px] font-semibold" style="font-family: var(--font-mono);"
						>{item.from.toUpperCase()}</span
					>
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						style="color: var(--text-muted);"
						aria-hidden="true"
					>
						<line x1="5" y1="12" x2="19" y2="12" />
						<polyline points="12 5 19 12 12 19" />
					</svg>
					<CurrencyIcon code={item.to} size={18} />
					<span class="text-[13px] font-semibold" style="font-family: var(--font-mono);"
						>{item.to.toUpperCase()}</span
					>
					<span class="text-[11.5px] truncate ml-auto" style="color: var(--text-muted);">
						{currencyName(item.to)}
					</span>
				</a>
			</li>
		{/each}
	</ul>
</section>
