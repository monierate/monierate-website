import type { FaqEntry } from '$lib/utils/seo';
import type { MarketName } from '$lib/services/globalRate.service';
import { shortDisclosure, disclosureFaq, FEES_NOTE } from '$lib/constants/disclosure';
import { bestQuote, type ExchangeQuote } from '$lib/utils/converterQuotes';

/**
 * Generated copy for the converter pages.
 *
 * Written from the figures the loader already holds, for the same reason
 * `pairContent.ts` is: there are far too many conversions to hand-write, and copy
 * derived from the live numbers cannot drift away from the numbers rendered next to
 * it. The `faqs` array feeds both the rendered questions and the FAQPage JSON-LD, so
 * the two can never disagree — which is the thing Google actually penalises.
 *
 * Answers are plain text: `faqPageJsonLd` puts the string straight into
 * `acceptedAnswer.text`, where markup is worse than useless.
 */

export interface ConverterContentInput {
	amount: number;
	/** Uppercase codes. */
	from: string;
	to: string;
	fromName: string;
	toName: string;
	toSymbol: string;
	/** 1 `from` = `rate` `to`. Zero means we have no rate. */
	rate: number;
	market: MarketName | null;
	updatedAt: number | null;
	exchanges: ExchangeQuote[];
}

export interface ConverterContent {
	intro: string;
	faqs: FaqEntry[];
	ladderNote: string;
}

const money = (symbol: string, value: number, decimals = 2): string =>
	`${symbol}${value.toLocaleString('en-US', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	})}`;

/**
 * A figure that always carries its unit, and never carries it twice.
 *
 * `₦137,423.30 NGN` is redundant; a bare `137,423.30` for a currency with no symbol
 * is ambiguous. The symbol wins where there is one, the code stands in where there
 * is not.
 */
export function moneyWithUnit(
	symbol: string,
	code: string,
	value: number,
	decimals = conversionDecimals(value)
): string {
	const figure = value.toLocaleString('en-US', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	});

	return symbol ? `${symbol}${figure}` : `${figure} ${code}`;
}

const amountLabel = (value: number): string => value.toLocaleString('en-US');

const stamp = (updatedAt: number | null): string =>
	updatedAt
		? new Date(updatedAt).toLocaleString('en-US', {
				dateStyle: 'medium',
				timeStyle: 'short',
				timeZone: 'UTC'
			}) + ' UTC'
		: 'the last update';

/**
 * How many decimals a conversion deserves.
 *
 * A naira figure wants 2; 0.06 GBP wants more than "0.06" before it stops saying
 * anything. Driven off magnitude rather than currency so it works for a pair we
 * hold no metadata for.
 *
 * Magnitude, not sign: a −500 difference is a hundreds-sized number and wants 2
 * decimals like any other, not the 8 an unguarded comparison would give it. Zero
 * likewise — "₦0.00000000" is noise where "₦0.00" is an answer.
 */
export function conversionDecimals(value: number): number {
	const magnitude = Math.abs(value);

	if (magnitude === 0) return 2;
	if (magnitude >= 100) return 2;
	if (magnitude >= 1) return 4;
	if (magnitude >= 0.01) return 6;
	return 8;
}

const MARKET_PHRASE: Record<MarketName, string> = {
	parallel: 'parallel market',
	mid: 'mid-market'
};

