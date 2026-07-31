import { api as defaultApi, createApi, type Api } from '../../api';

// Monierate Spread Index (MSI) — the premium of the composite USDT/NGN market
// rate over the CBN official USD/NGN rate. See currency-api docs/msi-frontend-tdd.md.
// All responses are wrapped in the standard `{ status, message, data }` envelope.

export type PremiumLevel = 'tight' | 'moderate' | 'elevated' | 'crisis';

export interface MsiCurrent {
	as_of: string; // ISO 8601 UTC
	cbn_rate: number; // NGN per 1 USD
	composite_rate: number; // NGN per 1 USDT
	spread_naira: number; // composite − cbn
	msi_score: number; // percent
	premium_level: PremiumLevel;
	change: { vs_yesterday_pct_points: number | null; direction: 'up' | 'down' | 'flat' };
	window: { range_low: number; range_high: number; label: string };
	stale: boolean;
}

export interface MsiHistoryPoint {
	t: string;
	msi: number;
	cbn: number;
	composite: number;
}

export interface MsiHistory {
	range: '7d' | '30d' | '90d' | '1y';
	interval: string;
	stats: { avg: number | null; high: number | null; low: number | null };
	points: MsiHistoryPoint[];
}

export interface MsiSource {
	id: string;
	name: string;
	rate: number;
	premium_pct: number;
	weight_in_channel: number;
	updated_at: string;
	status: 'ok' | 'stale';
}

export interface MsiChannel {
	channel: 'p2p' | 'exchange' | 'otc';
	label: string;
	weight: number;
	sources: MsiSource[];
}

export interface MsiSources {
	as_of: string;
	composite_rate: number;
	cbn_rate: number;
	channels: MsiChannel[];
	signals: {
		p2p_vs_otc_naira: number | null;
		p2p_vs_exchange_naira: number | null;
		best_rate: { source_id: string; name: string; rate: number; delta_vs_composite: number } | null;
	};
}

// Position-aware "What this means" interpretation. Mirrors the currency-api
// /v1/spread/interpretation payload (docs/msi-ai-summary-tdd-v2.md §9). The
// numbers are computed server-side; only the wording is generated, and the
// public endpoint serves pre-generated variants from cache.
export type Position = 'holding_usdt' | 'holding_naira' | 'watching';
export type SizeBand = 'small' | 'medium' | 'large' | 'very_large';

export interface MsiInterpretation {
	as_of: string;
	position: Position;
	size_band: SizeBand | null;
	text: string;
	watch: string;
	source: 'model' | 'template';
	disclaimer: string;
}

interface Envelope<T> {
	status: string;
	message: string;
	data: T;
}

function makeSpread(api: Api) {
	return {
		getCurrent: (pair?: string) => {
			const q = new URLSearchParams();
			if (pair) q.set('pair', pair);
			return api.get<Envelope<MsiCurrent>>(`/currency/v1/spread/current?${q}`);
		},

		getHistory: (
			params: {
				range?: MsiHistory['range'];
				pair?: string;
				start_date?: string;
				end_date?: string;
			} = {}
		) => {
			const q = new URLSearchParams();
			if (params.range) q.set('range', params.range);
			if (params.pair) q.set('pair', params.pair);
			if (params.start_date) q.set('start_date', params.start_date);
			if (params.end_date) q.set('end_date', params.end_date);
			return api.get<Envelope<MsiHistory>>(`/currency/v1/spread/history?${q}`);
		},

		getSources: (pair?: string) => {
			const q = new URLSearchParams();
			if (pair) q.set('pair', pair);
			return api.get<Envelope<MsiSources>>(`/currency/v1/spread/sources?${q}`);
		},

		getInterpretation: (
			params: { position?: Position; size?: SizeBand; pair?: string } = {}
		) => {
			const q = new URLSearchParams();
			if (params.position) q.set('position', params.position);
			if (params.size) q.set('size', params.size);
			if (params.pair) q.set('pair', params.pair);
			return api.get<Envelope<MsiInterpretation>>(`/currency/v1/spread/interpretation?${q}`);
		}
	};
}

export const spread = makeSpread(defaultApi);

export function createSpread(fetch: typeof globalThis.fetch, origin?: string) {
	return makeSpread(createApi(fetch, origin));
}
