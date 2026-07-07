<script lang="ts">
	import { browser } from '$app/environment';
	import { getCookie, setCookie } from '$lib/functions';
	import { ACCOUNT_URL } from '$lib/config';

	// 'sticky' = fixed to the bottom of the viewport; 'top' = inline, above the fold
	export let variant: 'sticky' | 'top' = 'sticky';
	export let title = 'Use Market Insight';
	export let subtitle = 'Get a pro and comprehensive experience';
	export let cta = 'Open';
	export let link = `${ACCOUNT_URL}/auth/signup`;
	export let icon = '/favicon-blue-1.png';
	// cookie used to remember dismissal; days controls how long it stays hidden
	export let cookieKey = 'market_insight_banner';
	export let dismissDays = 7;

	let visible = browser ? getCookie(cookieKey) == null : true;

	function dismiss() {
		visible = false;
		if (browser) {
			setCookie(cookieKey, 'hide', dismissDays);
		}
	}
</script>

{#if visible}
	<div
		class={variant === 'sticky'
			? 'fixed inset-x-0 bottom-0 z-50 pb-2 sm:pb-5'
			: 'w-full'}
	>
		<div
			class={variant === 'sticky'
				? 'mx-auto w-[95%] md:w-[500px] px-2 sm:px-0'
				: 'mx-auto w-[95%] md:max-w-[1500px] px-4'}
		>
			<div
				class="flex items-center gap-2 sm:gap-3 rounded-xl p-2 sm:p-3 shadow-lg"
				style="background: var(--card-bg); border: 1px solid var(--card-border);"
			>
				<button
					on:click={dismiss}
					type="button"
					class="shrink-0 -mr-1 rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none dark:hover:text-gray-200"
				>
					<span class="sr-only">Dismiss</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
						class="h-4 w-4"
					>
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>

				<img
					src={icon}
					alt="Monierate"
					width="44"
					height="44"
					class="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl"
					loading="lazy"
				/>

				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
					<p class="truncate text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
				</div>

				<a
					href={link}
					class="shrink-0 rounded-lg bg-blue-600 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold uppercase text-white hover:bg-blue-700 focus:outline-none"
				>
					{cta}
				</a>
			</div>
		</div>
	</div>
{/if}
