<script lang="ts">
	export let playStoreUrl: string | undefined = undefined;
	export let appStoreUrl: string | undefined = undefined;
	export let isAndroid: boolean = false;
	export let isIOS: boolean = false;

	$: showPlay = playStoreUrl && !isIOS;
	$: showApp = appStoreUrl && !isAndroid;
	$: stacked = isAndroid || isIOS;
</script>

{#if showPlay || showApp}
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Download App</p>
		<div class="flex gap-2" class:flex-col={stacked} class:flex-row={!stacked}>
			{#if showPlay}
				<a
					href={playStoreUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="flex flex-1 items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--table-hover)] transition-colors group"
					class:px-4={stacked} class:py-3={stacked}
					class:px-3={!stacked} class:py-2={!stacked}
				>
					<img src="/icons/stores/playstore.png" alt="Google Play" class="object-contain shrink-0" class:w-7={stacked} class:h-7={stacked} class:w-5={!stacked} class:h-5={!stacked} />
					<div class="leading-tight">
						<div class="text-gray-400 dark:text-gray-500" class:text-[10px]={stacked} class:text-[9px]={!stacked}>Get it on</div>
						<div class="font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap" class:text-sm={stacked} class:text-xs={!stacked}>Google Play</div>
					</div>
					{#if stacked}
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-auto shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
						</svg>
					{/if}
				</a>
			{/if}
			{#if showApp}
				<a
					href={appStoreUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="flex flex-1 items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--table-hover)] transition-colors group"
					class:px-4={stacked} class:py-3={stacked}
					class:px-3={!stacked} class:py-2={!stacked}
				>
					<img src="/icons/stores/appstore.png" alt="App Store" class="object-contain shrink-0" class:w-7={stacked} class:h-7={stacked} class:w-5={!stacked} class:h-5={!stacked} />
					<div class="leading-tight">
						<div class="text-gray-400 dark:text-gray-500" class:text-[10px]={stacked} class:text-[9px]={!stacked}>Download on</div>
						<div class="font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap" class:text-sm={stacked} class:text-xs={!stacked}>App Store</div>
					</div>
					{#if stacked}
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-auto shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
						</svg>
					{/if}
				</a>
			{/if}
		</div>
	</div>
{/if}
