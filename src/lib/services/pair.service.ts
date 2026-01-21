import { clientApiFetch } from './api';

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
export const getPairs = async (pairCode: string) => {
	const result = await clientApiFetch<Record<string, any>>('/pairs/get_pair', {
		params: {
			pair_code: pairCode
		}
	});

	if (!result) {
		return null;
	}

	return result.data;
};

/**
 * Get pair changers (optionally filtered by service)
 */
export const getPairChangers = async (
	code: string,
	changerService: ChangerServiceCategory | 'all' = 'all'
) => {
	const params: Record<string, string> = { code };

	if (changerService !== 'all') {
		params.changer_service = changerService;
	}

	const data = await clientApiFetch<any>('/pairs/get_pair_changers', {
		params
	});

	return data?.result ?? data ?? null;
};
