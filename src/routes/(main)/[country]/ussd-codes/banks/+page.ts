import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {

	type BankData = {
		id: string;
		name: string;
		city: string;
		address: string;
		branch: string;
		ussd: string[];
	};

	try {
		const countryCode = params.country;
		const Banks = await import(`../../../../../data/banks/${countryCode}-banks.json`);
		const UssdCodes = await import(`../../../../../data/bank-codes/${countryCode}-bank-codes.json`);
		const Countries = await import(`../../../../../data/countries.json`);

		const banks: Record<string, Omit<BankData, 'id' | 'ussd'>> = JSON.parse(JSON.stringify(Banks.default));
		const ussdCodes: Record<string, { ussd: string[] }> = JSON.parse(JSON.stringify(UssdCodes.default));
		const countries: Record<string, string> = JSON.parse(JSON.stringify(Countries.default));
		const countryName = countries[countryCode.toUpperCase()];

		// Merging the datasets with proper type inference
		const banksData: Record<string, BankData> = Object.keys(ussdCodes).reduce((result, bank) => {
			if (banks[bank]) {
				const ussdCodesData = ussdCodes[bank].ussd;
				// Check if ussdCodesData is defined and not null
				if (ussdCodesData) {
					result[bank] = {
						id: bank,
						...banks[bank],
						ussd: ussdCodesData,
					};
				}
			} else {
				// If a bank is present only in UssdCodes dataset and has valid USSD codes
				const ussdCodesData = ussdCodes[bank].ussd;
				if (ussdCodesData) {
					result[bank] = {
						id: bank,
						name: 'Unknown Bank',
						city: '',
						address: '',
						branch: '',
						ussd: ussdCodesData
					};
				}
			}
			return result;
		}, {} as Record<string, BankData>);

		return { banks, ussdCodes, countryName, countryCode, banksData };
	} catch (e) {
		throw error(404, `Could not find bank codes for ${params.country}`);
	}
};
