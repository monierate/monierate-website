import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProviderV1 } from '$lib/services/providers.service';
import { getRateHistory, type DailySnapshot } from '$lib/services/rates.service';
import { parsePairCode } from '$lib/utils/pairs';
import { buildProviderSeo } from '$lib/utils/providerSeo';
import { DEFAULT_CURRENCY_COOKIE_NAME } from '$lib/stores/defaultCurrency';
import { getDayPassStatus } from '$lib/server/billing';
import { FREE_HISTORY_ROWS } from '$lib/constants/gate';

export interface ProviderCurrentRate {
	pair: string;
	rate_buy?: number;
	rate_sell?: number;
	rate_mid?: number;
	spread?: number;
	updated_at?: string;
}

export const load: PageServerLoad = async ({ params, fetch, cookies, url }) => {
	const code = params.code;

	const result = await getProviderV1(fetch, code);

	if (!result?.provider?.name) {
		throw error(404, 'Provider not found');
	}

	const { provider, latest_rates } = result;

	const providerCurrentRates: ProviderCurrentRate[] = (latest_rates ?? []).map((r) => ({
		pair: r.pair,
		rate_buy: r.rate_buy,
		rate_sell: r.rate_sell,
		rate_mid: r.rate_mid,
		spread: r.spread,
		updated_at: r.timestamp
	}));

	const supportedPairCodes = providerCurrentRates.map((r) => r.pair);
	const quotes = [...new Set(supportedPairCodes.map((p) => parsePairCode(p).quote.toUpperCase()))].sort();

	const cookieQuote = (cookies.get(DEFAULT_CURRENCY_COOKIE_NAME) ?? 'NGN').toUpperCase();
	const initialQuote = quotes.includes(cookieQuote) ? cookieQuote : (quotes[0] ?? '');

	// Determine initial pair: requested via ?pair= → preferred-quote + USDT base →
	// any pair in the preferred quote → first available.
	const requestedPair = url.searchParams.get('pair');
	const initialPairCode =
		(requestedPair && supportedPairCodes.includes(requestedPair) ? requestedPair : null) ??
		supportedPairCodes.find(
			(p) => parsePairCode(p).quote.toUpperCase() === initialQuote && parsePairCode(p).base.toUpperCase() === 'USDT'
		) ??
		supportedPairCodes.find((p) => parsePairCode(p).quote.toUpperCase() === initialQuote) ??
		supportedPairCodes[0] ??
		null;

	let initialHistory: DailySnapshot[] = [];
	if (initialPairCode) {
		const end = new Date();
		const start = new Date(end.getTime() - 30 * 86_400_000);
		const fmtDate = (d: Date) => d.toISOString().split('T')[0];

		const historyRes = await getRateHistory(fetch, {
			pair: initialPairCode,
			provider_id: code,
			start_date: fmtDate(start),
			end_date: fmtDate(end),
			limit: 90
		});
		initialHistory = historyRes?.snapshots ?? [];
	}

	const seo = buildProviderSeo({
		code,
		name: provider.name,
		bio: provider.bio,
		icon: provider.icon,
		link: provider.link
	});

	// Only worth resolving if the table will actually gate — skips the extra
	// round trip on providers with too little history to lock anything.
	const dayPass = initialHistory.length > FREE_HISTORY_ROWS
		? await getDayPassStatus(cookies.get('user_token'))
		: null;

	return {
		code,
		provider,
		supportedPairCodes,
		providerCurrentRates,
		initialPairCode,
		initialHistory,
		seo,
		dayPass
	};
};
