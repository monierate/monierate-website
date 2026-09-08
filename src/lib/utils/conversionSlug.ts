import { LADDER_AMOUNTS } from '$lib/utils/amountLadder';

/**
 * The `/converter` URL grammar, in one place.
 *
 * Every conversion the site can answer needs a crawlable address, which the old
 * `?Amount=&From=&To=` form was not. The shape is:
 *
 *   /converter/usd-to-ngn         the pair page — canonical, and *is* the amount-1 page
 *   /converter/100-usd-to-ngn     an amount page
 *
 * `1-usd-to-ngn` deliberately does not exist as its own URL: it would say exactly
 * what `usd-to-ngn` says. {@link buildConversionSlug} folds it into the bare form
 * and the route redirects anything that arrives at the long one, so the pair page
 * and the amount-1 page can never compete with each other in the index.
 */

/** Lowercase, no separators — matches the currency codes the APIs return. */
const CODE = '[a-z0-9]{2,6}';

const SLUG = new RegExp(`^(?:(\\d+(?:\\.\\d+)?)-)?(${CODE})-to-(${CODE})$`);

/**
 * Above this an amount stops being a question anybody asks and starts being a
 * way to mint unbounded URLs. Also keeps the rendered figure inside the range
 * where a double is still exact to the cent.
 */
export const MAX_AMOUNT = 1_000_000_000_000;

export interface Conversion {
	amount: number;
	/** Lowercase currency codes. */
	from: string;
	to: string;
}

/**
 * The amounts that get their own indexable URL.
 *
 * Shared with the on-page ladder table on purpose: every row of that table links
 * to a URL that is itself indexable, so the internal linking and the indexing
 * policy cannot drift apart.
 */
export const LADDER_SET: ReadonlySet<number> = new Set<number>(LADDER_AMOUNTS);

export function isLadderAmount(amount: number): boolean {
	return LADDER_SET.has(amount);
}

/** Cheap shape test for the route matcher — no currency validation. */
export function isConversionSlug(slug: string): boolean {
	return SLUG.test(slug);
}

/**
 * Read a slug. Returns null for anything we would rather 404 than render: a
 * malformed slug, a non-positive or absurd amount, or a currency converted to
 * itself (a page whose answer is always "1", and 90 of them).
 */
export function parseConversionSlug(slug: string): Conversion | null {
	const match = SLUG.exec(slug);
	if (!match) return null;

	const [, rawAmount, from, to] = match;

	// A bare `usd-to-ngn` is the amount-1 page.
	const amount = rawAmount === undefined ? 1 : Number(rawAmount);

	if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) return null;
	if (from === to) return null;

	return { amount, from, to };
}

/**
 * The one spelling of a conversion we are willing to serve.
 *
 * Normalising here is what lets the route 301 `007-usd-to-ngn` and `1-usd-to-ngn`
 * onto their canonical forms instead of serving three URLs with one answer.
 */
export function buildConversionSlug(amount: number, from: string, to: string): string {
	const pair = `${from.toLowerCase()}-to-${to.toLowerCase()}`;
	return amount === 1 ? pair : `${amount}-${pair}`;
}

export function conversionPath(amount: number, from: string, to: string): string {
	return `/converter/${buildConversionSlug(amount, from, to)}`;
}

/** The pair page an amount page canonicals to when its amount is off-ladder. */
export function pairPath(from: string, to: string): string {
	return conversionPath(1, from, to);
}
