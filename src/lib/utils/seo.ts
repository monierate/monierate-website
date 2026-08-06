/**
 * Shared SEO primitives for the public Markets pages.
 *
 * Every page builds a {@link SeoMeta} in its server load and hands it to
 * `<Seo {...data.seo} />`, so the head markup exists in exactly one place and
 * no page can drift on canonical, OG, or Twitter tags.
 */

export const SITE = 'https://monierate.com';
export const SITE_NAME = 'Monierate';
export const DEFAULT_OG_IMAGE = `${SITE}/monierate-og-image.png`;

export interface SeoMeta {
	title: string;
	description: string;
	/** Absolute URL. Always the monierate.com address for this page. */
	canonical: string;
	ogImage: string;
	ogType?: string;
	/** Only set to hold a page back from the index; omitted means indexable. */
	robots?: string;
	/** Pre-serialised, escaped JSON-LD blocks — see the builders below. */
	jsonLd: string[];
}

/**
 * Serialise a JSON-LD block. `<` is escaped so a value containing `</script>`
 * cannot break out of the tag it is embedded in.
 */
export function jsonLdBlock(data: Record<string, unknown>): string {
	return JSON.stringify(data).replace(/</g, '\\u003c');
}

export interface Crumb {
	name: string;
	/** Site-relative path, e.g. `/markets/usdtngn`. */
	path: string;
}

/** BreadcrumbList for a nested page. Pass the trail excluding the site root. */
export function breadcrumbJsonLd(crumbs: Crumb[]): string {
	return jsonLdBlock({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [{ name: 'Markets', path: '/markets' }, ...crumbs].map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: c.name,
			item: `${SITE}${c.path}`
		}))
	});
}

export interface DatasetInput {
	name: string;
	description: string;
	url: string;
	/** ISO date of the most recent observation, when known. */
	modified?: string;
	keywords?: string[];
	temporalCoverage?: string;
}

/**
 * Dataset — the right type for our rate series (index history, OHLC, MSI).
 * Signals to search and AI crawlers that the page is a data source, not prose.
 */
export function datasetJsonLd(input: DatasetInput): string {
	return jsonLdBlock({
		'@context': 'https://schema.org',
		'@type': 'Dataset',
		name: input.name,
		description: input.description,
		url: input.url,
		...(input.modified ? { dateModified: input.modified } : {}),
		...(input.keywords?.length ? { keywords: input.keywords } : {}),
		...(input.temporalCoverage ? { temporalCoverage: input.temporalCoverage } : {}),
		isAccessibleForFree: true,
		creator: { '@type': 'Organization', name: SITE_NAME, url: SITE },
		license: `${SITE}/policy/data`
	});
}

export interface ExchangeRateInput {
	/** Uppercase codes, e.g. USDT and NGN. */
	base: string;
	quote: string;
	rate: number;
	/** Provider name when the rate belongs to one, omitted for the composite index. */
	providerName?: string;
}

/**
 * ExchangeRateSpecification — schema.org's FinancialProduct subtype for an FX
 * quote. More precise than a bare FinancialProduct, and the currency fields are
 * what rich results actually read.
 */
export function exchangeRateJsonLd(input: ExchangeRateInput): string {
	return jsonLdBlock({
		'@context': 'https://schema.org',
		'@type': 'ExchangeRateSpecification',
		currency: input.base,
		name: `${input.base}/${input.quote}${input.providerName ? ` on ${input.providerName}` : ''}`,
		currentExchangeRate: {
			'@type': 'UnitPriceSpecification',
			price: input.rate,
			priceCurrency: input.quote
		},
		...(input.providerName
			? { provider: { '@type': 'Organization', name: input.providerName } }
			: {})
	});
}

export interface OrganizationInput {
	name: string;
	/** The provider's own site. */
	url?: string;
	logo?: string;
}

export function organizationJsonLd(input: OrganizationInput): string {
	return jsonLdBlock({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: input.name,
		...(input.url ? { url: input.url } : {}),
		...(input.logo ? { logo: input.logo } : {})
	});
}

export interface WebPageInput {
	name: string;
	description: string;
	url: string;
	about?: string;
}

export function webPageJsonLd(input: WebPageInput): string {
	return jsonLdBlock({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: input.name,
		description: input.description,
		url: input.url,
		...(input.about ? { about: input.about } : {})
	});
}
