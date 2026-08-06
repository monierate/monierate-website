import { clientApiFetch } from '$lib/api/client';

export interface ProviderRateSnapshot {
	pair: string;
	rate_type: string;
	rate_buy: number;
	rate_sell: number;
	rate_mid: number;
	spread: number;
	timestamp: string;
}

export interface ProviderV1Response {
	provider: Record<string, any>;
	latest_rates: ProviderRateSnapshot[];
}

/**
 * Get a single provider (v1) — profile fields plus its latest known rate
 * snapshot per supported pair.
 */
export const getProviderV1 = async (
	fetch: typeof globalThis.fetch,
	code: string
): Promise<ProviderV1Response | null> => {
	const result = await clientApiFetch<ProviderV1Response>(`/v1/providers/${code}`, { method: 'GET' }, fetch);

	if (!result) {
		return null;
	}

	return result;
};
