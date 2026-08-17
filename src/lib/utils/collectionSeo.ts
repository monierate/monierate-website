import {
	SITE,
	DEFAULT_OG_IMAGE,
	breadcrumbJsonLd,
	collectionPageJsonLd,
	faqPageJsonLd,
	itemListJsonLd,
	type SeoMeta
} from '$lib/utils/seo';
import { fillCopy, type ExchangeCollection } from '$lib/data/exchange-collections';

/**
 * SeoMeta builders for the /exchanges directory. Same contract as the Markets
 * builders: the page hands the result straight to `<Seo {...data.seo} />` and
 * assembles no head markup itself.
 */

const EXCHANGES_ROOT = { name: 'Exchanges', path: '/exchanges' };

export interface CollectionListing {
	code: string;
	name: string;
}

export interface CollectionSeoInput {
	collection: ExchangeCollection;
	/** The changers rendered on the page, in the order they appear. */
	listings: CollectionListing[];
	/** ISO timestamp of the freshest listing, for `dateModified`. */
	modified?: string;
	year?: number;
}

export function buildCollectionSeo({
	collection,
	listings,
	modified,
	year
}: CollectionSeoInput): SeoMeta {
	const values = { year: year ?? new Date().getFullYear(), count: listings.length };
	const title = fillCopy(collection.title, values);
	const heading = fillCopy(collection.heading, values);
	const path = `/exchanges/${collection.slug}`;
	const canonical = `${SITE}${path}`;

	return {
		title,
		description: collection.description,
		canonical,
		ogImage: DEFAULT_OG_IMAGE,
		jsonLd: [
			collectionPageJsonLd({
				name: heading,
				description: collection.description,
				url: canonical,
				modified
			}),
			itemListJsonLd(
				heading,
				listings.map((l) => ({ name: l.name, url: `${SITE}/exchanges/${l.code}` }))
			),
			...(collection.faqs.length ? [faqPageJsonLd(collection.faqs)] : []),
			breadcrumbJsonLd([{ name: collection.label, path }], EXCHANGES_ROOT)
		]
	};
}

/** The directory index at /exchanges. */
export function buildExchangesIndexSeo(): SeoMeta {
	const title = 'Crypto Exchanges & Money Transfer Platforms Directory | Monierate';
	const description =
		'A directory of crypto exchanges, OTC desks, remittance apps and card providers serving Nigeria — live rates, fees, licences and profiles for every platform.';
	const canonical = `${SITE}/exchanges`;

	return {
		title,
		description,
		canonical,
		ogImage: DEFAULT_OG_IMAGE,
		jsonLd: [
			collectionPageJsonLd({
				name: 'Exchange and platform directory',
				description,
				url: canonical
			}),
			breadcrumbJsonLd([], EXCHANGES_ROOT)
		]
	};
}

export { EXCHANGES_ROOT };
