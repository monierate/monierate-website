import { error } from '@sveltejs/kit'

export async function load({ params }) {
	let codes = await import(`../../../../data/bank-ussd.json`)
    let banks = await import(`../../../../data/banks.json`)

    codes = JSON.parse(JSON.stringify(codes.default))
    banks = JSON.parse(JSON.stringify(banks.default))

    let code = codes[params.bank]
    let bank = banks.ng[params.bank]

    console.log(code)
    console.log(bank)

	try {
		return {
			code,
            bank
		}
	} catch (e) {
		throw error(404, `Could not find ussd codes`)
	}
}