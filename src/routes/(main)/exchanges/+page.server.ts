import type { PageServerLoad } from './$types';
import { getAllChangers } from '$lib/services/changer.service';
import { getPublishedCollections } from '$lib/server/collections';
import { buildExchangesIndexSeo } from '$lib/utils/collectionSeo';

/**
 * The directory index. Its job in the SEO graph is to be the hub every
 * collection page hangs off — the collections list here, each collection links
 * to its profiles, and each profile links back to the collections it belongs to.
 *
 * Only collections that pass the thin-page guard are linked; a link to a
 * collection that 404s wastes crawl budget on the whole section.
 */
export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	const [published, changers] = await Promise.all([
		getPublishedCollections(),
		getAllChangers(fetch, 1, 200)
	]);

	const collections = published.map(({ collection, count, previews }) => ({
		slug: collection.slug,
		label: collection.label,
		description: collection.description,
		featured: collection.featured ?? false,
		count,
		previews
	}));

	setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=1800' });

	return {
		collections,
		changers: (changers ?? []).map((c: any) => ({
			code: c.code,
			name: c.name,
			icon: c.icon,
			bio: c.bio,
			is_verified: c.is_verified,
			rating_score: c.rating_score,
			changer_tags: c.changer_tags ?? [],
			licenses: c.licenses ?? []
		})),
		seo: buildExchangesIndexSeo()
	};
};
