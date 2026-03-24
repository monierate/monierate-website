import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	type SwiftDetails = {
		bank: string;
		country: string;
		location: string;
		branch: string | null;
	};

	type BankData = {
		id: string;
		name: string;
		city: string;
		address: string;
		branch: string;
		swift: {
			codes: string[];
			details: SwiftDetails;
		};
	};

	try {
		const countryCode = params.country;
		const Banks = await import(`../../../../../data/banks/${countryCode}-banks.json`);
		const SwiftCodes = await import(`../../../../../data/bank-codes/${countryCode}-bank-codes.json`);
		const Countries = await import(`../../../../../data/countries.json`);
		
		const banks: Record<string, Omit<BankData, 'id' | 'swift'>> = JSON.parse(JSON.stringify(Banks.default));
		const swiftCodes: Record<string, { swift: string[] }> = JSON.parse(JSON.stringify(SwiftCodes.default));
		const countries: Record<string, string> = JSON.parse(JSON.stringify(Countries.default));
		const countryName = countries[countryCode.toUpperCase()];

		function parseSwiftCode(swiftCode: string): SwiftDetails {
			const bankCode = swiftCode.substring(0, 4);
			const countryCode = swiftCode.substring(4, 6);
			const locationCode = swiftCode.substring(6, 8);
			const branchCode = swiftCode.length > 8 ? swiftCode.substring(8) : null;

			return {
				bank: bankCode,
				country: countryCode,
				location: locationCode,
				branch: branchCode,
			};
		}

		// Merging the datasets with proper type inference
		const banksData: Record<string, BankData> = Object.keys(swiftCodes).reduce((result, bank) => {
			if (banks[bank]) {
				const swiftCodesData = swiftCodes[bank].swift;

				if(swiftCodesData) {
					result[bank] = {
						id: bank,
						...banks[bank],
						swift: {
							codes: swiftCodesData,
							details: parseSwiftCode(swiftCodesData[0]),
						},
					};
				}
			} else {
				// If a bank is present only in SwiftCodes dataset, handle gracefully
				const swiftCodesData = swiftCodes[bank].swift;
				if(swiftCodesData) {
					result[bank] = {
						id: bank,
						name: 'Unknown Bank',
						city: '',
						address: '',
						branch: '',
						swift: {
							codes: swiftCodes[bank].swift,
							details: parseSwiftCode(swiftCodes[bank].swift[0]),
						},
					};
				}
			}
			return result;
		}, {} as Record<string, BankData>);

		return { banks, swiftCodes, countryName, countryCode, banksData };
	} catch (e) {
		throw error(404, `Could not find bank codes for ${params.country}`);
	}
};
