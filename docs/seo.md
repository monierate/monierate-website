# SEO infrastructure — public Markets pages

Foundation layer for MON-162. Every Markets page builds its metadata server-side
and renders it through one component, so no page hand-writes head markup.

The `/exchanges` directory reuses the same helper and builders — see
[Programmatic collection pages](#programmatic-collection-pages) below.

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

`src/lib/utils/collectionSeo.ts` does the same for the exchange directory:

| Page | Builder | JSON-LD |
| --- | --- | --- |
| `/exchanges` | `buildExchangesIndexSeo` | CollectionPage, BreadcrumbList |
| `/exchanges/:collection` | `buildCollectionSeo` | CollectionPage, ItemList, FAQPage, BreadcrumbList |

`src/lib/utils/seo.ts` holds the block builders (`breadcrumbJsonLd`,
`collectionPageJsonLd`, `datasetJsonLd`, `exchangeRateJsonLd`, `faqPageJsonLd`,
`itemListJsonLd`, `organizationJsonLd`, `webPageJsonLd`). All serialisation goes
through `jsonLdBlock`, which escapes `<` so a value containing `</script>` cannot
break out of its tag.

`breadcrumbJsonLd` roots the trail at the Markets hub by default; pass a second
argument to re-root it (the exchange pages pass `/exchanges`).

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
- every collection that clears the thin-page threshold → `/exchanges/:collection`

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

## Programmatic collection pages

`/exchanges/:collection` is one server-rendered directory page per long-tail
query — "otc desks in lagos", "licensed crypto exchanges in nigeria" — over the
`/changers/search_changers` facets.

### Currently disabled

`COLLECTIONS_ENABLED` in `src/lib/data/exchange-collections.ts` is `false`, so
none of this is live. With the flag off:

- the param matcher claims no slugs, so `/exchanges/:collection` falls through to
  `/exchanges/[changer]` and 404s,
- `getCollection()` returns `undefined`, so the route load 404s even if reached,
- `getPublishedCollections()` resolves empty without running the probe fan-out —
  the sitemap lists no collections and the `/exchanges` index renders no
  collection sections,
- `collectionsForChanger()` returns nothing, so profiles cross-link nothing.

The `/exchanges` index itself still serves — it is a searchable list of every
changer with the collection strips hidden — but its SEO is **commented out**
rather than flag-gated: the `<Seo />` render in `+page.svelte`, the
`buildExchangesIndexSeo()` call in `+page.server.ts`, and its `/sitemap.xml`
entry. So the page emits no title, canonical or JSON-LD and is not submitted. It
carries no `noindex`, so a crawler reaching it by another route can still index
it; add one if that matters.

The config, routes, builders and components all stay in place. Flip the constant
to `true` and uncomment those three spots to bring the layer back. Everything
below describes the layer as it behaves when enabled.

### The config is curated, not generated

`src/lib/data/exchange-collections.ts` holds one entry per published combo:
slug, H1, `<title>`, meta description, intro copy, the facets to query, and 2–3
FAQs. **Do not generate the permutation space.** `{tag} × {city|country} ×
{licensed}` is mostly empty, and near-empty programmatic pages drag on the whole
site's rankings, not just their own. Add a combo when you expect it to hold
changers.

Copy carries `{year}` and `{count}` placeholders, substituted at render time by
`fillCopy` — the H1 stays "…(2026)" without a yearly edit.

### The thin-page guard

A collection resolving to fewer than `MIN_COLLECTION_SIZE` (3) changers **404s**
rather than rendering. This is the load-bearing rule of the whole layer, and it
is enforced in three places that must agree:

| Place | Enforcement |
| --- | --- |
| The route load | Throws 404 below the threshold. |
| `sitemap.xml` | Only lists collections from `getPublishedCollections()`. |
| Changer profiles | Cross-links filtered through `getPublishedSlugs()`. |

`src/lib/server/collections.ts` is the single source of that answer: one
`limit=1` count per collection, fanned out in parallel, cached in-isolate for ten
minutes. Every changer profile asks the same question, so an uncached
implementation would put a fan-out on the hottest page in the section.

### Routing around the changer codes

`/exchanges/otc-desks-in-lagos` and `/exchanges/busha` share a path segment. The
param matcher `src/params/collection.ts` checks the slug against the curated
config, so `[collection=collection]` claims only known collection slugs and
everything else falls through to `[changer]`. Matching the config rather than a
slug-shape heuristic means a changer code can never be swallowed by the
collection route.

### Internal linking

The graph closes in both directions, which is most of why these pages rank at
all: `/exchanges` links to every published collection, each collection links to
its profiles and to sibling collections, and each profile links back to the
collections it belongs to. `collectionsForChanger()` derives that last set
locally from the changer record, so a profile pays no extra request for it.

### Dependency on the changer backfill

The facets only work if the data is there. As of 2026-08-14, `changer_tags` is
populated, and `address.city`, `countries`, `categories` and `licenses` are
empty across all 94 changers — so the six tag-backed collections publish and the
seven location- and licence-scoped ones 404 by design. They start serving
themselves the day MON-136's backfill lands, with no code change. Check with:

```
curl -su changemoney_api:… "$API_URL/changers/search_changers?city=lagos&limit=1"
```

Multi-value facets are comma-separated (`tags=onramp,offramp`, OR'd). Repeating
a param is a 400.

## robots.txt

`static/robots.txt` allows `/markets/` and `/exchanges/` explicitly and points at
the sitemap:

```
Allow: /markets/
Allow: /exchanges/
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
