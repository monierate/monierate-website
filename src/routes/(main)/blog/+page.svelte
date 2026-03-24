<script lang="ts">
	import { formatDate } from '$lib/blog/utils'
	import * as config from '$lib/blog/config'

	export let data;

	const posts = data.posts;
</script>

<svelte:head>
	<title>{config.title}</title>
	<meta name="description" content="{config.description}">
	<meta property="og:type" content="website" />
	<meta property="og:title" content={config.title} />
	<meta property="og:description" content={config.description} />
	<meta property="og:url" content={config.url} />
</svelte:head>

<div class="mb-8">
	<!-- <div class="container mx-auto mb-4 md:mb-6">
		<ins class="adsbygoogle max-h-[70px]"
			style="display:block"
			data-ad-client="ca-pub-9886145381404391"
			data-ad-slot="3727635247"
			data-ad-format="auto"
			data-full-width-responsive="true"></ins>
	</div> -->

	<div class="w-[95%] md:w-[70%] px-8 py-4 mx-auto mb-4 md:mb-6 text-center">
		<h1 class="text-2xl md:text-4xl">
			Make knowledgeable transactions with our articles
		</h1> 
	</div>
	
	<!-- Posts -->
	<div class="container bg-white px-4 shadow-md dark:bg-gray-900">
		<section id="entries" class="min-h-[100vh]">
			<ul class="posts">
				{#each posts as post}
					<li class="flex flex-col md:flex-row justify-between item-left md:items-center mb-4 py-6 border-b-2 border-dotted border-gray-300 dark:border-gray-700 last:border-none">
						<span class="block">
							<a data-sveltekit-reload href="/blog?tag={post.tag}" class="inline-block text-gray-600 dark:text-green-500 font-semibold text-xs mb-1 leading-none mb-4">{post.tag.toUpperCase()}</a>
							<p></p>
							<a href="/blog/{post.slug}" class="text-lg md:text-2xl text-gray-900 hover:underline dark:text-gray-300">{post.title}</a>
						</span>
						<p class="text-sm md:text-lg text-gray-500 dark:text-gray-300">{formatDate(post.createdAt)}</p>
					</li>
				{/each}
			</ul>
		</section>
	</div>
</div>


<style>
	
</style>