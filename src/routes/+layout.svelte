<script lang="ts">
	import '../app.css';
	import { partytownSnippet } from '@builder.io/partytown/integration';
	import { page, navigating } from '$app/stores';
	import { onMount } from 'svelte';
	import { getCookie, setCookie, login_uri } from '$lib/functions';
	import { browser } from '$app/environment';
	import Money from '$lib/money';
	import { timezone } from '$lib/functions';
	import { messageStore } from '$lib/notification';
	import AdBanner from '$lib/components/AdBanner.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';

	let message: string | null = null;
	messageStore.subscribe((value: any) => {
		message = value;
	});

	export let data;
	const selected_partner_top = data.selected_partner_top;
	const market_avg_rate = parseFloat(`${data.market_avg_rate}`);
	const user = data.user;

	const top_pairs = data.top_pairs;

	let year = new Date().getFullYear();
	let showPromotionBar = getCookie('promotion_bar') == null ? true : false;
	let showDropdown = false;

	// get the current page path
	$: paths = $page.url.pathname.split('/');
	$: paths.shift();
	$: path = paths[0] ?? 'home';
	$: currentPath = paths[paths.length - 1];
	$: paths.pop();

	// hide promotion bar on alert page
	$: showPromotionBar = path == 'alerts' ? false : true;
	// hide sticky navbar menu on page change
	$: if ($navigating) {
		if (browser) {
			const targetEl = document.getElementById('navbar-sticky');
			targetEl?.classList.add('hidden');
		}
	}

	// toggle navbar collapse menu on mobile
	onMount(() => {
		if (browser) {
			const getTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			if (getCookie('timezone') !== getTimezone) {
				setCookie('timezone', getTimezone, 1);
			}
			setCookie('timezone', getTimezone, 1);
			timezone.set(getTimezone);
		}

		const collapse = () => {
			const triggerEl = document.getElementById('nav-collapse-trigger');
			const targetEl = document.getElementById('navbar-sticky');

			triggerEl?.addEventListener('click', () => {
				//if (targetEl?.classList.contains('hidden'))
				targetEl?.classList.toggle('hidden');
			});
		};
		collapse();

		const handleClickOutside = (event: MouseEvent) => {
			const dropdown = document.getElementById('profile-menu-button');
			if (dropdown && !dropdown.contains(event.target as Node)) {
				showDropdown = false;
			}
		};

		document.addEventListener('click', handleClickOutside);
	});

	function breadcrumbs(paths: any, current: any) {
		let url = '';
		for (let i = 0; i < paths.length; i++) {
			if (i > current) continue;
			url += `/${paths[i]}`;
		}

		return url;
	}

	function hidePromotionBar() {
		if (browser) {
			let element = document.querySelector('#promotion-bar');
			element?.classList.add('hidden');

			setCookie('promotion_bar', 'hide', 7);
		}
	}

	try {
		if (data.user?.isLoggedIn) {
			timezone.set(data.user.userData.data.timezone);
		}
	} catch (error) {
		console.log(error);
	}

	/*
	 * this code is to remove the old service worker from users browser since we moved to sveltekit's built in service worker support.
	 * This is a one-time operation and should be removed after the old service worker is unregistered.
	 * This code should be removed in 60 days.
	 * Start date: 19th May, 2025 (Tuesday).
	 * End date: July 18, 2025 (Friday).
	 */
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistrations().then((registrations) => {
			for (const registration of registrations) {
				if (registration.active?.scriptURL.includes('/sw.js')) {
					registration.unregister().then((success) => {
						if (success) {
							console.log('✅ Unregistered old service worker: /sw.js');
						}
					});
				}
			}
		});
	}
</script>

<svelte:head>
	<script>
		// Forward the necessary functions to the web worker layer
		partytown = {
			forward: ['dataLayer.push', 'gtag']
		};
	</script>

	{@html '<script>' + partytownSnippet() + '</script>'}

	<script
		type="text/partytown"
		src="https://www.googletagmanager.com/gtag/js?id=G-59H6DBC82L"
	></script>
	<script type="text/partytown">
		window.dataLayer = window.dataLayer || [];
		window.gtag = function () {
			dataLayer.push(arguments);
		};
		gtag('js', new Date());
		gtag('config', 'G-59H6DBC82L');
	</script>
</svelte:head>

<LoadingIndicator />

<!-- <div id="top-banner" tabindex="-1" class="fixed top-0 mb-8 start-0 z-50 flex justify-between w-full p-4"> -->

<div
	id="top-banner"
	tabindex="-1"
	class="flex fixed top-0 mb-8 w-full z-50 gap-x-6 overflow-hidden bg-[#d60505] px-6 py-5 sm:px-3.5 sm:before:flex-1"
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
	<div class="flex flex-1 justify-end"> </div>
