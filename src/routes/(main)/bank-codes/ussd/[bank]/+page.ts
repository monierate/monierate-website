import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const codesModule = await import(`../../../../../data/bank-ussd.json`);
	const banksModule = await import(`../../../../../data/banks.json`);

	const codes = JSON.parse(JSON.stringify(codesModule.default));
	const banks = JSON.parse(JSON.stringify(banksModule.default));

	const code = codes[params.bank];
	const bank = banks.ng[params.bank];

	if (!code || !bank) {
		throw error(404, `Could not find ussd codes`);
	}

	return {
		code,
		bank
	};
}
