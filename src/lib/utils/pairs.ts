import { KNOWN_BASES, CURRENCY_SYMBOLS } from '$lib/constants/currency';
import type { Pair, HistoricalData, ProviderRate } from '$lib/types';
import type { MarketPair, PairChanger, ChangerMeta } from '$lib/types/pairMarket';
import type { CurrentRate } from '$lib/services/currency/v1/rates';

/**
 * A changer quote older than this is treated as no quote at all, because rendering a
 * dead quote as a current rate is worse than showing none.
 *
 * The bar is deliberately loose. Live quotes refresh within the hour, but a bank that
 * posts a desk rate can sit untouched for a week or more and still be correct — while
 * the changer document's `pairs` map holds a snapshot frozen months back. A month
 * clears the slow-but-real feeds and still fails closed on the frozen ones.
 */
export const QUOTE_MAX_AGE_DAYS = 30;

/** A quote is usable only if it is active, actually priced, and recent. */
export function isUsableQuote(
	quote: Partial<PairChanger> | null | undefined,
	maxAgeDays: number = QUOTE_MAX_AGE_DAYS
): boolean {
	if (!quote?.is_active) return false;
	if (!(Number(quote.price_buy ?? 0) > 0 || Number(quote.price_sell ?? 0) > 0)) return false;

	const updated = Date.parse(quote.updated_at ?? '');
	if (!updated) return false;

	return Date.now() - updated <= maxAgeDays * 24 * 60 * 60 * 1000;
}

export function parsePairCode(code: string): { base: string; quote: string } {
	const lower = code.toLowerCase();
	if (lower.includes('-')) {
		const [base, quote] = lower.split('-');
		return { base, quote };
	}
	for (const len of [4, 3]) {
		const candidate = lower.slice(0, len);
		if (KNOWN_BASES.includes(candidate)) {
			return { base: candidate, quote: lower.slice(len) };
		}
	}
	const mid = Math.floor(code.length / 2);
	return { base: lower.slice(0, mid), quote: lower.slice(mid) };
}

/** Both halves must be currencies we can name, or a page has nothing to render. */
export function isRenderablePair(pairCode: string, currencyCodes: Set<string>): boolean {
	const { base, quote } = parsePairCode(pairCode);
	return currencyCodes.has(base) && currencyCodes.has(quote);
}

export function toDisplayPair(mp: MarketPair): Pair {
	const { base, quote } = parsePairCode(mp.code);
	const prices = [mp.price_30d, mp.price_7d, mp.price_24hr, mp.price_1hr, mp.price?.current ?? 0].filter((p) => p > 0);
	return {
		code: mp.code,
		display: `${base.toUpperCase()} / ${quote.toUpperCase()}`,
		base: base.toUpperCase(),
		quote: quote.toUpperCase(),
		symbol: CURRENCY_SYMBOLS[quote] ?? '',
		range: prices.length ? [Math.min(...prices), Math.max(...prices)] : [0, 0],
	};
}

export function toSparkline(mp: MarketPair): HistoricalData[] {
	const current = mp.price?.current ?? 0;
	return [
		{ label: '30d', rate: mp.price_30d },
		{ label: '7d',  rate: mp.price_7d },
		{ label: '24h', rate: mp.price_24hr },
		{ label: '1h',  rate: mp.price_1hr },
		{ label: 'now', rate: current },
	]
		.filter((p) => p.rate > 0)
		.map((p) => ({
			date: p.label, dateLabel: p.label,
			open: p.rate, high: p.rate, low: p.rate, close: p.rate,
			rate: p.rate, volume: 0,
		}));
}

function resolveChangerType(tags?: string[]): ProviderRate['type'] {
	if (!tags?.length) return 'CEX';
	if (tags.includes('p2p')) return 'P2P';
	if (tags.includes('remittance')) return 'Remittance';
	if (tags.includes('neobank')) return 'Neobank';
	if (tags.includes('otc')) return 'OTC';
	return 'CEX';
}

export function toProviderRate(changer: PairChanger, meta?: ChangerMeta): ProviderRate {
	const buy = changer.price_buy ?? 0;
	const sell = changer.price_sell ?? 0;
	const name = meta?.name ?? (changer.changer_code.charAt(0).toUpperCase() + changer.changer_code.slice(1));
	const logo = meta?.icon ?? '';
	return {
		id: changer.changer_code,
		name,
		type: resolveChangerType(meta?.changer_tags),
		logo,
		rate: buy || sell,
		buy,
		sell,
		rate_mid: buy > 0 && sell > 0 ? (buy + sell) / 2 : buy || sell,
		rate_type: 'live',
		premium: 0,
		premiumPct: 0,
		delta24h: 0,
		deltaPct: changer.price_change_percent_24hr ?? 0,
		availability: 0,
		lastUpdated: changer.updated_at ? new Date(changer.updated_at).getTime() : 0,
		stale: false,
		spread: buy > 0 && sell > 0 ? buy - sell : 0,
		minTx: String(changer.trade_min ?? 0),
		maxTx: String(changer.trade_max ?? 0),
		score: 0,
		tags: meta?.changer_tags ?? [],
	};
}

export function toProviderRateFromCurrent(rate: CurrentRate, meta?: ChangerMeta): ProviderRate {
	const name = meta?.name ?? (rate.provider_id.charAt(0).toUpperCase() + rate.provider_id.slice(1));
	return {
		id: rate.provider_id,
		name,
		type: resolveChangerType(meta?.changer_tags),
		logo: meta?.icon ?? '',
		rate: rate.rate_buy || rate.rate_sell,
		buy: rate.rate_buy,
		sell: rate.rate_sell,
		rate_mid: rate.rate_mid,
		rate_type: rate.rate_type,
		premium: 0,
		premiumPct: 0,
		delta24h: 0,
		deltaPct: 0,
		availability: 0,
		lastUpdated: rate.timestamp ? new Date(rate.timestamp).getTime() : 0,
		stale: false,
		spread: rate.spread,
		minTx: '0',
		maxTx: '0',
		score: 0,
		tags: meta?.changer_tags ?? [],
	};
}
