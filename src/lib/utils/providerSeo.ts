import { getIconPath } from '$lib/utils';

const SITE = 'https://monierate.com';

export interface ProviderSeoInput {
	code: string;
	name: string;
	bio?: string;
	icon?: string;
	link?: string;
}

export interface ProviderSeo {
	title: string;
	description: string;
	canonical: string;
	ogImage: string;
	orgJsonLd: string;
}

/**
 * Dynamic SEO (title/description/canonical/OG/JSON-LD) for a provider's
 * public rates page, keyed on the changer code. Shared so every
 * programmatic /markets/providers/:code page gets consistent, unique tags.
 */
export function buildProviderSeo(provider: ProviderSeoInput): ProviderSeo {
	const title = `${provider.name} Exchange Rates & Spreads | Monierate`;
	const description = provider.bio
		? `${provider.bio} See live ${provider.name} exchange rates, buy/sell spreads and 24h changes on Monierate.`
		: `Live ${provider.name} exchange rates, buy/sell spreads and 24h changes, tracked in real time on Monierate.`;
	const canonical = `${SITE}/markets/providers/${provider.code}`;
	const ogImage = `https://ik.imagekit.io/monierate/thumbnails/${provider.code}-og.png`;

	const orgJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: provider.name,
		...(provider.link ? { url: provider.link } : {}),
		logo: `${SITE}${getIconPath(provider.icon)}`
	}).replace(/</g, '\\u003c');

	return { title, description, canonical, ogImage, orgJsonLd };
}
