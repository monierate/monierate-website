import type { ParamMatcher } from '@sveltejs/kit';
import { isConversionSlug } from '$lib/utils/conversionSlug';

/**
 * Distinguishes a conversion slug from a changer code, so `/converter/100-usd-to-ngn`
 * and `/converter/binance` can share a segment — the same arrangement
 * `/exchanges/[collection=collection]` already has with `/exchanges/[changer]`.
 *
 * A shape test is safe here where the exchange matcher needed a curated list: the
 * grammar requires a literal `-to-`, and no changer code contains one. Anything
 * that fails the shape falls through to `/converter/[changer]`.
 */
export const match: ParamMatcher = (param) => isConversionSlug(param);
