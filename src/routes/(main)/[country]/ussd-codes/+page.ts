type CountryCode = string;
type CountryName = string;
type Countries = { [code: CountryCode]: CountryName | any };
type GroupedCountries = { [letter: string]: Countries };

import { error } from '@sveltejs/kit';
import * as CountriesData from '$data/countries.json';
import { validCountryKeys } from './validCountryKeys';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }: any) => {
    const countryCode = params.country;

    const hasBank = async (code: string) => {
        try {
            const Banks = await import(`../../../../data/banks/${code.toLowerCase()}-banks.json`);
            const banks = JSON.parse(JSON.stringify(Banks.default));
            return Object.entries(banks).length > 0;
        } catch (error) {
            return false;
        }
    };

    try {
        const countries: Countries = CountriesData as Countries;

        const bankCheckPromises = Object.entries(countries)
            .filter(([code, name]) => validCountryKeys.includes(code) && typeof name === 'string')
            .map(async ([code, name]) => {
                const hasBankResult = await hasBank(code);
                return hasBankResult ? [code, name] : null;
            });

        const results = await Promise.all(bankCheckPromises);

        const filteredCountries = results.filter((result): result is [string, string] => result !== null);
        filteredCountries.sort(([, nameA], [, nameB]) => nameA.localeCompare(nameB));

        const groupedByAlpha: GroupedCountries = filteredCountries.reduce(
            (acc, [code, name]) => {
                const firstLetter = name.charAt(0).toUpperCase();
                if (!firstLetter.match(/[A-Z]/)) {
                    return acc;
                }
                if (!acc[firstLetter]) acc[firstLetter] = {};
                acc[firstLetter][code] = name;
                return acc;
            },
            {} as GroupedCountries
        );

        return {
            countries: groupedByAlpha,
            countryCode,
        };
    } catch (e) {
        console.error('Error loading countries:', e);
        throw error(500, 'Could not find countries data');
    }
};