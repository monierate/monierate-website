import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    try {
        const countryCode = params.country;
        const bankID = params.slug;

        const Banks = await import(`../../../../../../data/banks/${countryCode}-banks.json`);
        const SwiftCodes = await import(`../../../../../../data/bank-codes/${countryCode}-bank-codes.json`);
        const Countries = await import(`../../../../../../data/countries.json`);

        const banks = JSON.parse(JSON.stringify(Banks.default));
        const swiftCodes = JSON.parse(JSON.stringify(SwiftCodes.default));
        const countries = JSON.parse(JSON.stringify(Countries.default));
        const countryName = countries[countryCode.toUpperCase()];

        function parseSwiftCode(swiftCode: string) {
            const bankCode = swiftCode.substring(0, 4); // First 4 characters bank identifier
            const countryCode = swiftCode.substring(4, 6); // Next 2 characters country code
            const locationCode = swiftCode.substring(6, 8); // Next 2 characters location
            const branchCode = swiftCode.length > 8 ? swiftCode.substring(8) : null; // Remaining characters branch code (if any)
            return {
                codes: swiftCode,
                details: {
                    bank: bankCode,
                    country: countryCode,
                    location: locationCode,
                    branch: branchCode
                }
            };
        }

        const bankData = banks[bankID];
        if (!bankData) {
            throw error(404, `Bank with ID ${bankID} not found.`);
        }

        const swiftCodesData = swiftCodes[bankID]?.swift || [];
        const parsedCodes = swiftCodesData.map(parseSwiftCode);
        const bankInfo = {
            id: bankID,
            ...bankData,
            swift: {
                codes: swiftCodesData,
                details: (swiftCodesData.length > 0) ? parsedCodes : null
            }
        };

        if (!(swiftCodesData.length > 0)) {
            throw error(404, `No SWIFT code for selected bank.`);
        }

        return { bankInfo, countryName, countryCode };

    } catch (e) {
        throw error(404, `Could not find SWIFT code for selected bank.`);
    }
};