<script lang="ts">
	import { onMount } from 'svelte';
	import { useImageOrDefault } from '$lib/utils/loadImageOrDefault';
	import { copyToClipboard } from '$lib/functions';

	export let data;

	let bankInfo = data.bankInfo;
	let countryName = data.countryName;
	let countryCode = data.countryCode;

	const ussdCodes = [
		{ option: 'Start', code: bankInfo.ussd.start },
		{ option: 'Transfer to same bank', code: bankInfo.ussd.transfer_to_same_bank || null },
		{ option: 'Transfer to other banks', code: bankInfo.ussd.transfer_other_banks || null },
		{ option: 'Airtime self', code: bankInfo.ussd.airtime_self || null },
		{ option: 'Airtime others', code: bankInfo.ussd.airtime_others || null },
		{ option: 'Balance', code: bankInfo.ussd.balance || null },
		{ option: 'BVN', code: bankInfo.ussd.bvn || null },
		{ option: 'Update BVN details', code: bankInfo.ussd.update_bvn_details || null },
		{ option: 'Stop debit transactions', code: bankInfo.ussd.stop_debit_transactions || null },
		{ option: 'Activate code', code: bankInfo.ussd.activate_code || null },
		{ option: 'Country', code: countryName || null }
	];

	let copied: boolean = false;
	const handleCopy = (text: string) => {
		if (data.isMobile) {
			return window.open(`tel:${text}`, '_self');
		}
		copyToClipboard(text);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	};

	let defaultImage: string = '/icons/default.png';
	onMount(async () => {
		defaultImage = await useImageOrDefault(`/icons/svg/${bankInfo.id}.svg`, defaultImage);
	});
</script>

<svelte:head>
	<title>{bankInfo.name} {countryName} USSD Codes</title>
	<meta name="description" content="Get all {bankInfo.name} Bank USSD codes on Monierate." />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{bankInfo.name} USSD Codes {countryName}" />
	<meta property="og:description" content="Get all {countryName} Bank USSD codes." />
	<meta property="og:url" content="https://monierate.com/{countryCode}/ussd-code/{bankInfo.id}" />
</svelte:head>

<div class="mb-8 space-y-8">
	<!-- Header -->

	<h1 class="text-2xl md:text-4xl">
		{bankInfo.name} USSD Code
	</h1>

	<!-- Header Button -->
	<div class="flex items-center gap-3">
		<picture>
			<source srcset={`/icons/svg/${bankInfo.id}.svg`} type="image/svg+xml" />
			<source srcset={`/icons/png/${bankInfo.id}.png`} type="image/png" />
			<img
				class="w-[50px] h-[50px] object-cover rounded-full"
				alt="{bankInfo.name} icon"
				src={`/icons/svg/${bankInfo.id}.svg`}
				srcset={defaultImage}
			/>
		</picture>
		<button
			class="bg-primary/20 text-primary font-semibold rounded-full py-2 px-4 inline-flex gap-2 justify-center items-center hover:bg-primary/30 transition"
			on:click={() => handleCopy(bankInfo.ussd.start)}
		>
			<span class="font-medium">Start</span>
			<span class="w-3/4 overflow-hidden text-ellipsis whitespace-nowrap">
				{#if copied}
					<span class="block animate-slide-up font-semibold text-sm py-1.5 px-1"> Copied! </span>
				{:else}
					<span class="block animate-slide-up text-2xl font-medium">
						{bankInfo.ussd.start}
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
			{:else if data.isMobile}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="size-8"
				>
					<path
						d="M22 16.92v3a2 2 0 0 1-2.18 2A19.88 19.88 0 0 1 2 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12.81.31 1.6.57 2.36a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.72-1.03a2 2 0 0 1 2.11-.45c.76.26 1.55.45 2.36.57A2 2 0 0 1 22 16.92z"
					/>
				</svg>
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
	</div>

	<!-- Table -->
	<div class="bg-primary/5 rounded-lg overflow-hidden font-semibold">
		<table class="w-full text-sm border-collapse">
			<thead>
				<tr>
					<th class="text-left px-6 py-3 text-gray-600 dark:text-gray-200 font-semibold border-b dark:border-gray-700">Option</th>
					<th class="text-left px-6 py-3 text-gray-600 dark:text-gray-200 font-semibold border-b dark:border-gray-700">USSD Code</th>
				</tr>
			</thead>
			<tbody>
				{#each ussdCodes as item}
					{#if item.code}
						<tr>
							<td class="px-6 py-3 text-gray-800 dark:text-gray-200">{item.option}</td>
							<td class="px-6 py-3 text-gray-800 dark:text-gray-200">{item.code}</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
</div>
