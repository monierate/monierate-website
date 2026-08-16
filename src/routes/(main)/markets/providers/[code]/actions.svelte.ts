import { getRateHistory, type DailySnapshot } from '$lib/services/rates.service';
import { CURRENCY_SYMBOLS } from '$lib/constants/currency';
import { parsePairCode } from '$lib/utils/pairs';

export const RANGES = ['7d', '30d', '60d', '90d'] as const;
export type Range = (typeof RANGES)[number];
export type TableRange = Range | 'all';

const DAYS_MAP: Record<Range, number> = { '7d': 7, '30d': 30, '60d': 60, '90d': 90 };

/** Rows per OHLC table page. */
export const TABLE_PAGE_SIZE = 20;

interface InitData {
	code: string;
	supportedPairCodes: string[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	providerCurrentRates: any[];
	initialPairCode: string | null;
	initialHistory: DailySnapshot[];
	/** First page of the OHLC table, fetched server-side alongside initialHistory. */
	initialTableRows?: DailySnapshot[];
	/** True row count for the selected window, from the API's pagination envelope. */
	initialTableTotal?: number;
}

export class ProviderProfileActions {
	readonly code: string;
	readonly supportedPairCodes: string[];

	selectedPair = $state<string>('');
	selectedRange = $state<Range>('30d');
	history = $state<DailySnapshot[]>([]);
	historyLoading = $state(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	providerCurrentRates = $state<any[]>([]);

	// OHLC table — paginated server-side (real `total`, one page fetched at a
	// time) and on its own date window, decoupled from the chart's range pills
	// (though still scoped to whichever pair is selected above).
	tableRange = $state<TableRange>('30d');
	tableRows = $state<DailySnapshot[]>([]);
	tableTotal = $state(0);
	tablePage = $state(1);
	tableLoading = $state(false);

	convertSend = $state('1');
	convertReceive = $state('');
	lastEdited = $state<'send' | 'receive'>('send');
	convertDir = $state<'buy' | 'sell'>('buy');
	convertSwapped = $state(false);

	constructor(data: InitData) {
		this.code = data.code;
		this.supportedPairCodes = data.supportedPairCodes;
		this.selectedPair = data.initialPairCode ?? '';
		this.history = data.initialHistory;
		this.tableRows = data.initialTableRows ?? [];
		this.tableTotal = data.initialTableTotal ?? 0;
		this.providerCurrentRates = data.providerCurrentRates;
	}

	get currentRate() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return this.providerCurrentRates.find((r: any) => r.pair === this.selectedPair) ?? null;
	}

	get parsedPair(): { base: string; quote: string; symbol: string } {
		if (!this.selectedPair) return { base: '', quote: '', symbol: '' };
		const { base, quote } = parsePairCode(this.selectedPair);
		return {
			base: base.toUpperCase(),
			quote: quote.toUpperCase(),
			symbol: CURRENCY_SYMBOLS[quote] ?? ''
		};
	}

	get chartData(): { dateLabel: string; open: number; close: number; high: number; low: number }[] {
		return this.history.map((s) => ({
			dateLabel: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
			open: s.open,
			close: s.close,
			high: s.high,
			low: s.low
		}));
	}

	readonly chartSeries = [
		{ key: 'close', label: 'Close', color: '#6366f1', fill: true },
		{ key: 'open', label: 'Open', color: '#f59e0b', fill: false, dashed: true },
		{ key: 'high', label: 'High', color: '#10b981', fill: false, dashed: true },
		{ key: 'low', label: 'Low', color: '#f43f5e', fill: false, dashed: true }
	];

	get activeRateValue(): number {
		const rate = this.currentRate;
		if (!rate) return 0;
		return this.convertDir === 'buy' ? rate.rate_buy || rate.rate_mid || 0 : rate.rate_sell || rate.rate_mid || 0;
	}

