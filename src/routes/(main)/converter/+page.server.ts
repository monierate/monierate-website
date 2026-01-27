import { array_to_key_object } from '$lib/helper';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import Countries from '$data/countries.json';
import CountriesToCurrencies from '$data/countries-to-currencies.json';
import CountryCodeByCurrency from '$data/countryCodeByCurrency.json';
import { getPair, getPairChangers, ChangerServiceCategory } from '$lib/services/pair.service';
import { getAllChangers } from '$lib/services/changer.service';
import { getCurrencies } from '$lib/services/currency.service';

interface CountriesMap {
	[key: string]: string;
}

interface CountryCodeByCurrencyMap {
	[currencyCode: string]: string | string[];
}

export const load: PageServerLoad = async ({ fetch, url, depends }) => {
	const search = url.searchParams;

	const convert = {
		From: search.get('From') ?? 'usd',
		To: search.get('To') ?? 'ngn',
		Amount: Number(search.get('Amount')) || 1
	};

	depends(
		`convert:from=${convert.From}`,
		`convert:to=${convert.To}`,
	);

	const pairCode = `${convert.From}${convert.To}`;

	try {
		const [pair, remittanceRates, rampRates, cardRates, changers, currencies] = await Promise.all([
			getPair(fetch, pairCode),
			getPairChangers(fetch, pairCode, ChangerServiceCategory.Remittance),
			getPairChangers(fetch, pairCode, ChangerServiceCategory.Ramp),
			getPairChangers(fetch, pairCode, ChangerServiceCategory.Card),
			getAllChangers(fetch),
			getCurrencies(fetch)
		]);

		if (!currencies.length) throw error(500, 'Currencies data failed');

		return {
			convert,
			pair,
			changers: array_to_key_object(changers, 'code'),
			currencies,
			countries: Countries as CountriesMap,
			countriesToCurrencies: CountriesToCurrencies as CountriesMap,
			countryCodeByCurrency: CountryCodeByCurrency as CountryCodeByCurrencyMap,
			remittanceRates,
			rampRates,
			cardRates,
		};
	} catch (err) {
		console.error(err);
		throw error(502, 'Unable to fetch an important data');
	}
};
