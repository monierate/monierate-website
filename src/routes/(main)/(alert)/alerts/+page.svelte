<script lang="ts">
	import { friendlyDate } from '$lib/functions';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import AlertTable from '$lib/components/price-alert/AlertTable.svelte';
	import AlertToolbar from '$lib/components/price-alert/AlertToolbar.svelte';
	import type { Alert } from '$lib/types/alert.type';

	type Alerts = Alert[];

	export let data;
	const auth: any = data.auth;
	const providers = data.providers;
	const pairList = data.pair_list;
	$: alerts = data.alerts?.sort(
		(a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	) as Alerts;

	$: {
		if (
			(browser && !auth.isLoggedIn) ||
			(browser && auth.isLoggedIn && data.alerts && !(data.alerts.length > 0))
		) {
			goto('/alerts/price-alert/periodic', { replaceState: true });
		}
	}

	$: {
		alerts = alerts?.map((a) => ({
			...a,
			exchange: a.exchange.map((e) => providers[e]?.name ?? e)
		}));
	}
	let isRecent: boolean = true;
	function toggleSort() {
		let isSortedByRecent = alerts.every(
			(alert, index, array) =>
				index === 0 || new Date(array[index - 1].created_at) >= new Date(alert.created_at)
		);

		alerts = alerts.sort((a, b) => {
			if (isSortedByRecent) {
				isRecent = false;
				return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
			} else {
				isRecent = true;
				return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
			}
		});
	}

	function filterAlerts(searchText: string) {
		if (searchText === '') {
			alerts = data.alerts;
		} else {
			alerts = data.alerts.filter(
				(a: any) =>
					a.base.toLowerCase().includes(searchText.toLowerCase()) ||
					a.quote.toLowerCase().includes(searchText.toLowerCase()) ||
					a.exchange.some((e: any) => e.toLowerCase().includes(searchText.toLowerCase())) ||
					Object.entries(a.channel).some((c: any) =>
						c.toString().toLowerCase().includes(searchText.toLowerCase())
					) ||
					(a.note && a.note.toLowerCase().includes(searchText.toLowerCase())) ||
					friendlyDate(a.created_at).toLowerCase().includes(searchText.toLowerCase())
			);
		}
	}

	function filterAlertsByPair(filter: string) {
		if (filter === '') {
			alerts = data.alerts;
		} else {
			alerts = data.alerts.filter(
				(a: any) => `${a.base}${a.quote}`.toLowerCase() === filter.toLowerCase()
			);
		}
	}
</script>

<svelte:head>
	<title>Price Alerts</title>
</svelte:head>

<div class="container">
	{#if auth.isLoggedIn}
		<h2 class="text-3xl mb-4">My alerts</h2>
		<div class="mb-6">View and manage all your price alerts in one place.</div>

		{#if data.alerts && data.alerts.length > 0}
			<div class="flex gap-2 items-center justify-end mb-4 md:hidden">
				<a href="/alerts/price-alert/" class="button">Create alert</a>
			</div>
			<div
				class="bg-gray-50 dark:bg-gray-900/10 p-2 md:p-6 rounded-lg w-full text-gray-600 dark:text-gray-300"
			>
				<AlertToolbar
					{pairList}
					onSearch={filterAlerts}
					onFilterByPair={filterAlertsByPair}
					onToggleSort={toggleSort}
					isRecent={isRecent}
				/>

				{#if alerts.length === 0}
					<p class="text-center text-gray-400 my-16">No results found.</p>
				{:else}
					<AlertTable {alerts} {providers} {auth} />
				{/if}
			</div>
		{:else}
			<div class="text-center">
				<p class="text-2xl mb-10">You currently do not have any price alert.</p>
				<a href="/alerts/price-alert/" class="button">Create alert</a>
			</div>
		{/if}
	{/if}
</div>
