<script lang="ts">
	import CurrencySelector from '$lib/components/CurrencySelector.svelte';
	import { defaultCurrencyStore } from '$lib/stores/defaultCurrency';
	import { page, navigating } from '$app/stores';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { login_uri } from '$lib/functions';
	import { ACCOUNT_URL } from '$lib/config';

	export let defaultCurrency: string;
	// export let user: {
	//     isLoggedIn: boolean;
	// } | null;

	// get the current page path
	$: paths = $page.url.pathname.split('/');
	$: paths.shift();
	$: path = paths[0] ?? 'home';

	// hide sticky navbar menu on page change
	$: if ($navigating) {
		if (browser) {
			const targetEl = document.getElementById('navbar-sticky');
			targetEl?.classList.add('hidden');
		}
	}

	// let showDropdown = false;

	// toggle navbar collapse menu on mobile
	onMount(() => {
		const collapse = () => {
			const triggerEl = document.getElementById('nav-collapse-trigger');
			const targetEl = document.getElementById('navbar-sticky');

			triggerEl?.addEventListener('click', () => {
				//if (targetEl?.classList.contains('hidden'))
				targetEl?.classList.toggle('hidden');
			});
		};
		collapse();

		// const handleClickOutside = (event: MouseEvent) => {
		// 	const dropdown = document.getElementById('profile-menu-button');
		// 	if (dropdown && !dropdown.contains(event.target as Node)) {
		// 		showDropdown = false;
		// 	}
		// };

		// document.addEventListener('click', handleClickOutside);
	});
</script>

<header class="mb-0 mt-16">
	<nav
		class="bg-white w-full z-20 top-0 left-0 border-b border-gray-200 dark:bg-gray-900 dark:border-none"
	>
		<div class="w-[95%] md:max-w-[1500px] flex flex-wrap items-center justify-between mx-auto p-4">
			<div class="flex items-center">
				<a href="/" class="flex items-center">
				<!-- Mobile: favicon (light mode) -->
				<img
					src="/favicon-blue-1.png"
					width="32px"
					height="32px"
					class="block dark:hidden md:hidden h-10 w-10 mr-3"
					alt="Monierate Logo"
					loading="lazy"
				/>
				<!-- Mobile: favicon (dark mode) -->
				<img
					src="/favicon-white-1.png"
					width="32px"
					height="32px"
					class="hidden dark:block md:dark:hidden h-10 w-10 mr-3"
					alt="Monierate Logo"
					loading="lazy"
				/>
				<!-- Desktop: full logo (light mode) -->
				<img
					src="/monierate-blue-black-1.png"
					width="142px"
					height="24px"
					class="hidden md:block dark:md:hidden h-auto w-[142px] mr-3"
					alt="Monierate Logo"
					loading="lazy"
				/>
				<!-- Desktop: full logo (dark mode) -->
				<img
					alt="Monierate Logo"
					width="142px"
					height="24px"
					class="hidden md:dark:block h-auto w-[142px] mr-3"
					src="/monierate-logo-white-1.png"
					loading="lazy"
				/>
				</a>
			</div>
			<div class="flex items-center md:order-2">
				<!-- {#if !auth.isLoggedIn}
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
									href="https://pro.monierate.com"
									class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
									role="menuitem"
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
  <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
</svg>
 Account
								</a>
								<a
									href="https://pro.monierate.com/logout"
									class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
									role="menuitem"
								>
									 Logout
								</a>
							</div>
						{/if}
					</div>
				{/if} -->

				<span class="hidden md:inline-block">
					<CurrencySelector
						onSelect={(currency: any) => defaultCurrencyStore.set(currency)}
						bind:selected={defaultCurrency}
					/>
				</span>

				<a
					href={login_uri()}
					target="_blank"
					rel="noopener noreferrer"
					type="button"
					class="button px-3 bg-transparent border border-blue-600 dark:border-gray-200 font-semibold text-blue-600 dark:text-gray-200 hidden md:inline-block md:mr-4"
				>
					Login
				</a><a
					href="{ACCOUNT_URL}/auth/signup"
					target="_blank"
					rel="noopener noreferrer"
					type="button"
					class="button px-3 bg-blue-600 dark:bg-gray-200 font-semibold text-white dark:text-gray-900 md:inline-block"
				>
					Sign Up
				</a>

				<button
					id="nav-collapse-trigger"
					data-collapse-toggle="navbar-sticky"
					type="button"
					class="inline-flex items-center ml-3 justify-center text-sm text-blue-500 md:hidden focus:outline-none"
					aria-controls="navbar-sticky"
					aria-expanded="false"
				>
					<span class="sr-only">Open main menu</span>
					<svg
						class="w-6 h-6"
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
							d="M1 4h15M1 10h15"
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
					<!-- <li>
						<a href="/ng/compare" class={path == 'ng' ? 'active' : ''}>Compare</a>
					</li> -->
					<li>
						<a href="/alerts" class={path == 'alerts' ? 'active' : ''}>Price Alerts</a>
					</li>
					<li>
						<a data-sveltekit-reload href="/blog" class={path == 'blog' ? 'active' : ''}>Blog</a>
					</li>
					<li>
						<a href="/api" class={path == 'api' ? 'active' : ''}> API </a>
					</li>
					<li class="md:hidden">
						<a href={login_uri()} target="_blank" rel="noopener noreferrer"> Login </a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</header>

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
</style>
