import type { ProviderRate } from '$lib/types';

// 'sell'/'buy' show a single headline rate; 'card' shows Deposit/Withdrawal columns.
export type HighlightMode = 'sell' | 'buy' | 'card';

export interface HighlightCard {
	// Slug of the matching HIGHLIGHT_DEFS entry — drives the "View all" route.
	slug: string;
	title: string;
	sublabel: string;
	providers: ProviderRate[];
	mode: HighlightMode;
	// Total providers in this highlight (the card only previews the first few).
	total?: number;
	// When true, the card is only shown for crypto/stablecoin bases (hidden on fiat pairs like USD/NGN).
	cryptoOnly?: boolean;
}
