<script lang="ts">
	import CustomSelectBox from '$lib/components/CustomSelectBox.svelte';

	type Provider = { name: string; code: string; icon: string; pairs: any };
	type DropdownOption = { label: string; value: string; icon: string };

	enum CurrentScreen {
		FIRST_SCREEN = 's1',
		SECOND_SCREEN = 's2'
	}

	enum Channels {
		EMAIL = 'email',
		WEBHOOK = 'webhook'
	}

	$: current_screen = CurrentScreen.FIRST_SCREEN;

	const change_screen = (screen: CurrentScreen) => {
		current_screen = screen;
	};

	export let data;
	const providers: [Provider] = data.providers;
	const pair_list: any = data.pair_list;
	const user: any = data.user;

	let currentView: string = 'details' as 'details' | 'options';
	let historyView: string = 'active-alerts' as 'active-alerts' | 'alert-history';

	let selectedPair: string = 'usdngn';
	let selectedProviders: string[] = [];
	$: selectedChannels = [] as string[];
	let selectedChannelsValues = {} as { email: string; webhook: string };
	let disableAfterTrigger: boolean = false;
	let note: string = '';
	let selectedCooldown: number;
	let selectedRange: string = 'above';
	let selectedAmount: number;

	if (user.isLoggedIn) {
		selectedChannelsValues = { email: user.email, webhook: '' };
	}

	let isSelectedProvidersDropdownOpen: boolean = false;

	const toggle_channel = (channel: Channels) => {
		if (selectedChannels.includes(channel)) {
			selectedChannels = selectedChannels.filter((c) => c !== channel);
		} else {
			selectedChannels = [...selectedChannels, channel];
		}
	};

	let providersForDropdown: DropdownOption[] = [];
	$: {
		providersForDropdown = Object.entries(providers)
			.filter(([_, value]) => {
				try {
					return value.pairs[selectedPair.toLowerCase()] !== undefined;
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
			}) as DropdownOption[];

		selectedProviders = [];
	}
</script>

<svelte:head>
	<title>Periodic Price Alerts</title>
</svelte:head>

<div class="flex flex-col md:flex-row gap-4">
	<div class="w-full md:w-1/2">
		<div class="md:w-3/4 mx-auto px-2 md:px-10 pb-5 flex flex-col gap-5">
			<div class="text-center mb-8">
				<h2 class="text-2xl mb-2 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="size-10"
					>
						<path
							d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 2h-1ZM9.5 6A1.5 1.5 0 0 0 8 7.5v9A1.5 1.5 0 0 0 9.5 18h1a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 10.5 6h-1ZM3.5 10A1.5 1.5 0 0 0 2 11.5v5A1.5 1.5 0 0 0 3.5 18h1A1.5 1.5 0 0 0 6 16.5v-5A1.5 1.5 0 0 0 4.5 10h-1Z"
						/>
					</svg>
					Price Alerts
				</h2>
				<p class="text-gray-500">Get notified when your favorite stocks reach a certain price</p>
			</div>

			{#if current_screen === CurrentScreen.FIRST_SCREEN}
				<div>
					<p class="text-xl mb-4">Select a pair, range, providers and amount to get started.</p>

					<div class="mb-5">
						<label for="pair" class="label">Select a pair</label>
						<CustomSelectBox
							options={pair_list}
							className="!w-full"
							bind:selected={selectedPair}
							id="pair"
							fullbox={true}
						/>
					</div>

					<div class="mb-5">
						<label for="range" class="label">Select range</label>
						<CustomSelectBox
							options={[
								{ label: 'above', icon: 'fas fa-arrow-up' },
								{ label: 'bellow', icon: 'fas fa-arrow-down' }
							]}
							className="!w-full"
							bind:selected={selectedRange}
							id="range"
							fullbox={true}
							placeholder="Select range"
						/>
					</div>

					<div class="mb-5">
						<label for="amount" class="label">Select amount</label>
						<input
							type="number"
							id="amount"
							class="c-buttom"
							bind:value={selectedAmount}
							placeholder="Enter amount"
						/>
					</div>

					<div class="mb-10">
						<label for="providers" class="label">Select providers</label>
						<div
							class="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400"
						>
							{#if !isSelectedProvidersDropdownOpen}
								{#each selectedProviders as provider}
									<span
										class="bg-gray-100 dark:bg-gray-800 text-sm px-2 py-1 rounded-full mr-2 inline-flex items-center mb-2"
									>
										<img
											src="/icons/{Object.entries(providers).find(
												([_, value]) => value.code === provider
											)?.[1]?.icon}"
											alt="icon"
											class="w-4 h-4 mr-2"
										/>

										{Object.entries(providers).find(([_, value]) => value.code === provider)?.[1]
											?.name || provider}

										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="size-5 ml-2 cursor-pointer"
											on:click={() =>
												(selectedProviders = selectedProviders.filter((p) => p !== provider))}
											on:keydown={() => {}}
										>
											<path
												d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
											/>
										</svg>
									</span>
								{/each}
							{/if}

							<CustomSelectBox
								options={providersForDropdown}
								className="!p-1 !px-2 !rounded-full !bg-gray-100 dark:!bg-gray-800 {selectedProviders.length ===
									0 || isSelectedProvidersDropdownOpen
									? 'block !w-full !justify-center !border-none !py-0'
									: '!text-sm'}"
								bind:selected={selectedProviders}
								multiple={true}
								placeholder={selectedProviders.length === 0 || isSelectedProvidersDropdownOpen
									? 'Select providers'
									: 'Add'}
								bind:isDropdownOpen={isSelectedProvidersDropdownOpen}
								fullbox={selectedProviders.length === 0 || isSelectedProvidersDropdownOpen
									? true
									: false}
								id="providers"
							/>
						</div>
					</div>

					<button
						class="button w-full"
						disabled={!selectedPair ||
							selectedProviders.length === 0 ||
							!selectedAmount ||
							selectedAmount <= 0 ||
							!selectedRange}
						on:click={() => change_screen(CurrentScreen.SECOND_SCREEN)}>Continue</button
					>
				</div>
			{:else if current_screen === CurrentScreen.SECOND_SCREEN}
				<div>
					<p class="text-xl mb-4">Where do you want to receive the alert?</p>

					<div class="mb-10">
						<div class="mb-4">
							<button
								class="c-buttom mb-2 flex flex-row items-center justify-between"
								on:click={() => toggle_channel(Channels.EMAIL)}
							>
								<span class="inline-flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										class="size-5"
									>
										<path
											d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z"
										/>
										<path
											d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z"
										/>
									</svg>

									Email
								</span>
								{#if selectedChannels.includes(Channels.EMAIL)}
									<div
										class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center ml-2"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="white"
											stroke-width="3"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<polyline points="20 6 9 17 4 12" />
										</svg>
									</div>
								{/if}
							</button>
							{#if selectedChannels.includes(Channels.EMAIL)}
								<label for="email" class="label text-sm">Email address</label>
								<input
									type="email"
									id="email"
									class="input"
									bind:value={selectedChannelsValues.email}
									placeholder="example@example.com"
								/>
							{/if}
						</div>

						<div class="mb-4">
							<button
								class="c-buttom mb-4 flex flex-row items-center justify-between"
								on:click={() => toggle_channel(Channels.WEBHOOK)}
							>
								<span class="inline-flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										class="size-5 mr-2"
									>
										<path
											fill-rule="evenodd"
											d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-1.503.204A6.5 6.5 0 1 1 7.95 3.83L6.927 5.62a1.453 1.453 0 0 0 1.91 2.02l.175-.087a.5.5 0 0 1 .224-.053h.146a.5.5 0 0 1 .447.724l-.028.055a.4.4 0 0 1-.357.221h-.502a2.26 2.26 0 0 0-1.88 1.006l-.044.066a2.099 2.099 0 0 0 1.085 3.156.58.58 0 0 1 .397.547v1.05a1.175 1.175 0 0 0 2.093.734l1.611-2.014c.192-.24.296-.536.296-.842 0-.316.128-.624.353-.85a1.363 1.363 0 0 0 .173-1.716l-.464-.696a.369.369 0 0 1 .527-.499l.343.257c.316.237.738.275 1.091.098a.586.586 0 0 1 .677.11l1.297 1.297Z"
											clip-rule="evenodd"
										/>
									</svg>

									Web hook
								</span>
								{#if selectedChannels.includes(Channels.WEBHOOK)}
									<div
										class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center ml-2"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="white"
											stroke-width="3"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<polyline points="20 6 9 17 4 12" />
										</svg>
									</div>
								{/if}
							</button>
							{#if selectedChannels.includes(Channels.WEBHOOK)}
								<label for="uri" class="label text-sm">Webhook URI</label>
								<input
									type="text"
									id="uri"
									class="input"
									bind:value={selectedChannelsValues.webhook}
									placeholder="https://example.com/webhook"
								/>
							{/if}
						</div>
					</div>

					<button class="button w-full">Set alert</button>
					<button
						class="border border-gray-300 dark:border-gray-600 hover:border-gray-400 w-full mt-4 p-2 rounded-lg text-center text-gray-500 dark:text-gray-400"
						on:click={() => change_screen(CurrentScreen.FIRST_SCREEN)}>Go back</button
					>
				</div>
			{/if}
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
			<div class="mt-4 space-y-10 md:w-[90%] md:mx-auto">
				<div class="flex gap-4 items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="size-10"
					>
						<path
							d="M3.505 2.365A41.369 41.369 0 0 1 9 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 0 0-.577-.069 43.141 43.141 0 0 0-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 0 1 5 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914Z"
						/>
						<path
							d="M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.472 9 8.998v2.24c0 1.519 1.147 2.839 2.71 2.935.214.013.428.024.642.034.2.009.385.09.518.224l2.35 2.35a.75.75 0 0 0 1.28-.531v-2.07c1.453-.195 2.5-1.463 2.5-2.915V8.998c0-1.526-1.157-2.85-2.729-2.936A41.645 41.645 0 0 0 14 6Z"
						/>
					</svg>

					<p>Get regular price updates delivered to your device at any frequency.</p>
				</div>
				<div class="flex gap-2 items-center">
					<p>Convert the price to your local fiat currency, or view the value relative to BTC.</p>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="size-10"
					>
						<path
							d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 0 0-1.138-.432ZM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 0 0-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152Z"
						/>
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-6a.75.75 0 0 1 .75.75v.316a3.78 3.78 0 0 1 1.653.713c.426.33.744.74.925 1.2a.75.75 0 0 1-1.395.55 1.35 1.35 0 0 0-.447-.563 2.187 2.187 0 0 0-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 1 1-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 1 1 1.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 0 1-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 0 1 1.653-.713V4.75A.75.75 0 0 1 10 4Z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="flex gap-4 items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="size-16"
					>
						<path
							fill-rule="evenodd"
							d="M2.5 3A1.5 1.5 0 0 0 1 4.5v4A1.5 1.5 0 0 0 2.5 10h6A1.5 1.5 0 0 0 10 8.5v-4A1.5 1.5 0 0 0 8.5 3h-6Zm11 2A1.5 1.5 0 0 0 12 6.5v7a1.5 1.5 0 0 0 1.5 1.5h4a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 17.5 5h-4Zm-10 7A1.5 1.5 0 0 0 2 13.5v2A1.5 1.5 0 0 0 3.5 17h6a1.5 1.5 0 0 0 1.5-1.5v-2A1.5 1.5 0 0 0 9.5 12h-6Z"
							clip-rule="evenodd"
						/>
					</svg>

					<p>
						Get price data directly from any of our 47 supported exchanges, including Coinbase and
						Binance. Or use our market average.
					</p>
				</div>
			</div>
		{/if}
		{#if currentView === 'options'}
			<div class="mt-4 space-y-8 flex flex-col items-center">
				<div class="flex gap-4 items-center">
					<label for="cooldown">Cooldown:</label>
					<CustomSelectBox
						id="cooldown"
						options={[
							{ label: '5 minutes', value: 5, icon: 'fas fa-clock' },
							{ label: '10 minutes', value: 10, icon: 'fas fa-clock' },
							{ label: '15 minutes', value: 15, icon: 'fas fa-clock' },
							{ label: '30 minutes', value: 30, icon: 'fas fa-clock' },
							{ label: '1 hour', value: 60, icon: 'fas fa-clock' },
							{ label: '2 hours', value: 120, icon: 'fas fa-clock' },
							{ label: '3 hours', value: 180, icon: 'fas fa-clock' },
							{ label: '4 hours', value: 240, icon: 'fas fa-clock' },
							{ label: '6 hours', value: 360, icon: 'fas fa-clock' },
							{ label: '12 hours', value: 720, icon: 'fas fa-clock' },
							{ label: '24 hours', value: 1440, icon: 'fas fa-clock' },
							{ label: '7 days', value: 10080, icon: 'fas fa-clock' }
						]}
						className="inline-block !w-auto !p-1 leading-none"
						bind:selected={selectedCooldown}
					/>
					<span class="relative group">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="size-5 text-gray-500"
						>
							<path
								fill-rule="evenodd"
								d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
								clip-rule="evenodd"
							/>
						</svg>

						<span
							class="hidden group-hover:inline-block absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 shadow-md text-sm text-white p-1 rounded-md whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
						>
							Specify an amount of time that must pass before the alert can be triggered again.
						</span>
					</span>
				</div>

				<div class="flex gap-4 items-center">
					<label for="add-note">Add a note:</label>
					<input
						id="add-note"
						type="text"
						class="bg-gray-50 text-dark dark:bg-gray-800 dark:text-white p-1 px-2 w-[125px] h-7 rounded-md border border-gray-300 dark:border-gray-600 hover:border-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0"
						placeholder="Optional"
						bind:value={note}
					/>
					<span class="relative group">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="size-5 text-gray-500"
						>
							<path
								fill-rule="evenodd"
								d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
								clip-rule="evenodd"
							/>
						</svg>

						<span
							class="hidden group-hover:inline-block absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 shadow-md text-sm text-white p-1 rounded-md whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
						>
							This will appear along side the alert to help give you context.
						</span>
					</span>
				</div>

				<div class="flex gap-4 items-center">
					<input
						id="alert-spam"
						type="checkbox"
						style="transform: scale(1.5);"
						placeholder="Optional"
						bind:checked={disableAfterTrigger}
					/>
					<label for="alert-spam">Disable this alert after it triggers onces.</label>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.c-buttom {
		@apply w-full text-left bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0;
	}
</style>
