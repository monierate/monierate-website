import type { IndexDailyHistoryEntry } from '$lib/services/currency/v1/index';

export const RANGES = ['7d', '30d', '60d', '90d'] as const;

export interface IndexHistoryData {
	pair: string;
	history: IndexDailyHistoryEntry[];
}

function fmtDate(iso: string): string {
	try {
		return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	} catch {
		return iso;
	}
}

export class IndexHistoryActions {
	readonly entries: IndexDailyHistoryEntry[];
	readonly pair: string;

	readonly series = [
		{ key: 'close', label: 'Close', color: '#3861fb', fill: true },
		{ key: 'open', label: 'Open', color: '#f59e0b', fill: false, dashed: true },
		{ key: 'high', label: 'High', color: '#22c55e', fill: false, dashed: true },
		{ key: 'low', label: 'Low', color: '#ef4444', fill: false, dashed: true },
	];

	constructor(data: IndexHistoryData) {
		this.entries = data.history;
		this.pair = data.pair;
	}

	get chartData(): { dateLabel: string; open: number; close: number; high: number; low: number }[] {
		return [...this.entries]
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
			.map((e) => ({
				dateLabel: fmtDate(e.date),
				open: e.open,
				close: e.close,
				high: e.high,
				low: e.low,
			}));
	}

	get tableRows(): IndexDailyHistoryEntry[] {
		return [...this.entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	}
}
