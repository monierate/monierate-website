import type { PageServerLoad } from './$types';
import { createIndex } from '$lib/services';
import type { IndexDailyHistoryEntry } from '$lib/services/currency/v1/index';
import type { DailySnapshot } from '$lib/services/rates.service';
import { parsePairCode } from '$lib/utils/pairs';
import { buildPairHistorySeo } from '$lib/utils/providerSeo';

// `?amount=` seeds the quick converter's send field. Sanitized the same way the
// converter's own input handler does, so a junk query can't poison the state.
function parseAmountParam(raw: string | null): string {
	if (!raw) return '1';
	const cleaned = raw.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
	return parseFloat(cleaned) > 0 ? cleaned : '1';
}

// This route has no single provider (changer) to scope to, so history comes from
// the composite index's daily OHLC instead of one changer's daily snapshots.
// Mapped into the same `DailySnapshot` shape the provider-page components already
// expect, so ProviderPairInsight / OhlcTable / HistoryChart need no changes to render it.
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

export const load: PageServerLoad = async ({ fetch, params, url }) => {
	const pairCode = params.code.toLowerCase();
	const amount = parseAmountParam(url.searchParams.get('amount'));

	const indexService = createIndex(fetch, url.origin);

	const end = new Date();
	const start = new Date(end.getTime() - 30 * 86_400_000);
	const fmtDate = (d: Date) => d.toISOString().split('T')[0];

	interface DailyHistoryResponse {
		status: string;
		data: { entries: IndexDailyHistoryEntry[] };
	}

	const historyRes = await indexService
		.getDailyHistory({ pair: pairCode, start_date: fmtDate(start), end_date: fmtDate(end), limit: 90 })
		.catch(() => null);
	const entries: IndexDailyHistoryEntry[] = (historyRes as DailyHistoryResponse | null)?.data?.entries ?? [];
	const initialHistory: DailySnapshot[] = entries.map((e) => toDailySnapshot(pairCode, e));

	// Latest entry stands in for `latest_rates` — the composite rate reflects the
	// pair as a whole instead of one changer's quote.
	const latest = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1))[0] ?? null;
	const currentRate = latest
		? {
				pair: pairCode,
				rate_type: 'index',
				rate_buy: latest.close,
				rate_sell: latest.close,
				rate_mid: latest.close,
				spread: latest.avg_spread_range,
				timestamp: latest.date
			}
		: null;
	const hasLiveRate = currentRate !== null;

	const { base, quote } = parsePairCode(pairCode);

	const seo = buildPairHistorySeo({
		pairCode,
		base: base.toUpperCase(),
		quote: quote.toUpperCase(),
		rate: currentRate?.rate_mid,
		updatedAt: currentRate?.timestamp
	});

	return {
		pairCode,
		providerCode: '',
		provider: { name: `${base.toUpperCase()}/${quote.toUpperCase()} Composite Index`, icon: '', link: undefined },
		currentRate,
		hasLiveRate,
		initialHistory,
		amount,
		seo
	};
};
