<script lang="ts">
	import { onMount } from 'svelte';
	import { BOOKING_URL } from '$lib/config';
	import { currentApiTheme, setApiTheme, type ApiTheme } from '$lib/utils/apiTheme';

	let theme = $state<ApiTheme>('light');

	onMount(() => {
		theme = currentApiTheme();
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		setApiTheme(theme);
	}
</script>

<!-- Standalone, distraction-free header for the API landing page: logo, theme toggle and one CTA -->
<header class="mb-0">
	<nav
		class="w-full z-20 top-0 left-0"
		style="background: var(--page-bg); border-bottom: 1px solid var(--card-border);"
	>
		<div class="w-[95%] md:max-w-[1200px] flex items-center justify-between mx-auto p-4">
			<a href="/" class="flex items-center">
				<!-- Mobile: favicon -->
				<img
					src="/favicon-blue-1.png"
					width="32px"
					height="32px"
					class="block dark:hidden md:hidden h-10 w-10"
					alt="Monierate Logo"
				/>
				<img
					src="/favicon-white-1.png"
					width="32px"
					height="32px"
					class="hidden dark:block md:dark:hidden h-10 w-10"
					alt="Monierate Logo"
				/>
				<!-- Desktop: full logo -->
				<img
					src="/monierate-blue-black-1.png"
					width="142px"
					height="24px"
					class="hidden md:block dark:md:hidden h-auto w-[142px]"
					alt="Monierate Logo"
				/>
				<img
					src="/monierate-logo-white-1.png"
					width="142px"
					height="24px"
					class="hidden md:dark:block h-auto w-[142px]"
					alt="Monierate Logo"
				/>
			</a>

			<div class="flex items-center gap-3">
				<button
					type="button"
					class="theme-toggle"
					onclick={toggleTheme}
					aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
					title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
				>
					{#if theme === 'dark'}
						<!-- Sun -->
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<circle cx="12" cy="12" r="4" />
							<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
						</svg>
					{:else}
						<!-- Moon -->
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
						</svg>
					{/if}
				</button>

				<a
					href={BOOKING_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="button px-4 inline-block"
				>
					Book a Demo
				</a>
			</div>
		</div>
	</nav>
</header>

<style>
	.theme-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 12px;
		border: 1px solid var(--card-border);
		background: transparent;
		color: var(--text-primary);
		cursor: pointer;
		transition: background 0.15s ease;
	}
	.theme-toggle:hover {
		background: var(--table-hover);
	}
</style>
