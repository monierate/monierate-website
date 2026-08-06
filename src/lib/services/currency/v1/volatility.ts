import { api as defaultApi, createApi, type Api } from '../../api';

// Stablecoin-dollar volatility (USDT/NGN) from the volatility engine — the
// companion to MSI. Computed from the msi_snapshots series. See currency-api
// docs/msi-volatility-tdd.md.

export type VolRegime = 'calm' | 'normal' | 'elevated' | 'turbulent';
export type VolStress = 'rising' | 'stable' | 'easing';

export interface VolatilityCurrent {
	as_of: string;
	regime: VolRegime;
	stress: VolStress;
	realized_vol: { d7: number | null; d30: number | null };
	spread_vol: { d7: number | null; d30: number | null };
	range: { avg_naira_7d: number | null; avg_pct_7d: number | null };
	channel_vol_7d: number | null;
	change: { realized_vol_7d_prev: number | null; direction: 'up' | 'down' | 'flat' };
	coverage: { days_available: number; complete: boolean };
	stale: boolean;
}

interface Envelope<T> {
	status: string;
	message: string;
	data: T;
}

function makeVolatility(api: Api) {
	return {
		getCurrent: (pair?: string) => {
			const q = new URLSearchParams();
			if (pair) q.set('pair', pair);
			return api.get<Envelope<VolatilityCurrent>>(`/currency/v1/volatility/current?${q}`);
		}
	};
}

export const volatility = makeVolatility(defaultApi);

export function createVolatility(fetch: typeof globalThis.fetch, origin?: string) {
	return makeVolatility(createApi(fetch, origin));
}
