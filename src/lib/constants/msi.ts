import type { PremiumLevel, Position } from '$lib/services/currency/v1/spread';

// Kill switch for every AI-generated market summary surface (Spread page
// "What this means", MarketReadPanel on Overview/pair/Volatility). Disabled
// while backend generation is paused (no Anthropic credits) — flip to true
// once generation resumes.
export const MARKET_READ_ENABLED = false;

// Mirror of the backend MSI_LEVELS (currency-api src/modules/v1/msi.constants.ts).
// Keep the key/min/max/tone in sync — they are the same source of truth across the
// boundary. `rangeLabel` and `meaning` are presentation-only (frontend) copy that
// explains each band to users. Ranges are [min, max): a score exactly on a boundary
// falls into the higher band.
export const MSI_LEVELS = [
	{
		key: 'tight',
		label: 'Tight',
		min: -Infinity,
		max: 2,
		tone: 'success',
		rangeLabel: '< 2%',
		meaning:
			'The market rate is nearly level with the CBN official rate — healthy FX liquidity and little room for arbitrage.'
	},
	{
		key: 'moderate',
		label: 'Moderate',
		min: 2,
		max: 4,
		tone: 'info',
		rangeLabel: '2–4%',
		meaning:
			'A normal, modest premium — typical market conditions with only mild dollar-demand pressure on the naira.'
	},
	{
		key: 'elevated',
		label: 'Elevated',
		min: 4,
		max: 8,
		tone: 'warning',
		rangeLabel: '4–8%',
		meaning:
			'A widening gap that signals rising dollar scarcity — the parallel market is pulling noticeably above the official rate.'
	},
	{
		key: 'crisis',
		label: 'Crisis',
		min: 8,
		max: Infinity,
		tone: 'danger',
		rangeLabel: '> 8%',
		meaning:
			'A severe gap pointing to acute FX scarcity or lost confidence — the official rate sits far below where the market actually clears.'
	}
] as const;

export type Tone = 'success' | 'info' | 'warning' | 'danger';

export const MSI_LEVEL_LABEL = Object.fromEntries(
	MSI_LEVELS.map((l) => [l.key, l.label])
) as Record<PremiumLevel, string>;

// Tone → concrete color, matching the palette used across the dashboard cards.
export const TONE_COLOR: Record<Tone, string> = {
	success: '#22c55e',
	info: '#3861fb',
	warning: '#f59e0b',
	danger: '#ef4444'
};

export const classifyTone = (level: PremiumLevel): Tone =>
	(MSI_LEVELS.find((l) => l.key === level)?.tone ?? 'info') as Tone;

// Position options for the "What this means" toggle (TDD §10.1). `watching` is
// the default; the same spread reads differently for each side.
export const POSITION_OPTIONS: { key: Position; label: string; hint: string }[] = [
	{ key: 'holding_usdt', label: 'Holding USDT', hint: 'You hold stablecoin dollars' },
	{ key: 'holding_naira', label: 'Holding Naira', hint: 'You hold naira' },
	{ key: 'watching', label: 'Watching', hint: 'Just following the market' }
];

export const DEFAULT_POSITION: Position = 'watching';

export const POSITION_LABEL = Object.fromEntries(
	POSITION_OPTIONS.map((p) => [p.key, p.label])
) as Record<Position, string>;

// Client-side classification of an arbitrary score (e.g. for chart band coloring).
// Trust the server's `premium_level` for the badge; use this only for derived UI.
export const classifyLevel = (msi: number): PremiumLevel =>
	(MSI_LEVELS.find((l) => msi >= l.min && msi < l.max)?.key ?? 'tight') as PremiumLevel;
