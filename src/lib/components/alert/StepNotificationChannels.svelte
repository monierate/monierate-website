<script lang="ts">
	import { Channels } from './useAlertForm';
	import { change_screen, CurrentScreen } from './useAlertForm';

	export let selectedChannels: string[] = [];
	export let selectedChannelsValues: { [key in Channels]: string } = {
		email: '',
		webhook: ''
	};

	const toggle_channel = (channel: Channels) => {
		if (selectedChannels.includes(channel)) {
			selectedChannels = selectedChannels.filter((c) => c !== channel);
		} else {
			selectedChannels = [...selectedChannels, channel];
		}
	};
</script>

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
						class="size-5 mr-2"
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
					<div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center ml-2">
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
						class="size-5 pr-2"
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
					<div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center ml-2">
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

	<button
		class="button w-full"
		disabled={!(
			(selectedChannelsValues.email && selectedChannels.includes(Channels.EMAIL)) ||
			(selectedChannelsValues.webhook && selectedChannels.includes(Channels.WEBHOOK))
		)}
		on:click={() => change_screen(CurrentScreen.THIRD_SCREEN)}>Continue</button
	>
	<button
		class="border border-gray-300 dark:border-gray-600 hover:border-gray-400 w-full mt-4 p-2 rounded-lg text-center text-gray-500 dark:text-gray-400"
		on:click={() => change_screen(CurrentScreen.FIRST_SCREEN)}>Go back</button
	>
</div>

<style>
	.c-buttom {
		@apply w-full text-left bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400;
	}
</style>
