<script lang="ts">
	import ViewMoreText from '$lib/components/ViewMoreText.svelte';
	import SocialLinks from '$lib/components/exchanges/SocialLinks.svelte';
	import ProviderIcon from '$lib/components/ProviderIcon.svelte';
	import AppStoreLinks from '$lib/components/exchanges/AppStoreLinks.svelte';

	export let changer: any;
	export let isAndroid: boolean = false;
	export let isIOS: boolean = false;

	$: playStoreUrl = changer.featured_publications?.find((p: any) =>
		p.url?.includes('play.google.com')
	)?.url;
	$: appStoreUrl = changer.featured_publications?.find((p: any) =>
		p.url?.includes('apps.apple.com')
	)?.url;
</script>

<div class="md:w-1/3">
	<div class="container space-y-6 md:px-6 md:py-8 md:mx-0 md:mr-10 md:sticky md:top-[80px] md:border md:border-gray-200/80 md:dark:border-gray-700/60 md:rounded-xl">
		<div class="flex flex-col md:flex-row justify-between items-center gap-4">
			<div class="w-full md:w-auto">
				<h2 class="text-xl md:text-2xl font-bold flex items-center gap-1">
					<ProviderIcon
						icon={changer.icon}
						alt="{changer.name} Logo"
						class="w-10 h-10 rounded-full object-contain"
					/>
					<span>{changer.name}</span>
				</h2>
			</div>
			<div class="w-full md:w-auto">
				<a
					href={changer.link}
					target="_blank"
					class="w-full block md:inline-block md:w-auto text-center border border-geay-200/80 dark:border-gray-700/60 rounded-full px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-100 transition-colors hover:bg-gray-100/10 dark:hover:bg-gray-700/60"
				>Visit website</a>
			</div>
		</div>

		<div class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
			<ViewMoreText text={changer.bio} />
		</div>

		{#if changer.media_handles && changer.media_handles.length > 0}
			<SocialLinks links={changer.media_handles} />
		{/if}

		<AppStoreLinks {playStoreUrl} {appStoreUrl} {isAndroid} {isIOS} />
	</div>
</div>
