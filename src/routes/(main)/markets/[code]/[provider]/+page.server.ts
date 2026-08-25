import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProviderV1 } from '$lib/services/providers.service';
import { getRateHistory, type DailySnapshot } from '$lib/services/rates.service';
import { parsePairCode } from '$lib/utils/pairs';
import { buildPairProviderSeo } from '$lib/utils/providerSeo';
import { resolveCurrentRate } from '$lib/utils/currentRate';
import { getHistoryAccess } from '$lib/server/billing';
import { FREE_HISTORY_ROWS } from '$lib/constants/gate';
import { allPeriodStats } from '$lib/utils/rateStats';
import { buildPairContent } from '$lib/utils/pairContent';
import { CURRENCY_SYMBOLS } from '$lib/constants/currency';

// `?amount=` seeds the quick converter's send field. Sanitized the same way the
// converter's own input handler does, so a junk query can't poison the state.
function parseAmountParam(raw: string | null): string {
	if (!raw) return '1';
	const cleaned = raw.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
	return parseFloat(cleaned) > 0 ? cleaned : '1';
}

export const load: PageServerLoad = async ({ fetch, params, url, cookies }) => {
	const pairCode = params.code.toLowerCase();
	const providerCode = params.provider.toLowerCase();
	const amount = parseAmountParam(url.searchParams.get('amount'));

	const result = await getProviderV1(fetch, providerCode);

	if (!result?.provider?.name) {
		throw error(404, `Provider "${providerCode}" not found`);
	}

	const { provider, latest_rates } = result;

	// `latest_rates` is the live v1 feed, and plenty of providers we still list
	// aren't in it — either we never scraped them for this pair, or the scraper
	// has gone quiet. Those pages used to 404, which was wrong: the homepage rate
	// tables link here from the legacy changer dataset, so a real provider with a
	// real profile was answering "not found". Render the page without the rate
	// instead; `hasLiveRate` drives the empty state downstream.
	const liveRate = (latest_rates ?? []).find((r) => r.pair === pairCode) ?? null;
	const hasLiveRate = liveRate !== null;

	const end = new Date();
	const start = new Date(end.getTime() - 30 * 86_400_000);
	// The stats table and the About copy summarise 7/30/90-day windows, which the
	// chart's own 30-day fetch cannot cover. Kept as a separate request so widening
	// it never changes what the chart draws on first paint.
	const statsStart = new Date(end.getTime() - 90 * 86_400_000);
	const fmtDate = (d: Date) => d.toISOString().split('T')[0];

	// Two fetches: the chart wants every daily point in the window (capped well
	// above what a 90-day window can hold), while the table below it fetches its
	// own page 1 so its `total` comes straight from the API's pagination envelope
	// instead of being inferred from whatever the chart happened to load.
	const [historyRes, tableRes, statsRes] = await Promise.all([
		getRateHistory(fetch, {
			pair: pairCode,
			provider_id: providerCode,
			start_date: fmtDate(start),
			end_date: fmtDate(end),
			limit: 90
		}),
		// 20 = the OHLC table's page size (OhlcTable.svelte's `pageSize` default).
		getRateHistory(fetch, {
			pair: pairCode,
			provider_id: providerCode,
			start_date: fmtDate(start),
			end_date: fmtDate(end),
			page: 1,
			limit: 20
		}),
		getRateHistory(fetch, {
			pair: pairCode,
			provider_id: providerCode,
			start_date: fmtDate(statsStart),
			end_date: fmtDate(end),
			limit: 100
		})
	]);
	const initialHistory: DailySnapshot[] = historyRes?.snapshots ?? [];
	const initialTableRows: DailySnapshot[] = tableRes?.snapshots ?? [];
	const initialTableTotal = tableRes?.total ?? 0;

	// Providers on a daily/manual cadence never reach the live feed, so keying the
	// page off `liveRate` alone blanked the stats, converter and summary on pages
	// that plainly had a current daily close sitting in the chart right below.
	// `basis` tells the UI which it got so it can label a close as a close.
	const { rate: currentRate, basis: rateBasis, asOf: rateAsOf } = resolveCurrentRate(
		liveRate,
		initialHistory
	);

	const { base, quote } = parsePairCode(pairCode);

	const stats = allPeriodStats(statsRes?.snapshots ?? []);

	const content = buildPairContent({
		pairCode,
		base: base.toUpperCase(),
		quote: quote.toUpperCase(),
		symbol: CURRENCY_SYMBOLS[quote.toLowerCase()] ?? '',
		rate: currentRate?.rate_mid ?? currentRate?.rate_buy ?? 0,
		buy: currentRate?.rate_buy,
		sell: currentRate?.rate_sell,
		spread: currentRate?.spread,
		stats,
		provider: { code: providerCode, name: provider.name },
		rateBasis,
		asOf: rateAsOf
	});

	const seo = buildPairProviderSeo({
		pairCode,
		base: base.toUpperCase(),
		quote: quote.toUpperCase(),
		providerCode,
		providerName: provider.name,
		providerIcon: provider.icon,
		providerLink: provider.link,
		rate: currentRate?.rate_buy || currentRate?.rate_mid,
		updatedAt: currentRate?.timestamp,
		rateBasis,
		rateAsOf,
		faqs: content.faqs
	});

	// Only worth resolving if the table will actually gate — skips the extra
	// round trip on pairs with too little history to lock anything. Driven by
	// the table's own `total`, not the chart's row count, since the two can differ.
	const { hasFullAccess, dayPass } = initialTableTotal > FREE_HISTORY_ROWS
		? await getHistoryAccess(cookies.get('user_token'))
		: { hasFullAccess: false, dayPass: null };

	return {
		pairCode,
		providerCode,
		provider,
		currentRate,
		hasLiveRate,
		rateBasis,
		rateAsOf,
		initialHistory,
		initialTableRows,
		initialTableTotal,
		amount,
		stats,
		content,
		seo,
		dayPass,
		hasFullAccess
	};
};
