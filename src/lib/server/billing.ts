import { userAccountRequest } from '$lib/api/userAccountApi';
import type { DayPassStatus } from '$lib/services/billing.service';

const PAID_PLANS = ['pro', 'max'];

export interface HistoryAccess {
	/** True when the account already has full history access — an active day
	 *  pass, or a Pro/Max plan — so the table should render fully unlocked
	 *  rather than showing the gate at all. */
	hasFullAccess: boolean;
	/** Day-pass status/pricing, for the unlock button when hasFullAccess is false. */
	dayPass: DayPassStatus | null;
}

/**
 * Server-side entitlement check for the OHLC/index history gate, resolved
 * during SSR in the page's own load function.
 *
 * Two things determine whether the gate should even render: a Pro/Max plan
 * unlocks unconditionally, and a day pass already bought today unlocks via
 * `dayPass.active` — checking only "can they afford another one" (as this
 * used to) left already-entitled accounts stuck looking locked. Fetched in
 * parallel with the plan lookup so an already-unlocked visitor never sees a
 * placeholder state flash to the real one after hydration.
 */
export async function getHistoryAccess(userToken: string | undefined): Promise<HistoryAccess> {
	if (!userToken) return { hasFullAccess: false, dayPass: null };

	const [userRes, passRes] = await Promise.all([
		userAccountRequest<Record<string, unknown>>('/users/get_user', { method: 'GET', userToken }),
		userAccountRequest<DayPassStatus>('/billing/day-pass', { method: 'GET', userToken })
	]);

	const userData = userRes.success ? userRes.data : undefined;
	const user = (userData?.user ?? userData) as { plan?: { code?: string } } | undefined;
	const paid = PAID_PLANS.includes(user?.plan?.code ?? '');

	const dayPass = passRes.success ? (passRes.data ?? null) : null;
	const hasFullAccess = paid || dayPass?.active === true;

	return { hasFullAccess, dayPass };
}
