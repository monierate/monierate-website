<script lang="ts">
	type MediaType = 'x' | 'twitter' | 'instagram' | 'linkedin' | 'facebook';

	type SocialLink = {
		media: MediaType | string;
		handle: string;
	};

	export let links: SocialLink[] = [];

	const mediaBaseUrls: Record<MediaType, string> = {
		x: 'https://x.com',
		twitter: 'https://x.com',
		instagram: 'https://instagram.com',
		linkedin: 'https://linkedin.com/company',
		facebook: 'https://facebook.com'
	};

	const getHref = (media: string, handle: string) => {
		const base = mediaBaseUrls[media.toLowerCase() as MediaType];
		return base ? `${base}/${handle}` : '#';
	};
</script>

{#if links.length}
<div class="w-full">
	<div class="inline-flex flex-col gap-3">
		{#each links as link}
			<a
				href={getHref(link.media, link.handle)}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={`${link.media} link`}
				class="inline-flex gap-2 items-center text-primary hover:text-primary/90"
			>
				<!-- ICON -->
				{#if link.media === 'x' || link.media === 'twitter'}
					<!-- X / Twitter -->
					<svg viewBox="0 0 24 24" fill="currentColor" class="size-5">
						<path
							d="M18.244 2H21.8l-7.77 8.88L23 22h-7.04l-5.51-6.85L4.66 22H1.1l8.3-9.48L1 2h7.22l4.98 6.17L18.24 2Z"
						/>
					</svg>
				{:else if link.media === 'instagram'}
					<!-- Instagram -->
					<svg viewBox="0 0 24 24" fill="currentColor" class="size-5">
						<path
							d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7Zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10Zm-5 3.5A5.5 5.5 0 1 0 17.5 13 5.51 5.51 0 0 0 12 7.5Zm0 9A3.5 3.5 0 1 1 15.5 13 3.5 3.5 0 0 1 12 16.5ZM18 6.25a.75.75 0 1 1-.75-.75.75.75 0 0 1 .75.75Z"
						/>
					</svg>
				{:else if link.media === 'linkedin'}
					<!-- LinkedIn -->
					<svg viewBox="0 0 24 24" fill="currentColor" class="size-5">
						<path
							d="M4.98 3.5a2.5 2.5 0 1 0 .02 5 2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05a4.2 4.2 0 0 1 3.8-2.1c4.05 0 4.8 2.67 4.8 6.13V21h-4v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21h-4V9Z"
						/>
					</svg>
				{:else if link.media === 'facebook'}
					<!-- Facebook -->
					<svg viewBox="0 0 24 24" fill="currentColor" class="size-5">
						<path
							d="M22 12a10 10 0 1 0-11.56 9.87v-7H7.9v-2.87h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.62.76-1.62 1.54v1.85h2.76l-.44 2.87h-2.32v7A10 10 0 0 0 22 12Z"
						/>
					</svg>
				{:else}
					<!-- Fallback link icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="size-5"
					>
						<path
							d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z"
						/>
					</svg>
				{/if}

				<span>@{link.handle}</span>
			</a>
		{/each}
	</div>
</div>
{/if}
