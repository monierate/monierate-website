import { classifyTone, MSI_LEVEL_LABEL, TONE_COLOR, type Tone } from '$lib/constants/msi';
import type { MsiCurrent, MsiHistory, MsiSources } from '$lib/services/currency/v1/spread';

export const RANGES = ['7d', '30d', '90d', '1y'] as const;

// Wraps the three MSI payloads into formatted, chart-ready values. Plain class
// (no runes) — instantiated once per render with the resolved load data.
export class MsiActions {
	constructor(
		readonly current: MsiCurrent | null,
		readonly history: MsiHistory | null,
		readonly sources: MsiSources | null
	) {}

	get hasCurrent(): boolean {
		return this.current !== null;
	}

	get score(): number | null {
		return this.current?.msi_score ?? null;
	}

	get levelLabel(): string {
		return this.current ? MSI_LEVEL_LABEL[this.current.premium_level] : '';
	}

	get tone(): Tone {
		return this.current ? classifyTone(this.current.premium_level) : 'info';
	}

	get toneColor(): string {
		return TONE_COLOR[this.tone];
	}

	get isStale(): boolean {
		return this.current?.stale ?? false;
	}

	// Chart.js-ready: a line of MSI over time plus a flat average reference line.
	get historyData(): { date: string; msi: number; avg: number }[] {
		const pts = this.history?.points ?? [];
		const avg = this.history?.stats.avg ?? 0;
		return pts.map((p) => ({ date: p.t, msi: p.msi, avg }));
	}

	get historyAvg(): number {
		return this.history?.stats.avg ?? 0;
	}

	get channels() {
		return this.sources?.channels ?? [];
	}

	get signals() {
		return this.sources?.signals ?? null;
	}
}
