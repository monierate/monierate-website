export interface DayPassStatus {
	active: boolean;
	expires_at: string | null;
	price: number;
	currency: 'NGN' | 'USD';
	wallet_balance: number;
}

export interface DayPassPurchase {
	active: boolean;
	/** False when the user already held today's pass, so nothing was debited. */
	charged: boolean;
	expires_at: string;
	price: number;
	currency: 'NGN' | 'USD';
}

/** Idempotent — buying twice in one day debits once. Throws with a message
 *  suitable to show the user on failure (e.g. insufficient wallet balance). */
export async function buyDayPass(fetch: typeof globalThis.fetch = globalThis.fetch): Promise<DayPassPurchase> {
	const res = await fetch('/api/billing/day-pass', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({})
	});
	const body = await res.json().catch(() => null);
	if (!res.ok) {
		throw new Error(body?.error ?? 'Could not start your day pass.');
	}
	return body as DayPassPurchase;
}
