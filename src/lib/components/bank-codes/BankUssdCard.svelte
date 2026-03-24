<script lang="ts">
	import { useImageOrDefault } from '$lib/utils/loadImageOrDefault';
	import { onMount } from 'svelte';
	import { copyToClipboard } from '$lib/functions';

	export let bankData: any;
	export let countryCode: string;
	export let multiCountry: boolean = true;

	let image: string = '/icons/default.png';

	let copied: boolean = false;
	const handleCopy = (text: string) => {
		copyToClipboard(text);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	};

	onMount(async () => {
		image = await useImageOrDefault(`/icons/svg/${bankData.id}.svg`, image);
	});
</script>

<div
	class="bg-white dark:bg-gray-900/40 rounded-xl shadow-sm p-4 w-full md:w-72 border border-gray-200 dark:border-gray-700"
>
	<div class="flex items-center space-x-2 mb-3">
		<picture>
			<source srcset={`/icons/svg/${bankData.id}.svg`} type="image/svg+xml" />
			<source srcset={`/icons/png/${bankData.id}.png`} type="image/png" />
			<img
				width="800"
				height="114"
				src={image}
				class="rounded-full w-6 h-6 border border-gray-200 dark:border-gray-600 object-contain"
				alt="{bankData.name} icon"
			/>
		</picture>
		<h2 class="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">{bankData.name}</h2>
	</div>

	<div class="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
		<div>
			<p class="font-medium">Airtime</p>
			<p class="font-mono text-gray-600 dark:text-gray-400">
				{bankData.ussd.airtime_self || bankData.ussd.airtime_others || '-'}
			</p>
		</div>

		<div>
			<p class="font-medium">Transfer</p>
			<p class="font-mono text-gray-600 dark:text-gray-400">
				{bankData.ussd.transfer_to_same_bank || bankData.ussd.transfer_other_banks || '-'}
			</p>
		</div>
	</div>

	<div class="mt-4 flex items-center justify-between gap-2">
		<button
			class="bg-primary/20 text-primary font-semibold rounded-full py-2 px-3 w-full flex gap-2 justify-center items-center hover:bg-primary/30 transition"
			on:click={() => handleCopy(bankData.ussd.start)}
		>
			<span class="w-3/4 overflow-hidden text-ellipsis whitespace-nowrap">
				{#if copied}
					<span class="block animate-slide-up font-semibold text-sm"> Copied! </span>
				{:else}
					<span class="block animate-slide-up">
						{bankData.ussd.start}
					</span>
				{/if}
			</span>
			{#if copied}
				<span class="block animate-slide-up">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="size-5"
					>
						<path
							fill-rule="evenodd"
							d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
			{:else}
				<span class="block animate-slide-up">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="size-5"
					>
						<path
							fill-rule="evenodd"
							d="M15.988 3.012A2.25 2.25 0 0 1 18 5.25v6.5A2.25 2.25 0 0 1 15.75 14H13.5v-3.379a3 3 0 0 0-.879-2.121l-3.12-3.121a3 3 0 0 0-1.402-.791 2.252 2.252 0 0 1 1.913-1.576A2.25 2.25 0 0 1 12.25 1h1.5a2.25 2.25 0 0 1 2.238 2.012ZM11.5 3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v.25h-3v-.25Z"
							clip-rule="evenodd"
						/>
						<path
							d="M3.5 6A1.5 1.5 0 0 0 2 7.5v9A1.5 1.5 0 0 0 3.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L8.44 6.439A1.5 1.5 0 0 0 7.378 6H3.5Z"
						/>
					</svg>
				</span>
			{/if}
		</button>
		<a
			class="text-gray-500 font-bold text-sm hover:text-gray-700 dark:hover:text-gray-300 transition border border-gray-200 rounded-full py-2 px-4 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
			href={multiCountry ? `/${countryCode}/ussd-codes/banks/${bankData.id}`: `/bank-codes/ussd/${bankData.id}`}
		>
			More
		</a>
	</div>
</div>

<style>
	@keyframes slide-up {
		0% {
			opacity: 0;
			transform: translateY(10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-slide-up {
		animation: slide-up 0.3s ease-out;
	}
</style>
