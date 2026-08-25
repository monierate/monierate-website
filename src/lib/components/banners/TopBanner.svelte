<script lang="ts">
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
			text: 'Fast, transparent FX — Naira to USDT and back',
			shortText: 'Fast Naira ↔ USDT swaps'
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
			image: 'https://textilecredit.com/?ref=monierate&utm_source=monierate&utm_medium=referral',
			link: 'https://textilecredit.com/?ref=monierate&utm_source=monierate&utm_medium=referral',
			brand: 'Textile',
			cta: 'Start trading'
		}
	];
	const selected_partner_top = {
		...selectTopPartnerBanner(sponsored_partners),
		...selectMessage(messages)
	};
</script>

<!-- <div id="top-banner" tabindex="-1" class="fixed top-0 mb-8 start-0 z-50 flex justify-between w-full p-4"> -->

<div
	id="top-banner"
	tabindex="-1"
	class="flex fixed top-0 mb-8 w-full z-50 gap-x-6 overflow-hidden bg-[#026DFC] px-6 py-5 sm:px-3.5 sm:before:flex-1 whitespace-nowrap"
>
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
		<span class="text-sm leading-6 text-gray-100">
			<strong class="font-semibold hidden md:inline-block">{selected_partner_top.brand}</strong>
			<svg
				viewBox="0 0 2 2"
				class="mx-2 hidden md:inline h-0.5 w-0.5 fill-current"
				aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg
			>
			<span class="hidden md:inline">{selected_partner_top.text}</span>

			<svg
				viewBox="0 0 2 2"
				class="mx-2 hidden md:inline h-0.5 w-0.5 fill-current"
				aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg
			>
			<a
				href={selected_partner_top.link}
				class="hidden md:inline-block rounded-full bg-gray-100 px-3.5 py-1 text-sm font-semibold text-red shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-100"
			>
				{selected_partner_top.cta} <span aria-hidden="true">&rarr;</span>
			</a>
			<a
				href={selected_partner_top.link}
				class="inline-block md:hidden break-word font-semibold text-sm text-gray-100 dark:text-gray-100 hover:underline text-wrap"
			>
				{selected_partner_top.brand}: {selected_partner_top.shortText}
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
	</div>
	<div class="flex flex-1 justify-end"></div>
</div>
