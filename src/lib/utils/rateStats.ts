import type { DailySnapshot } from '$lib/services/rates.service';

/** Windows we summarise, matching what Wise and XE publish on their pair pages. */
export const STAT_PERIODS = [7, 30, 90] as const;
export type StatPeriod = (typeof STAT_PERIODS)[number];

export interface PeriodStat {
	days: StatPeriod;
	/** `'7d'`, `'30d'`, `'90d'` — the label the UI renders. */
	label: string;
	high: number;
	low: number;
	average: number;
	/** Close-to-close move across the window, in percent. */
	changePct: number;
	/** Daily observations the window actually holds — a short series is still worth showing, labelled. */
	count: number;
}

/**
 * Summarise one trailing window of daily snapshots.
 *
 * Highs and lows fall back to the close when a row carries no separate high/low
 * (the composite index reshapes into `DailySnapshot` and some providers report a
 * single price per day), and zero prices are dropped rather than dragging the low
 * to nothing. Returns null when the window holds no usable row at all.
 */
export function periodStat(
	snapshots: DailySnapshot[],
	days: StatPeriod,
	now: Date = new Date()
): PeriodStat | null {
	const cutoff = now.getTime() - days * 86_400_000;

	const rows = (snapshots ?? []).filter((s) => {
		const t = new Date(s.date).getTime();
		return Number.isFinite(t) && t >= cutoff && s.close > 0;
	});

	if (!rows.length) return null;

	const highs = rows.map((s) => s.high || s.close).filter((v) => v > 0);
	const lows = rows.map((s) => s.low || s.close).filter((v) => v > 0);
	const closes = rows.map((s) => s.close);

	// Sorted rather than assumed — the API returns newest-first, but that ordering
	// is not contractual and the change figure flips sign if it is taken backwards.
	const byDate = [...rows].sort((a, b) => (a.date < b.date ? -1 : 1));
	const first = byDate[0].close;
	const last = byDate[byDate.length - 1].close;

	return {
		days,
		label: `${days}d`,
		high: Math.max(...highs),
		low: Math.min(...lows),
		average: closes.reduce((sum, v) => sum + v, 0) / closes.length,
		changePct: first > 0 ? ((last - first) / first) * 100 : 0,
		count: rows.length
	};
}

/** Every window that has data, shortest first. Windows with no rows are omitted. */
export function allPeriodStats(snapshots: DailySnapshot[], now: Date = new Date()): PeriodStat[] {
	return STAT_PERIODS.map((d) => periodStat(snapshots, d, now)).filter(
		(s): s is PeriodStat => s !== null
	);
}
