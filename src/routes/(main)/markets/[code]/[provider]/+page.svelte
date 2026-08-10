<script lang="ts">
	import { untrack } from 'svelte';
	import { ProviderPairInsightActions } from './actions.svelte';
	import ProviderPairInsight from '$lib/components/provider-profile/ProviderPairInsight.svelte';
	import OhlcTable from '$lib/components/provider-profile/OhlcTable.svelte';
	import ProviderPairSummary from '$lib/components/provider-profile/ProviderPairSummary.svelte';
	import Seo from '$lib/components/seo/Seo.svelte';
	import { getIconPath } from '$lib/utils';

	let { data } = $props();

	// Named `insight`, not `state` — a local variable literally called `state`
	// collides with the `$state` rune (see markets/providers/[code]/+page.svelte).
	const insight = untrack(
		() =>
			new ProviderPairInsightActions({
				pairCode: data.pairCode,
				providerCode: data.providerCode,
				currentRate: data.currentRate,
				initialHistory: data.initialHistory,
				amount: data.amount
			})
	);

	const seo = data.seo;
	const providerIconUrl = data.provider.icon ? getIconPath(data.provider.icon) : null;

	// Oldest snapshot in the loaded 30-day window — the "a month ago" comparison
	// point. Reduced rather than indexed, since the API's ordering isn't guaranteed.
	const monthAgo = data.initialHistory?.length
		? data.initialHistory.reduce((a, b) => (a.date <= b.date ? a : b)).close
		: 0;
</script>

<Seo {...seo} />

<!-- Container mirrors Breadcrumb.svelte so the page gutter lines up with the breadcrumb bar. -->
<div class="w-[95%] md:max-w-[1200px] mx-auto px-4 py-8">
	<ProviderPairInsight
		provider={data.provider}
		currentRate={data.currentRate}
		state={insight}
		showBreadcrumb={false}
	>
		{#snippet summary()}
			<ProviderPairSummary
				providerName={data.provider.name}
				base={insight.parsedPair.base}
				quote={insight.parsedPair.quote}
				symbol={insight.parsedPair.symbol}
				currentRate={data.currentRate}
				rateMonthAgo={monthAgo}
			/>
		{/snippet}
	</ProviderPairInsight>

	<!-- Mirrors the OHLC table on /markets/providers/[code]; shares the same range
	     selection, so switching 7d/30d/60d/90d above refreshes both. Hidden outright
	     when the provider has neither a live quote nor any recorded history — an
	     empty table under an empty state is just noise. -->
	{#if insight.history.length > 0 || insight.historyLoading}
		<div class="mt-5">
			<OhlcTable
				history={insight.history}
				historyLoading={insight.historyLoading}
				symbol={insight.parsedPair.symbol}
				selectedRange={insight.selectedRange}
				providerName={data.provider.name}
				{providerIconUrl}
				previewRows={10}
				dayPass={data.dayPass}
			/>
		</div>
	{/if}
</div>
