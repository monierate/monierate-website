import currencies from '$data/currencies.json';
import type { FaqEntry } from '$lib/utils/seo';
import type { PeriodStat } from '$lib/utils/rateStats';
import { longDisclosure, shortDisclosure, disclosureFaq } from '$lib/constants/disclosure';

/**
 * Prose and FAQ copy for the pair and pair×provider pages.
 *
 * Everything is generated from figures the loaders already hold, for two reasons:
 * 89 pairs is far too many to hand-write, and copy derived from the live series
 * cannot drift away from the numbers rendered beside it. The same `faqs` array
 * feeds both the rendered questions and the FAQPage JSON-LD, so the two can never
 * disagree — which is the thing Google penalises.
 *
 * Answers are plain text on purpose: `faqPageJsonLd` puts the string straight into
 * `acceptedAnswer.text`, and markup there is worse than useless.
 */

const NAMES: Record<string, string> = { ...currencies.fiat, ...currencies.coins };

/** Full display name for a currency code, falling back to the code itself. */
export function currencyName(code: string): string {
	return NAMES[code.toUpperCase()] ?? code.toUpperCase();
}

export interface PairContentInput {
	/** Lowercase pair slug, e.g. `usdngn` — used to build the onward link. */
	pairCode: string;
	/** Uppercase codes, e.g. USD / NGN. */
	base: string;
	quote: string;
	/** Quote symbol, e.g. ₦. */
	symbol: string;
	/** Mid rate. Everything keys off this; zero suppresses the rate-dependent copy. */
	rate: number;
	buy?: number;
	sell?: number;
	spread?: number;
	stats: PeriodStat[];
	/** Providers quoting this pair — pair page only, and only when known. */
	providerCount?: number;
	/** Set on the pair×provider page; omit for the composite pair page. */
	provider?: { code: string; name: string };
	/** Whether `rate` is a live quote or the last sealed daily close. */
	rateBasis?: 'live' | 'daily';
	/** ISO date the rate is effective for, when `rateBasis` is `'daily'`. */
	asOf?: string | null;
}

const money = (symbol: string, value: number, decimals = 2): string =>
	`${symbol}${value.toLocaleString('en-US', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	})}`;

const pct = (value: number): string => `${Math.abs(value).toFixed(2)}%`;

const longDate = (iso: string): string =>
	new Date(iso).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});

const findStat = (stats: PeriodStat[], days: number): PeriodStat | undefined =>
	stats.find((s) => s.days === days);

/**
 * The range sentence XE renders alongside its statistics table. Written as prose
 * rather than a grid because a sentence is what gets lifted into an answer box.
 */
export function rangeSentence(input: PairContentInput, days = 30): string | null {
	const stat = findStat(input.stats, days);
	if (!stat) return null;

	const { base, quote, symbol } = input;
	const direction = stat.changePct >= 0 ? 'up' : 'down';

	return (
		`Over the last ${days} days, ${base}/${quote} moved between ` +
		`${money(symbol, stat.low)} and ${money(symbol, stat.high)}, averaging ` +
		`${money(symbol, stat.average)} and finishing ${direction} ${pct(stat.changePct)}.`
	);
}

