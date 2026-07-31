import { KNOWN_BASES } from '$lib/constants/currency';

export function parsePairCode(code: string): { base: string; quote: string } {
	const lower = code.toLowerCase();
	if (lower.includes('-')) {
		const [base, quote] = lower.split('-');
		return { base, quote };
	}
	for (const len of [4, 3]) {
		const candidate = lower.slice(0, len);
		if (KNOWN_BASES.includes(candidate)) {
			return { base: candidate, quote: lower.slice(len) };
		}
	}
	const mid = Math.floor(code.length / 2);
	return { base: lower.slice(0, mid), quote: lower.slice(mid) };
}
