import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { array_to_key_object } from '$lib/helper';
import { getCurrencies } from '$lib/services/currency.service';
import { getPair } from '$lib/services/pair.service';
import { getAllChangers } from '$lib/services/changer.service';
import {
	getRateSnapshot,
	resolveConversion,
	getPriceableCodes,
	pairFallbackRate
} from '$lib/services/globalRate.service';
import { buildConversionSlug, parseConversionSlug } from '$lib/utils/conversionSlug';
import { buildCurrencyUniverse, findCurrency } from '$lib/utils/converterCurrencies';
import { buildExchangeQuotes, type RawQuote } from '$lib/utils/converterQuotes';
import { buildConverterContent } from '$lib/utils/converterContent';
import { buildConversionSeo } from '$lib/utils/converterSeo';

/**
 * A conversion page.
 *
 * Two rules shape this loader, both learned from what the old page got wrong:
 *
 * 1. **One URL per conversion.** `1-usd-to-ngn`, `007-usd-to-ngn` and `usd-to-ngn`
 *    all say the same thing, so only the canonical spelling is served — everything
 *    else redirects into it before a crawler can index a duplicate.
 * 2. **Never 502.** The page it replaced threw on any upstream hiccup, so a slow
 *    rates API took down every conversion on the site. Here a failed fetch costs
 *    the section that needed it and nothing else; only a currency we cannot name
 *    at all is a 404.
 */
export const load: PageServerLoad = async ({ params, fetch }) => {
	const conversion = parseConversionSlug(params.conversion);

	if (!conversion) throw error(404, 'Not found');

	const { amount, from, to } = conversion;

	// `1-usd-to-ngn` -> `usd-to-ngn`, `007-` -> `7-`. Permanent: these are not
	// alternative addresses, they are misspellings of one.
	const canonical = buildConversionSlug(amount, from, to);
	if (params.conversion !== canonical) throw redirect(301, `/converter/${canonical}`);

	const directCode = `${from}${to}`;
	const inverseCode = `${to}${from}`;

	const [currencies, snapshot, directPair, inversePair] = await Promise.all([
		getCurrencies(fetch).catch(() => []),
		getRateSnapshot(fetch, from),
		getPair(fetch, directCode).catch(() => null),
		getPair(fetch, inverseCode).catch(() => null)
	]);

	const apiCurrencies = (Array.isArray(currencies) ? currencies : []) as any[];
	const priceable = await getPriceableCodes(fetch, snapshot);

	const pair: any = directPair ?? inversePair;
	const pairCode: string = pair?.code ?? directCode;
	const rawQuotes: RawQuote[] = pair?.changers ?? [];

	/* --- Is this a conversion we recognise at all? --- */
	const namedCodes = new Set(
		apiCurrencies
			.filter((c) => c?.is_active !== false)
			.map((c) => String(c?.code ?? '').toUpperCase())
	);
	const priceableCodes = new Set(priceable);

	// Three independent ways to be a real currency, because each source knows a
	// different slice: we can price it, we can name it, or the pairs feed quotes
	// the corridor. Only a code no source has heard of is a 404.
	const recognised = (code: string) =>
		priceableCodes.has(code.toUpperCase()) || namedCodes.has(code.toUpperCase()) || Boolean(pair);

	if (!recognised(from) || !recognised(to)) throw error(404, 'Unsupported currency');

	// The picker offers what we can price, not everything we can name. The two
	// currencies on screen are pinned in so a corridor answered by the pairs feed
	// alone still renders its own conversion.
	const universe = buildCurrencyUniverse(apiCurrencies, priceable, [from, to]);

	const fromCurrency = findCurrency(universe, from);
	const toCurrency = findCurrency(universe, to);

	// Account API first; the pairs feed answers for tracked corridors when it can't.
	const resolved = resolveConversion(snapshot, to) ?? pairFallbackRate(pair, from, to);
	const rate = resolved?.rate ?? 0;

	// 99 changer records is a heavy payload; only fetch the names and logos when
	// there are actually rows to put them against.
	const changers = rawQuotes.length ? await getAllChangers(fetch).catch(() => null) : null;

	const exchanges = changers
		? buildExchangeQuotes({
				quotes: rawQuotes,
				changers: array_to_key_object(changers as any[], 'code'),
				pairCode,
				from,
				to,
				amount,
				headlineRate: rate,
				contributors: pair?.index_contributors ?? []
			})
		: [];

	const content = buildConverterContent({
		amount,
		from: from.toUpperCase(),
		to: to.toUpperCase(),
		fromName: fromCurrency.name,
		toName: toCurrency.name,
		toSymbol: toCurrency.symbol,
		rate,
		market: resolved?.market ?? null,
		updatedAt: resolved?.updatedAt ?? null,
		exchanges
	});

	const seo = buildConversionSeo({
		amount,
		from: from.toUpperCase(),
		to: to.toUpperCase(),
		fromName: fromCurrency.name,
		toName: toCurrency.name,
		toSymbol: toCurrency.symbol,
		rate,
		market: resolved?.market ?? null,
		exchangeCount: exchanges.length,
		faqs: content.faqs
	});

	return {
		conversion: { amount, from: from.toUpperCase(), to: to.toUpperCase() },
		fromCurrency,
		toCurrency,
		currencies: universe,
		rate,
		market: resolved?.market ?? null,
		updatedAt: resolved?.updatedAt ?? null,
		exchanges,
		pairCode,
		content,
		seo
	};
};