</div>

<header class="mb-0 mt-16">
	<nav
		class="bg-white w-full z-20 top-0 left-0 border-b border-gray-200 dark:bg-gray-900 dark:border-none"
	>
		<div class="w-[95%] md:max-w-[1500px] flex flex-wrap items-center justify-between mx-auto p-4">
			<a href="/" class="flex items-center">
				<img
					src="/monierate-1.png"
					width="142px"
					height="24px"
					class="block dark:hidden h-auto w-[142px] mr-3"
					alt="Monierate Logo"
					loading="lazy"
				/>
				<img
					alt="Monierate Logo"
					width="142px"
					height="24px"
					class="hidden dark:block h-auto w-[142px] mr-3"
					src="/monierate-logo-white-1.png"
					loading="lazy"
				/>
			</a>
			<div class="flex items-center md:order-2">
				<!-- {#if !user?.isLoggedIn}
					<a
						href={login_uri()}
						type="button"
						class="button px-3 md:px-4 bg-gray-900 dark:bg-gray-200 font-semibold text-white dark:text-gray-900"
					>
						Login
					</a>
				{:else}
					<div class="relative" title="User Account">
						<button
							class="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
							id="profile-menu-button"
							aria-expanded="false"
							aria-haspopup="true"
							on:click={() => (showDropdown = !showDropdown)}
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 text-2xl pr-2 md:pr-0">
  <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clip-rule="evenodd" />
</svg>

                            <span class="hidden md:inline-block px-2 text-sm font-bold inline-flex items-center">
                                <span>Dashboard</span>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
  <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
</svg>

                            </span>
						</button>
						{#if showDropdown}
							<div
								class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 overflow-hidden"
								role="menu"
								aria-labelledby="profile-menu-button"
							>
								<a
									href="https://account.monierate.com"
									class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
									role="menuitem"
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
  <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
</svg>
 Account
								</a>
								<a
									href="https://account.monierate.com/logout"
									class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
									role="menuitem"
								>
									 Logout
								</a>
							</div>
						{/if}
					</div>
				{/if} -->

				<a
					href="/alerts"
					type="button"
					class="button px-3 bg-gray-900 dark:bg-gray-200 font-semibold text-white dark:text-gray-900"
				>
					Get alert
				</a>

				<button
					id="nav-collapse-trigger"
					data-collapse-toggle="navbar-sticky"
					type="button"
					class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
					aria-controls="navbar-sticky"
					aria-expanded="false"
				>
					<span class="sr-only">Open main menu</span>
					<svg
						class="w-5 h-5"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 17 14"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M1 1h15M1 7h15M1 13h15"
						/>
					</svg>
				</button>
			</div>
			<div
				class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
				id="navbar-sticky"
			>
				<ul class="nav-link">
					<li>
						<a href="/" class={path == '' ? 'active' : ''} aria-current="page">$1 Today</a>
					</li>
					<li>
						<a href="/converter" class={path == 'converter' ? 'active' : ''} aria-current="page"
							>Converter</a
						>
					</li>
					<li>
						<a href="/ng/compare" class={path == 'ng' ? 'active' : ''}>Compare</a>
					</li>
					<li>
						<a href="/alerts" class={path == 'alerts' ? 'active' : ''}>Price Alerts</a>
					</li>
					<li>
						<a data-sveltekit-reload href="/blog" class={path == 'blog' ? 'active' : ''}>Blog</a>
					</li>
					<li>
						<a href="/api" class={path == 'api' ? 'active' : ''}> API </a>
					</li>
					<!-- {#if !user?.isLoggedIn}
						<li class="md:hidden">
							<a href={login_uri()}> Login </a>
						</li>
                        {:else}
						<li class="md:hidden">
							<a href="https://account.monierate.com/"> Dashboard </a>
						</li>
					{/if} -->
				</ul>
			</div>
		</div>
	</nav>
</header>

<div
	class="bg-white w-full py-2 whitespace-nowrap overflow-x-auto no-scrollbar dark:bg-gray-800 dark:border-gray-600 border-b border-gray-100"
>
	<div class="w-[95%] md:max-w-[1500px] mx-auto px-4">
		{#each Object.entries(top_pairs) as [code, value], i}
			<a
				data-sveltekit-reload
				href="/converter/?From={value.from}&To={value.to}&Amount=1"
				class="text-gray-900 dark:text-gray-300 mr-6 text-[90%] md:text-base"
			>
				<span class="font-medium mr-[2px]">{value.name}</span>
				<span class="font-thin mr-[2px]">{Money.format(value.price, 2)}</span>
				<!-- display 24hr price change in green or red -->
				{#if value.price_change_percent_24hr > 0}
					<span class="inline-block text-green-500 font-thin">
						<svg
							viewBox="0 0 320 512"
							width="16"
							height="16"
							class="inline-block bg-transparent text-2xl"
							fill="green"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z"
							/>
						</svg>
						{Money.format(value.price_change_percent_24hr, 2)}%
					</span>
				{:else}
					<span class="inline-block text-red-500 font-thin">
						<svg
							viewBox="0 0 320 512"
							width="16"
							height="16"
							class="inline-block bg-transparent text-2xl"
							fill="red"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z"
							/>
						</svg>
						{Money.format(value.price_change_percent_24hr, 2)}%
					</span>
				{/if}
			</a>
		{/each}
	</div>
</div>

{#if path != ''}
	<div class="bg-white dark:bg-gray-800 dark:border-gray-600 shadow-b-md">
		<div class="container">
			<span class="text-sm">
				<a href="/" class="mr-2 underline">Home</a>
				{#each paths as path, index}
					<span class="inline-block mr-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="inline-block w-3 h-3"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
						</svg>
					</span>
					<a href={breadcrumbs(paths, index)} class="mr-2 text-gray-700 dark:text-gray-300"
						>{path}</a
					>
				{/each}
				<span class="inline-block mr-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="inline-block w-3 h-3"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
					</svg>
				</span>
				<span class="text-gray-700 dark:text-gray-300">{currentPath}</span>
			</span>
		</div>
	</div>
{/if}

<slot />

<div class="w-full h-1 mt-16 dark:border-gray-900"> </div>

<div class="bg-white dark:bg-gray-800">
	<div class="top-landscape mb-8">
		<AdBanner name="footer" isMobile={data.isMobile}/>
	</div>
</div>

<footer class="pt-16 pb-8 mt-8 text-gray-500 dark:text-gray-300">
	<div class="container mx-auto block md:flex justify-between item-center">
		<div class="w-full md:w-[30%]">
			<h3 class="font-bold">Currency converter</h3>
			<ul class="py-4 converter-list">
				<li>
					<a data-sveltekit-reload href="/converter/bybit?Amount=1&From=USDT&To=NGN"
						>Convert USDT on Bybit</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/bitmama?Amount=1&From=USDT&To=NGN"
						>Convert USDT on Bitmama</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/bitnob?Amount=1&From=USDT&To=NGN"
						>Convert USDT on Bitnob</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/chippercash?Amount=1&From=USD&To=NGN"
						>Convert USD on Chipper Cash</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/coinprofile?Amount=1&From=USD&To=NGN"
						>Convert USDT on Coinprofile</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/eversend?Amount=1&From=USD&To=NGN"
						>Convert USD on Eversend</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/boundlesspay?Amount=1&From=USDT&To=NGN"
						>Convert USDT on Boundlesspay</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/noones?Amount=1&From=USDT&To=NGN"
						>Convert USDT on Noones</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/remitano?Amount=1&From=USDT&To=NGN"
						>Convert USDT on Remitano</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/quidax?Amount=1&From=USDT&To=NGN"
						>Convert USDT on Quidax</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/yellowcard?Amount=1&From=USDT&To=NGN"
						>Convert USDT on Yellow Card</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/luno?Amount=1&From=USDC&To=NGN"
						>Convert USDC on Luno</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/payday?Amount=1&From=USD&To=NGN"
						>Convert USD on Changera</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/wirepay?Amount=1&From=USD&To=NGN"
						>Convert USD on Wirepay</a
					>
				</li>
			</ul>
		</div>
		<div class="w-full md:w-[30%]">
			<h3 class="font-bold">Tools</h3>
			<ul class="py-4 converter-list">
				<li><a href="/api">Currency API</a></li>
				<li><a href="/alerts">Price Alerts</a></li>
				<li><a href="/converter">Currency Converter</a></li>
				<li><a href="/ng/ussd-codes">Bank USSD Codes</a></li>
				<li><a href="/ng/swift-codes">SWIFT Codes</a></li>
			</ul>
		</div>
		<div class="w-full md:w-[40%]">
			<span class="block mb-8">
				<h3 class="font-bold block mb-2 text-gray-800 dark:text-gray-300">Contacts</h3>
				<span class="font-bold text-xl block mb-2 text-gray-800 dark:text-gray-300"
					>hello@monierate.com</span
				>
			</span>

			<span class="block mb-8">
				<ul class="flex justify-left mt-5 space-x-5">
					<li>
						<a
							href="https://x.com/monierate"
							title="x.com"
							class="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400"
						>
							<!-- X -->
							<span class="[&>svg]:h-5 [&>svg]:w-5">
								<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
									<path
										d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
									/>
								</svg>
							</span>
						</a>
					</li>

					<li>
						<a
							href="https://www.tiktok.com/@monierate"
							title="tiktok.com"
							class="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400"
						>
							<!-- X -->
							<span class="[&>svg]:h-5 [&>svg]:w-5">
								<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
									<path
										d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"
									/>
								</svg>
							</span>
						</a>
					</li>

					<li>
						<a
							href="https://linkedin.com/company/monierate"
							title="linkedin.com"
							class="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400"
						>
							<!-- Linkedin -->
							<span class="[&>svg]:h-5 [&>svg]:w-5">
								<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
									<path
										d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"
									/>
								</svg>
							</span>
						</a>
					</li>
				</ul>
			</span>

			<span class="block text-sm">
				&copy; {year}, Monierate.com.
			</span>

			<div class="mt-4">
				<p class="text-sm mb-4 text-gray-500 dark:text-gray-300">
					We aggregate the exchange rates from multiple market providers. This is for informational
					purposes only.
				</p>
				<p class="text-sm mb-4 text-gray-500 dark:text-gray-300">
					References made to third party names, logos and trademarks on this website are to identify
					corresponding goods and services that Monierate visitor can themselves exchange
					currencies. Unless otherwise specified, the trademark holders are not affiliated with
					Monierate, our products or website, and they do not sponsor or endorse Monierate services.
					Such references are included strictly as nominative fair use under applicable trademark
					law and remain fully the property of their respective trademark holders.
				</p>
				<p class="text-sm mb-4 text-gray-500 dark:text-gray-300">
					If you subscribe for our exchange rate <a href="/alert" class="underline">alert</a>, you
					understand and accept the
					<a href="/policy/data" class="underline">Monierate data policy</a>.
				</p>
				<p class="text-sm">
					Built and maintained by <a
						href="https://twitter.com/jeremyikwuje"
						class="text-gray-800 dark:text-gray-300">@jeremyikwuje ⚡</a
					>
					and
					<a href="https://twitter.com/onionsman" class="text-gray-800 dark:text-gray-300"
						>@onionsman</a
					>
				</p>
			</div>
		</div>
	</div>
</footer>

{#if showPromotionBar}
	<div class="fixed inset-x-0 bottom-0 pb-2 sm:pb-5 z-50" id="promotion-bar">
		<div class="mx-auto w-[95%] md:w-[500px] px-2 sm:px-6 lg:px-8">
			<div class="rounded-lg bg-gray-800 p-2 shadow-lg sm:p-3 dark:bg-gray-100">
				<div class="flex flex-wrap items-center justify-between">
					<div class="flex w-0 flex-1 items-center">
						<span class="flex rounded-lg bg-gray-900 dark:bg-gray-600 p-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								aria-hidden="true"
								class="h-6 w-6 text-white"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
								/></svg
							>
						</span>
						<p class="ml-3 truncate font-medium text-white dark:text-gray-900">
							<span class="md:hidden">
								$1 = ₦{Math.round(market_avg_rate)}
							</span>
							<span class="hidden md:inline">
								$1 = ₦{Math.round(market_avg_rate)} (market avg.)
							</span>
						</p>
					</div>
					<div class="w-auto">
						<a
							class="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-900"
							href="https://tinyurl.com/cambridge-currences-top-banner"
							>Send Money
						</a>
					</div>
					<div class="">
						<button
							on:click={hidePromotionBar}
							type="button"
							class="-mr-1 flex rounded-md p-2 hover:bg-gray-500 dark:hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white dark:text-gray-200"
							><span class="sr-only">Dismiss</span><svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
								class="h-6 w-6 text-white dark:text-black"
								><path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/></svg
							></button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Notification Container -->
{#if $messageStore}
	<div
		class="
    fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50
    max-w-[90%] md:max-w-[400px] py-4 px-2 md:p-4
    bg-black/80 dark:bg-black/85 text-white rounded-lg shadow-lg text-center text-[0.9em]
    fade-notification show
    "
	>
		<p>{$messageStore}</p>
	</div>
{/if}

<!-- Landscape Top/Bottom -->
<!-- <ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-9886145381404391"
     data-ad-slot="3727635247"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script> -->

<style>
	.nav-link {
		@apply flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0;
	}
	.nav-link a {
		@apply font-bold block py-2 pl-3 pr-4 text-gray-500 md:hover:text-primary md:p-0 md:dark:hover:text-primary dark:text-white dark:hover:text-white dark:border-gray-700;
	}
	.nav-link a:first-child {
		@apply mr-4 md:mr-6;
	}
	.nav-link a:last-child {
		@apply mr-0;
	}
	.nav-link a.active {
		@apply text-black dark:text-primary;
	}

	footer .converter-list {
		@apply py-4;
	}
	footer .converter-list li {
		@apply mb-4;
	}
	footer .converter-list a {
		@apply block text-sm text-gray-500 font-semibold dark:text-gray-300;
	}
</style>
