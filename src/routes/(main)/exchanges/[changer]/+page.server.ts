import type { PageServerLoad } from './$types';
import currencies from '$data/currencies.json';
import currencySymbols from '$data/currency-symbols.json';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { changer } = params;

	if (!changer) {
		throw error(400, 'Missing changer parameter');
	}

	const allCurrencies: Record<string, string> = {
		...currencies.fiat,
		...currencies.coins
	};

	const [changerResult, relatedChangers] = await Promise.all([
		getJson<any>(fetch, `/api/changer?code=${encodeURIComponent(changer)}`),
		getJson<any>(fetch, `/api/changer/get_similar_changers?code=${encodeURIComponent(changer)}`)
	]);

	if (!changerResult || Object.entries(changerResult).length <= 0) {
		throw error(404, 'Changer not found');
	}

	return {
		changer: changerResult,
		currencies: allCurrencies,
		currencySymbols,
		relatedChangers: relatedChangers?.data ?? []
	};
};

/* -------------------------------- helpers -------------------------------- */

async function getJson<T>(fetchFn: typeof fetch, url: string): Promise<T | null> {
	try {
		const res = await fetchFn(url);

		if (!res.ok) {
			console.error(`Request failed: ${url}`, {
				status: res.status,
				statusText: res.statusText
			});
			return null;
		}

		return (await res.json()) as T;
	} catch (err) {
		console.error(`Fetch error: ${url}`, err);
		return null;
	}
}
