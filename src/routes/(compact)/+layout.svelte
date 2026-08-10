<script lang="ts">
	import Footer from '$lib/components/layout/Footer.svelte';
	import { ACCOUNT_URL } from '$lib/config';

	const BOOKING_URL = 'https://calendar.app.google/wjSasoMY7uurTppi7';
	const SIGNUP_URL = `${ACCOUNT_URL}/auth/signup`;
</script>

<header
	class="sticky top-0 z-40 mb-12 md:mb-16"
	style="background: var(--page-bg); border-bottom: 1px solid var(--card-border);"
>
	<div class="w-[95%] md:max-w-[1500px] flex items-center justify-between mx-auto p-4">
		<a href="/" class="flex items-center" aria-label="Monierate home">
			<!-- Mobile: favicon (light mode) -->
			<img
				src="/favicon-blue-1.png"
				width="32"
				height="32"
				class="block dark:hidden md:hidden h-10 w-10"
				alt="Monierate"
				loading="lazy"
			/>
			<!-- Mobile: favicon (dark mode) -->
			<img
				src="/favicon-white-1.png"
				width="32"
				height="32"
				class="hidden dark:block md:dark:hidden h-10 w-10"
				alt="Monierate"
				loading="lazy"
			/>
			<!-- Desktop: full logo (light mode) -->
			<img
				src="/monierate-blue-black-1.png"
				width="142"
				height="24"
				class="hidden md:block dark:md:hidden h-auto w-[142px]"
				alt="Monierate"
				loading="lazy"
			/>
			<!-- Desktop: full logo (dark mode) -->
			<img
				src="/monierate-logo-white-1.png"
				width="142"
				height="24"
				class="hidden md:dark:block h-auto w-[142px]"
				alt="Monierate"
				loading="lazy"
			/>
		</a>

		<div class="flex items-center gap-2 md:gap-3">
			<a
				href={BOOKING_URL}
				target="_blank"
				rel="noopener"
				class="button bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 py-2.5 px-4 md:px-5"
			>
				Book a demo
			</a>
			<a
				href={SIGNUP_URL}
				class="button bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 md:px-5"
			>
				Sign Up
			</a>
		</div>
	</div>
</header>

<div class="min-h-[70vh]">
	<slot />
</div>

<div class="w-full h-1 mt-16 dark:border-gray-900"></div>
<Footer />
