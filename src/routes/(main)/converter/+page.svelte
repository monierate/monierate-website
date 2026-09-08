<script lang="ts">
	import type { PageData } from './$types';
	import Seo from '$lib/components/seo/Seo.svelte';
	import AdBanner, { hasActiveAd } from '$lib/components/banners/AdBanner.svelte';
	import ConverterForm from '$lib/components/converter/ConverterForm.svelte';
	import RateHeadline from '$lib/components/converter/RateHeadline.svelte';
	import RateDisclaimer from '$lib/components/converter/RateDisclaimer.svelte';
	import PopularConversions from '$lib/components/converter/PopularConversions.svelte';
	import CurrencyIcon from '$lib/components/converter/CurrencyIcon.svelte';
	import { conversionPath } from '$lib/utils/conversionSlug';

	/**
	 * The hub.
	 *
	 * Deliberately a directory rather than another conversion page: the live result
	 * is there so the form does not look broken on arrival, but the content that
	 * earns the URL is the index of every currency we can convert — which is also
	 * how a crawler reaches the pair pages in the first place.
	 */

	let { data }: { data: PageData } = $props();

	const c = $derived(data.conversion);
	const base = $derived(c.from.toLowerCase());
</script>

<Seo {...data.seo} />

<div style="background: var(--page-bg);">
	<AdBanner name="converter" isMobile={data.isMobile} />
</div>

<div class="w-[95%] md:max-w-[900px] mx-auto pb-24 {hasActiveAd('converter') ? 'pt-4' : 'pt-8'}">
	<h1 class="text-[22px] md:text-[30px] leading-tight">Currency converter</h1>
	<p class="mt-2 text-[14px] leading-relaxed max-w-2xl" style="color: var(--text-secondary);">
		Convert any currency at the live parallel market or mid-market rate — then see what each
		exchange would actually pay you, instead of one headline number.
	</p>

	<section
		class="mt-6 rounded-2xl px-5 py-6 md:px-7 md:py-7"
		style="background: var(--card-bg); border: 1px solid var(--card-border); box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04);"
	>
		<ConverterForm currencies={data.currencies} amount={c.amount} from={c.from} to={c.to} />

		<RateHeadline
			amount={c.amount}
			from={c.from}
			to={c.to}
			fromName={data.fromCurrency.name}
			toName={data.toCurrency.name}
			fromSymbol={data.fromCurrency.symbol}
			toSymbol={data.toCurrency.symbol}
			rate={data.rate}
			market={data.market}
			updatedAt={data.updatedAt}
		/>

		<RateDisclaimer market={data.market} isLoggedIn={data.auth?.isLoggedIn ?? false} />

		{#if data.rate > 0}
			<a
				href={conversionPath(1, base, c.to.toLowerCase())}
				class="inline-flex items-center gap-1.5 mt-5 text-[13px] font-semibold no-underline"
				style="color: var(--accent);"
			>
				See {c.from} to {c.to} exchange rates
				<svg
					width="13"
					height="13"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<line x1="5" y1="12" x2="19" y2="12" />
					<polyline points="12 5 19 12 12 19" />
				</svg>
			</a>
		{/if}
	</section>

	<div class="mt-8 space-y-8">
		<PopularConversions />

		<!-- The crawl surface: every currency we can price, each linking to its own page. -->
		<section
			class="rounded-xl border overflow-hidden"
			style="background: var(--page-bg); border-color: var(--card-border);"
		>
			<div class="px-5 py-3.5 border-b" style="border-color: var(--card-border);">
				<h2 class="text-[15px] font-semibold" style="color: var(--text-primary);">
					All currencies
				</h2>
				<p class="text-[12px] mt-0.5" style="color: var(--text-secondary);">
					{data.currencies.length} currencies, converted from {c.from}.
				</p>
			</div>

			<ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 m-0 p-0 list-none">
				{#each data.currencies as currency (currency.code)}
					{#if currency.code !== c.from}
						<li style="border-bottom: 1px solid var(--card-border);">
							<a
								href={conversionPath(1, base, currency.code.toLowerCase())}
								class="flex items-center gap-2 px-4 py-2.5 no-underline"
								style="color: var(--text-primary);"
							>
								<CurrencyIcon code={currency.code} icon={currency.icon} size={18} />
								<span
									class="text-[12.5px] font-semibold flex-shrink-0"
									style="font-family: var(--font-mono);">{currency.code}</span
								>
								<span class="text-[11.5px] truncate" style="color: var(--text-muted);"
									>{currency.name}</span
								>
							</a>
						</li>
					{/if}
				{/each}
			</ul>
		</section>
	</div>

	<div class="mt-8">
		<AdBanner name="converter_mobile_only" mobileOnly={true} showLabel={true} />
	</div>
</div>
