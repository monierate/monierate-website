import type { ParamMatcher } from '@sveltejs/kit';
import { isCollectionSlug } from '$lib/data/exchange-collections';

/**
 * Distinguishes a curated collection slug from a changer code, so
 * `/exchanges/otc-desks-in-lagos` and `/exchanges/busha` can share a segment.
 *
 * Matching against the curated list rather than a shape heuristic means a
 * changer code can never be swallowed by the collection route: anything not in
 * the config falls through to `/exchanges/[changer]`.
 */
export const match: ParamMatcher = (param) => isCollectionSlug(param);
