import type { PageServerLoad } from './$types';
import {
	createIndex,
	createRates,
	createChangers,
	createPairs,
	createSpread,
	createVolatility
} from '$lib/services';
import { error } from '@sveltejs/kit';
import { parsePairCode } from '$lib/utils/pairs';
import { buildPairOverviewSeo } from '$lib/utils/providerSeo';

// The Monierate Spread Index is published for USDT/NGN only.
const MSI_PAIR = 'usdtngn';

export const load: PageServerLoad = async ({ params, fetch, url }) => {
	const indexService = createIndex(fetch, url.origin);
	const ratesService = createRates(fetch, url.origin);
	const changersService = createChangers(fetch, url.origin);
	const pairsService = createPairs(fetch, url.origin);
	const spreadService = createSpread(fetch, url.origin);
	const volatilityService = createVolatility(fetch, url.origin);
	const isMsiPair = params.code === MSI_PAIR;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const asAny = (r: PromiseSettledResult<unknown>) => (r.status === 'fulfilled' ? (r.value as any) : null);

	const start24h = new Date();
	start24h.setDate(start24h.getDate() - 1);
	const startDate24h = start24h.toISOString().split('T')[0];

	// Await only what the hero (metrics + rate chart) and the tab strip need — this is
	// the LCP-critical content. The MSI (USDT/NGN hero metric) is fetched in the same
	// batch so it doesn't add a round trip. The provider breakdown below the fold is
	// streamed (below) so the shell paints without waiting on the slowest upstream call.
	const [historyRes, pairRes, pairsRes, msiRes, volRes] = await Promise.allSettled([
		indexService.getHistory({ pair: params.code, start_date: startDate24h, limit: 150 }),
		pairsService.get(params.code),
		pairsService.getAll({ is_active: true, limit: 100 }),
		isMsiPair ? spreadService.getCurrent(MSI_PAIR) : Promise.resolve(null),
		isMsiPair ? volatilityService.getCurrent(MSI_PAIR) : Promise.resolve(null),
	]);

	const indexHistory: unknown[] = asAny(historyRes)?.data?.entries ?? [];
	if (!indexHistory.length) throw error(404, 'Pair not found');

	const indexContributors: string[] = asAny(pairRes)?.data?.index_contributors ?? [];
	const pairs: unknown[] = asAny(pairsRes)?.data?.result ?? [];

	const msiData = asAny(msiRes)?.data;
	const msi = msiData
		? { score: msiData.msi_score as number, level: msiData.premium_level as string }
		: null;

	// Volatility-engine read (USDT/NGN only) — drives the Volatility hero metric.
	const volData = asAny(volRes)?.data;
	const vol = volData
		? {
			score: (volData.realized_vol?.d7 ?? null) as number | null,
			regime: volData.regime as string,
			stress: volData.stress as string
		}
		: null;

	// Streamed (unawaited) promises — resolve on the client after the shell has rendered.
	const changers: Promise<unknown[]> = changersService
		.getAll({ is_active: true, limit: 200 })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.then((r) => (r as any)?.data?.result ?? [])
		.catch(() => []);
	const currentRates: Promise<unknown[]> = ratesService
		.getCurrent({ pair: params.code, limit: 50 })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.then((r) => (r as any)?.data?.rates ?? [])
		.catch(() => []);

	const { base, quote } = parsePairCode(params.code);
	// entries are newest-first
	const latestRate = (indexHistory[0] as { composite_rate?: number } | undefined)?.composite_rate;
	const seo = buildPairOverviewSeo({
		pairCode: params.code,
		base: base.toUpperCase(),
		quote: quote.toUpperCase(),
		rate: latestRate
	});

	return { pairCode: params.code, indexHistory, currentRates, changers, indexContributors, pairs, msi, vol, seo };
};
