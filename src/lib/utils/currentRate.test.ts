import { describe, it, expect } from 'vitest';
import { resolveCurrentRate, rateFromSnapshot, DAILY_RATE_MAX_AGE_DAYS } from './currentRate';
import type { DailySnapshot } from '$lib/services/rates.service';
import type { ProviderRateSnapshot } from '$lib/services/providers.service';

const NOW = new Date('2026-08-20T12:00:00.000Z');

function snapshot(date: string, over: Partial<DailySnapshot> = {}): DailySnapshot {
	return {
		date,
		provider_id: 'yellowcard',
		pair: 'usdngn',
		open: 1394,
		close: 1394,
		high: 1394,
		low: 1394,
		availability_pct: null,
		close_buy: 1402,
		close_sell: 1386,
		source: 'manual',
		...over
	};
}

const LIVE: ProviderRateSnapshot = {
	pair: 'usdngn',
	rate_type: 'fixed',
	rate_buy: 1400.64,
	rate_sell: 1385.97,
	rate_mid: 1393.305,
	spread: -14.67,
	timestamp: '2026-08-19T23:10:00.942Z'
};

const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86_400_000).toISOString();

describe('rateFromSnapshot', () => {
	it('maps the two-sided close onto the live-rate shape', () => {
		expect(rateFromSnapshot(snapshot(daysAgo(2)))).toMatchObject({
			rate_type: 'daily_close',
			rate_buy: 1402,
			rate_sell: 1386,
			rate_mid: 1394,
			// Signed sell − buy, matching how the live feed reports it.
			spread: -16
		});
	});

	it('mirrors the single-sided close to both legs when no buy/sell exists', () => {
		const r = rateFromSnapshot(snapshot(daysAgo(2), { close_buy: undefined, close_sell: undefined }));
		expect(r).toMatchObject({ rate_buy: 1394, rate_sell: 1394, rate_mid: 1394, spread: 0 });
	});

	it('returns null for a snapshot with no usable price', () => {
		expect(
			rateFromSnapshot(snapshot(daysAgo(2), { close: 0, close_buy: 0, close_sell: 0 }))
		).toBeNull();
	});
});

describe('resolveCurrentRate', () => {
	it('prefers the live quote and ignores history', () => {
		const r = resolveCurrentRate(LIVE, [snapshot(daysAgo(2))], NOW);
		expect(r).toEqual({ rate: LIVE, basis: 'live', asOf: LIVE.timestamp });
	});

	it('falls back to the newest daily close when there is no live quote', () => {
		const r = resolveCurrentRate(null, [snapshot(daysAgo(5)), snapshot(daysAgo(2), { close: 1400 })], NOW);
		expect(r.basis).toBe('daily');
		expect(r.asOf).toBe(daysAgo(2));
		expect(r.rate?.rate_mid).toBe(1400);
	});

	it('accepts a close exactly at the staleness limit', () => {
		expect(resolveCurrentRate(null, [snapshot(daysAgo(DAILY_RATE_MAX_AGE_DAYS))], NOW).basis).toBe(
			'daily'
		);
	});

	it('rejects a close past the staleness limit so the empty state still fires', () => {
		const r = resolveCurrentRate(null, [snapshot(daysAgo(DAILY_RATE_MAX_AGE_DAYS + 1))], NOW);
		expect(r).toEqual({ rate: null, basis: 'live', asOf: null });
	});

	it('returns nothing when there is neither a live quote nor history', () => {
		expect(resolveCurrentRate(null, [], NOW)).toEqual({ rate: null, basis: 'live', asOf: null });
	});
});
