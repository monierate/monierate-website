import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { searchChangers } from '$lib/services/changer.service';
import {
	COLLECTION_PAGE_SIZE,
	EXCHANGE_COLLECTIONS,
	MIN_COLLECTION_SIZE,
	fillCopy,
	getCollection
} from '$lib/data/exchange-collections';
import { buildCollectionSeo } from '$lib/utils/collectionSeo';
import { getPublishedSlugs } from '$lib/server/collections';

/**
 * A curated directory collection, e.g. /exchanges/otc-desks-in-lagos.
 *
 * SSR on demand — the listing has to be in the HTML a crawler receives, and the
 * ranked order tracks live ratings, so a build-time snapshot would ship stale.
 */
export const load: PageServerLoad = async ({ params, fetch, setHeaders }) => {
	const collection = getCollection(params.collection);

	// Unreachable via the route matcher, but the load must not assume it.
	if (!collection) throw error(404, 'Collection not found');

	const search = await searchChangers(fetch, {
		...collection.facets,
		sort: 'rating',
		limit: COLLECTION_PAGE_SIZE
	});

	const changers = search?.result ?? [];

	// Thin-page guard. A collection with almost nothing in it is a dead end that
	// drags on the whole site's rankings, so it 404s rather than publishing —
	// which is also what keeps it out of the sitemap.
	if (changers.length < MIN_COLLECTION_SIZE) {
		throw error(404, 'Collection not found');
	}

	const modified = changers
		.map((c: any) => c.updatedAt)
		.filter(Boolean)
		.sort()
		.pop();

	const year = new Date().getFullYear();

	// Sibling collections for the "explore more" strip: same shape of query,
	// different facet. Sorted so the ones sharing a tag with this page come first.
	//
	// Filtered through the published set, not just the config — a collection
	// whose facets currently return nothing 404s, and linking to it from here
	// would hand crawlers a dead end. The set is cached, so this is normally free.
	const publishedSlugs = await getPublishedSlugs();

	const shareTag = (a?: string[], b?: string[]) =>
		Boolean(a && b && a.some((t) => b.includes(t)));

	const related = EXCHANGE_COLLECTIONS.filter(
		(c) => c.slug !== collection.slug && publishedSlugs.has(c.slug)
	)
		.sort((a, b) => {
			const score = (c: typeof a) =>
				(shareTag(c.facets.tags, collection.facets.tags) ? 2 : 0) + (c.featured ? 1 : 0);
			return score(b) - score(a);
		})
		.slice(0, 6)
		.map((c) => ({ slug: c.slug, label: c.label }));

	// Directory data turns over slowly; an edge cache keeps the worker cheap
	// while still picking up a new listing within the hour.
	setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=1800' });

	return {
		collection: {
			slug: collection.slug,
			heading: fillCopy(collection.heading, { year, count: changers.length }),
			intro: fillCopy(collection.intro, { year, count: changers.length }),
			label: collection.label,
			faqs: collection.faqs
		},
		changers,
		total: search?.count ?? changers.length,
		related,
		lastUpdated: modified ?? new Date().toISOString(),
		seo: buildCollectionSeo({
			collection,
			listings: changers.map((c: any) => ({ code: c.code, name: c.name })),
			modified,
			year
		})
	};
};
