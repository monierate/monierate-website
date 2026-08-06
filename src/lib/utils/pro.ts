import { ACCOUNT_URL } from '$lib/config';

/**
 * Links and copy for Pro upsells on the public site.
 *
 * Every CTA is built here so conversions arriving at pro.monierate.com carry
 * consistent attribution: which page the visitor came from (`source`) and which
 * locked affordance they clicked (`feature`).
 */

export interface ProLinkParams {
	/** The gated affordance, e.g. 'export-index-history'. Becomes utm_content. */
	feature: string;
	/** The page/surface the gate lives on, e.g. 'markets-history'. Becomes utm_term. */
	source: string;
	/** Overrides the default campaign for one-off pushes. */
	campaign?: string;
}

const UTM_SOURCE = 'monierate';
const UTM_MEDIUM = 'upsell';
const DEFAULT_CAMPAIGN = 'pro_gate';

function withAttribution(base: string, { feature, source, campaign }: ProLinkParams): string {
	const url = new URL(base);
	url.searchParams.set('utm_source', UTM_SOURCE);
	url.searchParams.set('utm_medium', UTM_MEDIUM);
	url.searchParams.set('utm_campaign', campaign ?? DEFAULT_CAMPAIGN);
	url.searchParams.set('utm_content', feature);
	url.searchParams.set('utm_term', source);
	return url.toString();
}

/** Primary CTA — straight into Pro signup. No account needed to get here. */
export function proSignupUrl(params: ProLinkParams): string {
	return withAttribution(`${ACCOUNT_URL}/auth/signup`, params);
}

/**
 * Secondary CTA — the plans page on this site, so the visitor can read before
 * committing. Same-origin, so it carries plain params rather than utm_*.
 */
export function proLearnMoreUrl({ feature, source }: ProLinkParams): string {
	return `/pricing?source=${encodeURIComponent(source)}&feature=${encodeURIComponent(feature)}`;
}

/** Fallback benefit list. Surfaces override it with something feature-specific. */
export const PRO_FEATURES: readonly string[] = [
	'Unlimited CSV & PDF exports',
	'Export any custom date range',
	'Full historical data access',
	'Priority, ad-free data access'
];
