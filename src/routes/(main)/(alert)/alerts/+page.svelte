<script lang="ts">
	import { capitalizeFirstLetter, friendlyDate, getNextTriggerTime } from '$lib/functions';
	import { notify } from '$lib/notification';
	import {
		get_all_alerts,
		delete_alert,
		update_alert,
		delete_all_alert,
		delete_all_disabled_alert,
		delete_all_enabled_alert
	} from '$lib/price_alert/alert.service.js';
	import { onMount } from 'svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import { goto } from '$app/navigation';
	import CustomSelectBox from '$lib/components/CustomSelectBox.svelte';
	import TipView from '$lib/components/TipView.svelte';
	import { browser } from '$app/environment';

	type Alert = {
		_id: string;
		quote: string;
		base: string;
		type: string;
		price: number;
		direction: string;
		frequency: {
			type: string;
			value: number;
			time?: number;
		};
		exchange: string[];
		cooldown: number;
		channel: string[];
		note?: string;
		disable_after_trigger: boolean;
		status: string;
		created_at: any;
		last_triggered: any;
	};

	type Alerts = Alert[];

	export let data;
	const user: any = data.user;
	const providers = data.providers;
	const pair_list = data.pair_list;
	$: alerts = data.alerts?.sort(
		(a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	) as Alerts;

	$: {
		if (
			(browser && !user?.isLoggedIn) ||
			(browser && user?.isLoggedIn && data.alerts && !(data.alerts.length > 0))
		) {
			goto('/alerts/price-alert/periodic', { replaceState: true });
		}
	}

	let showSearch: boolean = false;
	let showConfirmAlertDeletion = {} as { [key: string]: boolean };
	let showConfirmAllAlertDeletion: boolean = false;
	let showConfirmDisabledAlertDeletion: boolean = false;
	let showConfirmEnabledAlertDeletion: boolean = false;

	$: {
		alerts = alerts?.map((a) => ({
			...a,
			exchange: a.exchange.map((e) => providers[e]?.name ?? e)
		}));
	}
	let isRecent = true;
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

	let isToggling = false;
	async function toggleAlertStatus(id: string) {
		if (isToggling) return;
		isToggling = true;
		const getStatus = 'active' === alerts.find((a) => a._id === id)?.status ? 'disabled' : 'active';
		const res = await update_alert({ id, status: getStatus });
		if (res.status === 'success') {
			alerts = alerts.map((n: any) => (n._id === id ? { ...n, status: getStatus } : n));
		} else {
			notify(`There was an error ${getStatus === 'active' ? 'enabling' : 'disabling'} alert`);
		}
		isToggling = false;
	}

	let searchText: string = '';
	function filterAlerts() {
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

	let selectedPairForFilter: string = '';
	function filterAlertsByPair() {
		if (selectedPairForFilter === '') {
			alerts = data.alerts;
		} else {
			alerts = data.alerts.filter(
				(a: any) => `${a.base}${a.quote}`.toLowerCase() === selectedPairForFilter.toLowerCase()
			);
		}
	}

	async function deleteAlert(id: string) {
		const res = await delete_alert(id);
		if (res.status === 'success') {
			data.alerts = data.alerts.filter((a: any) => a._id !== id);
		} else {
			notify('There was an error deleting the alert');
		}
		showConfirmAlertDeletion[id] = false;
	}

	async function deleteAllAlert() {
		const res = await delete_all_alert();
		if (res.status === 'success') {
			let getAlerts = await get_all_alerts();
			data.alerts = getAlerts.data;
			notify('All alerts deleted successfully');
		} else {
			notify('There was an error deleting all alerts');
		}
		showConfirmAllAlertDeletion = false;
	}

	async function deleteAllDisabledAlert() {
		const res = await delete_all_disabled_alert();
		if (res.status === 'success') {
			let getAlerts = await get_all_alerts();
			data.alerts = getAlerts.data;
			notify('All disabled alerts deleted successfully');
		} else {
			notify('There was an error deleting disabled alerts');
		}
		showConfirmDisabledAlertDeletion = false;
	}

	async function deleteAllEnabledAlert() {
		const res = await delete_all_enabled_alert();
		if (res.status === 'success') {
			let getAlerts = await get_all_alerts();
			data.alerts = getAlerts.data;
			notify('All enabled alerts deleted successfully');
		} else {
			notify('There was an error deleting enabled alerts');
		}
		showConfirmEnabledAlertDeletion = false;
	}

	let showAllAlertOptions: boolean = false;
	let showAlertOptionsEvent: any;
	function showAlertOptions(alert_id: string) {
		try {
			window.removeEventListener('click', showAlertOptionsEvent);
			let alert = document.getElementById('alert-option-' + alert_id);
			alert?.classList.toggle('hidden');
			showAlertOptionsEvent = window.addEventListener('click', (e) => {
				if (e.target instanceof HTMLElement && !e.target.closest('.alert-options')) {
					alert?.classList.add('hidden');
				}
			});
		} catch (e) {
			console.error(e);
		}
	}

	function editAlert(alert_id: string, alert_type: string) {
		goto(`/alerts/price-alert/${alert_type}?edit_alert=${alert_id}`);
	}

	function getProvider(code: string) {
		return providers.find((p: any) => p.code === code);
	}

	onMount(() => {
		window.addEventListener('click', (e) => {
			if (e.target instanceof HTMLElement && !e.target.closest('.all-alert-options')) {
				showAllAlertOptions = false;
			}
		});
	});
</script>

<svelte:head>
	<title>Price Alerts</title>
</svelte:head>

<div class="container">
	{#if user.isLoggedIn}
		<h2 class="text-3xl mb-4">My alerts</h2>
		<div class="mb-6">View and manage all your price alerts in one place.</div>

		{#if data.alerts && data.alerts.length > 0}
			<div class="flex gap-2 items-center justify-end mb-4 md:hidden">
				<a href="/alerts/price-alert/" class="button">Create alert</a>
			</div>
			<div
				class="bg-gray-50 dark:bg-gray-900/10 p-2 md:p-6 rounded-lg w-full text-gray-600 dark:text-gray-300"
			>
				<div class="flex items-center justify-between mb-4 relative">
					<div class="flex gap-2 items-center">
						<span class="text-gray-800 dark:text-gray-400">Sort:</span>
						<button
							class="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded"
							on:click={toggleSort}
						>
							{#if isRecent}
								<!-- Sort Descending -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d="M11 5h10" />
									<path d="M11 9h7" />
									<path d="M11 13h4" />
									<path d="M3 17l3 3 3-3" />
									<path d="M6 4v16" />
								</svg>
							{:else}
								<!-- Sort Ascending -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d="M11 11h4" />
									<path d="M11 15h7" />
									<path d="M11 19h10" />
									<path d="M3 7l3-3 3 3" />
									<path d="M6 4v16" />
								</svg>
							{/if}
							{isRecent ? 'Most Recent' : 'Oldest'}
						</button>
						<span class="hidden md:inline">
							<CustomSelectBox
								options={pair_list}
								className="!py-1"
								on:select={filterAlertsByPair}
								bind:selected={selectedPairForFilter}
								placeholder="Filter by Pairs"
							/>
							<button
								class="text-blue-500 mx-2 {selectedPairForFilter === '' ? 'hidden' : ''}"
								on:click={() => {
									selectedPairForFilter = '';
									filterAlertsByPair();
								}}>Clear filter</button
							>
						</span>
						<span class="flex md:inline items-center justify-center md:justify-start">
							<button
								class="bg-transpareent p-2 md:hidden"
								on:click={() => (showSearch = !showSearch)}
								aria-label="Search"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="size-5 cursor-pointer"
								>
									<path
										fill-rule="evenodd"
										d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
							<span
								class="flex items-center gap-2 md:flex-none w-full md:w-auto bg-gray-50 dark:bg-gray-800 p-2 md:p-0 absolute md:static -top-1 left-0 transition-opacity duration-300 md:inline z-50"
								class:hidden={!showSearch}
							>
								<input
									type="search"
									class="input border-none w-10 m-0 w-auto bg-gray-200 dark:bg-gray-700 text-gray-500 px-3 py-1 rounded"
									placeholder="Search..."
									bind:value={searchText}
									on:input={filterAlerts}
								/>
								<button
									on:click={() => (showSearch = false)}
									class="button md:hidden"
									aria-label="Close">Cancel</button
								>
							</span>
						</span>
					</div>
					<div class="flex items-center gap-5">
						<span class="relative all-alert-options pr-5 md:pr-0">
							<button on:click={() => (showAllAlertOptions = !showAllAlertOptions)}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="size-5"
								>
									<path
										fill-rule="evenodd"
										d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
							<span
								class="{showAllAlertOptions
									? 'flex'
									: 'hidden'} flex-col gap-4 w-64 z-[70] absolute top-5 right-0 md:left-1/2 md:transform md:-translate-x-1/2 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-lg"
							>
								<button
									class="hover:bg-gray-200 dark:hover:bg-gray-800"
									on:click={() => (showConfirmAllAlertDeletion = true)}>Delete all alerts</button
								>
								<button
									class="hover:bg-gray-200 dark:hover:bg-gray-800"
									on:click={() => (showConfirmEnabledAlertDeletion = true)}
									>Delete all enabled alerts</button
								>
								<button
									class="hover:bg-gray-200 dark:hover:bg-gray-800"
									on:click={() => (showConfirmDisabledAlertDeletion = true)}
									>Delete all disabled alerts</button
								>
							</span>
						</span>
						<a href="/alerts/price-alert/" class="button hidden md:inline-block">Create alert</a>
					</div>
				</div>

				<div class="md:hidden mb-8">
					<span class="text-gray-800 dark:text-gray-400">Filter:</span>
					<CustomSelectBox
						options={pair_list}
						className="!py-1"
						on:select={filterAlertsByPair}
						bind:selected={selectedPairForFilter}
						placeholder="Filter by Pairs"
					/>
					<button
						class="text-blue-500 mx-2 {selectedPairForFilter === '' ? 'hidden' : ''}"
						on:click={() => {
							selectedPairForFilter = '';
							filterAlertsByPair();
						}}>Clear filter</button
					>
				</div>

				{#if searchText !== '' || (selectedPairForFilter !== '' && alerts.length === 0)}
					<p class="text-center text-gray-400 my-16">No results found.</p>
				{:else}
					<div class="mb-10 overflow-x-auto md:overflow-visible">
						<div class="min-w-[800px] md:min-w-auto">
							<table class="table-auto w-full border-separate border-spacing-y-4">
								<thead>
									<tr>
										<th class="p-4 text-left">Pairs, Providers</th>
										<th class="p-4 text-left">Channels</th>
										<th class="p-4 text-left">Interval</th>
										<th class="p-4 text-left">Last Trigger</th>
										<th class="p-4 text-left">Next Trigger</th>
										<th class="p-4 text-left" />
									</tr>
								</thead>
								<tbody>
									{#each alerts as alert}
										<tr
											class="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
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
																<img
																	src="/icons/{getProvider(exchange).icon}"
																	alt="icon"
																	class="w-4 h-4 mr-2"
																/>
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
																		(index > 2 && alert.exchange.length - 3 > 1
																			? ' others'
																			: ' other')}
																</span>
															{/if}
														{/if}
													{/each}
												</span>
											</td>
											<td class="px-4 py-2 text-left">
												<span class="flex flex-wrap gap-2 items-center">
													{#each Object.entries(alert.channel) as [key, value]}
														<span
															class="border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 text-sm"
														>
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
												{getNextTriggerTime(alert.frequency, user.userData.data.timezone || 'UTC')}
											</td>
											<td class="px-4 py-2 text-left">
												<div>
													<div class="md:hidden ml-1 alert-options">
														<button
															class="text-gray-400 hover:text-red-500"
															aria-label="Options"
															on:click={() => showAlertOptions(alert._id)}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 24 24"
																fill="currentColor"
																class="size-6"
															>
																<path
																	fill-rule="evenodd"
																	d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
																	clip-rule="evenodd"
																/>
															</svg>
														</button>
													</div>
													<div
														class="hidden md:flex items-center gap-4 fixed md:static left-0 bottom-0 z-[60] bg-gray-100 dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent p-5 md:p-0 w-full md:w-auto alert-options"
														id="alert-option-{alert._id}"
													>
														<span class="flex items-center gap-4 w-full md:w-auto p-4 md:p-0">
															<button
																class="w-12 h-6 rounded-full relative focus:outline-none"
																style="background-color: {alert.status === 'active'
																	? '#4CAF50'
																	: '#c0c0c0'};"
																on:click={() => toggleAlertStatus(alert._id)}
															>
																<span
																	class="absolute top-0.5 left-1 w-5 h-5 bg-white rounded-full transition-transform"
																	style="transform: translateX({alert.status === 'active'
																		? '24px'
																		: '0px'});"
																/>
															</button>
															<button
																class="md:hidden"
																on:click={() => toggleAlertStatus(alert._id)}
																>Enable/Disable this alert</button
															>
														</span>
														<span class="flex items-center gap-4 w-full md:w-auto p-4 md:p-0">
															<button
																class="text-gray-400 hover:text-gray-500"
																aria-label="Edit"
																on:click={() => editAlert(alert._id, alert.type)}
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	viewBox="0 0 20 20"
																	fill="currentColor"
																	class="size-5"
																>
																	<path
																		d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z"
																	/>
																	<path
																		d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z"
																	/>
																</svg>
															</button>
															<button
																class="md:hidden"
																on:click={() => editAlert(alert._id, alert.type)}
																>Edit this alert</button
															>
														</span>
														<span class="flex items-center gap-4 w-full md:w-auto p-4 md:p-0">
															<button
																class="text-gray-400 hover:text-red-500"
																aria-label="Delete"
																on:click={() => (showConfirmAlertDeletion[alert._id] = true)}
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	viewBox="0 0 20 20"
																	fill="currentColor"
																	class="size-5"
																>
																	<path
																		fill-rule="evenodd"
																		d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
																		clip-rule="evenodd"
																	/>
																</svg>
															</button>
															<button
																class="md:hidden"
																on:click={() => (showConfirmAlertDeletion[alert._id] = true)}
																>Delete this alert</button
															>
														</span>
													</div>
													<Dialog
														bind:isOpen={showConfirmAlertDeletion[alert._id]}
														title="Are you sure you want to delete this alert?"
														actions={[
															{
																label: 'Confirm',
																callback: () => {
																	deleteAlert(alert._id);
																}
															}
														]}
													>
														<p class="mb-4">Please confirm alert deletion.</p>
													</Dialog>
												</div>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
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

<Dialog
	bind:isOpen={showConfirmAllAlertDeletion}
	title="Are you sure you want to delete all your alerts?"
	actions={[
		{
			label: 'Confirm',
			callback: () => {
				deleteAllAlert();
			}
		}
	]}
>
	<p class="mb-4">Please confirm alert deletion.</p>
</Dialog>

<Dialog
	bind:isOpen={showConfirmDisabledAlertDeletion}
	title="Are you sure you want to delete all your disabled alerts?"
	actions={[
		{
			label: 'Confirm',
			callback: () => {
				deleteAllDisabledAlert();
			}
		}
	]}
>
	<p class="mb-4">Please confirm alert deletion.</p>
</Dialog>

<Dialog
	bind:isOpen={showConfirmEnabledAlertDeletion}
	title="Are you sure you want to delete all your enabled alerts?"
	actions={[
		{
			label: 'Confirm',
			callback: () => {
				deleteAllEnabledAlert();
			}
		}
	]}
>
	<p class="mb-4">Please confirm alert deletion.</p>
</Dialog>
