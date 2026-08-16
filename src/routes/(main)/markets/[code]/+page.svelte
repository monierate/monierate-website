<script lang="ts">
	import { untrack } from 'svelte';
	import { PairInsightActions } from './actions.svelte';
	import PairInsight from '$lib/components/pair-profile/PairInsight.svelte';
	import OhlcTable from '$lib/components/pair-profile/OhlcTable.svelte';
	import PairSummary from '$lib/components/pair-profile/PairSummary.svelte';
	import Seo from '$lib/components/seo/Seo.svelte';

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
				loading={insight.historyLoading || insight.tableLoading}
				symbol={insight.parsedPair.symbol}
				selectedRange={insight.selectedRange}
				previewRows={data.hasFullAccess ? null : 10}
				dayPass={data.dayPass}
				onPageChange={(p) => insight.loadTablePage(p)}
			/>
		</div>
	{/if}
</div>
