import { isUsableQuote } from '$lib/utils/pairs';

/**
 * Turning a pair's changer quotes into "what you actually get for your $100".
 *
 * This is the part XE has no answer for. XE shows one number; a visitor converting
 * 100 USD to NGN wants to know that Quidax pays ₦2,100 more than the platform below
 * it. So every quote is restated in the same units as the headline — quote currency
 * per one unit of `from` — and then simply multiplied through the amount.
 *
 * ## Which side of the book
 *
 * The codebase convention is user-facing, not desk-facing: for pair `usdngn`,
 * `price_buy` is what you pay to *buy* USD and `price_sell` is what you receive
 * *selling* it. Both sit on the visitor's losing side of mid (grey quotes
 * buy 1415 / sell 1350 against a 1374 mid), which is what confirms the reading.
 *
 * So the side depends on which way the URL runs relative to the pair document:
 *
 * - `usd-to-ngn` against pair `usdngn` — the visitor is selling USD, so `price_sell`,
 *   and they receive `amount × price_sell`.
 * - `ngn-to-usd` against the same pair — the visitor is buying USD, so `price_buy`,
 *   and they receive `amount ÷ price_buy`.
 *
 * Restating both as "quote per one `from`" means one sort order — highest first is
 * best for the visitor — covers both directions.
 */

export interface ChangerMeta {
	code: string;
	name?: string;
	icon?: string;
	link?: string;
	changer_tags?: string[];
	is_active?: boolean;
	is_public?: boolean;
}

export interface RawQuote {
	changer_code: string;
	is_active?: boolean;
	is_public?: boolean;
	price_buy?: number;
	price_sell?: number;
	updated_at?: string;
}

export interface ExchangeQuote {
	code: string;
	name: string;
	logo: string;
	link: string;
	/** Quote-currency units per one `from` unit — directly comparable to the headline. */
	rate: number;
	/** What the visitor receives for the entered amount. */
	received: number;
	/** Signed difference against the headline payout, in `to` units. */
	delta: number;
	deltaPct: number;
	updatedAt: string | null;
	tags: string[];
	/** Feeds this pair's composite index — ranked above everyone else. */
	isContributor: boolean;
}

/**
 * `market` is the synthetic aggregate the headline is already built from, so listing
 * it would show the visitor the same number twice under a provider's name. `binance`
 * is withheld the same way the rest of the site withholds it (see `ChangerRates.svelte`).
 */
const EXCLUDED = new Set(['market', 'binance']);

export interface BuildQuotesInput {
	quotes: RawQuote[];
	/** Changer metadata keyed by code — names and logos for the rows. */
	changers: Record<string, ChangerMeta>;
	/** The pair document's own code, e.g. `usdngn`. */
	pairCode: string;
	/** Lowercase slug direction. */
	from: string;
	to: string;
	amount: number;
	/** Headline rate, in `to` per `from`, that each row is compared against. */
	headlineRate: number;
	/** `pair.index_contributors` — the platforms this pair's composite index is built from. */
	contributors?: string[];
}

export function buildExchangeQuotes(input: BuildQuotesInput): ExchangeQuote[] {
	const { quotes, changers, pairCode, from, to, amount, headlineRate } = input;

	const forward = pairCode.toLowerCase() === `${from}${to}`.toLowerCase();
	const side = forward ? 'price_sell' : 'price_buy';

	const headlinePayout = headlineRate > 0 ? headlineRate * amount : 0;

	const contributors = new Set((input.contributors ?? []).map((c) => c.toLowerCase()));

	const rows: ExchangeQuote[] = [];

	for (const quote of quotes ?? []) {
		const code = quote?.changer_code;
		if (!code || EXCLUDED.has(code.toLowerCase())) continue;

		// Withheld and dormant quotes never reach the table. The `/api/pairs/get_pair`
		// proxy already drops non-public entries, but the rule is restated here rather
		// than inherited: this is the last point before a rate is rendered as a payout
		// somebody may act on, and it must not depend on a filter one layer up staying
		// where it is.
		if (quote.is_public === false || quote.is_active === false) continue;

		const meta = changers[code];
		// No name and no logo means nothing renderable — a bare code in a comparison
		// table is noise, not a provider. A delisted provider is dropped for the same
		// reason its quote would be.
		if (!meta || meta.is_active === false || meta.is_public === false) continue;

		const price = Number(quote[side] ?? 0);
		// `isUsableQuote` re-checks is_active and adds the freshness bar.
		if (!isUsableQuote(quote) || !(price > 0)) continue;

		// Restated into the headline's units so the two are comparable.
		const rate = forward ? price : 1 / price;
		const received = rate * amount;

		const delta = headlinePayout > 0 ? received - headlinePayout : 0;

		rows.push({
			code,
			name: meta.name ?? code.charAt(0).toUpperCase() + code.slice(1),
			logo: meta.icon ?? '',
			link: meta.link ?? '',
			rate,
			received,
			delta,
			deltaPct: headlinePayout > 0 ? (delta / headlinePayout) * 100 : 0,
			updatedAt: quote.updated_at ?? null,
			tags: meta.changer_tags ?? [],
			isContributor: contributors.has(code.toLowerCase())
		});
	}

	/**
	 * Two tiers, not one ranking.
	 *
	 * Index contributors are the platforms whose quotes we trust enough to build the
	 * pair's composite rate from, so they lead regardless of price — a better number
	 * from a platform outside that set never appears above them. Within each tier the
	 * order is still best payout first, which is what restating the rate bought us.
	 *
	 * This is why the table carries no "best" badge and why its subtitle does not
	 * claim best-first ordering: the first row is the best *trusted* rate, which is
	 * not always the highest number on screen.
	 */
	return rows.sort((a, b) => {
		if (a.isContributor !== b.isContributor) return a.isContributor ? -1 : 1;
		return b.rate - a.rate;
	});
}

/**
 * The highest payout on offer, whatever tier it sits in.
 *
 * Separate from row order on purpose: with contributors ranked first, `quotes[0]`
 * is the best *trusted* quote rather than the best one, so anything comparing
 * against "the best" — the vs-best column, the FAQ answer — has to ask for it
 * rather than read the top of the list.
 */
export function bestQuote(quotes: ExchangeQuote[]): ExchangeQuote | null {
	return quotes.reduce<ExchangeQuote | null>(
		(best, quote) => (!best || quote.rate > best.rate ? quote : best),
		null
	);
}
