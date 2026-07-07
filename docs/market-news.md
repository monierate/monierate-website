# Design: Market News & Daily Recap Feed

**Status:** Draft / proposal
**Owner:** —
**Related:** `/fx/*` market rate pages (`src/routes/(main)/fx`, `src/lib/services/market.service.ts`)

## Context & goal

The `/fx` pages (Black Market, CBN, Global Market) show live rates. Data-based FX
platforms such as abokifx.com and abokiforex.app — and, at the high end, the Bloomberg
Terminal — keep users coming back by pairing rates with **fresh, frequently-updated news
and market commentary** tagged to each currency/market.

Goal: add a **news & daily recap feed** to each `/fx` page that updates automatically,
requires little/no manual effort, is unique enough to rank in search, and reuses the rate
data we already compute.

Two content streams:

1. **Auto daily recap** — generated from our *own* rate data (no external sources). Unique,
   always fresh, high SEO value. **Ship this first.**
2. **Aggregated news** — pulled from RSS/news APIs, deduped, optionally enriched by an LLM
   (summary + per-currency tag + bull/bear sentiment).

## How comparable platforms do it

The common pattern is: **ingest from many sources on a schedule → process/rank → display in
a feed tagged to the relevant asset.**

- **Sources:** news APIs (Marketaux, Finnhub, Alpha Vantage, GNews, Benzinga), publisher
  **RSS** feeds (Nairametrics, BusinessDay, Punch, Reuters, CBN), scraping (for sources with
  no API), licensed wires (Reuters/AP/Dow Jones — the expensive tier Bloomberg uses), and
  **social** (X/Twitter, Telegram, Reddit, StockTwits) for "popular opinions".
- **Freshness:** a scheduled worker polls every N minutes, dedupes, and stores; webhooks/
  streaming for the real-time tier.
- **"Popular opinions" / sentiment:** social listening ranked by engagement + recency +
  velocity; NLP/LLM sentiment scoring; Bloomberg's `MOST`/`TOP` rank by *readership among
  terminal users* (an analytics signal, not editorial).
- **Auto-generated content:** data-to-text (NLG) summaries straight from the numbers, and
  LLM summarization of scraped articles into daily digests.

## Architecture

```
                         ┌─────────────────────────────────────────┐
   SCHEDULED (cron)      │           Cloudflare Worker              │
                         │                                          │
  every 15–30 min  ───▶  │  1. INGEST   RSS + News API + our rates  │
                         │  2. DEDUPE   hash(title+url) drop repeats │
   once daily (7am)  ─▶  │  3. ENRICH   Claude: summarize, tag,     │
                         │              sentiment (bull/bear)        │
                         │  4. RECAP    NLG from our own rate data   │
                         │  5. STORE    ─────────┐                   │
                         └───────────────────────┼──────────────────┘
                                                 ▼
                                    ┌──────────────────────┐
                                    │  D1 (SQLite)  news    │  ← durable store
                                    │  KV           feed:*  │  ← hot cache per market
                                    └──────────┬───────────┘
                                               │
   READ (page load)                            ▼
                         ┌─────────────────────────────────────────┐
   /fx/parallel   ───▶   │  +page.server.ts → getMarketNews('ngn',  │
   /fx/official          │     'usd')  reads KV/D1  (fast, cached)   │
                         └───────────────────┬─────────────────────┘
                                             ▼
                              <MarketRecap/> + <MarketNewsFeed/>
                              rendered around the rates table
```

We already deploy on Cloudflare (`@sveltejs/adapter-cloudflare`, `wrangler.toml`), so all
primitives below live in the same account/config.

### Cloudflare primitives to add

| Need | Primitive | Why |
|---|---|---|
| Run on a schedule | **Cron Triggers** | native to Workers; no server to run |
| Durable store | **D1** (SQLite) | queryable; filter/tag by currency & market |
| Hot read cache | **Workers KV** | per-market feed JSON, sub-ms reads |
| Summarize / tag / sentiment | **Claude API** (or Workers AI) | the intelligence layer |
| (optional) decouple ingest→enrich | **Queues** | smooth bursts, retries |

