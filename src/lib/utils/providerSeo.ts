import { getIconPath } from '$lib/utils';
import {
	SITE,
	DEFAULT_OG_IMAGE,
	breadcrumbJsonLd,
	datasetJsonLd,
	exchangeRateJsonLd,
	organizationJsonLd,
	webPageJsonLd,
	type SeoMeta
} from '$lib/utils/seo';

/**
 * Per-page SeoMeta builders for the public Markets pages. Each returns a value
 * the page hands straight to `<Seo {...data.seo} />` — no page assembles head
 * markup itself.
 */

function providerOgImage(code: string): string {
	return `https://ik.imagekit.io/monierate/thumbnails/${code}-og.png`;
}

export interface ProviderSeoInput {
	code: string;
	name: string;
	bio?: string;
	icon?: string;
	link?: string;
}

/**
 * Provider rates page — /markets/providers/:code. One per changer code.
 */
export function buildProviderSeo(provider: ProviderSeoInput): SeoMeta {
	const title = `${provider.name} Exchange Rates & Spreads | Monierate`;
	const description = provider.bio
		? `${provider.bio} See live ${provider.name} exchange rates, buy/sell spreads and 24h changes on Monierate.`
		: `Live ${provider.name} exchange rates, buy/sell spreads and 24h changes, tracked in real time on Monierate.`;
	const path = `/markets/providers/${provider.code}`;
	const canonical = `${SITE}${path}`;

	return {
		title,
		description,
		canonical,
		ogImage: providerOgImage(provider.code),
		jsonLd: [
			organizationJsonLd({
				name: provider.name,
				url: provider.link,
				logo: `${SITE}${getIconPath(provider.icon)}`
			}),
			breadcrumbJsonLd([
				{ name: 'Providers', path: '/markets/providers' },
				{ name: provider.name, path }
			])
		]
	};
}

export interface PairProviderSeoInput {
	pairCode: string;
	base: string;
	quote: string;
	providerCode: string;
	providerName: string;
	providerIcon?: string;
	providerLink?: string;
	rate?: number;
	/** ISO timestamp of the latest quote, for Dataset freshness. */
	updatedAt?: string;
}

/**
 * Pair × provider page — /markets/:pair/:provider. The long-tail counterpart to
 * {@link buildProviderSeo}: one per supported pair per provider.
 *
 * The page still renders when the provider has no live quote for the pair (see
 * the loader), so the copy and robots directive both flex on `rate`: without one
 * there is nothing to index, and promising a "live rate" in the SERP would be a
 * lie. `noindex, follow` keeps the crawler moving through to the pair hub.
 */
export function buildPairProviderSeo(input: PairProviderSeoInput): SeoMeta {
	const { base, quote, providerName, pairCode, providerCode } = input;
	const hasRate = input.rate !== undefined && input.rate > 0;
	const title = `${base} to ${quote} Rate on ${providerName} | Monierate`;
	const description = hasRate
		? `Live ${base} → ${quote} exchange rate on ${providerName}, with buy/sell spread and rate history. Current rate: 1 ${base} = ${input.rate!.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${quote}.`
		: `Monierate is not currently tracking a ${base} → ${quote} rate from ${providerName}. Compare live ${base}/${quote} rates from every provider we track.`;
	const path = `/markets/${pairCode}/${providerCode}`;
	const canonical = `${SITE}${path}`;

	return {
		title,
		description,
		canonical,
		...(hasRate ? {} : { robots: 'noindex, follow' }),
		ogImage: providerOgImage(providerCode),
		jsonLd: [
			organizationJsonLd({
				name: providerName,
				url: input.providerLink,
				logo: `${SITE}${getIconPath(input.providerIcon)}`
			}),
			...(hasRate
				? [exchangeRateJsonLd({ base, quote, rate: input.rate!, providerName })]
				: []),
			datasetJsonLd({
				name: `${base}/${quote} daily rate history on ${providerName}`,
				description: `Daily open, high, low and close for the ${base}/${quote} rate quoted by ${providerName}.`,
				url: canonical,
				modified: input.updatedAt,
				keywords: [base, quote, `${base}/${quote}`, providerName, 'exchange rate', 'OHLC']
			}),
			breadcrumbJsonLd([
				{ name: `${base}/${quote}`, path: `/markets/${pairCode}` },
				{ name: providerName, path }
			])
		]
	};
}

export interface PairOverviewSeoInput {
	pairCode: string;
	base: string;
	quote: string;
	rate?: number;
	updatedAt?: string;
}

/**
 * Pair insight page — /markets/:pair/insight. One per supported pair (usdtngn,
 * usdngn…). The metrics/highlights/provider-breakdown deep dive; the bare
 * /markets/:pair hub above it is the OHLC history page (see
 * {@link buildPairHistorySeo}).
 */
