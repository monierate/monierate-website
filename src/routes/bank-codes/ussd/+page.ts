import { error } from '@sveltejs/kit';

type USSD = {
	[key: string]: string;
};

interface Bank {
	name: string;
	city?: string;
	address?: string;
	branch?: string;
}

type BankData = {
	id: string;
	name: string;
	city: string;
	address: string;
	branch: string;
	ussd: USSD;
};

export async function load() {
	try {
		const codesModule = await import('../../../data/bank-ussd.json');
		const banksModule = await import('../../../data/banks.json');

		const codes = codesModule.default as any;
		const banks = (banksModule.default as any).ng;

		const mappedBanks: BankData[] = (Object.entries(banks) as [string, Bank][]).map(
			([bankKey, bank]) => {
				const bankCodes = codes[bankKey] || {};
				return {
					id: bankKey,
					name: bank.name,
					city: bank.city || '',
					address: bank.address || '',
					branch: bank.branch || '',
					ussd: {
						start: bankCodes?.start || '',
						airtime_self: bankCodes?.airtime?.[0] || '',
						transfer_to_same_bank: bankCodes?.transfer?.[0] || '',
					}
				};
			}
		);

		const banksData: BankData[] = mappedBanks.filter(bankData => Object.keys(bankData.ussd).length > 0);

		return { banksData };
	} catch (e) {
		throw error(404, 'Could not find or map USSD codes');
	}
}
