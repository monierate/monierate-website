<script lang="ts">
	import type { MarketCurrencyRate, MarketMeta } from '$lib/types/market';
	import { page } from '$app/stores';
	import MarketTabs from './MarketTabs.svelte';
	import MarketRateTable from './MarketRateTable.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import { MARKET_SEO } from '$lib/data/market-seo';

	export let meta: MarketMeta;
	export let rates: MarketCurrencyRate[] = [];

	const SITE = 'https://monierate.com';

	$: seo = MARKET_SEO[meta.key];

	$: today = new Date(meta.updatedAt);
	$: dateLong = today.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
	$: updated = today.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

	$: title = seo.title.replace('{date}', dateLong);
	$: intro = seo.intro.map((p) => p.replace('{date}', dateLong));
	$: canonical = `${SITE}${$page.url.pathname}`;

	// Headline: today's USD rate (falls back to the first available row).
	$: headline = rates.find((r) => r.code === 'USD') ?? rates[0];

	const money = (v: number | undefined) =>
		v === undefined
			? '—'
			: `₦${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(v)}`;

	// FAQ structured data (schema.org FAQPage) for rich results.
	$: faqJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: seo.faqItems.map((f) => ({
			'@type': 'Question',
			name: f.question,
			acceptedAnswer: {
				'@type': 'Answer',
				// plain-text answer for schema: drop {link:{...}} placeholders and any HTML
				text: f.answer
					.replace(/\{_?link:\s*\{\s*\w+\s*:\s*([^}]+)\s*\}\}/gi, '$1')
					.replace(/<[^>]+>/g, ' ')
					.replace(/\s+/g, ' ')
					.trim()
			}
		}))
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={seo.description} />
	<meta name="keywords" content={seo.keywords} />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={seo.ogImage} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={seo.ogImage} />

	{@html `<script type="application/ld+json">${faqJsonLd}<\/script>`}
</svelte:head>

<section class="market-view">
	<div class="head-row">
		<span class="eyebrow">Markets · {meta.base}</span>
		<h1>{meta.title} Exchange Rates Today</h1>
		<p class="sub">{seo.description}</p>

		{#if headline}
			<div class="headline">
				{#if meta.rateMode === 'single'}
					<span class="hl-main">1 {headline.code} = {money(headline.rate)}</span>
				{:else}
					<span class="hl-main">1 {headline.code} = {money(headline.buy)}</span>
					<span class="hl-meta">
						Buy {money(headline.buy)} · Sell {money(headline.sell)}
					</span>
				{/if}
				<span class="hl-date">as of {dateLong}</span>
			</div>
		{/if}
	</div>

	<div class="controls">
		<MarketTabs />
		<span class="updated">Updated {updated}</span>
	</div>

	<MarketRateTable {rates} rateMode={meta.rateMode} base={meta.base} />

	<!-- SEO content -->
	<div class="seo-content">
		<h2>About the {meta.title} rate</h2>
		<div class="prose-cols">
			{#each intro as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>
	</div>

	<FAQ faqItems={seo.faqItems} links={seo.faqLinks} coverPage={true} useContainer={false} />
</section>

<style>
	.market-view {
		width: 95%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
	}

	.eyebrow {
		font-family: var(--font-head);
		font-size: 0.78rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--accent);
	}
	h1 {
		font-family: var(--font-head);
		font-weight: 700;
		font-size: clamp(1.8rem, 4vw, 2.4rem);
		color: var(--text-primary);
		margin: 0.25rem 0 0.5rem;
	}
	.sub {
		max-width: 46rem;
		color: var(--text-secondary);
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.headline {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.25rem 0.85rem;
		margin-top: 1rem;
	}
	.hl-main {
		font-family: var(--font-head);
		font-weight: 700;
		font-size: clamp(1.25rem, 3vw, 1.6rem);
		color: var(--text-primary);
	}
	.hl-meta {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		color: var(--text-secondary);
	}
	.hl-date {
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	.controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin: 1.5rem 0 1rem;
	}
	.updated {
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	.seo-content {
		margin: 3rem 0 1rem;
	}
	.seo-content h2 {
		font-family: var(--font-head);
		font-weight: 700;
		font-size: 1.35rem;
		color: var(--text-primary);
		margin-bottom: 0.75rem;
	}
	.prose-cols p {
		color: var(--text-secondary);
		font-size: 0.95rem;
		line-height: 1.65;
		margin-bottom: 1rem;
	}
	/* Full-width like the table, but keep readable line length via columns. */
	@media (min-width: 768px) {
		.prose-cols {
			column-count: 2;
			column-gap: 3rem;
		}
		.prose-cols p {
			break-inside: avoid;
			margin-bottom: 0;
		}
	}
</style>
