import { serverApiRequest } from '$lib/api/server';
import {
	EXCHANGE_COLLECTIONS,
	MIN_COLLECTION_SIZE,
	type CollectionFacets,
	type ExchangeCollection
} from '$lib/data/exchange-collections';

/**
 * Which curated collections currently hold enough changers to be published.
 *
 * The thin-page guard lives in the collection route, but two other places need
 * the same answer without rendering the pages: the sitemap (a listed URL that
 * 404s is worse than an unlisted one) and the /exchanges index (linking to a
 * dead collection wastes crawl budget and looks broken).
 *
 * Counting is one `limit=1` request per collection, run in parallel — cheap
 * enough for a handful of curated combos, and both callers cache at the edge.
 * Add a collection and this cost grows linearly; if the config ever reaches the
 * hundreds, replace this with a single counts endpoint.
 */

/** Flatten facets into search_changers query params (multi-value = comma-joined). */
export function facetsToParams(facets: CollectionFacets): Record<string, string> {
	const params: Record<string, string> = {};

	for (const [key, value] of Object.entries(facets)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			if (value.length === 0) continue;
			params[key] = value.join(',');
		} else {
			params[key] = String(value);
		}
	}

	return params;
}

async function countChangers(facets: CollectionFacets): Promise<number> {
	try {
		const res = await serverApiRequest<{ count?: number }>('/changers/search_changers', {
			params: { ...facetsToParams(facets), limit: 1 },
			timeoutMs: 8000,
			retries: 1
		});

		return res.success ? (res.data?.count ?? 0) : 0;
	} catch {
		return 0;
	}
}

export interface PublishedCollection {
	collection: ExchangeCollection;
	count: number;
}

/**
 * Read-through cache, held for the life of a worker isolate. Three routes ask
 * the same question on every render — the sitemap, the index, and every changer
 * profile — and the answer changes only when a changer's facets change. The
 * in-flight promise is cached too, so concurrent requests share one fan-out
 * instead of each firing its own.
 */
const CACHE_TTL_MS = 10 * 60 * 1000;
let cache: { at: number; value: Promise<PublishedCollection[]> } | null = null;

async function resolvePublished(): Promise<PublishedCollection[]> {
	const counts = await Promise.all(
		EXCHANGE_COLLECTIONS.map(async (collection) => ({
			collection,
			count: await countChangers(collection.facets)
		}))
	);

	return counts.filter(({ count }) => count >= MIN_COLLECTION_SIZE);
}

export async function getPublishedCollections(): Promise<PublishedCollection[]> {
	if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
		return cache.value;
	}

	const value = resolvePublished();
	cache = { at: Date.now(), value };

	// A rejected fetch must not be cached as "nothing is published" for ten
	// minutes — drop the entry so the next caller retries.
	value.catch(() => {
		if (cache?.value === value) cache = null;
	});

	return value;
}

/** Slugs of the collections currently large enough to publish. */
export async function getPublishedSlugs(): Promise<Set<string>> {
	return new Set((await getPublishedCollections()).map(({ collection }) => collection.slug));
}
