<script lang="ts">
	import * as config from '$lib/blog/config'

	export let data
	// Reactive so client-side navigation between policy pages (e.g. /policy/data
	// -> /policy/terms) re-reads the content and title instead of keeping the
	// first-loaded page.
	$: content = data.content
	$: metadata = data.metadata
</script>

<!-- SEO -->
<svelte:head>
	<title>{metadata.title} &mdash; Monierate</title>
	<meta name="description" content={metadata.description} />
	<meta property="og:type" content="content" />
	<meta property="og:title" content={metadata.title} />
	<meta property="og:description" content={metadata.description} />
</svelte:head>


<main class="container pb-8 md:mb-8 min-h-[100vh]">
	<header class="mb-4 md:mb-6 not-format text-left max-w-2xl mx-auto">
		<!-- Title -->
		<h1 class="mb-2 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-2 lg:text-4xl dark:text-gray-300 dark:font-semibold leading-10 md:leading-10">{metadata.title}</h1>
	</header>

	<div class="flex justify-between mx-auto max-w-screen-xl">
		<article id="entry" class="mx-auto w-full max-w-2xl format text-gray-800 dark:text-gray-300 format-sm sm:format-base lg:format-lg format-primary dark:format-invert lg:w-[700px]">
			<!-- Post -->
			<div class="post-content">
				<svelte:component this={content} />
			</div>
		</article>
	</div>
</main>

<style>
	
</style>
