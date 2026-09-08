import { env } from '$env/dynamic/private';
import type { ApiResponse } from './types';

/**
 * Server-only client for the account API's rate endpoints.
 *
 * Separate from {@link ./userAccountApi.ts} because that one speaks for a signed-in
 * visitor (`user_token`) while this speaks for the site itself: `/rates/latest` sits
 * behind `apiMiddleware`, so it wants an API key, and the key must never reach the
 * browser. Everything here is reached through `/api/rates/*`, never imported into a
 * component.
 */

const API_ACCOUNT_URL = env.API_ACCOUNT_URL ?? 'https://monierate-account-api.onrender.com/core';

const DEFAULT_TIMEOUT = 8_000;

/** Whether the site has been given a key at all. Callers degrade rather than throw. */
export const hasAccountApiKey = (): boolean => Boolean(env.ACCOUNT_API_KEY);

export interface AccountApiOptions {
	params?: Record<string, string | number | undefined>;
	timeoutMs?: number;
}

/**
 * GET against the account API.
 *
 * A 400 is a normal answer here, not a failure: `/rates/latest?market=parallel`
 * answers 400 for any base the parallel market does not carry, which is most of
 * them — the market is built from the pairs feed and never crosses. Callers need
 * to read that as "no parallel rate, fall back to mid", so it comes back as a
 * clean unsuccessful response rather than an exception.
 */
export async function accountApiRequest<T = unknown>(
	endpoint: string,
	options: AccountApiOptions = {}
): Promise<ApiResponse<T>> {
	const { params, timeoutMs = DEFAULT_TIMEOUT } = options;

	const apiKey = env.ACCOUNT_API_KEY;

	if (!apiKey) {
		return { success: false, status: 0, error: 'ACCOUNT_API_KEY is not set' };
	}

	let url = `${API_ACCOUNT_URL}${endpoint}`;

	if (params && Object.keys(params).length > 0) {
		const search = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined) search.append(key, String(value));
		}
		url += `?${search.toString()}`;
	}

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const response = await fetch(url, {
			method: 'GET',
			signal: controller.signal,
			headers: {
				Accept: 'application/json',
				// Sent as a header, never in the query string, so the key cannot end up
				// in an access log or a Referer.
				api_key: apiKey
			}
		});

		clearTimeout(timeoutId);

		const isJson = response.headers.get('content-type')?.includes('application/json');
		const raw: any = isJson ? await response.json() : await response.text();

		if (!response.ok) {
			return {
				success: false,
				status: response.status,
				error: raw?.description ?? raw?.message ?? `Request failed (${response.status})`,
				raw
			};
		}

		return { success: true, status: response.status, data: raw?.data ?? raw, raw };
	} catch (err: any) {
		clearTimeout(timeoutId);

		return {
			success: false,
			status: 0,
			error: err?.name === 'AbortError' ? 'Request timed out' : (err?.message ?? 'Network error')
		};
	}
}

export type RateMarket = 'parallel' | 'mid' | 'official';

export interface LatestRates {
	timestamp: number;
	base: string;
	market: RateMarket;
	derived_from?: string;
	/** Quote code (uppercase) -> rate. */
	rates: Record<string, number>;
}

/**
 * Every quote the account API holds for `base` on `market`.
 *
 * Fetched as a whole map rather than one `quote=` at a time because the page needs
 * several numbers off the same snapshot — the headline, the inverse, and the
 * "popular conversions" block — and one map is one billable call instead of a dozen.
 */
export async function getLatestRates(
	base: string,
	market: RateMarket
): Promise<LatestRates | null> {
	const response = await accountApiRequest<LatestRates>('/rates/latest', {
		params: { base: base.toUpperCase(), market }
	});

	if (!response.success || !response.data?.rates) return null;

	return response.data;
}