/** Prose paragraphs for the "About" section. Three at most — this is context, not an essay. */
export function buildAbout(input: PairContentInput): string[] {
	const { base, quote, symbol, rate, provider, providerCount } = input;
	const baseName = currencyName(base);
	const quoteName = currencyName(quote);
	const paragraphs: string[] = [];

	if (provider) {
		const cadence =
			input.rateBasis === 'daily'
				? `publishes this pair once a day${input.asOf ? `, most recently on ${longDate(input.asOf)}` : ''}`
				: 'updates this pair continuously';

		let opening = `${provider.name} ${cadence}.`;
		if (rate > 0) {
			opening =
				`${provider.name} ${cadence}, currently pricing 1 ${base} at about ` +
				`${money(symbol, rate)}.`;
		}
		paragraphs.push(opening);

		if (input.buy && input.sell) {
			const gap = Math.abs(input.spread ?? input.buy - input.sell);
			paragraphs.push(
				`It charges ${money(symbol, input.buy)} in ${quoteName} to sell you ${baseName}, and pays ` +
					`${money(symbol, input.sell)} when you sell ${baseName} back. The ${money(symbol, gap)} ` +
					`gap between those two prices is what a round trip costs before any fees ${provider.name} ` +
					`charges separately.`
			);
		}

		paragraphs.push(
			`Monierate records ${provider.name}'s ${base}/${quote} price as a daily open, high, low and ` +
				`close, so the chart and table above show how it has moved rather than just where it stands ` +
				`today. To see whether it is competitive, compare it against every other provider quoting ` +
				`${base}/${quote}.`
		);

		paragraphs.push(longDisclosure(base, provider.name));

		return paragraphs;
	}

	// Composite pair page.
	let opening =
		`The ${baseName} to ${quoteName} exchange rate (${base}/${quote}) is the price of one ` +
		`${baseName} in ${quoteName}.`;
	if (providerCount && providerCount > 1) {
		opening += ` Monierate tracks it across ${providerCount} providers and averages them into a single composite rate.`;
	}
	if (rate > 0) {
		opening += ` That composite currently stands at ${money(symbol, rate)} per ${base}.`;
	}
	paragraphs.push(opening);

	const range = rangeSentence(input, 30);
	const stat90 = findStat(input.stats, 90);
	if (range) {
		let movement = range;
		if (stat90) {
			movement += ` Over 90 days the range widens to ${money(symbol, stat90.low)} – ${money(symbol, stat90.high)}.`;
		}
		paragraphs.push(movement);
	}

	paragraphs.push(
		`No two providers quote ${base}/${quote} identically: each sets its own buy and sell price and ` +
			`its own margin, so the rate you actually get depends on where you trade. The composite above ` +
			`is a market reference rather than an offer — the per-provider breakdown is where the prices ` +
			`you can actually transact at are.`
	);

	paragraphs.push(longDisclosure(base));

	return paragraphs;
}

