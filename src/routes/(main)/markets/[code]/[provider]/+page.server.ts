import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProviderV1 } from '$lib/services/providers.service';
import { getRateHistory, type DailySnapshot } from '$lib/services/rates.service';
import { parsePairCode } from '$lib/utils/pairs';
import { buildPairProviderSeo } from '$lib/utils/providerSeo';
import { getHistoryAccess } from '$lib/server/billing';
import { FREE_HISTORY_ROWS } from '$lib/constants/gate';

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
	const currentRate = (latest_rates ?? []).find((r) => r.pair === pairCode) ?? null;
	const hasLiveRate = currentRate !== null;

	const end = new Date();
	const start = new Date(end.getTime() - 30 * 86_400_000);
	const fmtDate = (d: Date) => d.toISOString().split('T')[0];

	// Two fetches: the chart wants every daily point in the window (capped well
	// above what a 90-day window can hold), while the table below it fetches its
	// own page 1 so its `total` comes straight from the API's pagination envelope
	// instead of being inferred from whatever the chart happened to load.
	const [historyRes, tableRes] = await Promise.all([
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
		})
	]);
	const initialHistory: DailySnapshot[] = historyRes?.snapshots ?? [];
	const initialTableRows: DailySnapshot[] = tableRes?.snapshots ?? [];
	const initialTableTotal = tableRes?.total ?? 0;

	const { base, quote } = parsePairCode(pairCode);

	const seo = buildPairProviderSeo({
		pairCode,
		base: base.toUpperCase(),
		quote: quote.toUpperCase(),
		providerCode,
		providerName: provider.name,
		providerIcon: provider.icon,
		providerLink: provider.link,
		rate: currentRate?.rate_buy || currentRate?.rate_mid,
		updatedAt: currentRate?.timestamp
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
		initialHistory,
		initialTableRows,
		initialTableTotal,
		amount,
		seo,
		dayPass,
		hasFullAccess
	};
};
