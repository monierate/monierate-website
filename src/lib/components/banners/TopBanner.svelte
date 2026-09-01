<script lang="ts">
	import { onMount } from 'svelte';

	export const selectTopPartnerBanner = (sponsored_partners: any[]) => {
		const random_index = Math.floor(Math.random() * sponsored_partners.length);
		return sponsored_partners[random_index];
	};

	// Copy variants for the selected partner. Rotated per hour rather than picked
	// at random so the server and client render the same text (a random pick here
	// runs twice — once on SSR, once on hydration — and the two disagree).
	const messages = [
		{
			text: 'Swap Naira to USDT in seconds',
			shortText: 'Naira to USDT, in seconds'
		},
		{
			text: 'Fast, transparent FX between Naira and USDT',
			shortText: 'Fast Naira to USDT swaps'
		},
		{
			text: 'Trade Naira and USDT at rates you can see upfront',
			shortText: 'Upfront Naira/USDT rates'
		}
	];

	const selectMessage = (list: typeof messages) =>
		list[Math.floor(Date.now() / 3_600_000) % list.length];

	const sponsored_partners = [
		{
			link: 'https://textilecredit.com/?ref=monierate&utm_source=monierate&utm_medium=referral',
			brand: 'Textile',
			cta: 'Start trading'
		}
	];
	const selected_partner_top = {
		...selectTopPartnerBanner(sponsored_partners),
		...selectMessage(messages)
	};

	// Every headline shares the one banner slot. The strip below stacks them and
	// slides up on an interval, so add an entry here to put it in the rotation.
	// `gradient` is the banner background while that headline is showing: `base`
	// is the flat fallback, the other three are the left/middle/right stops.
	const headlines = [
		{
			...selected_partner_top,
			gradient: {
				base: '#301E4B',
				from: '#2A1D43',
				via: '#3A2560',
				to: '#5A3391'
			}
		},
		{
			link: '/exchanges/hyperfx',
			brand: 'HyperFX',
			text: 'is now on Monierate',
			shortText: 'Now on Monierate',
			cta: 'View profile',
			gradient: {
				base: '#0A2A4D',
				from: '#041E38',
				via: '#0B4C8C',
				to: '#0080FF'
			}
		}
	];

	const gradientStyle = (gradient: (typeof headlines)[number]['gradient']) =>
		`background-color: ${gradient.base}; background-image: linear-gradient(to right, ${gradient.from}, ${gradient.via}, ${gradient.to});`;

	const SLIDE_INTERVAL = 7000;

	// Starts at the first headline so SSR and hydration render the same row; the
	// interval only ever runs in the browser.
	let active = $state(0);

	onMount(() => {
		if (headlines.length < 2) return;

		const timer = setInterval(() => {
			active = (active + 1) % headlines.length;
		}, SLIDE_INTERVAL);

		return () => clearInterval(timer);
	});
</script>

<!-- <div id="top-banner" tabindex="-1" class="fixed top-0 mb-8 start-0 z-50 flex justify-between w-full p-4"> -->

<div
	id="top-banner"
	tabindex="-1"
	class="flex fixed top-0 mb-8 w-full z-50 isolate gap-x-6 overflow-hidden bg-[#301E4B] px-6 py-5 sm:px-3.5 sm:before:flex-1 whitespace-nowrap"
>
	<!-- One background per headline, stacked and cross-faded, so the banner
	     colour changes with the row instead of snapping when it slides. -->
	{#each headlines as headline, i (headline.brand)}
		<div
			class="absolute inset-0 -z-10 transition-opacity duration-700 ease-in-out motion-reduce:transition-none"
			style="{gradientStyle(headline.gradient)} opacity: {i === active ? 1 : 0};"
			aria-hidden="true"
		></div>
	{/each}

	<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
		<!-- One row tall, so only the active headline shows. h-7 clears the CTA
		     pill (py-1 + text-sm = 28px); anything shorter leaks the next row. -->
		<div class="h-7 overflow-hidden">
			<div
				class="transition-transform duration-700 ease-in-out motion-reduce:transition-none"
				style="transform: translateY(-{(active * 100) / headlines.length}%)"
			>
				{#each headlines as headline (headline.brand)}
					<span
						class="flex h-7 items-center text-sm leading-6 text-gray-100"
						aria-hidden={headline !== headlines[active]}
					>
						<strong class="font-semibold hidden md:inline-block text-[#F68BFD]"
							>{headline.brand}</strong
						>
						<svg
							viewBox="0 0 2 2"
							class="mx-2 hidden md:inline h-0.5 w-0.5 fill-current"
							aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg
						>
						<span class="hidden md:inline">{headline.text}</span>

						<svg
							viewBox="0 0 2 2"
							class="mx-2 hidden md:inline h-0.5 w-0.5 fill-current"
							aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg
						>
						<a
							href={headline.link}
							tabindex={headline === headlines[active] ? 0 : -1}
							class="hidden md:inline-block rounded-full bg-white px-3.5 py-1 text-sm font-semibold text-[#0B0E12] shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
						>
							{headline.cta} <span aria-hidden="true">&rarr;</span>
						</a>
						<a
							href={headline.link}
							tabindex={headline === headlines[active] ? 0 : -1}
							class="inline-block md:hidden break-word font-semibold text-sm text-gray-100 dark:text-gray-100 hover:underline text-wrap"
						>
							{headline.brand}: {headline.shortText}
							<svg
								class="inline-block md:hidden w-3 h-3 ms-2 rtl:rotate-180"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 14 10"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M1 5h12m0 0L9 1m4 4L9 9"
								/>
							</svg>
						</a>
					</span>
				{/each}
			</div>
		</div>
	</div>
	<div class="flex flex-1 justify-end"></div>
</div>
