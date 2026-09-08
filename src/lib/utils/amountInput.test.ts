import { describe, it, expect } from 'vitest';
import {
	sanitizeAmountInput,
	formatAmountInput,
	countSignificant,
	caretPositionAfterFormat,
	parseAmountInput
} from './amountInput';

/**
 * Simulates a keystroke the way the browser delivers it: the field's value with the
 * new character already spliced in at the caret. Returns what the user would then
 * see and where their caret would sit.
 */
function type(current: string, caret: number, char: string) {
	const raw = current.slice(0, caret) + char + current.slice(caret);
	const significant = countSignificant(raw.slice(0, caret + char.length));
	const formatted = formatAmountInput(raw);

	return { value: formatted, caret: caretPositionAfterFormat(formatted, significant) };
}

describe('sanitizeAmountInput', () => {
	it('keeps digits and a single decimal point', () => {
		expect(sanitizeAmountInput('1234.56')).toBe('1234.56');
		expect(sanitizeAmountInput('1,234.56')).toBe('1234.56');
	});

	it('drops everything else, including a second point', () => {
		expect(sanitizeAmountInput('1a2b3')).toBe('123');
		expect(sanitizeAmountInput('1.2.3')).toBe('1.23');
		expect(sanitizeAmountInput('$1,000 USD')).toBe('1000');
	});
});

describe('formatAmountInput', () => {
	it('groups the integer part in threes', () => {
		expect(formatAmountInput('1000')).toBe('1,000');
		expect(formatAmountInput('1000000')).toBe('1,000,000');
		expect(formatAmountInput('100')).toBe('100');
	});

	it('leaves the fraction ungrouped', () => {
		expect(formatAmountInput('1234.5678')).toBe('1,234.5678');
	});

	it('preserves a trailing point so the decimal is typable', () => {
		expect(formatAmountInput('1000.')).toBe('1,000.');
	});

	it('does not rewrite the digits the user typed', () => {
		// Round-tripping through Number would turn this into "7" under the caret.
		expect(formatAmountInput('007')).toBe('007');
	});

	it('is idempotent over its own output', () => {
		expect(formatAmountInput(formatAmountInput('1234567'))).toBe('1,234,567');
	});

	it('returns empty for an emptied field', () => {
		expect(formatAmountInput('')).toBe('');
		expect(formatAmountInput('abc')).toBe('');
	});
});

describe('caret tracking', () => {
	it('keeps the caret at the end while typing a number straight through', () => {
		let state = { value: '', caret: 0 };

		for (const char of '1000000') {
			state = type(state.value, state.caret, char);
		}

		expect(state.value).toBe('1,000,000');
		// Caret at the end, not stranded before an inserted comma.
		expect(state.caret).toBe(state.value.length);
	});

	it('steps over a comma inserted to the left of the caret', () => {
		// "100" with the caret at the end; typing "0" makes it "1,000".
		const next = type('100', 3, '0');

		expect(next.value).toBe('1,000');
		expect(next.caret).toBe(5);
	});

	it('holds position when editing mid-string', () => {
		// "1,000" caret after the "1"; typing "2" gives "12,000" with the caret after the 2.
		const next = type('1,000', 1, '2');

		expect(next.value).toBe('12,000');
		expect(next.caret).toBe(2);
		expect(next.value.slice(0, next.caret)).toBe('12');
	});

	it('lands after the decimal point when one is typed', () => {
		const next = type('1000', 4, '.');

		expect(next.value).toBe('1,000.');
		expect(next.caret).toBe(next.value.length);
	});

	it('clamps to the start of an empty field', () => {
		expect(caretPositionAfterFormat('', 0)).toBe(0);
		expect(caretPositionAfterFormat('1,000', 0)).toBe(0);
	});

	it('clamps to the end when more significant characters are claimed than exist', () => {
		expect(caretPositionAfterFormat('1,000', 99)).toBe(5);
	});
});

describe('parseAmountInput', () => {
	it('reads the number back out of a formatted field', () => {
		expect(parseAmountInput('1,000')).toBe(1000);
		expect(parseAmountInput('1,234.56')).toBe(1234.56);
	});

	it('is NaN for an incomplete entry', () => {
		expect(parseAmountInput('')).toBeNaN();
		expect(parseAmountInput('.')).toBeNaN();
	});

	it('tolerates a trailing point mid-typing', () => {
		expect(parseAmountInput('1,000.')).toBe(1000);
	});
});
