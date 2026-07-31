import type { VolRegime } from '$lib/services/currency/v1/volatility';
import { TONE_COLOR, type Tone } from './msi';

// Mirror of the backend VOL_REGIMES (currency-api src/modules/v1/volatility.constants.ts).
// Regime keys + tone are the shared source of truth across the boundary.
export const VOL_REGIME_LABEL: Record<VolRegime, string> = {
	calm: 'Calm',
	normal: 'Normal',
	elevated: 'Elevated',
	turbulent: 'Turbulent'
};

export const VOL_REGIME_TONE: Record<VolRegime, Tone> = {
	calm: 'success',
	normal: 'info',
	elevated: 'warning',
	turbulent: 'danger'
};

export const volRegimeColor = (regime: VolRegime): string => TONE_COLOR[VOL_REGIME_TONE[regime]];
