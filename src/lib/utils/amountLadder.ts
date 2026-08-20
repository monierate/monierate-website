/**
 * The amounts Wise and XE both ladder on their pair pages. Kept as one shared
 * list so the forward and reverse tables stay symmetrical.
 */
export const LADDER_AMOUNTS = [
	1, 5, 10, 20, 50, 100, 250, 500, 1_000, 2_000, 5_000, 10_000
] as const;

export interface LadderRow {
	amount: number;
	converted: number;
}

/**
 * Multiply the ladder through a rate.
 *
 * The point of this table is that the answers sit in the HTML: a converter input
 * can never rank for "how much is 500 dollars in naira", because the answer only
 * exists once somebody types. Returns [] for a missing or zero rate rather than a
 * column of zeroes.
 */
export function ladderRows(rate: number): LadderRow[] {
	if (!rate || rate <= 0) return [];
	return LADDER_AMOUNTS.map((amount) => ({ amount, converted: amount * rate }));
}

/** The same ladder the other way round — quote currency back into the base. */
export function reverseLadderRows(rate: number): LadderRow[] {
	if (!rate || rate <= 0) return [];
	return LADDER_AMOUNTS.map((amount) => ({ amount, converted: amount / rate }));
}

/**
 * One decimal precision for a whole ladder column, chosen from its smallest row.
 *
 * Deliberately per-table rather than per-value: picking decimals row by row gives
 * a column that reads $0.0143 / $1.432 / $7.161, where the decimal points don't
 * line up and the eye can't compare magnitudes. Driving it off the smallest row
 * keeps the smallest conversion meaningful — the reverse direction on a weak quote
 * currency lands in the thousandths — and every larger row just carries the same
 * places. Capped at 6 so a very weak currency can't run the column off the edge.
 */
export function ladderDecimals(values: number[]): number {
	const positive = values.filter((v) => v > 0);
	if (!positive.length) return 2;

	const smallest = Math.min(...positive);
	if (smallest >= 100) return 2;
	if (smallest >= 1) return 3;
	if (smallest >= 0.01) return 4;
	return 6;
}
