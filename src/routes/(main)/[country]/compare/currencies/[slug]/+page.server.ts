import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import * as Countries from '$data/countries.json'
import * as Currencies from '$data/currencies.json'
import { array_to_key_object } from '$lib/helper'
import { getAllChangers } from '$lib/services/changer.service';
import { getPair } from '$lib/services/pair.service'

export const load: PageServerLoad = async ({ fetch, params }) => {
    try {
        // get currencies and country data
        const countries = JSON.parse(JSON.stringify(Countries));
        let currencies = JSON.parse(JSON.stringify(Currencies));
        
        // get url params
        const slug = params.slug;
        const country_code = params.country.toUpperCase();

        // get currency from slug
        const splitSlug = slug.split('-');
        const currency_type = splitSlug[splitSlug.length - 1];
        const currency_code = splitSlug[1].toUpperCase();

        if (currency_type == 'crypto') {
            currencies = currencies.coins;
        }
        else {
            currencies = currencies.fiat;
        }

        // prepared country and currency data
        const country = {
            name: countries[country_code] || "",
            code: country_code
        }
        const currency = {
            code: currency_code,
            name: currencies[currency_code] || ""
        }

        if (country.name.length == 0) {
            throw error(500, `Country name couldn't be obtained`);
        }
        if (currency.name.length == 0) {
            throw error(500, `Currency name couldn't be obtained`);
        }

        const changers = await getAllChangers(fetch);
        const pair_code = `${currency.code.toLowerCase()}ngn`;
        const pair = (await getPair(fetch, pair_code)) as any;
        const pair_changers = pair.changers;

        return {
            currency,
            country,
            pair_changers,
            changers: array_to_key_object(changers, 'code'),
        }
    }
    catch(e: any) {
        throw error(502, `Unable to fetch an important data`);
    }
}