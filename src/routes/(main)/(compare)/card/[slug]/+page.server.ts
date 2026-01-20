import { array_to_key_object } from '$lib/helper';
import { get_changers } from '$lib/server/changer.service';
import { get_currencies } from '$lib/server/currency.service';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { ChangerServiceCategory, get_pairs_changers } from '$lib/server/pair.service';

interface ConvertParams {
    From: string;
    To: string;
    Amount: number;
    Inverse: boolean;
}

export const load: PageServerLoad = async ({ params, url }) => {
    const slug = params.slug;
    const [currencyToFundCode, currencyToPayCode] = slug.split('-');

    let convert: ConvertParams = {
        From: currencyToFundCode || 'USD',
        To: currencyToPayCode || 'NGN',
        Amount: 1,
        Inverse: false,
    };

    try {
        const pair_code = `${convert.From}${convert.To}`.toUpperCase();
        const [changers, currencies, pair_changers] = await Promise.all([
            get_changers(),
            get_currencies(),
            get_pairs_changers(pair_code, ChangerServiceCategory.VCard)
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
                Inverse: true,
            };
            const inverse_pair_code = `${convert.To}${convert.From}`.toUpperCase();
            final_pair_changers = await get_pairs_changers(inverse_pair_code, ChangerServiceCategory.Ramp);
        }

        return {
            changers: array_to_key_object(changers, 'code'),
            currencies,
            pair_changers: final_pair_changers,
            convert,
        };
    }
    catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error('Data fetch error:', errorMessage);

        throw error(500, 'Unable to fetch required data');
    }
}