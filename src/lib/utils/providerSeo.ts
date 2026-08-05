import { getIconPath } from '$lib/utils';

const SITE = 'https://monierate.com';

export interface ProviderSeoInput {
	code: string;
	name: string;
	bio?: string;
	icon?: string;
	link?: string;
}

export interface ProviderSeo {
	title: string;
	description: string;
	canonical: string;
	ogImage: string;
	orgJsonLd: string;
}

/**
 * Dynamic SEO (title/description/canonical/OG/JSON-LD) for a provider's
 * public rates page, keyed on the changer code. Shared so every
 * programmatic /markets/providers/:code page gets consistent, unique tags.
 */
export function buildProviderSeo(provider: ProviderSeoInput): ProviderSeo {
	const title = `${provider.name} Exchange Rates & Spreads | Monierate`;
	const description = provider.bio
		? `${provider.bio} See live ${provider.name} exchange rates, buy/sell spreads and 24h changes on Monierate.`
		: `Live ${provider.name} exchange rates, buy/sell spreads and 24h changes, tracked in real time on Monierate.`;
	const canonical = `${SITE}/markets/providers/${provider.code}`;
	const ogImage = `https://ik.imagekit.io/monierate/thumbnails/${provider.code}-og.png`;

	const orgJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: provider.name,
		...(provider.link ? { url: provider.link } : {}),
		logo: `${SITE}${getIconPath(provider.icon)}`
	}).replace(/</g, '\\u003c');

	return { title, description, canonical, ogImage, orgJsonLd };
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
}

/**
 * Dynamic SEO for a single pair × provider page, keyed on both the pair code
 * and the changer code (e.g. "USDT → NGN rate on Bybit"). One of these exists
 * per supported pair per provider, so this is the long-tail counterpart to
 * {@link buildProviderSeo}.
 */
export function buildPairProviderSeo(input: PairProviderSeoInput): ProviderSeo {
	const { base, quote, providerName } = input;
	const title = `${base} to ${quote} Rate on ${providerName} | Monierate`;
	const rateLine =
		input.rate !== undefined
			? ` Current rate: 1 ${base} = ${input.rate.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${quote}.`
			: '';
	const description = `Live ${base} → ${quote} exchange rate on ${providerName}, with buy/sell spread and rate history.${rateLine}`;
	const canonical = `${SITE}/markets/${input.pairCode}/${input.providerCode}`;
	const ogImage = `https://ik.imagekit.io/monierate/thumbnails/${input.providerCode}-og.png`;

	const orgJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: providerName,
		...(input.providerLink ? { url: input.providerLink } : {}),
		logo: `${SITE}${getIconPath(input.providerIcon)}`
	}).replace(/</g, '\\u003c');

	return { title, description, canonical, ogImage, orgJsonLd };
}

export interface PairOverviewSeoInput {
	pairCode: string;
	base: string;
	quote: string;
	rate?: number;
}

export interface PairOverviewSeo {
	title: string;
	description: string;
	canonical: string;
	ogImage: string;
	webPageJsonLd: string;
}

const OG_IMAGE = 'https://monierate.com/monierate-og-image.png';

/**
 * Dynamic SEO for the pair-overview hub page (all providers for one pair),
 * keyed on the pair code. Programmatic — one of these exists per supported
 * pair (usdtngn, usdngn, gbpngn, ...).
 */
export function buildPairOverviewSeo(input: PairOverviewSeoInput): PairOverviewSeo {
	const { base, quote } = input;
	const title = `${base}/${quote} Rate, Chart & Providers | Monierate`;
	const rateLine =
		input.rate !== undefined
			? ` Current index rate: 1 ${base} = ${input.rate.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${quote}.`
			: '';
	const description = `Live ${base} to ${quote} composite rate, history chart, and every provider quoting this pair, compared side by side on Monierate.${rateLine}`;
	const canonical = `${SITE}/markets/${input.pairCode}`;

	const webPageJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: title,
		description,
		url: canonical,
		about: `${base} to ${quote} exchange rate`
	}).replace(/</g, '\\u003c');

	return { title, description, canonical, ogImage: OG_IMAGE, webPageJsonLd };
}

/**
 * Static SEO for the market history (daily OHLC index) page — a single hub
 * page; the base/quote/range shown are a client-adjustable default, not
 * separate indexable URLs.
 */
export function buildHistorySeo(): PairOverviewSeo {
	const title = 'Exchange Rate History — Daily OHLC Charts | Monierate';
	const description =
		'Explore daily open/high/low/close history for Monierate’s composite exchange rate index, across currency pairs and time ranges, with exportable data tables.';
	const canonical = `${SITE}/markets/history`;

	const webPageJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: title,
		description,
		url: canonical,
		about: 'Historical exchange rate index data'
	}).replace(/</g, '\\u003c');

	return { title, description, canonical, ogImage: OG_IMAGE, webPageJsonLd };
}

/**
 * Static SEO for the Stablecoin Spread Index (MSI) page — a single hub page
 * (USDT/NGN only, per the backend MSI_PAIR), not programmatic per-pair.
 */
export function buildSpreadSeo(): PairOverviewSeo {
	const title = 'Stablecoin Spread Index (MSI) — USDT/NGN Premium | Monierate';
	const description =
		'Track the Monierate Stablecoin Spread Index: the live USDT/NGN market premium over the CBN official rate, with history, per-source breakdown and channel signals.';
	const canonical = `${SITE}/markets/spread`;

	const webPageJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: title,
		description,
		url: canonical,
		about: 'USDT/NGN stablecoin premium over the CBN official rate'
	}).replace(/</g, '\\u003c');

	return { title, description, canonical, ogImage: OG_IMAGE, webPageJsonLd };
}
