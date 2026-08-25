import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getChanger } from '$lib/services/changer.service';
import { getCurrencies } from '$lib/services/currency.service';
import { getPair, getAllPairs } from '$lib/services/pair.service';
import { isRenderablePair, isUsableQuote, parsePairCode } from '$lib/utils/pairs';

const DEFAULT_FROM = 'usd';
const DEFAULT_TO = 'ngn';

// How many of a changer's own pairs to try before giving up on finding it a rate.
const MAX_FALLBACK_PAIRS = 3;

type Quote = {
	changer_code?: string;
	is_active?: boolean;
	price_buy?: number;
	price_sell?: number;
	updated_at?: string;
};

/** A changer's own quote for a pair, taken from its changer document. */
function ownQuote(changer: any, pairCode: string): Quote | null {
	const quote = changer?.pairs?.[pairCode];
	return isUsableQuote(quote) ? quote : null;
}

const withChangers = (pair: any, changers: Quote[]) => (pair ? { ...pair, changers } : pair);

/** Most recently updated first, then alphabetical, so the pick is stable run to run. */
function byFreshness(a: { code: string; updated_at?: string }, b: { code: string; updated_at?: string }) {
	const delta = (Date.parse(b.updated_at ?? '') || 0) - (Date.parse(a.updated_at ?? '') || 0);
	return delta || a.code.localeCompare(b.code);
}

/**
 * Find this changer's rate for `from`/`to`, trying the inverse pair the way the
 * page always has.
 *
 * The pair document and the changer document don't always agree — a changer can
 * carry an active rate under `changer.pairs` while being absent from that pair's
 * `changers` array. The pair document wins; the changer's own book is the fallback,
 * except for changers the pair deliberately withholds.
 */
async function resolvePair(fetch: any, changer: any, from: string, to: string) {
	const direct = `${from}${to}`;
	const inverse = `${to}${from}`;

	let pair = (await getPair(fetch, direct)) as any;
	let rateInverse = false;
	let code = direct;

	if (!pair) {
		const flipped = (await getPair(fetch, inverse)) as any;
		if (flipped) {
			pair = flipped;
			rateInverse = true;
			code = inverse;
		}
	}

	const changers: Quote[] = pair?.changers ?? [];
	const listed = changers.find((c) => c.changer_code === changer.code);

	if (isUsableQuote(listed)) return { pair, rateInverse, rate: listed as Quote };

	// A listed-but-stale entry must not reach the page as a current rate.
	const usable = listed ? changers.filter((c) => c !== listed) : changers;

	if ((pair?.hidden_changers ?? []).includes(changer.code)) {
		return { pair: withChangers(pair, usable), rateInverse, rate: null };
	}

	let own = ownQuote(changer, code);

	if (!own && !pair) {
		// No pair document either way, so the changer's own book is all we have.
		own = ownQuote(changer, direct);
		if (!own && (own = ownQuote(changer, inverse))) {
			code = inverse;
			rateInverse = true;
		}
	}

	if (!own) return { pair: withChangers(pair, usable), rateInverse, rate: null };

	const entry = { ...own, changer_code: changer.code };

	return {
		pair: pair ? { ...pair, changers: [...usable, entry] } : { code, changers: [entry] },
		rateInverse,
		rate: entry as Quote
	};
}

/**
 * Pairs this changer actually quotes, best first. Used only when the visitor didn't
 * name a pair — otherwise a provider that doesn't trade USD/NGN lands on a page
 * quoting zero.
 */
async function fallbackPairCodes(fetch: any, changer: any, currencyCodes: Set<string>) {
	const candidates: { code: string; updated_at?: string }[] = [];

	const own = changer?.pairs;
	if (own && typeof own === 'object') {
		for (const [code, quote] of Object.entries(own) as [string, Quote][]) {
			if (isUsableQuote(quote)) candidates.push({ code, updated_at: quote.updated_at });
		}
	}

	if (!candidates.length) {
		// The changer document lists no pairs — ask which pair documents it appears in.
		const result = (await getAllPairs(fetch, undefined, 1, 200, undefined, changer.code)) as any;

		for (const pair of result?.result ?? []) {
			const entry = (pair.changers ?? []).find((c: Quote) => c.changer_code === changer.code);
			if (isUsableQuote(entry)) candidates.push({ code: pair.code, updated_at: entry.updated_at });
		}
	}

	return candidates
		.filter((candidate) => isRenderablePair(candidate.code, currencyCodes))
		.sort(byFreshness)
		.map((candidate) => candidate.code)
		.slice(0, MAX_FALLBACK_PAIRS);
}

export const load: PageServerLoad = async ({ params, url, fetch, depends }) => {
	const search = url.searchParams;

	const convert = {
		From: (search.get('From') ?? DEFAULT_FROM).toLowerCase(),
		To: (search.get('To') ?? DEFAULT_TO).toLowerCase(),
		Amount: Number(search.get('Amount')) || 1
	};

	depends(`convert:from=${convert.From}`, `convert:to=${convert.To}`);

	// A visitor who named a pair keeps it, rate or no rate.
	const pinned = search.has('From') || search.has('To');

	let changer: any;
	let currencies: any;
	let resolved: Awaited<ReturnType<typeof resolvePair>>;

	try {
		changer = await getChanger(fetch, params.changer);
		currencies = await getCurrencies(fetch);

		if (!currencies || !Object.keys(currencies).length) {
			throw new Error('Currencies data failed.');
		}

		if (!changer || !Object.keys(changer).length) {
			throw new Error('Changer data failed.');
		}

		const currencyCodes = new Set(
			(currencies as any[]).map((currency: any) => String(currency.code).toLowerCase())
		);

		resolved = await resolvePair(fetch, changer, convert.From, convert.To);

		if (!resolved.rate && !pinned) {
			for (const code of await fallbackPairCodes(fetch, changer, currencyCodes)) {
				const { base, quote } = parsePairCode(code);
				const next = await resolvePair(fetch, changer, base, quote);

				if (next.rate) {
					resolved = next;
					convert.From = base;
					convert.To = quote;
					break;
				}
			}
		}
	} catch (e) {
		console.error(e);
		throw error(502, 'Unable to fetch an important data');
	}

	return {
		changer,
		convert,
		currencies,
		pair: resolved.pair,
		rateInverse: resolved.rateInverse
	};
};
