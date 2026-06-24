<script lang="ts">
	import TipView from '../TipView.svelte';
	import ProviderIcon from '$lib/components/ProviderIcon.svelte';
	import { capitalizeFirstLetter, friendlyDate, getNextTriggerTime } from '$lib/functions';
	import AlertActions from './AlertActions.svelte';
	import type { Alert } from '$lib/types/alert.type';
	import { update_alert, delete_alert } from '$lib/services/alert.service';
	import { notify } from '$lib/notification';
	import { invalidate } from '$app/navigation';
	import Spinner from '../Spinner.svelte';

	interface Provider {
		code: string;
		name: string;
		icon: string;
	}

	export let alert: Alert;
	export let providers: Provider[];
	export let userTimezone: string;

	let isToggling: boolean = false;
	let disabled: string = '';

	function getProvider(code: string): Provider {
		const provider = providers.find((p: any) => p.code === code) as Provider;
		return provider;
	}

	async function toggleAlertStatus() {
		if (isToggling) return;

		isToggling = true;
		const newStatus = alert.status === 'active' ? 'disabled' : 'active';

		try {
			// invalidate('app:data');
			const result = await update_alert({ id: alert._id, status: newStatus }, fetch);
			if (!result) {
				notify(`There was an error ${newStatus === 'active' ? 'enabling' : 'disabling'} alert`);
			}
			alert.status = newStatus;
		} catch {
			notify('Unexpected error while updating alert');
		} finally {
			isToggling = false;
		}
	}

	async function deleteAlert() {
		try {
			disabled = alert._id;
			const result = await delete_alert(alert._id, fetch);
			if (!result) {
				notify('There was an error deleting the alert');
				disabled = '';
			} else {
				refresh();
			}
		} catch {
			notify('Unexpected error while deleting alert');
		}
	}

	async function refresh() {
		await invalidate('app:data');
	}
</script>

<tr
	class="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 {disabled ===
	alert._id
		? 'opacity-50 cursor-not-allowed'
		: ''}"
>
	<td class="px-4 py-2 text-left">
		<span class="block mb-2">
			{alert.base.toUpperCase()} in {alert.quote.toUpperCase()}
		</span>
		<span class="flex flex-wrap gap-2 items-center">
			{#each alert.exchange as exchange, index}
				{#if index <= 2}
					<span
						class="bg-gray-100 dark:bg-gray-800 text-sm px-2 py-1 rounded-full inline-flex items-center mb-2 border border-gray-300 dark:border-gray-700"
					>
						<ProviderIcon icon={getProvider(exchange).icon} alt="icon" class="w-4 h-4 mr-2" />
						{getProvider(exchange).name}
					</span>
				{/if}
				{#if alert.exchange.length - 1 === index}
					{#if index > 2 && alert.exchange.length - 3 > 0}
						<span
							class="bg-gray-100 dark:bg-gray-800 text-sm px-2 py-1 rounded-full inline-flex items-center mb-2 border border-gray-300 dark:border-gray-700"
						>
							+{alert.exchange.length -
								3 +
								(index > 2 && alert.exchange.length - 3 > 1 ? ' others' : ' other')}
						</span>
					{/if}
				{/if}
			{/each}
		</span>
	</td>
	<td class="px-4 py-2 text-left">
		<span class="flex flex-wrap gap-2 items-center">
			{#each Object.entries(alert.channel) as [key, value]}
				<span class="border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 text-sm">
					<TipView
						tip={{
							label: capitalizeFirstLetter(key),
							value: value
						}}
						trigger="click"
					/>
				</span>
			{/each}
		</span>
	</td>
	<td class="px-4 py-2 text-left">
		{alert.frequency.type}
	</td>
	<td class="px-4 py-2 text-left">
		{alert.last_triggered === null ? '-' : friendlyDate(alert.last_triggered)}
	</td>
	<td class="px-4 py-2 text-left">
		{getNextTriggerTime(alert.frequency, userTimezone || 'UTC')}
	</td>
	<td class="px-4 py-2 text-left">
		{#if disabled === alert._id}
			<Spinner />
		{:else}
			<AlertActions
				alertId={alert._id}
				alertStatus={alert.status}
				alertType={alert.type}
				onDelete={deleteAlert}
				onStatusChange={toggleAlertStatus}
			/>
		{/if}
	</td>
</tr>
