<script lang="ts">
	import { goto } from '$app/navigation';
	import { CurrentScreen, current_screen } from './useAlertForm';
	import type { Provider, DropdownOption, Channels } from './useAlertForm';

	import StepSelectPairProviders from './StepSelectPairProviders.svelte';
	import StepNotificationChannels from './StepNotificationChannels.svelte';
	import StepSchedule from './StepSchedule.svelte';

	export let editAlert: any;
	export let selectedProviders: string[] = [];
	export let selectedPair: any = '';
	export let pairList: any[];
	export let providers: Provider[];
	export let providersForDropdown: DropdownOption[];
	export let auth: any;

	export let selectedChannels: string[] = [];
	export let selectedChannelsValues: { [key in Channels]: string } = {
		email: '',
		webhook: ''
	};

	export let timeframeOptions: any[];
	export let timeframeValues: any[];
	export let dayTimeValues: any[];
	export let selectedTimeframe: string;
	export let selectedTimeframeInterval: number;
	export let selectedDayTimeValues: number;
	export let isLoading: boolean;
	export let onUpdateAlert: (alertId: string) => void = () => {};
	export let onCreateAlert: () => void = () => {};
</script>

{#if $current_screen === CurrentScreen.FIRST_SCREEN}
	<StepSelectPairProviders
		isEdit={editAlert}
		bind:selectedProviders
		bind:selectedPair
		{pairList}
		{providers}
		{providersForDropdown}
		{auth}
	/>
{:else if $current_screen === CurrentScreen.SECOND_SCREEN}
	<StepNotificationChannels bind:selectedChannels bind:selectedChannelsValues />
{:else if $current_screen === CurrentScreen.THIRD_SCREEN}
	<StepSchedule
		{timeframeOptions}
		{timeframeValues}
		{dayTimeValues}
		bind:selectedTimeframe
		bind:selectedTimeframeInterval
		bind:selectedDayTimeValues
		{onCreateAlert}
		{onUpdateAlert}
		{editAlert}
		{auth}
		{isLoading}
	/>
{/if}

{#if editAlert}
	<button
		class="border border-gray-300 dark:border-gray-600 hover:border-gray-400 w-full mt-4 p-2 rounded-lg text-center text-gray-500 dark:text-gray-400"
		on:click={() => goto('/alerts', { replaceState: true })}>Cancel changes</button
	>
{/if}
