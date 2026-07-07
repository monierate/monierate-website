<script lang="ts">
	import ViewMoreText from '$lib/components/ViewMoreText.svelte';
	import SocialLinks from '$lib/components/exchanges/SocialLinks.svelte';
	import ProviderIcon from '$lib/components/ProviderIcon.svelte';
	import AppStoreLinks from '$lib/components/exchanges/AppStoreLinks.svelte';

	export let changer: any;
	export let isAndroid: boolean = false;
	export let isIOS: boolean = false;

	// Prefer the dedicated app_links field; fall back to store URLs stashed in
	// featured_publications until data is migrated.
	$: playStoreUrl =
		changer.app_links?.android ||
		changer.featured_publications?.find((p: any) => p.url?.includes('play.google.com'))?.url;
	$: appStoreUrl =
		changer.app_links?.ios ||
		changer.featured_publications?.find((p: any) => p.url?.includes('apps.apple.com'))?.url;

	const platformLabels: Record<string, string> = { web: 'Web', ios: 'iOS', android: 'Android' };

	$: platforms = (changer.platforms ?? [])
		.map((p: string) => platformLabels[p.toLowerCase()] ?? p)
		.join(', ');

	$: licenses = changer.licenses ?? [];

	$: hasQuickFacts =
		changer.year_launched ||
		changer.headquarters ||
		platforms ||
		typeof changer.kyc_required === 'boolean' ||
		licenses.length > 0;

	$: ratings = changer.ratings ?? [];

	$: contacts = changer.contacts;
	$: hasContacts = contacts && (contacts.phone || contacts.whatsapp || contacts.telegram);

	const starWidth = (score: number) => `${(Math.max(0, Math.min(score, 5)) / 5) * 100}%`;

	const whatsappHref = (v: string) => `https://wa.me/${v.replace(/\D/g, '')}`;
	const telegramHref = (v: string) =>
		v.startsWith('+') ? `https://t.me/${v}` : `https://t.me/${v.replace(/^@/, '')}`;

	const formatCount = (count: number) => new Intl.NumberFormat('en-US').format(count);
</script>

