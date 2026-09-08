import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getCurrencies } from '$lib/services/currency.service';
import { getPair } from '$lib/services/pair.service';
import {
	getRateSnapshot,
	resolveConversion,
	getPriceableCodes,
	pairFallbackRate
} from '$lib/services/globalRate.service';
import { conversionPath, MAX_AMOUNT } from '$lib/utils/conversionSlug';
import { buildCurrencyUniverse, findCurrency } from '$lib/utils/converterCurrencies';
import { buildConverterHubSeo } from '$lib/utils/converterSeo';

const DEFAULT_FROM = 'usd';
const FALLBACK_TO = 'ngn';

/** Params are read case-insensitively — the old page emitted `From`, older links used `from`. */
function param(search: URLSearchParams, name: string): string | null {
	return search.get(name) ?? search.get(name.toLowerCase()) ?? search.get(name.toUpperCase());
}

function cleanCode(raw: string | null): string | null {
	if (!raw) return null;
	const code = raw.trim().toLowerCase();
	return /^[a-z0-9]{2,6}$/.test(code) ? code : null;
}

function cleanAmount(raw: string | null): number {
	const parsed = parseFloat((raw ?? '').replace(/[^0-9.]/g, ''));
	return Number.isFinite(parsed) && parsed > 0 && parsed <= MAX_AMOUNT ? parsed : 1;
}

/**
 * The converter hub.
 *
 * Also the retirement home for `?Amount=&From=&To=`. Those URLs are what the page
 * has been emitting for years, so they carry real links; a 301 hands that weight to
 * the path form instead of leaving two addresses competing to rank for the same
 * conversion.
 */
export const load: PageServerLoad = async ({ url, fetch, parent }) => {
	const search = url.searchParams;

	const legacyFrom = cleanCode(param(search, 'From'));
	const legacyTo = cleanCode(param(search, 'To'));

	// Only a request that actually named a conversion is redirected — `?quote=`
	// and friends belong to the layout and must keep working.
	if (legacyFrom && legacyTo && legacyFrom !== legacyTo) {
		throw redirect(
			301,
			conversionPath(cleanAmount(param(search, 'Amount')), legacyFrom, legacyTo)
		);
	}

	const { defaultCurrency } = await parent();

	// The visitor's own currency, unless that is the base — USD to USD has no page.
	const preferred = cleanCode(defaultCurrency) ?? FALLBACK_TO;
	const to = preferred === DEFAULT_FROM ? FALLBACK_TO : preferred;

	const [currencies, snapshot, pair] = await Promise.all([
		getCurrencies(fetch).catch(() => []),
		getRateSnapshot(fetch, DEFAULT_FROM),
		getPair(fetch, `${DEFAULT_FROM}${to}`).catch(() => null)
	]);

	// Membership is what we can price; the currency API only supplies names and icons.
	const universe = buildCurrencyUniverse(
		(Array.isArray(currencies) ? currencies : []) as any[],
		await getPriceableCodes(fetch, snapshot),
		[DEFAULT_FROM, to]
	);

	const resolved =
		resolveConversion(snapshot, to) ?? pairFallbackRate(pair as any, DEFAULT_FROM, to);

	return {
		conversion: { amount: 1, from: DEFAULT_FROM.toUpperCase(), to: to.toUpperCase() },
		fromCurrency: findCurrency(universe, DEFAULT_FROM),
		toCurrency: findCurrency(universe, to),
		currencies: universe,
		rate: resolved?.rate ?? 0,
		market: resolved?.market ?? null,
		updatedAt: resolved?.updatedAt ?? null,
		seo: buildConverterHubSeo()
	};
};
