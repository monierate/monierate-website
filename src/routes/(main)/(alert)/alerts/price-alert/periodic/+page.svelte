<script lang="ts">
	import { Timeframe } from './types';
	import { create_alert, update_alert } from '$lib/services/alert.service';
	import { notify } from '$lib/notification';
	import { goto } from '$app/navigation';
	import type { Provider, DropdownOption } from '$lib/components/alert/useAlertForm';
	import AlertDetailsPanel from '$lib/components/alert/AlertDetailsPanel.svelte';
	import AlertOptionsPanel from '$lib/components/alert/AlertOptionsPanel.svelte';
	import AlertInfoTabs from '$lib/components/alert/AlertInfoTabs.svelte';
	import AlertForm from '$lib/components/alert/AlertForm.svelte';

	export let data;
	const providers: Provider[] = (data.providers ?? []).sort((a: any, b: any) =>
		(a.name ?? '').localeCompare(b.name ?? '')
	);
	const pair_list: any = data.pair_list;
	const auth: any = data.auth;

	let editAlert: any = false;

	if (data.alert && data.alert._id) {
		editAlert = data.alert;
	}

	let currentView: string = 'details';
	let isLoading: boolean = false;

	let selectedPair: string = 'usdngn';
	let selectedProviders: string[] = [];
	let selectedChannels: string[] = [];
	let selectedChannelsValues = {} as { email: string; webhook: string };
	let selectedTimeframe = '' as string;
	let selectedTimeframeInterval = 0;
	let selectedDayTimeValues = 0;
	let disableAfterTrigger: boolean = false;
	let note: string = '';

	$: selected_base = pair_list.find((pair: any) => pair.value === selectedPair)?.base;
	$: selected_quote = pair_list.find((pair: any) => pair.value === selectedPair)?.quote;
	$: getSelectedTimeframe = selectedTimeframe ? Timeframe[selectedTimeframe]?.frequency?.type : '';

	let error: string = '';

	if (auth.isLoggedIn && !editAlert) {
		selectedChannelsValues.email = auth.user.email;
	}

	$: timeframeOptions = Object.entries(Timeframe)
		.map(([key, value]) => ({
			label: key,
			value: key
		}))
		.filter(({ label }) => !(label === 'Hourly' && selectedChannels.includes('email')));

	$: timeframeValues = !selectedTimeframe
		? []
		: Object.entries(Timeframe[selectedTimeframe]?.frequency?.values || {}).map(([key, value]) => ({
				label: key,
				value: value
			}));

	$: dayTimeValues =
		selectedTimeframe === 'Monthly' || selectedTimeframe === 'Weekly'
			? Object.entries(Timeframe[selectedTimeframe]?.frequency?.time || {}).map(([key, value]) => ({
					label: key,
					value: value
				}))
			: [];

	let providersForDropdown: DropdownOption[] = [];

	function updateProvidersForDropdown() {
		providersForDropdown = Object.entries(providers)
			.filter(([_, value]) => {
				try {
					const provider = value as Provider;
					return provider.pairs && provider.pairs[selectedPair.toLowerCase()] !== undefined;
				} catch (e) {
					return false;
				}
			})
			.map(([_, value]) => {
				const provider = value as Provider;
				return {
					label: provider.name,
					value: provider.code,
					icon: '/icons/' + provider.icon
				};
			});
	}

	$: if (selectedPair) {
		updateProvidersForDropdown();
	}

	async function create_alert_handler() {
		if (selectedProviders.length === 0) {
			error = 'Please select at least one provider';
			return;
		}

		if (Object.entries(selectedChannelsValues).length === 0) {
			error = 'Please select at least one notification channel';
			return;
		}

		isLoading = true;
		const alert: any = {
			type: 'periodic',
			quote: selected_quote,
			base: selected_base,
			frequency: {
				type: getSelectedTimeframe,
				value: selectedTimeframeInterval
			},
			exchange: selectedProviders,
			channel: selectedChannelsValues,
			disable_after_trigger: disableAfterTrigger
		};

		if (selectedTimeframe === 'Monthly' || selectedTimeframe === 'Weekly') {
			alert.frequency.time = selectedDayTimeValues;
		}

		if (note !== '') {
			alert.note = note;
		}

		try {
			const success = await create_alert(alert, fetch);

			isLoading = false;
			if (success) {
				notify('Alert created successfully');
				goto('/alerts');
			} else {
				error = 'Failed to create alert. Please try again.';
			}
		} catch (err) {
			isLoading = false;
			error = 'Failed to create alert. Please try again.';
			console.error('Create alert error:', err);
		}
	}

	async function update_alert_handler(alert_id: string) {
		if (selectedProviders.length === 0) {
			error = 'Please select at least one provider';
			return;
		}

		if (Object.entries(selectedChannelsValues).length === 0) {
			error = 'Please select at least one notification channel';
			return;
		}

		isLoading = true;
		const alert: any = {
			id: alert_id,
			type: 'periodic'
		};

		if (selected_quote !== editAlert.quote) {
			alert.quote = selected_quote;
		}

		if (selected_base !== editAlert.base) {
			alert.base = selected_base;
		}

		if (
			getSelectedTimeframe !== editAlert.frequency?.type ||
			selectedTimeframeInterval !== editAlert.frequency?.value ||
			selectedDayTimeValues !== editAlert.frequency?.time
		) {
			alert.frequency = {
				type: getSelectedTimeframe,
				value: selectedTimeframeInterval
			};
		}

		if (
			(selectedTimeframe === 'Monthly' || selectedTimeframe === 'Weekly') &&
			selectedDayTimeValues !== editAlert.frequency?.time
		) {
			alert.frequency = {
				...(alert.frequency || {}),
				time: selectedDayTimeValues
			};
		}

		if (JSON.stringify(selectedProviders) !== JSON.stringify(editAlert.exchange)) {
			alert.exchange = selectedProviders;
		}

		const filteredChannels = Object.fromEntries(
			Object.entries(selectedChannelsValues).map(([key, value]) => [
				key,
				value === '' || !selectedChannels.includes(key) ? null : value
			])
		);

		if (JSON.stringify(filteredChannels) !== JSON.stringify(editAlert.channel)) {
			alert.channel = filteredChannels;
		}

		if (disableAfterTrigger !== editAlert.disable_after_trigger) {
			alert.disable_after_trigger = disableAfterTrigger;
		}

		if (note !== editAlert.note && note !== '') {
			alert.note = note;
		}

		try {
			const success = await update_alert(alert, fetch);

			isLoading = false;
			if (success) {
				notify('Alert updated successfully');
				goto('/alerts');
			} else {
				error = 'Failed to update alert. Please try again.';
			}
		} catch (err) {
			isLoading = false;
			error = 'Failed to update alert. Please try again.';
			console.error('Update alert error:', err);
		}
	}

	function initializeFromExistingAlert() {
		if (!editAlert) return;

		console.log('Initializing from existing alert');

		if (editAlert.base && editAlert.quote) {
			selectedPair = `${editAlert.base}${editAlert.quote}`.toLowerCase();

			updateProvidersForDropdown();
		}

		setTimeout(() => {
			if (editAlert.exchange && Array.isArray(editAlert.exchange)) {
				selectedProviders = [...editAlert.exchange];
			}
		}, 100);

		if (editAlert.channel && Object.entries(editAlert.channel)) {
			selectedChannels = [...Object.keys(editAlert.channel)];
			selectedChannelsValues = { ...editAlert.channel };
		}

		if (editAlert.frequency) {
			for (const [key, value] of Object.entries(Timeframe as [any, any])) {
				if (value.frequency && value.frequency.type === editAlert.frequency.type) {
					selectedTimeframe = key;
					break;
				}
			}

			if (editAlert.frequency.value !== undefined) {
				selectedTimeframeInterval = editAlert.frequency.value;
			}

			if (editAlert.frequency.time !== undefined) {
				selectedDayTimeValues = editAlert.frequency.time;
			}
		}

		if (editAlert.disable_after_trigger !== undefined) {
			disableAfterTrigger = editAlert.disable_after_trigger;
		}

		if (editAlert.note) {
			note = editAlert.note;
		}
	}

	initializeFromExistingAlert();
