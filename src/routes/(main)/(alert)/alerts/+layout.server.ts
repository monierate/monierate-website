import type { LayoutServerLoad } from './$types';
import { getAllChangers } from '$lib/services/changer.service';
import { getCurrencies } from '$lib/services/currency.service';

export const load: LayoutServerLoad = async ({ url, fetch }) => {
	const providers = await getAllChangers(fetch);
	const currencies = await getCurrencies(fetch);

	const create_pairs: any = Object.entries(currencies)
		.map(([_, value]: [any, any]) => {
			if (value.code !== 'ngn') {
				return {
					label: value.code.toUpperCase() + ' - NGN',
					value: value.code + 'ngn',
					description: `The price of ${value.name} in Naira`,
					quote: 'ngn',
					base: value.code
				};
			}
			return null;
		})
		.filter((pair: any) => pair !== null);
	let pair_list = create_pairs;
	let slug = url.pathname.split('/')[3];

	return {
		currencies,
		providers,
		pair_list,
		slug
	};
};
