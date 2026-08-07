import { index } from '$lib/services';
import type { IndexDailyHistoryEntry } from '$lib/services/currency/v1/index';
import { CURRENCY_SYMBOLS } from '$lib/constants/currency';
import { parsePairCode } from '$lib/utils/pairs';

export const RANGES = ['7d', '30d', '60d', '90d'] as const;
export type Range = (typeof RANGES)[number];

const DAYS_MAP: Record<Range, number> = { '7d': 7, '30d': 30, '60d': 60, '90d': 90 };

export interface PairHistoryInitData {
	pairCode: string;
	initialHistory: IndexDailyHistoryEntry[];
}

function fmtDate(iso: string): string {
	try {
		return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	} catch {
		return iso;
	}
}

export class PairHistoryActions {
	readonly pairCode: string;

	selectedRange = $state<Range>('30d');
	history = $state<IndexDailyHistoryEntry[]>([]);
	historyLoading = $state(false);

	readonly series = [
		{ key: 'close', label: 'Close', color: '#3861fb', fill: true },
		{ key: 'open', label: 'Open', color: '#f59e0b', fill: false, dashed: true },
		{ key: 'high', label: 'High', color: '#22c55e', fill: false, dashed: true },
		{ key: 'low', label: 'Low', color: '#ef4444', fill: false, dashed: true }
	];

	constructor(data: PairHistoryInitData) {
		this.pairCode = data.pairCode;
		this.history = data.initialHistory ?? [];
	}

	get parsedPair(): { base: string; quote: string; symbol: string } {
		const { base, quote } = parsePairCode(this.pairCode);
		return {
			base: base.toUpperCase(),
			quote: quote.toUpperCase(),
			symbol: CURRENCY_SYMBOLS[quote] ?? ''
		};
	}

	// Newest-first — the API's ordering isn't guaranteed, so this is sorted rather than indexed.
	get tableRows(): IndexDailyHistoryEntry[] {
		return [...this.history].sort((a, b) => (a.date < b.date ? 1 : -1));
	}

	get chartData(): { dateLabel: string; open: number; close: number; high: number; low: number }[] {
		return [...this.history]
			.sort((a, b) => (a.date < b.date ? -1 : 1))
			.map((e) => ({ dateLabel: fmtDate(e.date), open: e.open, close: e.close, high: e.high, low: e.low }));
	}

	get latest(): IndexDailyHistoryEntry | null {
		return this.tableRows[0] ?? null;
	}

	get currentRate(): number {
		return this.latest?.close ?? 0;
	}

	get rangeHigh(): number {
		const highs = this.history.map((e) => e.high).filter((v) => v > 0);
		return highs.length ? Math.max(...highs) : 0;
	}

	get rangeLow(): number {
		const lows = this.history.map((e) => e.low).filter((v) => v > 0);
		return lows.length ? Math.min(...lows) : 0;
	}

	get changePct(): number {
		const rows = this.tableRows;
		if (rows.length < 2) return 0;
		const oldest = rows[rows.length - 1].open;
		const newest = rows[0].close;
		if (!oldest) return 0;
		return +(((newest - oldest) / oldest) * 100).toFixed(2);
	}

	async selectRange(range: Range) {
		if (range === this.selectedRange) return;
		this.selectedRange = range;
		this.historyLoading = true;
		try {
			const days = DAYS_MAP[range];
			const end = new Date();
			const start = new Date(end.getTime() - days * 86_400_000);
			const fmt = (d: Date) => d.toISOString().split('T')[0];

			const res = (await index.getDailyHistory({
				pair: this.pairCode,
				start_date: fmt(start),
				end_date: fmt(end),
				limit: 2000
			})) as { data?: { entries?: IndexDailyHistoryEntry[] } } | null;
			this.history = res?.data?.entries ?? [];
		} catch {
			// keep existing data on error
		} finally {
			this.historyLoading = false;
		}
	}
}
