import type { MarketCurrencyRate, MarketData, MarketKey, RateMode } from '$lib/types/market';
import { getAllPairs } from '$lib/services/pair.service';
import currencies from '$data/currencies.json';

/**
 * Each market view is the rates of a single provider (changer) across all NGN pairs:
 *   - Black Market -> "aboki-fx" (parallel market buy/sell)
 *   - CBN          -> "cbn"      (official buy/sell)
 *   - Global Market-> "fastforex" (mid-market, single rate)
 */
const MARKET_CONFIG: Record<
	MarketKey,
	{ changer: string; rateMode: RateMode; title: string; shortTitle: string; description: string }
> = {
	'black-market': {
		changer: 'aboki-fx',
		rateMode: 'buy-sell',
		title: 'Black Market',
		shortTitle: 'Black Market',
		description:
			'Live parallel (black market) exchange rates for major and emerging currencies against the Nigerian Naira.'
	},
	cbn: {
		changer: 'cbn',
		rateMode: 'buy-sell',
		title: 'CBN (Official)',
		shortTitle: 'CBN',
		description:
			'Central Bank of Nigeria (CBN) official exchange rates for major and emerging currencies against the Naira.'
	},
	'global-market': {
		changer: 'fastforex',
		rateMode: 'single',
		title: 'Global Market',
		shortTitle: 'Global Market',
		description:
			'Mid-market (interbank) exchange rates for major and emerging currencies against the Naira.'
	}
};

const BASE = 'NGN';

// Currency code -> name (fiat preferred, fall back to coins).
const NAMES: Record<string, string> = {
	...(currencies as any).coins,
	...(currencies as any).fiat
};

// ISO 4217 codes are mostly <country alpha-2> + <unit letter>, so the first two
// letters give the flag's country code. These are the exceptions.
const COUNTRY_OVERRIDES: Record<string, string> = {
	EUR: 'EU',
	XOF: 'SN',
	XAF: 'CM',
	XPF: 'PF',
	XCD: 'AG',
	XAU: 'UN',
	XAG: 'UN',
	XDR: 'UN',
	ANG: 'CW'
};

const countryCodeFor = (code: string): string =>
	COUNTRY_OVERRIDES[code] ?? code.slice(0, 2).toUpperCase();

/**
 * Get the rates table for a single market.
 *
 * Pulls every NGN pair and reads the configured provider's rate from each pair's
 * `changers[]`. Pairs where the provider has no (or zero) rate are skipped.
 */
export const getMarketRates = async (
	fetch: typeof globalThis.fetch,
	market: MarketKey
): Promise<MarketData> => {
	const cfg = MARKET_CONFIG[market];

	const response = await getAllPairs(fetch, undefined, 1, 250, 'ngn', cfg.changer);
	const pairs: any[] = response?.result ?? [];

	const rates: MarketCurrencyRate[] = [];
	let latestUpdate = 0;

	for (const pair of pairs) {
		if (pair?.is_active !== true) continue;

		const changer = pair?.changers?.find((c: any) => c.changer_code === cfg.changer);
		if (!changer) continue;

		const code = String(pair.code ?? '')
			.replace(/ngn$/i, '')
			.toUpperCase();
		if (!code || code === BASE) continue;

		const buy = Number(changer.price_buy) || 0;
		const sell = Number(changer.price_sell) || 0;

		const common = {
			code,
			name: NAMES[code] ?? code,
			countryCode: countryCodeFor(code),
			change: Number(pair.price_change_percent_24hr) || 0
		};

		if (cfg.rateMode === 'single') {
			const rate = buy || sell;
			if (!rate) continue;
			rates.push({ ...common, rate });
		} else {
			if (!buy && !sell) continue;
			rates.push({ ...common, buy, sell });
		}

		const updated = changer.updated_at ? new Date(changer.updated_at).getTime() : 0;
		if (updated > latestUpdate) latestUpdate = updated;
	}

	// Most relevant currencies first, then alphabetical.
	const PRIORITY = ['USD', 'EUR', 'GBP', 'CAD', 'CNY', 'JPY', 'GHS', 'ZAR', 'KES'];
	rates.sort((a, b) => {
		const ia = PRIORITY.indexOf(a.code);
		const ib = PRIORITY.indexOf(b.code);
		if (ia !== -1 || ib !== -1) {
			return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
		}
		return a.code.localeCompare(b.code);
	});

	return {
		meta: {
			key: market,
			title: cfg.title,
			shortTitle: cfg.shortTitle,
			description: cfg.description,
			rateMode: cfg.rateMode,
			base: BASE,
			updatedAt: new Date(latestUpdate || Date.now()).toISOString()
		},
		rates
	};
};
