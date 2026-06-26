<script lang="ts">
	import * as config from '$lib/blog/config';
	import { formatDate } from '$lib/blog/utils.js';
	import { onMount } from 'svelte';

	export let data;
	let content = data.content;
	const metadata = data.metadata;
	const adverts = data.adverts;

	function shuffleArray(arr: any[]) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
	}

	onMount(() => {
		const articleElement = document.querySelector('article');
		let headings = articleElement?.querySelectorAll('h2');
		if (!headings || !(headings?.length > 0)) {
			headings = articleElement?.querySelectorAll('h3');
		}

		const advertArray = (Array.isArray(adverts) ? adverts : [adverts]).filter(Boolean) as {
			label: string;
			image: string;
			url: string;
			width?: string;
			height?: string;
		}[];
		const numberOfAdverts = advertArray.length;

		if (numberOfAdverts === 0) return;

		// Insert 1 ad every 3 headings (scales naturally with content length)
		const HEADINGS_PER_AD = 3;

		function insertAd(advert: typeof advertArray[0], anchor: Element) {
			const img = document.createElement('img');
			img.src = advert.image;
			img.alt = advert.label || 'Banner';
			img.className = 'block mx-auto max-w-full';
			if (advert.width) img.style.width = advert.width;
			if (advert.height) img.style.height = advert.height;

			const link = document.createElement('a');
			link.href = advert.url;
			link.target = '_blank';
			link.rel = 'noopener noreferrer';
			link.className =
				'flex justify-center text-black dark:text-white hover:text-black dark:hover:text-white my-4';

			const container = document.createElement('div');
			container.className =
				'relative inline-block text-center bg-gray-50 dark:bg-gray-900/20 p-2 px-8 rounded-md';
			container.appendChild(img);

			const partnerText = document.createElement('div');
			partnerText.textContent = 'Partner Display';
			partnerText.className =
				'absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-50 dark:bg-gray-900/10 px-2 py-1 font-semibold text-xs rounded';
			container.appendChild(partnerText);

			link.appendChild(container);
			anchor.parentNode?.insertBefore(link, anchor);
		}

		let adIndex = 0;
		let adsInserted = 0;
		headings?.forEach((heading, index) => {
			if ((index + 1) % HEADINGS_PER_AD === 0) {
				insertAd(advertArray[adIndex++ % numberOfAdverts], heading);
				adsInserted++;
			}
		});

		// Guarantee at least one ad — insert before the first heading if none were placed
		if (adsInserted === 0 && headings && headings.length > 0) {
			insertAd(advertArray[0], headings[0]);
		}
	});
</script>

<!-- SEO -->
<svelte:head>
	<title>{metadata.title} &mdash; Monierate</title>
	<meta name="description" content={metadata.description} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={metadata.title} />
	<meta property="og:description" content={metadata.description} />
	<meta property="og:image" content={metadata.image} />
	<meta property="og:url" content="{config.url}/{metadata.tag}/{metadata.slug}" />
</svelte:head>

<main class="container pb-8 md:mb-8 min-h-[100vh]">
	<header class="mb-4 md:mb-6 not-format text-left max-w-2xl mx-auto">
		<!-- Tags -->
		<div class="tags text-left">
			<a
				href="/blog?tag={metadata.tag}"
				class="font-head inline-block font-semibold text-xs mb-4 leading-none mr-2 last:mr-0 tracking-wide"
				style="color: var(--accent);"
				>&num;{metadata.tag.toUpperCase()}</a
			>
		</div>
		<!-- Title -->
		<h1
			class="mb-2 text-3xl font-extrabold leading-tight lg:mb-2 lg:text-5xl leading-10 md:leading-10"
			style="color: var(--text-primary);"
		>
			{metadata.title}
		</h1>
		<p class="mt-4 text-sm" style="color: var(--text-secondary);">
			{#if metadata.author}
				<span class="mr-4">By <strong>{metadata.author}</strong></span>
			{/if}

			Published {formatDate(metadata.createdAt)}
		</p>
	</header>

	<div class="flex justify-between mx-auto max-w-screen-xl">
		<article
			id="entry"
			class="mx-auto w-full max-w-2xl format text-gray-800 dark:text-gray-300 format-sm sm:format-base lg:format-lg format-primary dark:format-invert lg:w-[700px]"
		>
			<!-- Post -->
			<div class="post-content overflow-x-auto">
				<svelte:component this={content} />
			</div>
		</article>
	</div>
</main>

<style>
</style>
