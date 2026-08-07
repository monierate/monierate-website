import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createIndex } from '$lib/services';
import type { IndexDailyHistoryEntry } from '$lib/services/currency/v1/index';
import { parsePairCode } from '$lib/utils/pairs';
import { buildPairHistorySeo } from '$lib/utils/providerSeo';

interface DailyHistoryResponse {
	status: string;
	data: { entries: IndexDailyHistoryEntry[] };
}

export const load: PageServerLoad = async ({ fetch, params, url }) => {
	const pairCode = params.code.toLowerCase();
	const { base, quote } = parsePairCode(pairCode);

	const end = new Date();
	const start = new Date(end.getTime() - 30 * 86_400_000);
	const fmtDate = (d: Date) => d.toISOString().split('T')[0];

	const indexService = createIndex(fetch, url.origin);

	const initialHistory: IndexDailyHistoryEntry[] = await indexService
		.getDailyHistory({ pair: pairCode, start_date: fmtDate(start), end_date: fmtDate(end), limit: 2000 })
		.then((res) => (res as DailyHistoryResponse | null)?.data?.entries ?? [])
		.catch(() => [] as IndexDailyHistoryEntry[]);

	if (!initialHistory.length) throw error(404, 'Pair not found');

	const latest = [...initialHistory].sort((a, b) => (a.date < b.date ? 1 : -1))[0];

	const seo = buildPairHistorySeo({
		pairCode,
		base: base.toUpperCase(),
		quote: quote.toUpperCase(),
		rate: latest?.close,
		updatedAt: latest?.date
	});

	return { pairCode, initialHistory, seo };
};
