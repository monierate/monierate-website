<script lang="ts">
	import { untrack } from 'svelte';
	import { PairInsightActions } from './actions.svelte';
	import PairInsight from '$lib/components/pair-profile/PairInsight.svelte';
	import OhlcTable from '$lib/components/pair-profile/OhlcTable.svelte';
	import PairSummary from '$lib/components/pair-profile/PairSummary.svelte';
	import Seo from '$lib/components/seo/Seo.svelte';
	import { FREE_HISTORY_ROWS } from '$lib/constants/gate';
	import PeriodStats from '$lib/components/pair-content/PeriodStats.svelte';
	import AmountLadder from '$lib/components/pair-content/AmountLadder.svelte';
	import AboutSection from '$lib/components/pair-content/AboutSection.svelte';
	import FaqSection from '$lib/components/pair-content/FaqSection.svelte';
	import { CURRENCY_SYMBOLS } from '$lib/constants/currency';

	let { data } = $props();

	const insight = untrack(
		() =>
			new PairInsightActions({
				pairCode: data.pairCode,
				currentRate: data.currentRate,
				initialHistory: data.initialHistory,
				initialTableRows: data.initialTableRows,
				initialTableTotal: data.initialTableTotal,
				amount: data.amount
			})
	);

	const seo = data.seo;

	// Oldest snapshot in the loaded 30-day window — the "a month ago" comparison
	// point. Reduced rather than indexed, since the API's ordering isn't guaranteed.
	const monthAgo = data.initialHistory?.length
		? data.initialHistory.reduce((a, b) => (a.date <= b.date ? a : b)).close
		: 0;
</script>

<Seo {...seo} />

<!-- Container mirrors Breadcrumb.svelte so the page gutter lines up with the breadcrumb bar. -->
<div class="w-[95%] md:max-w-[1200px] mx-auto px-4 py-8">
	<PairInsight currentRate={data.currentRate} state={insight}>
		{#snippet summary()}
			<PairSummary
				base={insight.parsedPair.base}
				quote={insight.parsedPair.quote}
				symbol={insight.parsedPair.symbol}
				currentRate={data.currentRate}
				rateMonthAgo={monthAgo}
			/>
		{/snippet}
	</PairInsight>

	<!-- Hidden outright when the pair has neither a live composite rate nor any
	     recorded history — an empty table under an empty state is just noise. -->
	{#if insight.history.length > 0 || insight.historyLoading}
		<div class="mt-5">
			<OhlcTable
				rows={insight.tableRows}
				total={insight.tableTotal}
				page={insight.tablePage}
				loading={insight.tableLoading}
				symbol={insight.parsedPair.symbol}
				range={insight.tableRange}
				previewRows={data.hasFullAccess ? null : FREE_HISTORY_ROWS}
				dayPass={data.dayPass}
				onPageChange={(p) => insight.loadTablePage(p)}
				onRangeChange={(r) => insight.setTableRange(r)}
			/>
		</div>
	{/if}

	<!-- Content modules. Ordered by how directly they answer the query that brought
	     the visitor here: the amount table first (it is the literal answer to
	     "how much is 500 X in Y"), then context, then the long tail of questions. -->
	<div class="mt-5 flex flex-col gap-5">
		<AmountLadder
			base={insight.parsedPair.base}
			quote={insight.parsedPair.quote}
			baseSymbol={CURRENCY_SYMBOLS[insight.parsedPair.base.toLowerCase()] ?? ''}
			quoteSymbol={insight.parsedPair.symbol}
			rate={data.currentRate?.rate_mid ?? 0}
			note={data.content.disclosure}
		/>

		<PeriodStats
			stats={data.stats}
			base={insight.parsedPair.base}
			quote={insight.parsedPair.quote}
			symbol={insight.parsedPair.symbol}
			sentence={data.content.rangeSentence}
			note={data.content.disclosure}
		/>

		<AboutSection
			heading="About {insight.parsedPair.base}/{insight.parsedPair.quote}"
			paragraphs={data.content.about}
			link={data.content.aboutLink}
		/>

		<FaqSection faqs={data.content.faqs} />
	</div>
</div>
