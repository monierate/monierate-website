import { clientApiFetch } from '$lib/api/client';

export enum ChangerServiceCategory {
	Remittance = 'remittance', // sending
	Crypto = 'crypto', // buying & selling
	Card = 'card', // virtual card
	Account = 'account', // usd account
	Ramp = 'ramp', // buy & sell
	VCard = 'vcard' // fund virtual card
}

/**
 * Get a single pair by pair code
 */
export const getPair = async (fetch: any, pairCode: string) => {
	const result = await clientApiFetch<Record<string, any>>('/pairs/get_pair', {
		params: {
			pair_code: pairCode
		}
	}, fetch);

	if (!result) {
		return null;
	}

	return result;
};

/**
 * Get all pairs with pagination
 */
export const getAllPairs = async (
	fetch: typeof globalThis.fetch,
	pairCode: string | undefined,
	page: number = 1,
	limit: number = 100,
	quote?: string,
	changer?: string
) => {
	const result = await clientApiFetch<Record<string, any>>(
		'/pairs/get_all_pairs',
		{
			params: {
				pair_code: pairCode,
				page,
				limit,
				quote,
				changer,
			}
		},
		fetch
	);

	if (!result) {
		return null;
	}

	return result;
};

/**
 * Get pair changers (optionally filtered by service)
 */
export const getPairChangers = async (
	fetch: typeof globalThis.fetch,
	pair_code: string,
	changerService: ChangerServiceCategory | 'all' = 'all'
) => {
	const params: Record<string, string> = { pair_code };

	if (changerService !== 'all') {
		params.changer_service = changerService;
	}

	const data = await clientApiFetch<any>(
		'/pairs/get_pair_changers',
		{
			params
		},
		fetch
	);

	return data?.result ?? data ?? null;
};
