/**
 * Outbound destinations resolved from a provider profile — the "Visit /
 * Download" link under a page title, and the "Buy on X" CTA below the quick
 * converter.
 *
 * `app_links` is the canonical home for store URLs, but older provider records
 * only carry them inside `featured_publications`; the same fallback runs in
 * ChangerSidebar.svelte and stays until that data is migrated.
 */

export interface ProviderLinkSource {
	/** The provider's own site — often a referral URL rather than a bare domain. */
	link?: string;
	app_links?: { ios?: string; android?: string } | null;
	featured_publications?: { url?: string }[] | null;
}

export interface DeviceHints {
	isAndroid?: boolean;
	isIOS?: boolean;
}

export interface ProviderCta {
	url: string;
	/** Which destination we resolved to — drives the spoken label at the call site. */
	kind: 'app' | 'site';
	/** Visible link text. */
	label: 'Download App' | 'Visit Website';
}

function playStoreUrl(provider: ProviderLinkSource): string | undefined {
	return (
		provider.app_links?.android ||
		provider.featured_publications?.find((p) => p.url?.includes('play.google.com'))?.url ||
		undefined
	);
}

function appStoreUrl(provider: ProviderLinkSource): string | undefined {
	return (
		provider.app_links?.ios ||
		provider.featured_publications?.find((p) => p.url?.includes('apps.apple.com'))?.url ||
		undefined
	);
}

/**
 * Best store URL for the visitor's device. Device hints come from the server's
 * user-agent sniff, so the choice is settled before hydration; without them the
 * Android listing wins, since it's the far more common device here.
 */
export function providerAppUrl(
	provider: ProviderLinkSource,
	{ isIOS = false }: DeviceHints = {}
): string | null {
	const play = playStoreUrl(provider);
	const app = appStoreUrl(provider);

	return (isIOS ? (app ?? play) : (play ?? app)) ?? null;
}

/**
 * The single link shown under a provider's name: its app when the profile lists
 * one, otherwise its website. `null` when the profile has neither.
 */
export function providerCta(
	provider: ProviderLinkSource,
	device: DeviceHints = {}
): ProviderCta | null {
	const app = providerAppUrl(provider, device);
	if (app) return { url: app, kind: 'app', label: 'Download App' };
	if (provider.link) return { url: provider.link, kind: 'site', label: 'Visit Website' };
	return null;
}

/**
 * Where "Buy on X" sends people. The website is the right landing spot for a
 * trade — the app store is only a stand-in for providers with no site on file.
 */
export function providerTradeUrl(
	provider: ProviderLinkSource,
	device: DeviceHints = {}
): string | null {
	return provider.link || providerAppUrl(provider, device);
}
