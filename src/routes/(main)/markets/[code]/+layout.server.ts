import type { LayoutServerLoad } from './$types';
import { createRates } from '$lib/services';
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
export const load: LayoutServerLoad = async ({ fetch, url }) => {
	const ratesService = createRates(fetch, url.origin);

	const res = (await ratesService
		.getPairs({ is_active: true })
		.catch(() => null)) as RatesPairsResponse | null;

	const pairOptions: PairOption[] = (res?.data?.pairs ?? [])
		.filter((p) => p?.code && p.is_active !== false)
		.map((p) => {
			const { base, quote } = parsePairCode(p.code);
			return { code: p.code.toLowerCase(), base: base.toUpperCase(), quote: quote.toUpperCase() };
		})
		.sort((a, b) => a.base.localeCompare(b.base) || a.quote.localeCompare(b.quote));

	return { pairOptions };
};
