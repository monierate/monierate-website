import { array_to_key_object } from '$lib/helper';
import { get_changers } from '$lib/server/changer.service';
import { get_currencies } from '$lib/server/currency.service';
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import Countries from '$data/countries.json';
import CountriesToCurrencies from '$data/countries-to-currencies.json';
import CountryCodeByCurrency from '$data/countryCodeByCurrency.json';
import { getPair } from '$lib/services/pair.service';

interface CountriesMap { [key: string]: string }
interface CountryCodeByCurrencyMap {
    [currencyCode: string]: string | string[];
}
interface PairChanger {
    changer_code: string;
    price_buy: number;
    price_sell: number;
    updated_at: string;
}


export const load: PageServerLoad = async ({ fetch, params, url }) => {
    async function getPairChangers(
		pair_code: string,
		changer_service: string
	): Promise<PairChanger[]> {
		try {
			const response = await fetch(
				`/api/pairs/changers?pair_code=${pair_code}&changer_service=${changer_service}`
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error('Error fetching pair changers:', error);
			return [];
		}
	}

    try {
        let urlParams = url.searchParams;
        const convert = {
            From: urlParams.get('From') || 'usd',
            To: urlParams.get('To') || 'ngn',
            Amount: urlParams.get('Amount') || 1
        };

        const pair = await getPair(fetch, `${convert.From}${convert.To}`);

        if(!pair) {
            throw error(404, 'Pair not found')
        }

        const pairChangers = pair.changers;
        
        let remittanceRates = await getPairChangers(`${convert.From}${convert.To}`, 'remittance');
		let rampRates = await getPairChangers(`${convert.From}${convert.To}`, 'ramp');
		let cardRates = await getPairChangers(`${convert.From}${convert.To}`, 'card');

        const changers = await get_changers();
        const currencies = await get_currencies();
        const countries = Countries as CountriesMap;
        const countriesToCurrencies = CountriesToCurrencies as CountriesMap;
        const countryCodeByCurrency = CountryCodeByCurrency as CountryCodeByCurrencyMap;


        if (currencies.length == 0) {
            throw error(500, "Currencies data failed.")
        }

        return {
            changers: array_to_key_object(changers, 'code'),
            currencies,
            convert,
            countries,
            countriesToCurrencies,
            countryCodeByCurrency,
            remittanceRates,
            rampRates,
            cardRates,
            pairs: pairChangers,
        }
    }
    catch (e: any) {
        console.log(e)
        throw error(502, `Unable to fetch an important data`)
    }
}