## Data model (D1)

```sql
-- Aggregated + generated items
news_item(
  id            TEXT PRIMARY KEY,     -- hash(url) for dedupe
  kind          TEXT,                 -- 'news' | 'recap' | 'opinion'
  title         TEXT,
  summary       TEXT,                 -- Claude 1–2 sentence
  url           TEXT,                 -- source link (null for recap)
  source        TEXT,                 -- 'Nairametrics', 'Monierate', ...
  base          TEXT,                 -- 'USD'  (nullable)
  quote         TEXT,                 -- 'NGN'
  market        TEXT,                 -- 'parallel' | 'official' | 'global' | null
  sentiment     TEXT,                 -- 'bullish' | 'bearish' | 'neutral'
  published_at  TEXT,
  created_at    TEXT
);
CREATE INDEX idx_news_market_time ON news_item(market, published_at DESC);
```

KV holds the rendered result per surface, rebuilt after each cron run:

```
feed:parallel:usdngn → [ …top ~15 items… ]
feed:official:usdngn → [ … ]
recap:parallel       → { …today's recap… }
```

Note: `market` values map to the URL slugs (`parallel`/`official`/`global`), while the
internal `MarketKey` remains `black-market`/`cbn`/`global-market` (see `market.service.ts`).

## Content streams in detail

### A. Auto daily recap (no external deps — Phase 1)

- Cron runs ~7am off our own rate data.
- Pure template + numbers already computed in `src/lib/services/market.service.ts`, e.g.:

  > "The naira held steady on the parallel market today, with the dollar trading at
  > ₦1,632 / ₦1,652 (buy/sell), while the CBN official rate stood at ₦1,384. The pound
  > gained 0.6% to …"

- Optionally polish phrasing with a single Claude call.
- Unique content, refreshes daily, strong for SEO.

### B. Aggregated news (Phase 2–3)

1. Pull ~5 Nigeria-finance RSS feeds + one news API keyed to `USD NGN naira dollar`.
2. Dedupe on `hash(url)`.
3. For each new item, one (batched) Claude call → `{ summary, market, sentiment }`.
4. Write to D1, refresh KV.

## Serving path (SvelteKit)

- Add `getMarketNews(fetch, market, pair)` alongside `getMarketRates` in a
  `src/lib/services/news.service.ts` (or extend `market.service.ts`). Reads KV/D1.
- Each `/fx/*` `+page.server.ts` fetches **rates and news in parallel**.
- New components under `src/lib/components/markets/`:
  - `MarketRecap.svelte` — today's recap, above/near the headline.
  - `MarketNewsFeed.svelte` — list of tagged items below the rates table.
- Add `NewsArticle` / `ItemList` JSON-LD for SEO rich results (mirrors the existing
  `FAQPage` JSON-LD in `MarketView.svelte`).

## Rollout phases

1. **Phase 1 — Auto recap.** No external APIs; only a cron + KV. Immediate unique daily
   content on every `/fx` page. Lowest risk, highest SEO payoff.
2. **Phase 2 — RSS aggregation + dedupe** into D1, rendered as a news feed. Free sources only.
3. **Phase 3 — Claude enrichment** (summary + per-currency tagging + sentiment badge) and a
   "market sentiment" indicator.
4. **Phase 4 — Social "popular opinions"** (X/Telegram) ranked by velocity — the
   abokifx/Bloomberg-style layer, added last since it is the messiest.

## Open questions / decisions

- **Sourcing:** which RSS feeds / news API, and any licensing limits on displaying headlines.
- **Editorial control:** fully automated, or a lightweight approval step (a `published` flag
  like the blog) before items go live.
- **Freshness vs cost:** cron cadence (15 min vs hourly) and the resulting number of Claude
  calls/day.
- **Content generation billing:** confirm which Claude model + expected token volume.

## Non-goals (for now)

- Real-time streaming/websocket news.
- Licensed wire content (Reuters/AP/Dow Jones).
- Per-user personalization / "most read among users" analytics ranking.
