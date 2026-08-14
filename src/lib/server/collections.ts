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
 * Probing is one small request per collection, run in parallel — cheap enough
 * for a handful of curated combos, and both callers cache at the edge. Add a
 * collection and this cost grows linearly; if the config ever reaches the
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

/** How many changer logos each collection card previews in its avatar stack. */
export const COLLECTION_PREVIEW_COUNT = 3;

/**
 * Size of the pool the avatar stack draws from. Bigger than the stack itself so
 * the logos vary — `sort=rating` returns the same head every time, which put an
 * identical three logos on every card.
 */
const PREVIEW_POOL_SIZE = 12;

export interface CollectionPreview {
	code: string;
	name: string;
	icon?: string;
}

/** Fisher–Yates on a copy — the source array is cached and must not be mutated. */
export function shuffle<T>(items: readonly T[]): T[] {
	const out = [...items];
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

async function searchPage(facets: CollectionFacets, page: number) {
	const res = await serverApiRequest<{ count?: number; result?: any[] }>(
		'/changers/search_changers',
		{
			params: { ...facetsToParams(facets), sort: 'rating', limit: PREVIEW_POOL_SIZE, page },
			timeoutMs: 8000,
			retries: 1
		}
	);

	return res.success ? res.data : null;
}

/**
 * The collection's size, plus a pool of members for the card's avatar stack.
 *
 * The pool is drawn from a random page so the logos differ between collections
 * that share a top-rated head, and the caller shuffles it again at render time.
 * `sort=rating` stays on because paging is only meaningful over a stable order.
 */
async function probeCollection(
	facets: CollectionFacets
): Promise<{ count: number; pool: CollectionPreview[] }> {
	const toPreviews = (rows: any[] = []): CollectionPreview[] =>
		rows.map((c) => ({ code: c.code, name: c.name, icon: c.icon }));

	try {
		// The first page doubles as the count probe the thin-page guard needs.
		const first = await searchPage(facets, 1);
		if (!first) return { count: 0, pool: [] };

		const count = first.count ?? 0;
		const pages = Math.ceil(count / PREVIEW_POOL_SIZE);

		if (pages > 1) {
			const page = 1 + Math.floor(Math.random() * pages);
			const extra = page === 1 ? null : await searchPage(facets, page);
			// The last page is usually a short one; falling back to the first keeps
			// the stack full rather than rendering a card with two logos.
			if ((extra?.result?.length ?? 0) >= COLLECTION_PREVIEW_COUNT) {
				return { count, pool: toPreviews(extra!.result) };
			}
		}

		return { count, pool: toPreviews(first.result) };
	} catch {
		return { count: 0, pool: [] };
	}
}

export interface PublishedCollection {
	collection: ExchangeCollection;
	count: number;
	/** Shuffle and slice at render time — see COLLECTION_PREVIEW_COUNT. */
	pool: CollectionPreview[];
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
	const probed = await Promise.all(
		EXCHANGE_COLLECTIONS.map(async (collection) => ({
			collection,
			...(await probeCollection(collection.facets))
		}))
	);

	return probed.filter(({ count }) => count >= MIN_COLLECTION_SIZE);
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
