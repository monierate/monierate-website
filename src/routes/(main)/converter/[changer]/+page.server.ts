import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getChanger } from '$lib/services/changer.service';
import { getCurrencies } from '$lib/services/currency.service';
import { getPair } from '$lib/services/pair.service';

export const load: PageServerLoad = async ({ params, url, fetch, depends }) => {
	try {
		const changer_code = params.changer;

		const search = url.searchParams;

		const convert = {
			From: search.get('From') ?? 'usd',
			To: search.get('To') ?? 'ngn',
			Amount: Number(search.get('Amount')) || 1
		};

		depends(`convert:from=${convert.From}`, `convert:to=${convert.To}`);

		const pairCode = `${convert.From}${convert.To}`;

		const changer = (await getChanger(fetch, changer_code)) as any;
		const currencies = await getCurrencies(fetch);
		let pair = await getPair(fetch, pairCode);
		let rateInverse: boolean = false;

		if (!pair) {
			pair = await getPair(fetch, `${convert.To}${convert.From}`);
			rateInverse = true;
		}

		if (!Object.keys(currencies).length) {
			throw error(500, 'Currencies data failed.');
		}

		if (!Object.keys(changer).length) {
			throw error(500, 'Changer data failed.');
		}

		return {
			changer,
			convert,
			currencies,
			pair,
			rateInverse
		};
	} catch (e) {
		console.error(e);
		throw error(502, 'Unable to fetch an important data');
	}
};