</script>

<svelte:head>
	<title>Naira Rate Alerts | Monierate</title>
</svelte:head>

<div class="flex flex-col md:flex-row gap-4">
	<div class="w-full md:w-1/2">
		<div class="md:w-3/4 mx-auto px-2 md:px-10 pb-5 flex flex-col gap-5">
			<AlertInfoTabs {editAlert} />

			{#if error !== ''}
				<div
					class="text-sm text-red-900 mb-2 border border-red-300 p-3 rounded-lg bg-red-50 shadow"
				>
					<p>{error}</p>
				</div>
			{/if}

			<AlertForm
				{auth}
				{editAlert}
				bind:selectedPair
				bind:selectedProviders
				bind:selectedChannels
				bind:selectedChannelsValues
				bind:selectedTimeframe
				bind:selectedTimeframeInterval
				bind:selectedDayTimeValues
				pairList={pair_list}
				{providers}
				{providersForDropdown}
				{timeframeOptions}
				{timeframeValues}
				{dayTimeValues}
				{isLoading}
				onCreateAlert={create_alert_handler}
				onUpdateAlert={() => update_alert_handler(editAlert._id)}
			/>
		</div>

	</div>

	<div class="w-full md:w-1/2 mt-10 md:mt-0">
		<div class="flex justify-center items-center gap-16 text-lg mb-10">
			<button
				class={currentView === 'details' ? 'text-blue-500' : 'hover:text-gray-500'}
				on:click={() => (currentView = 'details')}>Details</button
			>
			<button
				class={currentView === 'options' ? 'text-blue-500' : 'hover:text-gray-500'}
				on:click={() => (currentView = 'options')}>Options</button
			>
		</div>

		{#if currentView === 'details'}
			<AlertDetailsPanel />
		{/if}
		{#if currentView === 'options'}
			<AlertOptionsPanel {disableAfterTrigger} {note} />
		{/if}
	</div>
</div>