export function buildConverterContent(input: ConverterContentInput): ConverterContent {
	const { amount, from, to, fromName, toName, toSymbol, rate, market, updatedAt, exchanges } =
		input;

	const faqs: FaqEntry[] = [];

	if (!rate || !market) {
		return {
			intro:
				`Monierate does not currently hold a ${from} to ${to} rate. The pair is either outside ` +
				`the corridors we track or its feed has gone quiet — rather than show a stale number, ` +
				`we show none.`,
			faqs,
			ladderNote: shortDisclosure(from)
		};
	}

	const converted = rate * amount;
	const decimals = conversionDecimals(converted);
	const phrase = MARKET_PHRASE[market];

	// Amounts attach to the code, never to the currency name: "100 US Dollar" is
	// wrong and "100 US Dollars" cannot be generated safely (Naira and Yen do not
	// take an -s, and "British Pounds Sterling" is its own trap). The full names
	// still carry the page — they are in the title, the H1 and the info cards.
	const intro =
		`${amountLabel(amount)} ${from} converts to ${money(toSymbol, converted, decimals)} ` +
		`at the ${phrase} rate of ${money(toSymbol, rate, conversionDecimals(rate))} per ${from}, ` +
		`as of ${stamp(updatedAt)}. ` +
		(exchanges.length
			? `Monierate tracks ${exchanges.length} ${exchanges.length === 1 ? 'platform' : 'platforms'} ` +
				`quoting this conversion, so the table below shows what each one would actually pay you ` +
				`for ${amountLabel(amount)} ${from} rather than a single headline number.`
			: `No exchange on Monierate currently quotes this pair directly, so the figure above is the ` +
				`${phrase} reference rate.`);

	/* --- The literal query the page should answer --- */
	faqs.push({
		question: `How much is ${amountLabel(amount)} ${from} in ${to}?`,
		answer:
			`${amountLabel(amount)} ${from} (${fromName}) is ${money(toSymbol, converted, decimals)} ` +
			`in ${toName} at the ${phrase} rate of ` +
			`${money(toSymbol, rate, conversionDecimals(rate))} per ${from}, last updated ` +
			`${stamp(updatedAt)}. ${FEES_NOTE}`
	});

	/* --- The thing a single-rate converter cannot answer --- */
	// The genuine maximum, not the first row: contributors are ranked ahead of
	// everyone else, so the top of the table is the best trusted quote rather than
	// the highest number. Naming the wrong platform here would contradict the
	// figures rendered directly beneath it.
	const best = bestQuote(exchanges);
	if (best) {
		const worst = exchanges.reduce((low, q) => (q.received < low.received ? q : low), best);
		const spread = best.received - worst.received;

		faqs.push({
			question: `Which platform gives the best ${from} to ${to} rate?`,
			answer:
				`Of the ${exchanges.length} platforms Monierate tracks for ${from}/${to}, ${best.name} ` +
				`currently pays the most: ${money(toSymbol, best.received, decimals)} for ` +
				`${amountLabel(amount)} ${from}, at ${money(toSymbol, best.rate, conversionDecimals(best.rate))} ` +
				`per ${from}.` +
				(exchanges.length > 1 && spread > 0
					? ` That is ${money(toSymbol, spread, decimals)} more than the lowest quote in the ` +
						`table, which is the difference choosing a platform makes on this amount.`
					: '') +
				` ${FEES_NOTE}`
		});
	}

	/* --- Why our number differs from the one Google shows --- */
	faqs.push({
		question: `Why is the ${from} to ${to} rate here different from Google's?`,
		answer:
			market === 'parallel'
				? `Google quotes the mid-market rate — the midpoint of the interbank market, which is a ` +
					`reference number rather than a rate you can transact at. Monierate leads with the ` +
					`parallel market rate for ${from}/${to}: what desks and exchanges are actually quoting, ` +
					`aggregated across the platforms we track. The two diverge whenever official and street ` +
					`pricing diverge.`
				: `Both are mid-market rates, so they should be close. Any difference is timing — our ` +
					`snapshot is stamped ${stamp(updatedAt)} — or the source: no two providers sample the ` +
					`interbank market at exactly the same instant.`
	});

	faqs.push({
		question: `How often does the ${from} to ${to} rate update?`,
		answer:
			market === 'parallel'
				? `Continuously. Parallel market rates are rebuilt from the quotes the platforms we track ` +
					`publish, and a quote that stops moving for a day is dropped rather than shown as ` +
					`current. This page was built from data stamped ${stamp(updatedAt)}.`
				: `Mid-market rates refresh through the trading day. This page was built from data stamped ` +
					`${stamp(updatedAt)}.`
	});

	const disclosure = disclosureFaq(from, to);
	if (disclosure) faqs.push(disclosure);

	return { intro, faqs, ladderNote: shortDisclosure(from) };
}
