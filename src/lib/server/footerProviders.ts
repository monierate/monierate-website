import type { Cookies } from '@sveltejs/kit';
import { QUOTE_HOME_COUNTRY } from '$lib/constants/currency';
import { getAllChangers } from '$lib/services/changer.service';
import { getAllPairs } from '$lib/services/pair.service';
import { resolveDefaultCurrency } from './defaultCurrency';

export interface FooterProvider {
	href: string;
	label: string;
	/** Display name alone, for copy that lists the region's providers. */
	name: string;
}

export interface FooterData {
	providers: FooterProvider[];
	/** Lowercase country for the USSD and SWIFT code links. */
	country: string;
}

// The footer lists a region's index contributors: the providers whose books
// the pair's average is built from. A market with fewer than this many gets
// TOP_UP of its other providers as well, so its list doesn't look thin.
const MIN_CONTRIBUTORS = 5;
const TOP_UP = 2;
const MAX_LINKS = 9;

// The pairs a region's providers are read from, in order of preference: a
// provider on both is linked on USDT.
const LEG_BASES = ['usdt', 'usd'];

/**
 * Pick the footer's provider links out of one quote currency's pairs.
 * `names` maps provider code to display name, and holds only providers that
 * are live, so a deactivated provider is never linked.
 */
export function pickFooterProviders(
	pairs: any[],
	quote: string,
	names: Map<string, string>
): FooterProvider[] {
	const q = quote.toLowerCase();
	const legs = LEG_BASES.map((base) => pairs.find((p) => p?.code === `${base}${q}`)).filter(
		Boolean
	);

	const picked: { code: string; pair: any }[] = [];
	const seen = new Set<string>();

	const add = (pair: any, code: string) => {
		if (seen.has(code) || !names.has(code)) return;

		const listed = (pair.changers ?? []).some(
			(c: any) => c.changer_code === code && c.is_public === true && c.is_active !== false
		);
		if (!listed) return;

		seen.add(code);
		picked.push({ code, pair });
	};

	for (const pair of legs) {
		for (const code of pair.index_contributors ?? []) add(pair, code);
	}

	if (picked.length < MIN_CONTRIBUTORS) {
		const target = picked.length + TOP_UP;
		for (const pair of legs) {
			for (const changer of pair.changers ?? []) {
				if (picked.length >= target) break;
				add(pair, changer.changer_code);
			}
		}
	}

	return picked.slice(0, MAX_LINKS).map(({ code, pair }) => {
		const base = pair.code.slice(0, -q.length).toUpperCase();
		const name = names.get(code) as string;
		return {
			href: `/markets/${pair.code}/${code}`,
			label: `Convert ${base} on ${name}`,
			name
		};
	});
}

/** Provider code → display name, for live providers only. */
export async function providerNames(fetch: typeof globalThis.fetch): Promise<Map<string, string>> {
	const changers = (await getAllChangers(fetch)) ?? [];
	return new Map(changers.map((c: any) => [c.code, c.name]));
}

export function footerCountry(quote: string): string {
	return QUOTE_HOME_COUNTRY[quote.toUpperCase()] ?? 'ng';
}

/**
 * Footer data for layouts that don't already hold the visitor's pairs. The
 * (main) layout builds it from the pairs it fetched for the ticker instead.
 */
export async function loadFooter({
	fetch,
	url,
	cookies,
	locals
}: {
	fetch: typeof globalThis.fetch;
	url: URL;
	cookies: Cookies;
	locals: App.Locals;
}): Promise<FooterData> {
	const quote = resolveDefaultCurrency({ url, cookies, locals });
	const [pairs, names] = await Promise.all([
		getAllPairs(fetch, undefined, 1, 100, quote),
		providerNames(fetch)
	]);

	return {
		providers: pickFooterProviders(pairs?.result ?? [], quote, names),
		country: footerCountry(quote)
	};
}
