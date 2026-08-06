# SEO infrastructure — public Markets pages

Foundation layer for MON-162. Every Markets page builds its metadata server-side
and renders it through one component, so no page hand-writes head markup.

## The helper

```svelte
<script>
  import Seo from '$lib/components/seo/Seo.svelte';
  let { data } = $props();
</script>

<Seo {...data.seo} />
```

`data.seo` is a `SeoMeta` (`src/lib/utils/seo.ts`) built in the page's
`+page.server.ts`:

| Field | Notes |
| --- | --- |
| `title`, `description` | Dynamic per currency code / provider. |
| `canonical` | Absolute `https://monierate.com/...` URL. |
| `ogImage` | Provider thumbnail where one exists, else the site default. |
| `ogType` | Defaults to `website`. |
| `robots` | Omit to stay indexable. Only set to hold a page back. |
| `jsonLd` | Array of serialised blocks; `Seo` emits one `<script>` each. |

`Seo.svelte` renders `<title>`, description, canonical, the OpenGraph set
(including `og:site_name`), the Twitter summary-large-image set, and the JSON-LD.
Adding a tag for every page means editing that one file.

### Builders

`src/lib/utils/providerSeo.ts` has one builder per page; each returns `SeoMeta`.

| Page | Builder | JSON-LD |
| --- | --- | --- |
| `/markets/:pair` | `buildPairOverviewSeo` | WebPage, ExchangeRateSpecification, Dataset, BreadcrumbList |
| `/markets/:pair/:provider` | `buildPairProviderSeo` | Organization, ExchangeRateSpecification, Dataset, BreadcrumbList |
| `/markets/providers/:code` | `buildProviderSeo` | Organization, BreadcrumbList |
| `/markets/history` | `buildHistorySeo` | Dataset, BreadcrumbList |
| `/markets/spread` | `buildSpreadSeo` | Dataset, BreadcrumbList |

`src/lib/utils/seo.ts` holds the block builders (`breadcrumbJsonLd`,
`datasetJsonLd`, `exchangeRateJsonLd`, `organizationJsonLd`, `webPageJsonLd`).
All serialisation goes through `jsonLdBlock`, which escapes `<` so a value
containing `</script>` cannot break out of its tag.

**On type choice:** rate quotes use `ExchangeRateSpecification` rather than a bare
`FinancialProduct`. It is the FinancialProduct subtype for FX, and its
`currency` / `currentExchangeRate` fields are the ones consumers actually read.
Rate *series* (index history, per-provider OHLC, MSI) are `Dataset`, which is
what marks the page as a data source rather than prose for AI crawlers.

## Rendering strategy

Nothing under `/markets` is prerendered. Every page is **SSR on demand**, served
by the Cloudflare worker.

| Route | Cardinality | Strategy | Why |
| --- | --- | --- | --- |
| `/markets/:pair` | ~89 pairs | SSR | Rates change by the minute; a build-time snapshot would ship stale numbers in the description and JSON-LD. |
| `/markets/:pair/:provider` | ~172 live combos | SSR | High cardinality and the set changes as providers add or drop pairs. Prerendering needs a fixed build-time list, which would 404 on anything new until the next deploy. |
| `/markets/providers/:code` | ~92 changers | SSR | Same freshness argument; the page leads with live rates. |
| `/markets/history`, `/markets/spread` | 1 each | SSR | Single pages, but the headline figures are live. |

The tradeoff is a worker invocation per request instead of a static asset. It is
the right one here because the value of these pages *is* the current rate — the
title and description carry it, so a cached snapshot is worse than a slightly
slower response. The sitemap's `changefreq: hourly` matches.

This is a deliberate choice, not a default: SvelteKit prerenders nothing unless
asked, and no `/markets` route sets `export const prerender`. If a page ever
becomes genuinely static (a glossary, a methodology explainer), prerender it.

## Sitemap

`/sitemap.xml` is generated per request by `src/routes/sitemap.xml/+server.ts`
and cached at the edge for an hour (`s-maxage=3600`), so `lastmod` stays current.

It enumerates, from the live API:

- every pair code → `/markets/:pair`
- every live pair × provider combination → `/markets/:pair/:provider`
- every active changer code → `/converter/:code`, `/exchanges/:code`

plus the static hubs, discover pages, country bank pages, and blog posts.
`lastmod` comes from the API's own timestamps where available and falls back to
request time.

**One file, no index.** Measured 2026-08-06: 89 pairs, 92 active changers, 172
live pair×provider combos — a few hundred URLs in total against a 50,000 limit.
Splitting would add moving parts for no gain. `MAX_URLS_PER_SITEMAP` logs an
error if the count ever crosses the limit, which is the signal to split into an
index.

### Currently held back

`SUBMIT_SECONDARY_MARKETS_PAGES` is `false`, keeping `/markets/providers/:code`,
`/markets/spread`, and `/markets/history` out of the sitemap until their public
clones ship. The pages remain crawlable and carry no `noindex` — they are simply
not submitted. Flip the constant to include them.

## robots.txt

`static/robots.txt` allows `/markets/` explicitly and points at the sitemap:

```
Allow: /markets/
Sitemap: https://monierate.com/sitemap.xml
```

`Disallow: /*?` keeps parameterised variants out of the index, which matters
because the Pro CTAs append `?utm_*` — the canonical tag points at the clean
path regardless.

### pro.monierate.com

**Open issue, not fixed here.** The Pro app's `robots.txt` (verified 2026-08-06)
ends with an open `User-agent: * / Disallow:`, so crawling is allowed. It is not
served from this repo, so it cannot be changed from here.

In practice the duplicate-content risk is low today: `https://pro.monierate.com/`
returns a `303` redirect to auth, so there is no public HTML to index. That is an
accident of the auth flow rather than a stated policy. Worth making explicit on
the Pro side — either `Disallow: /` or a blanket `noindex` header — before the
public Markets clones start driving links there.
