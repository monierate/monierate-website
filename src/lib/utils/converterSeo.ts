import {
	SITE,
	DEFAULT_OG_IMAGE,
	breadcrumbJsonLd,
	exchangeRateJsonLd,
	faqPageJsonLd,
	webPageJsonLd,
	type FaqEntry,
	type SeoMeta
} from '$lib/utils/seo';
import { conversionPath, isLadderAmount, pairPath } from '$lib/utils/conversionSlug';
import { moneyWithUnit } from '$lib/utils/converterContent';
import type { MarketName } from '$lib/services/globalRate.service';

/**
 * SEO for the converter pages.
 *
 * The indexing rule lives here and nowhere else. `/converter/<amount>-usd-to-ngn`
 * is an unbounded URL space, so only the curated ladder — the same amounts the
 * on-page table links to — is self-canonical and indexable. Every other amount
 * renders normally for whoever followed the link but points its canonical at the
 * pair page and carries `noindex, follow`, which keeps the links crawlable while
 * keeping the near-duplicates out of the index.
 *
 * A conversion we hold no rate for is also held back: a page whose headline is
 * "no rate available" has nothing to rank for.
 */

const CONVERTER_ROOT = { name: 'Converter', path: '/converter' };

export interface ConversionSeoInput {
	amount: number;
	/** Uppercase codes. */
	from: string;
	to: string;
	fromName: string;
	toName: string;
	toSymbol: string;
	/** 1 `from` = `rate` `to`. Zero when unavailable. */
	rate: number;
	market: MarketName | null;
	exchangeCount: number;
	faqs: FaqEntry[];
}

const amountLabel = (value: number): string => value.toLocaleString('en-US');

export function buildConversionSeo(input: ConversionSeoInput): SeoMeta {
	const { amount, from, to, fromName, toName, toSymbol, rate, market, exchangeCount, faqs } = input;

	const lower = { from: from.toLowerCase(), to: to.toLowerCase() };
	const isPairPage = amount === 1;
	const selfPath = conversionPath(amount, lower.from, lower.to);

	const indexable = rate > 0 && (isPairPage || isLadderAmount(amount));

	// The amount is attached to the code only — see the note in `converterContent`
	// on why currency names are never inflected.
	const title = isPairPage
		? `${from} to ${to} — ${fromName} to ${toName} Exchange Rate`
		: `${amountLabel(amount)} ${from} to ${to} — Convert ${fromName} to ${toName}`;

	const converted = rate * amount;

	let description: string;

	if (!rate) {
		description =
			`Convert ${fromName} to ${toName} on Monierate. We hold no live ${from}/${to} rate ` +
			`right now — see the currencies we do cover.`;
	} else {
		const marketPhrase = market === 'parallel' ? 'parallel market' : 'mid-market';
		const head = `${amountLabel(amount)} ${from} = ${moneyWithUnit(toSymbol, to, converted)} at today's ${marketPhrase} rate.`;

		description = exchangeCount
			? `${head} Compare live rates from ${exchangeCount} ${exchangeCount === 1 ? 'exchange' : 'exchanges'} and see what each one actually pays you.`
			: `${head} See the live rate, a full conversion table and how ${from}/${to} has moved.`;
	}

	const jsonLd: string[] = [
		webPageJsonLd({
			name: title,
			description,
			url: `${SITE}${selfPath}`,
			about: `${from}/${to} exchange rate`
		})
	];

	if (rate > 0) {
		jsonLd.push(exchangeRateJsonLd({ base: from, quote: to, rate }));
	}

	if (faqs.length) jsonLd.push(faqPageJsonLd(faqs));

	// The trail always passes through the pair page, so an amount page tells a
	// crawler where its canonical parent is even before it reads the link tag.
	const crumbs = [{ name: `${from} to ${to}`, path: pairPath(lower.from, lower.to) }];
	if (!isPairPage) {
		crumbs.push({ name: `${amountLabel(amount)} ${from} to ${to}`, path: selfPath });
	}

	jsonLd.push(breadcrumbJsonLd(crumbs, CONVERTER_ROOT));

	return {
		title,
		description,
		canonical: `${SITE}${indexable ? selfPath : pairPath(lower.from, lower.to)}`,
		ogImage: DEFAULT_OG_IMAGE,
		...(indexable ? {} : { robots: 'noindex, follow' }),
		jsonLd
	};
}

/** The `/converter` hub — a directory page, not a conversion. */
export function buildConverterHubSeo(faqs: FaqEntry[] = []): SeoMeta {
	const title = 'Currency Converter — Live Exchange Rates from Real Exchanges';
	const description =
		'Convert any currency at the live parallel market or mid-market rate, then compare ' +
		'what each exchange would actually pay you. Free, updated continuously.';

	const jsonLd = [
		webPageJsonLd({ name: title, description, url: `${SITE}/converter` }),
		breadcrumbJsonLd([], CONVERTER_ROOT)
	];

	if (faqs.length) jsonLd.push(faqPageJsonLd(faqs));

	return {
		title,
		description,
		canonical: `${SITE}/converter`,
		ogImage: DEFAULT_OG_IMAGE,
		jsonLd
	};
}
