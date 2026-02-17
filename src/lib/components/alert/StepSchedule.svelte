<script lang="ts">
	import CustomSelectBox from '../CustomSelectBox.svelte';
	import { change_screen, CurrentScreen } from './useAlertForm';

	export let timeframeOptions: any[];
	export let timeframeValues: any[];
	export let dayTimeValues: any[];
	export let selectedTimeframe: string;
	export let selectedTimeframeInterval: number;
	export let selectedDayTimeValues: number;
	export let isLoading: boolean;
	export let editAlert: any;
	export let auth: any;
	export let onUpdateAlert: (alertId: string) => void = () => {};
	export let onCreateAlert: () => void = () => {};
</script>

<div>
	<p class="text-xl mb-4">When do you want to be receiving the alert?</p>

	<div class="mb-10">
		<div class="mb-4">
			<label for="time" class="label">Select time</label>
			<CustomSelectBox
				options={timeframeOptions}
				fullbox={true}
				className="!w-full"
				id="time"
				bind:selected={selectedTimeframe}
			/>
		</div>

		{#if selectedTimeframe !== ''}
			<div class="mb-4">
				<label for="timex" class="label">Get it every</label>
				<CustomSelectBox
					options={timeframeValues}
					fullbox={true}
					className="!w-full"
					id="timex"
					bind:selected={selectedTimeframeInterval}
					placeholder="Select interval"
				/>
			</div>
		{/if}

		{#if selectedTimeframe === 'Monthly' || selectedTimeframe === 'Weekly'}
			<div class="mb-4">
				<label for="timexx" class="label">What time of the day</label>
				<CustomSelectBox
					options={dayTimeValues}
					fullbox={true}
					className="!w-full"
					id="timexx"
					bind:selected={selectedDayTimeValues}
					placeholder="Select interval"
				/>
			</div>
		{/if}
	</div>

	{#if auth.isLoggedIn}
		<div class="mb-4 text-sm">
			<strong>Note:</strong>
			<span>Your timezone is "{auth.user.timezone || 'UTC'}."</span>
			<p>
				To update it, visit your <a
					href="https://account.monierate.com/edit-account-details"
					target="_blank">Account Dashboard</a
				>.
			</p>
		</div>
	{/if}

	{#if editAlert}
		<button
			class="button w-full"
			on:click={() => onUpdateAlert(editAlert._id)}
			disabled={isLoading ||
				!(
					selectedTimeframe !== '' &&
					selectedTimeframeInterval >= 1 &&
					(['weekly', 'monthly'].includes(selectedTimeframe.toLowerCase())
						? selectedDayTimeValues >= 1
						: true)
				)}>Update alert</button
		>
	{:else}
		<button
			class="button w-full"
			on:click={onCreateAlert}
			disabled={isLoading ||
				!(
					selectedTimeframe !== '' &&
					selectedTimeframeInterval >= 1 &&
					(['weekly', 'monthly'].includes(selectedTimeframe.toLowerCase())
						? selectedDayTimeValues >= 1
						: true)
				)}>Set alert</button
		>
	{/if}
	<button
		class="border border-gray-300 dark:border-gray-600 hover:border-gray-400 w-full mt-4 p-2 rounded-lg text-center text-gray-500 dark:text-gray-400"
		on:click={() => change_screen(CurrentScreen.SECOND_SCREEN)}>Go back</button
	>
</div>
