import { array_to_key_object } from '$lib/helper';
import { get_changers } from '$lib/server/changer.service';
import { get_currencies } from '$lib/server/currency.service';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import CountriesToCurrencies from '$data/countries-to-currencies.json';
import Countries from '$data/countries.json';
import { ChangerServiceCategory, get_pairs_changers } from '$lib/server/pair.service';

interface CountriesMap { [key: string]: string }
interface ConvertParams {
    From: string;
    To: string;
    Amount: number;
}

export const load: PageServerLoad = async ({ params, url }) => {
    const slug = params.slug;
    const [currencyFromCode, _, countryToCode] = slug.split('-');
    
    const countries = Countries as CountriesMap;
    const countriesToCurrencies = CountriesToCurrencies as CountriesMap;
    
    // Check if country exists
    const countryToName = countries[countryToCode.toUpperCase()];
    if (!countryToName) {
        throw error(404, 'Country not found');
    }

    // Check if currency exists
    const currencyToCode = countriesToCurrencies[countryToCode.toUpperCase()];
    if (!currencyToCode) {
        throw error(404, 'Currency not found');
    }

    const convert: ConvertParams = {
        From: currencyFromCode || 'usd',
        To: currencyToCode,
        Amount: 1
    };

    try {
        const pair_code = `${convert.From}${convert.To}`.toUpperCase();
        const [changers, currencies, pair_changers] = await Promise.all([
            get_changers(),
            get_currencies(),
            get_pairs_changers(pair_code, ChangerServiceCategory.Remittance)
        ]);

        // Check for null or empty data
        if (!changers || !currencies || currencies.length === 0 || 
            Object.keys(countries).length === 0 || 
            Object.keys(countriesToCurrencies).length === 0) {
            throw error(500, 'One or more data sources returned null');
        }

        const changerObject = array_to_key_object(changers, 'code');

        return {
            changers: changerObject,
            currencies,
            pair_changers,
            convert,
            countryToCode,
            countryToName,
            countries,
            countriesToCurrencies
        };
    }
    catch(e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error('Data fetch error:', errorMessage);
        
        throw error(500, 'Unable to fetch required data');
    }
}