	private fmtDisplay(raw: string): string {
		if (!raw) return '';
		const dotIdx = raw.indexOf('.');
		if (dotIdx === -1) {
			const n = parseInt(raw, 10);
			return isNaN(n) ? '' : n.toLocaleString('en-US');
		}
		const intPart = parseInt(raw.slice(0, dotIdx), 10);
		const decPart = raw.slice(dotIdx + 1);
		return `${isNaN(intPart) ? '0' : intPart.toLocaleString('en-US')}.${decPart}`;
	}

	get sendDisplay(): string {
		if (this.lastEdited === 'send') return this.fmtDisplay(this.convertSend);
		const rate = this.activeRateValue;
		if (!rate) return '';
		const num = parseFloat(this.convertReceive) || 0;
		const result = this.convertSwapped ? num * rate : num / rate;
		return result > 0 ? result.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '';
	}

	get receiveDisplay(): string {
		if (this.lastEdited === 'receive') return this.fmtDisplay(this.convertReceive);
		const rate = this.activeRateValue;
		if (!rate) return '';
		const num = parseFloat(this.convertSend) || 0;
		const result = this.convertSwapped ? num / rate : num * rate;
		return result > 0 ? result.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '';
	}

	handleSendInput(val: string) {
		this.convertSend = val.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
		this.lastEdited = 'send';
	}

	handleReceiveInput(val: string) {
		this.convertReceive = val.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
		this.lastEdited = 'receive';
	}

	toggleSwap() {
		const newSend = this.lastEdited === 'receive' ? this.convertReceive : (this.receiveDisplay ?? '').replace(/,/g, '');
		this.convertSend = newSend;
		this.convertReceive = '';
		this.lastEdited = 'send';
		this.convertSwapped = !this.convertSwapped;
	}

	async selectPair(pair: string) {
		if (pair === this.selectedPair) return;
		this.selectedPair = pair;
		// New pair → both the chart's full range and the table's page 1 reload.
		await Promise.all([this.loadHistory(), this.loadTablePage(1)]);
	}

	async selectRange(range: Range) {
		if (range === this.selectedRange) return;
		this.selectedRange = range;
		await this.loadHistory();
	}

	async setTableRange(range: TableRange) {
		if (range === this.tableRange) return;
		this.tableRange = range;
		await this.loadTablePage(1);
	}

	// `'all'` omits the date bounds entirely — the table's own unrestricted
	// history, as opposed to the chart's fixed 7d/30d/60d/90d windows.
	private windowFor(range: TableRange): { start_date?: string; end_date?: string } {
		if (range === 'all') return {};
		const days = DAYS_MAP[range];
		const end = new Date();
		const start = new Date(end.getTime() - days * 86_400_000);
		const fmtDate = (d: Date) => d.toISOString().split('T')[0];
		return { start_date: fmtDate(start), end_date: fmtDate(end) };
	}

	async loadHistory() {
		if (!this.selectedPair) return;
		this.historyLoading = true;
		try {
			const res = await getRateHistory(fetch, {
				pair: this.selectedPair,
				provider_id: this.code,
				...this.windowFor(this.selectedRange),
				limit: 200
			});
			this.history = res?.snapshots ?? [];
		} catch {
			this.history = [];
		} finally {
			this.historyLoading = false;
		}
	}

	// Fetches one page of the OHLC table directly from the API's own pagination
	// (page/limit in, total/count out) instead of slicing a client-held array —
	// `tableTotal` stays accurate even when the window holds more rows than any
	// single page fetch would.
	async loadTablePage(page: number) {
		if (!this.selectedPair) return;
		this.tableLoading = true;
		try {
			const res = await getRateHistory(fetch, {
				pair: this.selectedPair,
				provider_id: this.code,
				...this.windowFor(this.tableRange),
				page,
				limit: TABLE_PAGE_SIZE
			});
			this.tableRows = res?.snapshots ?? [];
			this.tableTotal = res?.total ?? 0;
			this.tablePage = page;
		} catch {
			this.tableRows = [];
			this.tableTotal = 0;
		} finally {
			this.tableLoading = false;
		}
	}
}
