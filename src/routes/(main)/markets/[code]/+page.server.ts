import type { PageServerLoad } from './$types';
import { createIndex } from '$lib/services';
import type { IndexDailyHistoryEntry } from '$lib/services/currency/v1/index';
import type { DailySnapshot } from '$lib/services/rates.service';
import { parsePairCode } from '$lib/utils/pairs';
import { buildPairHistorySeo } from '$lib/utils/providerSeo';
import { getHistoryAccess } from '$lib/server/billing';
import { FREE_HISTORY_ROWS } from '$lib/constants/gate';

// `?amount=` seeds the quick converter's send field. Sanitized the same way the
// converter's own input handler does, so a junk query can't poison the state.
function parseAmountParam(raw: string | null): string {
	if (!raw) return '1';
	const cleaned = raw.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
	return parseFloat(cleaned) > 0 ? cleaned : '1';
}

// This route has no single provider (changer) to scope to — history comes from
// the composite index's daily OHLC instead of one changer's daily snapshots,
// reshaped into the `DailySnapshot` fields the pair-profile components use.
function toDailySnapshot(pairCode: string, e: IndexDailyHistoryEntry): DailySnapshot {
	return {
		date: e.date,
		provider_id: 'index',
		pair: pairCode,
		open: e.open,
		close: e.close,
		high: e.high,
		low: e.low,
		availability_pct: null
	};
}

export const load: PageServerLoad = async ({ fetch, params, url, cookies }) => {
	const pairCode = params.code.toLowerCase();
	const amount = parseAmountParam(url.searchParams.get('amount'));

	const indexService = createIndex(fetch, url.origin);

	const end = new Date();
	const start = new Date(end.getTime() - 30 * 86_400_000);
	const fmtDate = (d: Date) => d.toISOString().split('T')[0];

	interface DailyHistoryResponse {
		data: { entries: IndexDailyHistoryEntry[]; total?: number; count?: number; page?: number; limit?: number };
	}

	// Two fetches: the chart wants every daily point in the window (capped well
	// above what a 90-day window can hold), while the table below it fetches its
	// own page 1 so its `total` comes straight from the API's pagination envelope
	// instead of being inferred from whatever the chart happened to load.
	const [historyRes, tableRes] = await Promise.all([
		indexService
			.getDailyHistory({ pair: pairCode, start_date: fmtDate(start), end_date: fmtDate(end), limit: 90 })
			.catch(() => null),
		indexService
			// 20 = the OHLC table's page size (OhlcTable.svelte's `pageSize` default).
			.getDailyHistory({ pair: pairCode, start_date: fmtDate(start), end_date: fmtDate(end), page: 1, limit: 20 })
			.catch(() => null)
	]);
	const entries: IndexDailyHistoryEntry[] = (historyRes as DailyHistoryResponse | null)?.data?.entries ?? [];
	const initialHistory: DailySnapshot[] = entries.map((e) => toDailySnapshot(pairCode, e));

	const tableData = (tableRes as DailyHistoryResponse | null)?.data;
	const initialTableRows: DailySnapshot[] = (tableData?.entries ?? []).map((e) => toDailySnapshot(pairCode, e));
	const initialTableTotal = tableData?.total ?? 0;

	// Latest entry stands in for `latest_rates` — a single composite rate for the
	// whole pair, not a changer's buy/sell quote (the index has no bid/ask of its
	// own, so there's nothing genuine to put in separate buy/sell fields).
	const latest = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1))[0] ?? null;
	const currentRate = latest
		? {
				pair: pairCode,
				rate_type: 'index',
				rate_mid: latest.close,
				spread: latest.avg_spread_range,
				timestamp: latest.date
			}
		: null;

	const { base, quote } = parsePairCode(pairCode);

	const seo = buildPairHistorySeo({
		pairCode,
		base: base.toUpperCase(),
		quote: quote.toUpperCase(),
		rate: currentRate?.rate_mid,
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
		currentRate,
		initialHistory,
		initialTableRows,
		initialTableTotal,
		amount,
		seo,
		dayPass,
		hasFullAccess
	};
};
