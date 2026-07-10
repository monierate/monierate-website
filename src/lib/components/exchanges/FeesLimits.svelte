<script lang="ts">
	export let changer: any;

	$: limits = changer.limits;
	$: hasLimits = limits && (limits.min || limits.max || limits.note);
	$: hasContent =
		changer.fees_note || hasLimits || changer.settlement_time || changer.min_ticket_size;
</script>

{#if hasContent}
	<div class="space-y-4">
		<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Fees & Limits</h3>

		<div
			class="border border-gray-200 dark:border-gray-700/60 rounded-xl divide-y divide-gray-200 dark:divide-gray-700/60"
		>
			{#if changer.fees_note}
				<div class="p-4 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6">
					<p class="sm:w-40 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">Fees</p>
					<p class="text-sm text-gray-800 dark:text-gray-100">{changer.fees_note}</p>
				</div>
			{/if}

			{#if hasLimits}
				<div class="p-4 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6">
					<p class="sm:w-40 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
						Limits
					</p>
					<div class="text-sm text-gray-800 dark:text-gray-100 space-y-1">
						{#if limits.min || limits.max}
							<p>
								{#if limits.min}Min: <span class="font-semibold">{limits.min}</span>{/if}
								{#if limits.min && limits.max}<span class="text-gray-400 mx-1">·</span>{/if}
								{#if limits.max}Max: <span class="font-semibold">{limits.max}</span>{/if}
							</p>
						{/if}
						{#if limits.note}
							<p class="text-gray-500 dark:text-gray-400">{limits.note}</p>
						{/if}
					</div>
				</div>
			{/if}

			{#if changer.settlement_time}
				<div class="p-4 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6">
					<p class="sm:w-40 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
						Settlement time
					</p>
					<p class="text-sm text-gray-800 dark:text-gray-100 capitalize">
						{changer.settlement_time}
					</p>
				</div>
			{/if}

			{#if changer.min_ticket_size}
				<div class="p-4 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6">
					<p class="sm:w-40 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
						Minimum ticket size
					</p>
					<p class="text-sm text-gray-800 dark:text-gray-100">{changer.min_ticket_size}</p>
				</div>
			{/if}
		</div>
	</div>
{/if}