/** Six questions, all answerable from the figures already on the page. */
export function buildFaqs(input: PairContentInput): FaqEntry[] {
	const { base, quote, symbol, rate, provider, providerCount } = input;
	const baseName = currencyName(base);
	const quoteName = currencyName(quote);
	const stat30 = findStat(input.stats, 30);
	const faqs: FaqEntry[] = [];

	if (rate <= 0) return faqs;

	const hundred = money(symbol, rate * 100);

	if (provider) {
		faqs.push({
			question: `What is ${provider.name}'s ${base} to ${quote} rate today?`,
			answer:
				`1 ${base} is about ${money(symbol, rate)} on ${provider.name}` +
				(input.rateBasis === 'daily' && input.asOf
					? `, based on its daily close for ${longDate(input.asOf)}.`
					: `, based on the latest rate Monierate recorded.`)
		});

		if (input.buy && input.sell) {
			faqs.push({
				question: `Does ${provider.name} buy and sell ${baseName}?`,
				answer:
					`Yes. ${provider.name} sells ${baseName} at ${money(symbol, input.buy)} per ${base} and ` +
					`buys it back at ${money(symbol, input.sell)}. The difference between the two is the ` +
					`spread, and it is a cost you pay on a round trip in addition to any explicit fee.`
			});
		}

		faqs.push({
			question: `How much is 100 ${base} on ${provider.name}?`,
			answer: `At the current rate, 100 ${base} is worth about ${hundred} on ${provider.name}.`
		});

		faqs.push({
			question: `How often does ${provider.name} update its ${base}/${quote} rate?`,
			answer:
				input.rateBasis === 'daily'
					? `${provider.name} publishes this pair once a day rather than continuously, so Monierate ` +
						`records one open, high, low and close per day for it.`
					: `${provider.name} updates this pair continuously. Monierate polls it through the day and ` +
						`seals each day into an open, high, low and close.`
		});

		if (stat30) {
			faqs.push({
				question: `What has ${provider.name}'s ${base}/${quote} rate done over the last 30 days?`,
				answer:
					`It moved between ${money(symbol, stat30.low)} and ${money(symbol, stat30.high)}, ` +
					`averaging ${money(symbol, stat30.average)} and finishing ` +
					`${stat30.changePct >= 0 ? 'up' : 'down'} ${pct(stat30.changePct)} over the period.`
			});
		}

		const providerDisclosure = disclosureFaq(base, quote, provider.name);
		if (providerDisclosure) faqs.push(providerDisclosure);

		faqs.push({
			question: `Is ${provider.name} the best place to change ${base} to ${quote}?`,
			answer:
				`Not necessarily. Providers set their own prices and margins, so the best rate changes from ` +
				`day to day. Monierate's ${base}/${quote} insight page compares every provider we track ` +
				`side by side, with buy and sell rates and the spread between them.`
		});

		return faqs;
	}

	faqs.push({
		question: `What is the ${base} to ${quote} rate today?`,
		answer:
			`1 ${base} is about ${money(symbol, rate)}. This is Monierate's composite rate` +
			(providerCount && providerCount > 1
				? `, averaged across the ${providerCount} providers we track for this pair.`
				: ` for this pair.`)
	});

	faqs.push({
		question: `How much is 100 ${base} in ${quote}?`,
		answer: `At the current composite rate, 100 ${base} is worth about ${hundred}. The table above lists the common amounts, in both directions.`
	});

	if (stat30) {
		faqs.push({
			question: `What was the highest ${base} to ${quote} rate in the last 30 days?`,
			answer:
				`${money(symbol, stat30.high)}. The low over the same window was ` +
				`${money(symbol, stat30.low)}, with an average of ${money(symbol, stat30.average)}.`
		});
	}

	faqs.push({
		question: `Why do ${base} to ${quote} rates differ between providers?`,
		answer:
			`Each provider sets its own buy and sell price and adds its own margin, and they source ` +
			`${baseName} on different terms. That is why the same ${base} can be worth noticeably more or ` +
			`less in ${quoteName} depending on where you trade it.`
	});

	faqs.push({
		question: `How often is the ${base}/${quote} rate updated?`,
		answer:
			`Continuously. Monierate polls the providers we track through the day, and seals each day into ` +
			`an open, high, low and close that you can see in the history table above.`
	});

	const pairDisclosure = disclosureFaq(base, quote);
	if (pairDisclosure) faqs.push(pairDisclosure);

	faqs.push({
		question: `Where can I get the best ${base} to ${quote} rate?`,
		answer:
			`It changes from day to day, which is the reason to compare rather than assume. Monierate's ` +
			`${base}/${quote} insight page breaks the pair down by provider, with each one's buy and sell ` +
			`rate and the spread between them, so you can see who is actually cheapest right now.`
	});

	return faqs;
}

export interface PairContent {
	about: string[];
	faqs: FaqEntry[];
	rangeSentence: string | null;
	/** Where the About section points next — the per-provider breakdown for this pair. */
	aboutLink: { href: string; label: string };
	/** One-line standing disclosure, footed under each data module. */
	disclosure: string;
}

/** One call for everything a page needs — keeps the loaders to a single import. */
export function buildPairContent(input: PairContentInput): PairContent {
	return {
		about: buildAbout(input),
		faqs: buildFaqs(input),
		rangeSentence: rangeSentence(input, 30),
		aboutLink: {
			href: `/markets/${input.pairCode}/insight`,
			label: `Compare every provider quoting ${input.base}/${input.quote}`
		},
		disclosure: shortDisclosure(input.base)
	};
}
