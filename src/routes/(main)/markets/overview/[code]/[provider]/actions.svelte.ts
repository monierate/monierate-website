import { getRateHistory, type DailySnapshot } from '$lib/services/rates.service';
import { CURRENCY_SYMBOLS } from '$lib/constants/currency';
import { parsePairCode } from '$lib/utils/pairs';

export const RANGES = ['7d', '30d', '60d', '90d'] as const;
export type Range = (typeof RANGES)[number];

const DAYS_MAP: Record<Range, number> = { '7d': 7, '30d': 30, '60d': 60, '90d': 90 };

export interface InsightInitData {
	pairCode: string;
	providerCode: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	currentRate: any | null;
	initialHistory: DailySnapshot[];
}

export class ProviderPairInsightActions {
	readonly pairCode: string;
	readonly providerCode: string;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	currentRate = $state<any | null>(null);
	selectedRange = $state<Range>('30d');
	history = $state<DailySnapshot[]>([]);
	historyLoading = $state(false);

	convertSend = $state('1');
	convertReceive = $state('');
	lastEdited = $state<'send' | 'receive'>('send');
	convertDir = $state<'buy' | 'sell'>('buy');
	convertSwapped = $state(false);

	constructor(data: InsightInitData) {
		this.pairCode = data.pairCode;
		this.providerCode = data.providerCode;
		this.currentRate = data.currentRate;
		this.history = data.initialHistory ?? [];
	}

	get parsedPair(): { base: string; quote: string; symbol: string } {
		const { base, quote } = parsePairCode(this.pairCode);
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

	// High/low across the loaded range — feeds the "X-duration highest/lowest" stats.
	get rangeHigh(): number {
		const highs = this.history.map((s) => s.high).filter((v) => v > 0);
		return highs.length ? Math.max(...highs) : 0;
	}

	get rangeLow(): number {
		const lows = this.history.map((s) => s.low).filter((v) => v > 0);
		return lows.length ? Math.min(...lows) : 0;
	}

	// --- Quick converter (pair-agnostic; mirrors the provider-profile converter) ---

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

	async selectRange(range: Range) {
		if (range === this.selectedRange) return;
		this.selectedRange = range;
		await this.loadHistory();
	}

	async loadHistory() {
		this.historyLoading = true;
		try {
			const days = DAYS_MAP[this.selectedRange];
			const end = new Date();
			const start = new Date(end.getTime() - days * 86_400_000);
			const fmtDate = (d: Date) => d.toISOString().split('T')[0];

			const res = await getRateHistory(fetch, {
				pair: this.pairCode,
				provider_id: this.providerCode,
				start_date: fmtDate(start),
				end_date: fmtDate(end),
				limit: 200
			});
			this.history = res?.snapshots ?? [];
		} catch {
			this.history = [];
		} finally {
			this.historyLoading = false;
		}
	}
}
