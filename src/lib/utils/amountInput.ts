/**
 * Thousand-separator formatting for the converter's amount field, as you type.
 *
 * Grouping while the caret is live is the part that goes wrong: inserting a comma
 * shifts every character after it, so a naive implementation sends the caret to the
 * end and typing "10000" comes out as "1,0000" or worse. The fix is to count
 * *significant* characters — digits and the decimal point, ignoring separators —
 * before the caret, then find the position after that many significant characters in
 * the formatted string.
 *
 * Kept pure and separate from the component so the caret arithmetic can be tested
 * without a DOM.
 */

/** Digits and at most one decimal point. Anything else a user pastes is dropped. */
export function sanitizeAmountInput(raw: string): string {
	return raw.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
}

/**
 * Group the integer part in threes, leaving the fraction alone.
 *
 * Digits are grouped rather than round-tripped through `Number`, which would rewrite
 * what the user typed — `007` would become `7` under the caret. A trailing `.` is
 * preserved too, because it is a legitimate intermediate state: stripping it makes
 * the decimal point impossible to type.
 */
export function formatAmountInput(raw: string): string {
	const cleaned = sanitizeAmountInput(raw);
	if (!cleaned) return '';

	const dot = cleaned.indexOf('.');
	const integer = dot === -1 ? cleaned : cleaned.slice(0, dot);
	const fraction = dot === -1 ? '' : cleaned.slice(dot + 1);

	const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	return dot === -1 ? grouped : `${grouped}.${fraction}`;
}

/** Characters that survive formatting — everything but the separators. */
export function countSignificant(value: string): number {
	return sanitizeAmountInput(value).length;
}

/**
 * Where the caret belongs in `formatted` after `significantBefore` significant
 * characters.
 *
 * Landing *after* the nth significant character rather than at index n is what keeps
 * typing continuous across a newly inserted comma: type `1000` and the caret sits
 * after the final `0` of `1,000`, not between the comma and the `0`.
 */
export function caretPositionAfterFormat(formatted: string, significantBefore: number): number {
	if (significantBefore <= 0) return 0;

	let seen = 0;

	for (let i = 0; i < formatted.length; i++) {
		if (formatted[i] !== ',') seen++;
		if (seen === significantBefore) return i + 1;
	}

	return formatted.length;
}

/** The number a formatted field represents. `NaN` for an incomplete entry like `.`. */
export function parseAmountInput(value: string): number {
	return parseFloat(sanitizeAmountInput(value));
}
