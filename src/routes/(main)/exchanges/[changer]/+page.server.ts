import type { PageServerLoad } from './$types';
import currencies from '$data/currencies.json';
import currencySymbols from '$data/currency-symbols.json';
import { error } from '@sveltejs/kit';
import { getChanger, getSimilarChangers } from '$lib/services/changer.service';
import { getAllPairs } from '$lib/services/pair.service';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { changer } = params;

	if (!changer) {
		throw error(400, 'Missing changer parameter');
	}

	const allCurrencies: Record<string, string> = {
		...currencies.fiat,
		...currencies.coins
	};

	const [changerResult, relatedChangers, pairs] = await Promise.all([
		getChanger(fetch, changer),
		getSimilarChangers(fetch, changer),
		getAllPairs(fetch, undefined, 1, 1000, undefined, changer)
	]);

	const availablePairs = pairs ? getAvailablePairs(changer, pairs.result) : [];

	if (!changerResult || Object.entries(changerResult).length <= 0) {
		throw error(404, 'Changer not found');
	}

	return {
		changer: changerResult,
		currencies: allCurrencies,
		currencySymbols,
		relatedChangers: relatedChangers?.data ?? [],
		pairs: availablePairs
	};
};

/* -------------------------------- helpers -------------------------------- */

interface Changer {
	changer_code: string;
	[key: string]: any;
}

interface Pair {
	code: string;
	changers: Changer[];
}

const getAvailablePairs = (
	changerCode: string,
	pairs: Pair[]
): (Changer & { pair_code: string })[] => {
	return pairs.flatMap((pair) =>
		pair.changers
			.filter((changer) => changer.changer_code === changerCode)
			.map((changer) => ({
				...changer,
				pair_code: pair.code
			}))
	);
};
