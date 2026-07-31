import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProviderV1 } from '$lib/services/providers.service';
import { getRateHistory, type DailySnapshot } from '$lib/services/rates.service';
import { parsePairCode } from '$lib/utils/pairs';
import { buildPairProviderSeo } from '$lib/utils/providerSeo';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const pairCode = params.code.toLowerCase();
	const providerCode = params.provider.toLowerCase();

	const result = await getProviderV1(fetch, providerCode);

	if (!result?.provider?.name) {
		throw error(404, `Provider "${providerCode}" not found`);
	}

	const { provider, latest_rates } = result;

	const currentRate = (latest_rates ?? []).find((r) => r.pair === pairCode) ?? null;

	if (!currentRate) {
		throw error(404, `No ${pairCode.toUpperCase()} rate for "${providerCode}"`);
	}

	const end = new Date();
	const start = new Date(end.getTime() - 30 * 86_400_000);
	const fmtDate = (d: Date) => d.toISOString().split('T')[0];

	const historyRes = await getRateHistory(fetch, {
		pair: pairCode,
		provider_id: providerCode,
		start_date: fmtDate(start),
		end_date: fmtDate(end),
		limit: 90
	});
	const initialHistory: DailySnapshot[] = historyRes?.snapshots ?? [];

	const { base, quote } = parsePairCode(pairCode);

	const seo = buildPairProviderSeo({
		pairCode,
		base: base.toUpperCase(),
		quote: quote.toUpperCase(),
		providerCode,
		providerName: provider.name,
		providerIcon: provider.icon,
		providerLink: provider.link,
		rate: currentRate.rate_buy || currentRate.rate_mid
	});

	return {
		pairCode,
		providerCode,
		provider,
		currentRate,
		initialHistory,
		seo
	};
};
