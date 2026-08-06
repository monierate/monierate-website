<script lang="ts">
	import { SITE_NAME, DEFAULT_OG_IMAGE } from '$lib/utils/seo';

	/**
	 * The single head helper for public Markets pages.
	 *
	 * Pages build their SeoMeta server-side and spread it in:
	 *
	 *   <Seo {...data.seo} />
	 *
	 * Everything here renders during SSR, so the tags are in the HTML a crawler
	 * receives — no hydration required.
	 */
	let { title, description, canonical, ogImage = DEFAULT_OG_IMAGE, ogType = 'website', robots, jsonLd = [] }: {
		title: string;
		description: string;
		canonical: string;
		ogImage?: string;
		ogType?: string;
		robots?: string;
		jsonLd?: string[];
	} = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	{#if robots}
		<meta name="robots" content={robots} />
	{/if}

	<meta property="og:type" content={ogType} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	{#each jsonLd as block}
		{@html `<script type="application/ld+json">${block}<\/script>`}
	{/each}
</svelte:head>
