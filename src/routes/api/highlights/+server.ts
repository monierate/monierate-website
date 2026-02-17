import { json, error } from '@sveltejs/kit';
import { getAllChangers } from '$lib/services/changer.service';
import { getPairChangers, ChangerServiceCategory } from '$lib/services/pair.service.js';

interface Changer {
	code: string;
	name: string;
	link: string;
	pairs: Record<string, unknown>;
}

interface PairChanger {
	changer_code: string;
	price_buy: number;
	price_sell: number;
	updated_at: string;
}

interface ChangerRate {
	rate: PairChanger;
	changer: Changer;
}

const EXCLUDED = new Set(['market', 'binance', 'paypal']);
const NEWEST = ['karsa', 'mavapay', 'nsave', 'cardtonic', 'boundlesspay'];

const findBuyPlatforms = (
	changers: Record<string, Changer>,
	rates: PairChanger[] = []
): ChangerRate[] => {
	try {
		return rates
			.filter((r) => changers[r.changer_code] && !EXCLUDED.has(r.changer_code) && r.price_buy > 0)
			.map((r) => ({ rate: r, changer: changers[r.changer_code] }))
			.sort((a, b) => a.rate.price_buy - b.rate.price_buy); // lower prices first
	} catch (err) {
		console.error('Error in findBuyPlatforms:', err);
		return [];
	}
};

const findSellPlatforms = (
	changers: Record<string, Changer>,
	rates: PairChanger[] = []
): ChangerRate[] => {
	try {
		return rates
			.filter((r) => changers[r.changer_code] && !EXCLUDED.has(r.changer_code) && r.price_sell > 0)
			.map((r) => ({ rate: r, changer: changers[r.changer_code] }))
			.sort((a, b) => b.rate.price_sell - a.rate.price_sell); // higher prices first
	} catch (err) {
		console.error('Error in findSellPlatforms:', err);
		return [];
	}
};

const findNewPlatforms = (
	changers: Record<string, Changer>,
	rates: PairChanger[] = []
): ChangerRate[] => {
	try {
		return rates
			.filter(
				(r) =>
					changers[r.changer_code] &&
					!EXCLUDED.has(r.changer_code) &&
					(r.price_buy > 0 || r.price_sell > 0)
			)
			.map((r) => ({ rate: r, changer: changers[r.changer_code] }))
			.sort((a, b) => {
				const indexA = NEWEST.indexOf(a.rate.changer_code);
				const indexB = NEWEST.indexOf(b.rate.changer_code);
				return indexA - indexB; // follow NEWEST order
			});
	} catch (err) {
		console.error('Error in findNewPlatforms:', err);
		return [];
	}
};

export const GET = async ({ url, fetch }) => {
	const pair = url.searchParams.get('pair')?.trim() || null;
	const max = (url.searchParams.get('max')?.trim() || 10) as number;

	if (!pair) {
		throw error(400, 'Invalid pair');
	}

	const [rawChangers, remittance, ramp, card, all] = await Promise.all([
		getAllChangers(fetch),
		getPairChangers(fetch, pair, ChangerServiceCategory.Remittance),
		getPairChangers(fetch, pair, ChangerServiceCategory.Ramp),
		getPairChangers(fetch, pair, ChangerServiceCategory.Card),
		getPairChangers(fetch, pair)
	]);

	if (!rawChangers) {
		throw error(500, 'Platform data unavailable. Try again shortly.');
	}

	const changers = Object.fromEntries(rawChangers.map((p: any) => [p.code, p]));
	const newest = Object.fromEntries(NEWEST.filter((c) => changers[c]).map((c) => [c, changers[c]]));

	const safe = (rates?: PairChanger[]) => Array.isArray(rates) && rates.length;

	const res = {
		newResult: safe(all) ? findNewPlatforms(newest, all).slice(0, max) : [],
		sendingResult: safe(remittance) ? findSellPlatforms(changers, remittance).slice(0, max) : [],
		buyingResult: safe(ramp) ? findBuyPlatforms(changers, ramp).slice(0, max) : [],
		sellingResult: safe(ramp) ? findSellPlatforms(changers, ramp).slice(0, max) : [],
		fundingResult: safe(card) ? findBuyPlatforms(changers, ramp).slice(0, max) : []
	};

	return json(res);
};
