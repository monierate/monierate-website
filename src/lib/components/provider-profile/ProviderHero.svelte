<script lang="ts">
	import ProviderLogo from '$lib/components/ui/ProviderLogo.svelte';
	import SocialIcon from '$lib/components/ui/SocialIcon.svelte';

	const SOCIAL_URLS: Record<string, (h: string) => string> = {
		twitter: (h) => `https://twitter.com/${h}`,
		x: (h) => `https://x.com/${h}`,
		instagram: (h) => `https://instagram.com/${h}`,
		facebook: (h) => `https://facebook.com/${h}`,
		youtube: (h) => `https://youtube.com/@${h}`,
		linkedin: (h) => `https://linkedin.com/in/${h}`,
		github: (h) => `https://github.com/${h}`,
		twitch: (h) => `https://twitch.tv/${h}`,
		telegram: (h) => `https://t.me/${h}`
	};

	function socialUrl(media: string, handle: string): string {
		const h = handle.replace('@', '');
		return SOCIAL_URLS[media.toLowerCase()]?.(h) ?? '#';
	}

	function tagLabel(tag: string): string {
		const map: Record<string, string> = {
			p2p: 'P2P',
			remittance: 'Remittance',
			neobank: 'Neobank',
			otc: 'OTC',
			cex: 'Exchange',
			crypto: 'Crypto'
		};
		return map[tag.toLowerCase()] ?? tag;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { provider, code, tags }: { provider: any; code: string; tags: string[] } = $props();
</script>

{#snippet linksRow()}
	<div class="flex flex-wrap items-center gap-x-4 gap-y-1.5">
		{#if provider.year_launched}
			<span class="flex items-center gap-1 text-[11px]" style="color: var(--text-muted);">
				<svg width="11" height="11" viewBox="0 0 24 24" fill="none">
					<rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" />
					<line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
					<line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
					<line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" />
				</svg>
				Est. {provider.year_launched}
				{#if provider.year_closed}
					· Closed {provider.year_closed}
				{/if}
			</span>
		{/if}

		{#if provider.link}
			<a
				href={provider.link}
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-1 text-[12px] font-medium hover:underline"
				style="color: var(--accent);"
			>
				<svg width="11" height="11" viewBox="0 0 24 24" fill="none">
					<path
						d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
					<polyline points="15 3 21 3 21 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
					<line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				</svg>
				Website
			</a>
		{/if}

		{#each provider.links ?? [] as link}
			<a
				href={link.url}
				target="_blank"
				rel="noopener noreferrer"
				class="text-[12px] hover:underline"
				style="color: var(--accent);"
			>{link.title}</a>
		{/each}

		{#if provider.support_email}
			<a
				href="mailto:{provider.support_email}"
				class="flex items-center gap-1 text-[12px] hover:underline"
				style="color: var(--text-secondary);"
			>
				<svg width="11" height="11" viewBox="0 0 24 24" fill="none">
					<path
						d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
						stroke="currentColor"
						stroke-width="2"
					/>
					<polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" />
				</svg>
				Support
			</a>
		{/if}

		{#each provider.media_handles ?? [] as handle}
			{@const media = handle.media.toLowerCase()}
			{@const username = handle.handle.replace('@', '')}
			<a
				href={socialUrl(media, username)}
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-1 text-[11px] hover:underline transition-colors"
				style="color: var(--text-muted);"
				title="{media} · @{username}"
			>
				<SocialIcon platform={media} size={12} />
				@{username}
			</a>
		{/each}
	</div>
{/snippet}

<div class="p-1">
	<div class="flex items-center gap-4">
		<div class="flex-shrink-0">
			<ProviderLogo logo={provider.icon ?? ''} name={provider.name} size={52} />
		</div>

		<div class="flex-1 min-w-0">
			<div class="flex flex-wrap items-center gap-2">
				<h1
					class="text-[20px] font-bold leading-tight"
					style="font-family: var(--font-head); color: var(--text-primary);"
				>{provider.name}</h1>

				<span
					class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide flex-shrink-0"
					style="
						background: {provider.is_active
						? 'color-mix(in srgb, var(--positive) 12%, transparent)'
						: 'color-mix(in srgb, var(--negative) 12%, transparent)'};
						color: {provider.is_active ? 'var(--positive)' : 'var(--negative)'};
					"
				>
					<span class="inline-block rounded-full flex-shrink-0" style="width:5px; height:5px; background:currentColor;"
					></span>
					{provider.is_active ? 'Active' : 'Closed'}
				</span>

				{#each tags as tag}
					<span
						class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide"
						style="background: var(--table-header-bg); color: var(--text-secondary);"
					>{tagLabel(tag)}</span>
				{/each}
			</div>

			{#if provider.bio}
				<p
					class="hidden sm:block mt-2 text-[13px] leading-relaxed"
					style="color: var(--text-secondary); max-width: 640px;"
				>
					{provider.bio}
				</p>
			{/if}
			<div class="hidden sm:block mt-3">
				{@render linksRow()}
			</div>
		</div>

		<div class="hidden sm:block flex-shrink-0">
			<a
				href="/exchanges/{code}"
				class="text-[11px] px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap hover:bg-[var(--table-hover)]"
				style="color: var(--text-secondary); border-color: var(--card-border);"
			>Full profile & reviews →</a>
		</div>
	</div>

	{#if provider.bio}
		<p class="sm:hidden mt-2 text-[13px] leading-relaxed" style="color: var(--text-secondary);">
			{provider.bio}
		</p>
	{/if}
	<div class="sm:hidden mt-3">
		{@render linksRow()}
	</div>
</div>
