import type { Pair, ProviderRate } from '$lib/types';
import type { ChangerMeta, MarketPair } from '$lib/types/pairMarket';
import { parsePairCode } from '$lib/utils/pairs';
import { buildProviders } from '$lib/utils/market-highlights';
import { CURRENCY_SYMBOLS, KNOWN_BASES, QUOTE_SUPPORTED_BASES } from '$lib/constants/currency';
import { index } from '$lib/services';
import type { IndexHistoryEntry } from '$lib/services/currency/v1/index';
import type { CurrentRate } from '$lib/services/currency/v1/rates';


export interface PairPageData {
	pairCode: string;
	indexHistory?: unknown[];
	// Streamed from the server loader — resolved by the page, then fed to setProviderData().
	currentRates?: unknown[] | Promise<unknown[]>;
	changers?: unknown[] | Promise<unknown[]>;
	indexContributors?: string[];
	pairs?: unknown[];
	msi?: { score: number; level: string } | null;
	vol?: { score: number | null; regime: string; stress: string } | null;
}

export interface PairTab {
	base: string;
	code: string;
	rate: number;
	delta: number;
}

function formatTimestamp(ts: string, range: string): string {
	const d = new Date(ts);
	if (range === '1h' || range === '24h') {
		return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
	}
	if (range === '7d') {
		return (
			d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }) +
			' ' +
			d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
		);
	}
	return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
}

function rangeToStartDate(range: string): string {
	const d = new Date();
	if (range === '1h') d.setHours(d.getHours() - 1);
	else if (range === '24h') d.setDate(d.getDate() - 1);
	else if (range === '7d') d.setDate(d.getDate() - 7);
	else d.setDate(d.getDate() - 30);
	return d.toISOString().split('T')[0];
}

function rangeToLimit(range: string): number {
	if (range === '1h') return 10;
	if (range === '24h') return 150;
	if (range === '7d') return 1008;
	return 720;
}

export class PairActions {
	readonly pair: Pair;
	readonly indexContributorIds: string[];
	readonly #pairMap: Map<string, MarketPair>;
	readonly msi: { score: number; level: string } | null;
	readonly vol: { score: number | null; regime: string; stress: string } | null;

	// Provider breakdown is streamed in after the shell renders (see setProviderData).
	providers        = $state<ProviderRate[]>([]);
	providersLoading = $state(true);
	#changerMap      = $state<Map<string, ChangerMeta>>(new Map());

	indexHistory   = $state<IndexHistoryEntry[]>([]);
	historyLoading = $state(false);

	timeRange = $state('24h');
	readonly ranges = ['1h', '24h', '7d', '30d'];
	readonly rateSeries = [{ key: 'rate', label: 'Index Rate', color: '#3861fb', fill: true }];

	constructor(data: PairPageData) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const raw = data as any;

		const { base, quote } = parsePairCode(raw.pairCode);
		this.pair = {
			code: raw.pairCode,
			display: `${base.toUpperCase()} / ${quote.toUpperCase()}`,
			base: base.toUpperCase(),
			quote: quote.toUpperCase(),
			symbol: CURRENCY_SYMBOLS[quote] ?? '',
			range: [0, 0],
		};

		this.indexContributorIds = (raw.indexContributors ?? []) as string[];

