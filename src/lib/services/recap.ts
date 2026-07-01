import type { MarketCurrencyRate, MarketMeta } from '$lib/types/market';
import currencySymbols from '$data/currency-symbols.json';

/**
 * Phase 1 auto recap: a deterministic, data-to-text (NLG) summary generated
 * from the rate data we already load — no external sources, no LLM. Because it
 * is a pure function of the current rates it is always fresh.
 *
 * See docs/market-news.md. Cron + KV caching is a later optimization.
 */

export interface MarketRecap {
	date: string;
	paragraphs: string[];
}

const symbolFor = (code: string): string =>
	(currencySymbols as Record<string, string>)[code] ?? '';

const fmt = (value: number | undefined): string => {
	if (value === undefined || value === null || Number.isNaN(value)) return '—';
	const decimals = value >= 100 ? 2 : value >= 1 ? 3 : 5;
	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: decimals
	}).format(value);
};

const move = (change: number | undefined): { verb: string; pct: string } => {
	const c = change ?? 0;
	const abs = Math.abs(c);
	if (abs < 0.05) return { verb: 'held steady', pct: '' };
	return { verb: c > 0 ? 'gained' : 'eased', pct: `${abs.toFixed(2)}%` };
};

const joinAnd = (items: string[]): string => {
	if (items.length <= 1) return items[0] ?? '';
	return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
};

export function buildMarketRecap(
	meta: MarketMeta,
	rates: MarketCurrencyRate[]
): MarketRecap | null {
	if (!rates?.length) return null;

	const baseSym = symbolFor(meta.base);
	const rateText = (r: MarketCurrencyRate) =>
		meta.rateMode === 'single'
			? `${baseSym}${fmt(r.rate)}`
			: `${baseSym}${fmt(r.buy)} / ${baseSym}${fmt(r.sell)}`;

	// Human name of the market, used in the answer-first sentence.
	const marketName =
		meta.key === 'cbn'
			? 'official (CBN)'
			: meta.key === 'global-market'
				? 'mid-market'
				: 'black market';

	const date = new Date(meta.updatedAt).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});

	// Anchor on USD, fall back to the first available currency.
	const usd = rates.find((r) => r.code === 'USD') ?? rates[0];
	const um = move(usd.change);

	// Answer-first sentence: a self-contained, quotable fact for AI overviews
	// (Google AI Overview, ChatGPT/SearchGPT, Claude, Perplexity) and featured snippets.
	const rateAnswer =
		meta.rateMode === 'single'
			? `${baseSym}${fmt(usd.rate)}`
			: `${baseSym}${fmt(usd.buy)} to buy and ${baseSym}${fmt(usd.sell)} to sell`;

	const answer =
		`As of ${date}, the ${marketName} exchange rate for the ${usd.name} (${usd.code}) ` +
		`to the Nigerian naira (NGN) is ${rateAnswer}.`;

	const movement = um.pct
		? ` The dollar has ${um.verb} ${um.pct} against the naira over the past 24 hours, ` +
			`leaving the naira ${(usd.change ?? 0) > 0 ? 'weaker' : 'stronger'} than a day ago.`
		: ` The rate has held steady over the past 24 hours.`;

	const paragraphs: string[] = [answer + movement];

	// Other majors, if present.
	const others = ['GBP', 'EUR', 'CAD', 'CNY']
		.map((c) => rates.find((r) => r.code === c))
		.filter((r): r is MarketCurrencyRate => Boolean(r))
		.slice(0, 3);

	if (others.length) {
		const parts = others.map((r) => {
			const m = move(r.change);
			return `the ${r.name} (${r.code}) at ${rateText(r)}${m.pct ? ` (${m.verb} ${m.pct})` : ''}`;
		});
		paragraphs.push(`Elsewhere, ${joinAnd(parts)}.`);
	}

	paragraphs.push(
		`Monierate tracks ${rates.length} ${meta.shortTitle} currency rate${
			rates.length === 1 ? '' : 's'
		} against the naira, refreshed as new data comes in.`
	);

	return { date, paragraphs };
}
