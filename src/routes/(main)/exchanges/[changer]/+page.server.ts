import type { PageServerLoad } from './$types';
import currencies from '$data/currencies.json';
import currencySymbols from '$data/currency-symbols.json';
import { error } from '@sveltejs/kit';
import { getChanger, getSimilarChangers } from '$lib/services/changer.service';
import { getAllPairs } from '$lib/services/pair.service';
import { collectionsForChanger } from '$lib/data/exchange-collections';
import { getPublishedSlugs } from '$lib/server/collections';

export const load: PageServerLoad = async ({ params, fetch, request }) => {
	const { changer } = params;
	const ua = request.headers.get('user-agent') ?? '';
	const isAndroid = /android/i.test(ua);
	const isIOS = /iphone|ipad|ipod/i.test(ua);

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

	// Cross-links up into the directory collections this changer belongs to.
	// Matching is local to the changer record, but the published set is checked
	// too — a collection this changer qualifies for can still be below the
	// thin-page threshold, and linking to a page that 404s is worse than not
	// linking at all. The published set is cached, so this is normally free.
	const publishedSlugs = await getPublishedSlugs();
	const collections = collectionsForChanger(changerResult)
		.filter((c) => publishedSlugs.has(c.slug))
		.map((c) => ({ slug: c.slug, label: c.label }));

	return {
		changer: changerResult,
		currencies: allCurrencies,
		currencySymbols,
		relatedChangers: relatedChangers?.data ?? [],
		pairs: availablePairs,
		collections,
		isAndroid,
		isIOS
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