<div class="md:w-1/3">
	<div class="container space-y-6 md:px-6 md:py-8 md:mx-0 md:mr-10 md:sticky md:top-[80px] md:border md:border-gray-200/80 md:dark:border-gray-700/60 md:rounded-xl">
		<div class="flex items-center justify-between gap-3">
			<h2 class="min-w-0 flex items-center gap-2 text-lg font-bold leading-tight">
				<ProviderIcon
					icon={changer.icon}
					alt="{changer.name} Logo"
					class="w-9 h-9 shrink-0 rounded-full object-contain"
				/>
				<span class="min-w-0 break-words">{changer.name}</span>
				{#if changer.is_verified}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-5 h-5 shrink-0 text-primary"
						aria-label="Verified"
						role="img"
					>
						<title>Verified</title>
						<path
							fill-rule="evenodd"
							d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
							clip-rule="evenodd"
						/>
					</svg>
				{/if}
			</h2>
			<a
				href={changer.link}
				target="_blank"
				class="shrink-0 whitespace-nowrap text-center border border-gray-200/80 dark:border-gray-700/60 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-100 transition-colors hover:bg-gray-100/10 dark:hover:bg-gray-700/60"
			>Visit website</a>
		</div>

		<div class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
			<ViewMoreText text={changer.bio} />
		</div>

		{#if ratings.length > 0}
			<div class="space-y-2">
				{#each ratings as rating}
					<div class="flex items-center gap-2 text-sm">
						<div
							class="relative inline-block text-gray-300 dark:text-gray-600 leading-none"
							aria-label={`Rated ${rating.score} out of 5`}
						>
							<span aria-hidden="true">★★★★★</span>
							<span
								class="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-yellow-400"
								style={`width: ${starWidth(rating.score)}`}
								aria-hidden="true">★★★★★</span
							>
						</div>
						<span class="font-semibold text-gray-800 dark:text-gray-100">{rating.score}</span>
						<span class="text-gray-500 dark:text-gray-400">
							{#if rating.url}
								<a href={rating.url} target="_blank" rel="noopener noreferrer" class="hover:underline">
									{rating.source}
								</a>
							{:else}
								{rating.source}
							{/if}
							{#if rating.count}
								({formatCount(rating.count)})
							{/if}
						</span>
					</div>
				{/each}
			</div>
		{/if}

		{#if hasQuickFacts}
			<div
				class="rounded-xl bg-gray-50 dark:bg-gray-800/40 divide-y divide-gray-200/70 dark:divide-gray-700/40 text-sm"
			>
				{#if changer.year_launched}
					<div class="flex items-center justify-between gap-4 px-4 py-3">
						<span class="text-gray-500 dark:text-gray-400">Year launched</span>
						<span class="font-semibold text-gray-800 dark:text-gray-100">{changer.year_launched}</span>
					</div>
				{/if}
				{#if changer.headquarters}
					<div class="flex items-center justify-between gap-4 px-4 py-3">
						<span class="text-gray-500 dark:text-gray-400">Headquarters</span>
						<span class="font-semibold text-gray-800 dark:text-gray-100 text-right">{changer.headquarters}</span>
					</div>
				{/if}
				{#if platforms}
					<div class="flex items-center justify-between gap-4 px-4 py-3">
						<span class="text-gray-500 dark:text-gray-400">Platforms</span>
						<span class="font-semibold text-gray-800 dark:text-gray-100 text-right">{platforms}</span>
					</div>
				{/if}
				{#if typeof changer.kyc_required === 'boolean'}
					<div class="flex items-center justify-between gap-4 px-4 py-3">
						<span class="text-gray-500 dark:text-gray-400">KYC required</span>
						<span class="font-semibold text-gray-800 dark:text-gray-100">
							{changer.kyc_required ? 'Yes' : 'No'}
						</span>
					</div>
				{/if}
				{#if licenses.length > 0}
					<div class="px-4 py-3 space-y-2">
						<span class="text-gray-500 dark:text-gray-400">Licenses</span>
						<div class="flex flex-wrap gap-2">
							{#each licenses as license}
								<svelte:element
									this={license.url ? 'a' : 'span'}
									href={license.url || undefined}
									target={license.url ? '_blank' : undefined}
									rel={license.url ? 'noopener noreferrer' : undefined}
									class="inline-flex items-center gap-1 rounded-full bg-white dark:bg-gray-900 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 shadow-sm {license.url ? 'hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors' : ''}"
								>
									Licensed by {license.authority}
									{#if license.license_type}
										<span class="text-gray-400 dark:text-gray-500">· {license.license_type}</span>
									{/if}
									{#if license.status === 'active'}
										<span class="text-green-600 dark:text-green-400">✓</span>
									{:else if license.status}
										<span class="text-gray-400 dark:text-gray-500 capitalize">({license.status})</span>
									{/if}
								</svelte:element>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}

		{#if hasContacts}
			<div class="flex flex-col gap-2">
				<p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contact</p>
				<div class="flex flex-wrap gap-2">
					{#if contacts.whatsapp}
						<a
							href={whatsappHref(contacts.whatsapp)}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-800/40 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
						>
							<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-green-600 dark:text-green-400">
								<path
									d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
								/>
							</svg>
							WhatsApp
						</a>
					{/if}
					{#if contacts.telegram}
						<a
							href={telegramHref(contacts.telegram)}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-800/40 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
						>
							<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-blue-500">
								<path
									d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
								/>
							</svg>
							Telegram
						</a>
					{/if}
					{#if contacts.phone}
						<a
							href={`tel:${contacts.phone}`}
							class="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-800/40 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-gray-500 dark:text-gray-400">
								<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
							</svg>
							Call
						</a>
					{/if}
				</div>
			</div>
		{/if}

		{#if changer.media_handles && changer.media_handles.length > 0}
			<SocialLinks links={changer.media_handles} />
		{/if}

		<AppStoreLinks {playStoreUrl} {appStoreUrl} {isAndroid} {isIOS} />
	</div>
</div>
