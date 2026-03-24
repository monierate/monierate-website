type CountryCode = string;
type CountryName = string;
type Countries = { [code: CountryCode]: CountryName | any };

import { error } from '@sveltejs/kit';
import * as CountriesData from '$data/countries.json';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }: any) => {
    const countryCode = params.country;
    let bankName = '';
    if(params.slug) {
        let bankID = params.slug;
        const Banks = await import(`../../../../data/banks/${countryCode}-banks.json`);
        const banks = JSON.parse(JSON.stringify(Banks.default));
        const bankData = banks[bankID];
        if (bankData) {
            bankName = bankData.name;
        }
    }

    try {
        const countries: Countries = CountriesData as Countries;
        const countryName = countries[countryCode.toUpperCase()];

        return {
            countryCode,
            countryName,
            bankName
        };
    } catch (e) {
        console.error('Error loading country:', e);
        throw error(500, 'Could not find countries data');
    }
};