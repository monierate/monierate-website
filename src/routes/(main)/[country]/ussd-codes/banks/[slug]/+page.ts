import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    try {
        const countryCode = params.country;
        const bankID = params.slug;

        const Banks = await import(`../../../../../../data/banks/${countryCode}-banks.json`);
        const UssdCodes = await import(`../../../../../../data/bank-codes/${countryCode}-bank-codes.json`);
        const Countries = await import(`../../../../../../data/countries.json`);

        const banks = JSON.parse(JSON.stringify(Banks.default));
        const ussdCodes = JSON.parse(JSON.stringify(UssdCodes.default));
        const countries = JSON.parse(JSON.stringify(Countries.default));
        const countryName = countries[countryCode.toUpperCase()];

        const bankData = banks[bankID];
        if (!bankData) {
            throw error(404, `Bank with ID ${bankID} not found.`);
        }

        const ussdCodesData = ussdCodes[bankID]?.ussd || [];
        const bankInfo = {
            id: bankID,
            ...bankData,
            ussd: ussdCodesData
        };

        if (!(Object.entries(ussdCodesData).length > 0)) {
            throw error(404, `No USSD code for selected bank.`);
        }

        return { bankInfo, countryName, countryCode };

    } catch (e) {
        throw error(404, `Could not find USSD code for selected bank.`);
    }
};