import { array_to_key_object } from '$lib/helper';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getPairChangers, ChangerServiceCategory } from '$lib/services/pair.service';
import { getCurrencies } from '$lib/services/currency.service';
import { getAllChangers } from '$lib/services/changer.service';

interface ConvertParams {
	From: string;
	To: string;
	Amount: number;
	Inverse: boolean;
}

export const load: PageServerLoad = async ({ params, url, fetch }) => {
	const slug = params.slug;
	const [currencyToBuyCode, _, currencyToPayCode] = slug.split('-');

	let convert: ConvertParams = {
		From: currencyToBuyCode || 'USD',
		To: currencyToPayCode || 'NGN',
		Amount: 1,
		Inverse: false
	};

	try {
		const pair_code = `${convert.From}${convert.To}`.toUpperCase();
		const [changers, currencies, pair_changers] = await Promise.all([
			getAllChangers(fetch),
			getCurrencies(fetch),
			getPairChangers(fetch, pair_code, ChangerServiceCategory.Ramp)
		]);

		// Check for null or empty data
		if (!changers || !currencies || currencies.length === 0) {
			throw error(500, 'One or more data sources returned null');
		}

		let final_pair_changers = pair_changers;

		// If pair_changers is empty, perform inverse fetch
		if (!pair_changers || !(pair_changers.length > 0)) {
			convert = {
				...convert,
				Inverse: true
			};
			const inverse_pair_code = `${convert.To}${convert.From}`.toUpperCase();
			final_pair_changers = await getPairChangers(
				fetch,
				inverse_pair_code,
				ChangerServiceCategory.Ramp
			);
		}

		return {
			changers: array_to_key_object(changers, 'code'),
			currencies,
			pair_changers: final_pair_changers,
			convert
		};
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e);
		console.error('Data fetch error:', errorMessage);

		throw error(500, 'Unable to fetch required data');
	}
};
