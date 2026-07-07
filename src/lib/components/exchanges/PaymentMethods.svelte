<script lang="ts">
	export let methods: string[] = [];

	const labels: Record<string, string> = {
		bank_transfer: 'Bank Transfer',
		card: 'Card',
		cash: 'Cash',
		mobile_money: 'Mobile Money',
		crypto: 'Crypto',
		ussd: 'USSD',
		pos: 'POS',
		p2p: 'P2P'
	};

	const toLabel = (method: string) =>
		labels[method.toLowerCase()] ??
		method
			.split(/[_\s]+/)
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ');
</script>

{#if methods.length > 0}
	<div class="space-y-4">
		<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Payment Methods</h3>

		<div class="flex flex-wrap gap-2">
			{#each methods as method}
				<span
					class="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200"
				>
					{toLabel(method)}
				</span>
			{/each}
		</div>
	</div>
{/if}
