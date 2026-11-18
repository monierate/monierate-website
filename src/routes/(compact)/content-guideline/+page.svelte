<script lang="ts">
	import Content from './content.md';

	const title = 'Monierate Content Style Guide';
	const description =
		'The rules every writer must follow when writing for the Monierate blog: voice, structure, formatting, and editorial standards.';
</script>

<svelte:head>
	<title>{title} &mdash; Monierate</title>
	<meta name="description" content={description} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href="https://monierate.com/content-guideline" />
</svelte:head>

<main class="container pb-8 md:mb-8 min-h-[100vh]">
	<header class="mb-4 md:mb-6 not-format text-left max-w-2xl mx-auto">
		<h1
			class="mb-2 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-2 lg:text-4xl dark:text-gray-300 dark:font-semibold md:leading-10"
		>
			{title}
		</h1>
	</header>

	<div class="flex justify-between mx-auto max-w-screen-xl">
		<article
			class="mx-auto w-full max-w-2xl format text-gray-800 dark:text-gray-300 format-sm sm:format-base lg:format-lg format-primary dark:format-invert lg:w-[700px]"
		>
			<div class="post-content">
				<Content />
			</div>
		</article>
	</div>
</main>
