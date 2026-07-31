import type { PageServerLoad } from './$types';
import { createIndex } from '$lib/services';
import { defaultBaseForQuote, QUOTE_SUPPORTED_BASES } from '$lib/constants/currency';
import { buildHistorySeo } from '$lib/utils/providerSeo';
import type { IndexDailyHistoryEntry } from '$lib/services/currency/v1/index';

const RANGES = ['7d', '30d', '60d', '90d'] as const;
type Range = (typeof RANGES)[number];
const DAYS_MAP: Record<Range, number> = { '7d': 7, '30d': 30, '60d': 60, '90d': 90 };

interface DailyHistoryResponse {
	status: string;
	data: { entries: IndexDailyHistoryEntry[] };
}

export const load: PageServerLoad = async ({ fetch, url, cookies }) => {
	const quote = (cookies.get('default_currency') ?? 'NGN').toUpperCase();
	const supported = QUOTE_SUPPORTED_BASES[quote] ?? [];
	const cookieBase = cookies.get('active_base')?.toUpperCase();
	const requestedBase = url.searchParams.get('base')?.toUpperCase();
	const base =
		(requestedBase && supported.includes(requestedBase) && requestedBase) ||
		(cookieBase && supported.includes(cookieBase) && cookieBase) ||
		defaultBaseForQuote(quote);

	const requestedRange = url.searchParams.get('range') as Range | null;
	const range = requestedRange && RANGES.includes(requestedRange) ? requestedRange : '30d';

	const pair = `${base}${quote}`.toLowerCase();
	const days = DAYS_MAP[range];
	const end = new Date();
	const start = new Date(end.getTime() - days * 86_400_000);
	const fmt = (d: Date) => d.toISOString().split('T')[0];

	const indexService = createIndex(fetch, url.origin);

	// Unlike the streamed provider-highlight cards on other market pages, this
	// IS the page's primary content — awaited so crawlers see the actual OHLC
	// chart/table in the raw SSR HTML, not just a loading skeleton.
	const history = await indexService
		.getDailyHistory({ pair, start_date: fmt(start), end_date: fmt(end), limit: 2000 })
		.then((res) => (res as DailyHistoryResponse | null)?.data?.entries ?? [])
		.catch(() => [] as IndexDailyHistoryEntry[]);

	return { base, quote, range, pair, history, seo: buildHistorySeo() };
};
