import type { ParamMatcher } from '@sveltejs/kit';
import { isAccountSlug } from '$lib/utils/accountsRoute';

/**
 * Matches the currency prefix of `/[currency]-accounts-rates`: a supported fiat code
 * (`usd`, `eur`, `gbp`) or `virtual` for the shared crypto page. Anything else 404s
 * instead of rendering an accounts page for a currency no provider issues.
 */
export const match: ParamMatcher = (param) => isAccountSlug(param);
