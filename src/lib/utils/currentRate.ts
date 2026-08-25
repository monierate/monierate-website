import type { DailySnapshot } from '$lib/services/rates.service';
import type { ProviderRateSnapshot } from '$lib/services/providers.service';

/**
 * How stale the newest daily close may be and still stand in for a live quote.
 *
 * The snapshot job seals a day at 00:05 UTC the following morning, so the freshest
 * close is routinely one — occasionally two — days behind "now". Seven days leaves
 * room for that lag plus a missed run, while still failing closed on a provider
 * whose feed has genuinely gone dark.
 */
export const DAILY_RATE_MAX_AGE_DAYS = 7;

/** Where a displayed rate came from: the live quote feed, or a sealed daily close. */
export type RateBasis = 'live' | 'daily';

export interface ResolvedRate {
	rate: ProviderRateSnapshot | null;
	basis: RateBasis;
	/** ISO date the rate is effective for. Null when there is no rate at all. */
	asOf: string | null;
}

/** Newest snapshot by date. Reduced rather than indexed — API ordering isn't contractual. */
function newestSnapshot(snapshots: DailySnapshot[]): DailySnapshot | null {
	if (!snapshots?.length) return null;
	return snapshots.reduce((a, b) => (a.date >= b.date ? a : b));
}

/**
 * Reshape a sealed daily snapshot into the same shape the live rate feed returns,
 * so every downstream consumer (stat cards, converter, summary copy, JSON-LD) can
 * stay basis-agnostic.
 *
 * `close_buy` / `close_sell` are the day's final two-sided quote. When only the
 * single-sided `close` exists we mirror it to both legs rather than inventing a
 * spread. Returns null if the snapshot carries no usable price.
 */
export function rateFromSnapshot(snapshot: DailySnapshot): ProviderRateSnapshot | null {
	const buy = snapshot.close_buy ?? 0;
	const sell = snapshot.close_sell ?? 0;
	const mid = snapshot.close || (buy && sell ? (buy + sell) / 2 : buy || sell);

	if (!mid) return null;

	return {
		pair: snapshot.pair,
		rate_type: 'daily_close',
		rate_buy: buy || mid,
		rate_sell: sell || mid,
		// Signed the same way the live feed reports it (sell − buy), so consumers
		// that already take the absolute value keep working unchanged.
		spread: buy && sell ? sell - buy : 0,
		rate_mid: mid,
		timestamp: snapshot.date
	};
}

/**
 * Pick the rate a pair × provider page should present.
 *
 * Providers we poll continuously land in the v1 `latest_rates` feed. Providers on a
 * manual or once-a-day cadence — Yellow Card, Chipper Cash and friends — never do,
 * even though we record a full daily OHLC series for them. Reading only the live
 * feed rendered those pages as "no rate", hiding data we demonstrably hold; this
 * falls back to the most recent daily close and tells the caller which one it used.
 */
export function resolveCurrentRate(
	liveRate: ProviderRateSnapshot | null,
	snapshots: DailySnapshot[],
	now: Date = new Date()
): ResolvedRate {
	if (liveRate) {
		return { rate: liveRate, basis: 'live', asOf: liveRate.timestamp ?? null };
	}

	const snapshot = newestSnapshot(snapshots ?? []);
	if (!snapshot) return { rate: null, basis: 'live', asOf: null };

	const ageDays = (now.getTime() - new Date(snapshot.date).getTime()) / 86_400_000;
	if (!(ageDays <= DAILY_RATE_MAX_AGE_DAYS)) {
		return { rate: null, basis: 'live', asOf: null };
	}

	const rate = rateFromSnapshot(snapshot);
	if (!rate) return { rate: null, basis: 'live', asOf: null };

	return { rate, basis: 'daily', asOf: snapshot.date };
}