		this.#pairMap = new Map<string, MarketPair>(
			((raw.pairs ?? []) as MarketPair[]).map((p) => [p.code, p])
		);

		this.indexHistory = (raw.indexHistory ?? []) as IndexHistoryEntry[];
		this.msi = (raw.msi ?? null) as { score: number; level: string } | null;
		this.vol = (raw.vol ?? null) as { score: number | null; regime: string; stress: string } | null;
	}

	// Called by the page once the streamed `changers` + `currentRates` promises resolve.
	// Builds the provider breakdown that feeds the market highlights; provider-name
	// lookups in the hero metrics/chart also upgrade reactively once this runs.
	setProviderData(changers: ChangerMeta[], currentRates: CurrentRate[]): void {
		this.#changerMap = new Map<string, ChangerMeta>(changers.map((c) => [c.code, c]));
		this.providers = buildProviders(currentRates, this.#changerMap);
		this.providersLoading = false;
	}

	// Pair tabs for the current quote (active base pinned first), each with its
	// current market price and 24h change for the TradingView-style header strip.
	get pairTabs(): PairTab[] {
		const quote = this.pair.quote;
		const supported = QUOTE_SUPPORTED_BASES[quote] ?? KNOWN_BASES.map((b) => b.toUpperCase());
		const bases = KNOWN_BASES.map((c) => c.toUpperCase())
			.filter((b) => supported.includes(b))
			.sort((a, b) => (a === this.pair.base ? -1 : b === this.pair.base ? 1 : 0));
		return bases.map((base) => {
			const code = `${base.toLowerCase()}${quote.toLowerCase()}`;
			const mp = this.#pairMap.get(code);
			return { base, code, rate: mp?.price?.current ?? 0, delta: mp?.price_change_percent_24hr ?? 0 };
		});
	}

	// Market highlights are derived in the page from the shared HIGHLIGHT_DEFS
	// (see $lib/utils/market-highlights) using this.providers.

	// Most recent entry (API returns newest-first)
	get #latest(): IndexHistoryEntry | null {
		return this.indexHistory[0] ?? null;
	}

	// --- "current" values from the most recent history entry ---

	get currentRate(): number {
		return this.#latest?.composite_rate ?? 0;
	}

	get indexContributors(): number {
		return this.#latest?.provider_count ?? 0;
	}

	get spreadRange(): number {
		return this.#latest?.spread_range ?? 0;
	}

	// Monierate Spread Index (USDT/NGN only) — null for other pairs.
	get msiScore(): number | null {
		return this.msi?.score ?? null;
	}

	get msiLevel(): string | null {
		return this.msi?.level ?? null;
	}

	// Volatility-engine read (USDT/NGN only) — realized 7d vol + regime. Null for
	// other pairs, where the card falls back to the high–low range volatility.
	get volScore(): number | null {
		return this.vol?.score ?? null;
	}

	get volRegime(): string | null {
		return this.vol?.regime ?? null;
	}

	get highProviderData(): { code: string; name: string; icon: string } | null {
		const code = this.#latest?.high_provider;
		if (!code) return null;
		const meta = this.#changerMap.get(code);
		return { code, name: meta?.name ?? code, icon: meta?.icon ?? '' };
	}

	get lowProviderData(): { code: string; name: string; icon: string } | null {
		const code = this.#latest?.low_provider;
		if (!code) return null;
		const meta = this.#changerMap.get(code);
		return { code, name: meta?.name ?? code, icon: meta?.icon ?? '' };
	}

	// --- 24h window metrics ---

	get high24h(): number {
		if (!this.indexHistory.length) return 0;
		return Math.max(...this.indexHistory.map((e) => e.composite_rate));
	}

	get low24h(): number {
		if (!this.indexHistory.length) return 0;
		return Math.min(...this.indexHistory.map((e) => e.composite_rate));
	}

	get volatility24h(): number {
		if (!this.high24h || !this.low24h) return 0;
		return +(((this.high24h - this.low24h) / this.low24h) * 100).toFixed(2);
	}

	get delta24h(): number {
		if (this.indexHistory.length < 2) return 0;
		// oldest entry is last (API newest-first)
		const oldest = this.indexHistory[this.indexHistory.length - 1].composite_rate;
		const newest = this.indexHistory[0].composite_rate;
		if (!oldest) return 0;
		return +(((newest - oldest) / oldest) * 100).toFixed(2);
	}

	get avgSpread(): number {
		if (!this.indexHistory.length) return 0;
		const spreads = this.indexHistory.map((e) => e.spread_range).filter((v) => v > 0);
		if (!spreads.length) return 0;
		return +(spreads.reduce((s, v) => s + v, 0) / spreads.length).toFixed(2);
	}

	// --- chart ---

	get chartData(): {
		dateLabel: string;
		rate: number;
		spreadUpper: number;
		spreadLower: number;
		spread_range: number;
		provider_count: number;
		excluded_count: number;
		high_provider: string;
		low_provider: string;
		calculation_method: string;
	}[] {
		if (!this.indexHistory.length) return [];
		return [...this.indexHistory].reverse().map((e) => ({
			dateLabel: formatTimestamp(e.timestamp, this.timeRange),
			rate: e.composite_rate,
			spreadUpper: e.composite_rate + e.spread_range / 2,
			spreadLower: e.composite_rate - e.spread_range / 2,
			spread_range: e.spread_range,
			provider_count: e.provider_count,
			excluded_count: e.excluded_count,
			high_provider: this.#changerMap.get(e.high_provider)?.name ?? e.high_provider,
			low_provider: this.#changerMap.get(e.low_provider)?.name ?? e.low_provider,
			calculation_method: e.calculation_method,
		}));
	}

	async setRange(r: string): Promise<void> {
		this.timeRange = r;
		this.historyLoading = true;
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const result = (await index.getHistory({
				pair: this.pair.code,
				start_date: rangeToStartDate(r),
				limit: rangeToLimit(r),
			})) as any;
			this.indexHistory = result?.data?.entries ?? [];
		} catch {
			// keep existing data on error
		} finally {
			this.historyLoading = false;
		}
	}
}
