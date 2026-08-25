/**
 * Standing disclosures for anywhere Monierate quotes a rate.
 *
 * Two separate claims, deliberately kept apart because they qualify on different
 * things:
 *
 * 1. **Digital dollars.** "USD" on Monierate is not a promise of physical or
 *    bank-held fiat. Plenty of the providers we track settle in stablecoins —
 *    USDT, USDC — and quote that as a dollar rate. Only applies to dollar-
 *    denominated bases; saying it on GBP/NGN would be nonsense.
 * 2. **Fees and information-only.** Providers charge swap, network and transfer
 *    fees inside their own app or API that never appear in a quoted rate, so no
 *    figure here is the amount somebody actually walks away with. Applies to
 *    every pair, dollar or not.
 *
 * Kept as one module so the wording cannot drift between the stat cards, the
 * ladder, the About copy and the FAQ.
 */

/**
 * `usd` only, and deliberately not `usdt` / `usdc`.
 *
 * The ambiguity this note exists to resolve is one-directional: "USD" might mean
 * fiat or might mean a stablecoin, so it needs saying. USDT and USDC are already
 * unambiguously stablecoins — asking "is this USDT fiat or a stablecoin?" on a
 * USDT page answers itself and reads as boilerplate.
 */
export function isDollarBase(code: string): boolean {
	return code.toLowerCase() === 'usd';
}

/** Applies everywhere: a quoted rate is not the final amount. */
export const FEES_NOTE =
	'Providers may charge additional swap, network or transfer fees in their own app or API that are not included in the rate shown, so these figures are for information purposes only.';

/** Applies to dollar-denominated bases only. */
export const DIGITAL_DOLLAR_NOTE =
	'A US Dollar balance on these providers may be a digital dollar — a stablecoin such as USDT or USDC — rather than physical or bank-held fiat USD.';

/**
 * One-line footnote for a data module (the ladder, the statistics table).
 * Compact by design: it sits under a table, not in place of the fuller copy.
 */
export function shortDisclosure(base: string): string {
	return isDollarBase(base) ? `${DIGITAL_DOLLAR_NOTE} ${FEES_NOTE}` : FEES_NOTE;
}

/** Fuller paragraph for the About section, naming the provider where there is one. */
export function longDisclosure(base: string, providerName?: string): string {
	const who = providerName ?? 'a provider';
	const dollars = isDollarBase(base)
		? `When Monierate shows a ${base.toUpperCase()} rate, the dollars ${who} actually holds or settles in may be digital dollars — stablecoins such as USDT or USDC — rather than physical or bank-held fiat USD, and the two are not always interchangeable. `
		: '';

	return (
		dollars +
		`${providerName ?? 'Providers'} may also charge swap, network or transfer fees inside ` +
		`${providerName ? 'its' : 'their'} own app or API which are not part of the quoted rate. ` +
		`Everything here is for information purposes only — confirm the final amount with ` +
		`${providerName ?? 'the provider'} before you trade.`
	);
}

/** The same ground, phrased as a question for the FAQ block and its JSON-LD. */
export function disclosureFaq(
	base: string,
	quote: string,
	providerName?: string
): { question: string; answer: string } | null {
	if (!isDollarBase(base)) return null;

	const B = base.toUpperCase();
	const who = providerName ?? 'providers';

	return {
		question: providerName
			? `Is ${providerName}'s ${B} a fiat dollar or a stablecoin?`
			: `Is this ${B} rate for fiat dollars or stablecoins?`,
		answer:
			`It can be either. Some ${who} quote physical or bank-held US Dollars, while others settle in ` +
			`digital dollars — stablecoins such as USDT or USDC — and quote that as a ${B} rate. Monierate ` +
			`lists both under ${B}/${quote.toUpperCase()}, so check which one ${providerName ?? 'the provider'} ` +
			`actually holds before you trade. ${FEES_NOTE}`
	};
}