export function buildPairOverviewSeo(input: PairOverviewSeoInput): SeoMeta {
	const { base, quote, pairCode } = input;
	const title = `${base}/${quote} Market Insight, Metrics & Providers | Monierate`;
	const rateLine =
		input.rate !== undefined
			? ` Current index rate: 1 ${base} = ${input.rate.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${quote}.`
			: '';
	const description = `Live ${base} to ${quote} composite rate, history chart, and every provider quoting this pair, compared side by side on Monierate.${rateLine}`;
	const path = `/markets/${pairCode}/insight`;
	const canonical = `${SITE}${path}`;

	return {
		title,
		description,
		canonical,
		ogImage: DEFAULT_OG_IMAGE,
		jsonLd: [
			webPageJsonLd({
				name: title,
				description,
				url: canonical,
				about: `${base} to ${quote} exchange rate`
			}),
			...(input.rate !== undefined ? [exchangeRateJsonLd({ base, quote, rate: input.rate })] : []),
			datasetJsonLd({
				name: `${base}/${quote} composite exchange rate index`,
				description: `Monierate's composite ${base}/${quote} rate, averaged across contributing providers, with history and per-provider breakdown.`,
				url: canonical,
				modified: input.updatedAt,
				keywords: [base, quote, `${base}/${quote}`, 'exchange rate', 'index']
			}),
			breadcrumbJsonLd([
				{ name: `${base}/${quote}`, path: `/markets/${pairCode}` },
				{ name: 'Insight', path }
			])
		]
	};
}

/**
 * Pair OHLC hub — /markets/:pair. One per supported pair (usdtngn, usdngn…).
 * The canonical landing URL for a pair: daily open/high/low/close history for
 * the composite index. The richer metrics/highlights/provider breakdown lives
 * one level down, at /markets/:pair/insight (see {@link buildPairOverviewSeo}).
 */
export function buildPairHistorySeo(input: PairOverviewSeoInput): SeoMeta {
	const { base, quote, pairCode } = input;
	const title = `${base}/${quote} Historical Rate & Chart | Monierate`;
	const rateLine =
		input.rate !== undefined
			? ` Current index rate: 1 ${base} = ${input.rate.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${quote}.`
			: '';
	const description = `Daily open, high, low and close history for the ${base}/${quote} composite exchange rate index on Monierate.${rateLine}`;
	const path = `/markets/${pairCode}`;
	const canonical = `${SITE}${path}`;

	return {
		title,
		description,
		canonical,
		ogImage: DEFAULT_OG_IMAGE,
		jsonLd: [
			...(input.rate !== undefined ? [exchangeRateJsonLd({ base, quote, rate: input.rate })] : []),
			datasetJsonLd({
				name: `${base}/${quote} composite exchange rate index — daily OHLC`,
				description: `Daily open, high, low and close for Monierate's composite ${base}/${quote} rate.`,
				url: canonical,
				modified: input.updatedAt,
				keywords: [base, quote, `${base}/${quote}`, 'exchange rate', 'OHLC', 'historical data']
			}),
			breadcrumbJsonLd([{ name: `${base}/${quote}`, path }])
		]
	};
}

/**
 * Market history hub — /markets/history. A single page; the base/quote/range
 * are client-adjustable defaults, not separate indexable URLs.
 */
export function buildHistorySeo(): SeoMeta {
	const title = 'Exchange Rate History — Daily OHLC Charts | Monierate';
	const description =
		'Explore daily open/high/low/close history for Monierate’s composite exchange rate index, across currency pairs and time ranges, with exportable data tables.';
	const path = '/markets/history';
	const canonical = `${SITE}${path}`;

	return {
		title,
		description,
		canonical,
		ogImage: DEFAULT_OG_IMAGE,
		jsonLd: [
			datasetJsonLd({
				name: 'Monierate composite exchange rate index — daily OHLC',
				description,
				url: canonical,
				keywords: ['exchange rate', 'OHLC', 'historical data', 'index']
			}),
			breadcrumbJsonLd([{ name: 'Rate history', path }])
		]
	};
}

/**
 * Stablecoin Spread Index hub — /markets/spread. USDT/NGN only, per the
 * backend's MSI_PAIR; not programmatic per-pair.
 */
export function buildSpreadSeo(): SeoMeta {
	const title = 'Stablecoin Spread Index (MSI) — USDT/NGN Premium | Monierate';
	const description =
		'Track the Monierate Stablecoin Spread Index: the live USDT/NGN market premium over the CBN official rate, with history, per-source breakdown and channel signals.';
	const path = '/markets/spread';
	const canonical = `${SITE}${path}`;

	return {
		title,
		description,
		canonical,
		ogImage: DEFAULT_OG_IMAGE,
		jsonLd: [
			datasetJsonLd({
				name: 'Monierate Stablecoin Spread Index (MSI)',
				description,
				url: canonical,
				keywords: ['USDT', 'NGN', 'stablecoin premium', 'CBN rate', 'spread index']
			}),
			breadcrumbJsonLd([{ name: 'Stablecoin Spread Index', path }])
		]
	};
}
