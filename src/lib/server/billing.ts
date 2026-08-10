import { userAccountRequest } from '$lib/api/userAccountApi';
import type { DayPassStatus } from '$lib/services/billing.service';

/**
 * Server-side day-pass lookup for the OHLC/index history gate.
 *
 * Resolved during SSR, in the page's own load function, so the unlock button
 * renders in its final state on first paint. It used to be fetched from the
 * client in onMount, which flashed the button from "Get Pro" to
 * "Unlock today · $X" once that request landed after hydration — the token
 * is already sitting in the request's cookies, so there's no reason to wait
 * for a round trip in the browser to know the answer.
 */
export async function getDayPassStatus(userToken: string | undefined): Promise<DayPassStatus | null> {
	if (!userToken) return null;
	const res = await userAccountRequest<DayPassStatus>('/billing/day-pass', {
		method: 'GET',
		userToken
	});
	return res.success ? (res.data ?? null) : null;
}
