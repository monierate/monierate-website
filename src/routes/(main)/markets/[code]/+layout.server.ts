import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { createRates } from '$lib/services';
import { getPair, getAllPairs } from '$lib/services/pair.service';
import { parsePairCode } from '$lib/utils/pairs';

export interface PairOption {
	code: string;
	base: string;
	quote: string;
}

interface RatesPairsResponse {
	data?: { pairs?: { code: string; is_active?: boolean }[] };
}

/**
 * The pair switcher in the page header (both /markets/[code] and
 * /markets/[code]/[provider]) needs the full list of tracked pairs. It's a
 * small, rarely-changing payload, so it's loaded once here rather than in each
 * page's own load.
 */
export const load: LayoutServerLoad = async ({ fetch, url, params }) => {
	const ratesService = createRates(fetch, url.origin);

	const [res, pair, allPairs] = await Promise.all([
		ratesService.getPairs({ is_active: true }).catch(() => null) as Promise<RatesPairsResponse | null>,
		getPair(fetch, params.code.toLowerCase()),
		getAllPairs(fetch, undefined, 1, 200)
	]);

	// Active pairs and the providers whose rate for each is public (the pairs proxy
	// already drops non-public providers). null when the lookup failed, so the
	// switchers fall back to unfiltered rather than emptying out.
	const publicPairProviders: Record<string, string[]> | null = Array.isArray(allPairs?.result)
		? Object.fromEntries(
				allPairs.result
					.filter((p: any) => p?.code && p.is_active !== false && p.changers?.length > 0)
					.map((p: any) => [
						String(p.code).toLowerCase(),
						p.changers.map((c: any) => String(c.changer_code).toLowerCase())
					])
			)
		: null;

	// The pairs proxy only returns public providers and lists the rest in
	// `hidden_changers`. A pair whose providers are all hidden has nothing public to
	// show, so it is treated as not found. (A pair with no providers at all is left
	// alone: it can still be an index-only pair.)
	const hiddenChangers: string[] = (pair?.hidden_changers ?? []).map((c: string) => c.toLowerCase());
	if (pair && pair.changers?.length === 0 && hiddenChangers.length > 0) {
		throw error(404, `Pair "${params.code}" not found`);
	}

	const pairOptions: PairOption[] = (res?.data?.pairs ?? [])
		.filter((p) => p?.code && p.is_active !== false)
		.filter((p) => !publicPairProviders || p.code.toLowerCase() in publicPairProviders)
		.map((p) => {
			const { base, quote } = parsePairCode(p.code);
			return { code: p.code.toLowerCase(), base: base.toUpperCase(), quote: quote.toUpperCase() };
		})
		.sort((a, b) => a.base.localeCompare(b.base) || a.quote.localeCompare(b.quote));

	return { pairOptions, hiddenChangers, publicPairProviders };
};
