<script lang="ts">
	export const selectTopPartnerBanner = (sponsored_partners: any[]) => {
		const random_index = Math.floor(Math.random() * sponsored_partners.length);
		return sponsored_partners[random_index];
	};

	const sponsored_partners = [
		{
			image: 'https://tinyurl.com/mavapay-monierate-link',
			text: 'Send money to Kenya, South Africa & Nigeria',
			link: 'https://tinyurl.com/mavapay-monierate-link',
			brand: 'mavapay',
			cta: 'Download App'
		}
		// {
		//     image: 'https://bit.ly/3svJGhQ',
		//     text: 'Send money to over 80 countries worldwide.',
		//     link: 'https://tinyurl.com/cambridge-currences-top-banner',
		//     brand: 'Cambridge Currencies',
		//     cta: 'Send Money'
		// }
	];
	const selected_partner_top = selectTopPartnerBanner(sponsored_partners);
</script>

<!-- <div id="top-banner" tabindex="-1" class="fixed top-0 mb-8 start-0 z-50 flex justify-between w-full p-4"> -->

<div
	id="top-banner"
	tabindex="-1"
	class="flex fixed top-0 mb-8 w-full z-50 gap-x-6 overflow-hidden bg-[#05AD5D] px-6 py-5 sm:px-3.5 sm:before:flex-1 whitespace-nowrap"
>
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
		<span class="text-sm leading-6 text-gray-100">
			<strong class="font-semibold hidden md:inline-block">{selected_partner_top.brand}</strong>
			<svg
				viewBox="0 0 2 2"
				class="mx-2 hidden md:inline h-0.5 w-0.5 fill-current"
				aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg
			>
			{selected_partner_top.text}

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
				class="inline-block md:hidden break-word text-sm font-semibold text-sm text-gray-100 dark:text-gray-100 hover:underline text-wrap"
			>
				{selected_partner_top.brand}
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
