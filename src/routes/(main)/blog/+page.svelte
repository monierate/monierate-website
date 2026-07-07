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
	<div class="w-[95%] md:max-w-[1000px] mx-auto px-4 md:px-8 py-2 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-md">
		<section id="entries" class="min-h-[100vh]">
			<ul class="posts">
				{#each posts as post}
					<li class="flex flex-col md:flex-row justify-between item-left md:items-center py-6 last:border-none" style="border-bottom: 1px solid var(--card-border);">
						<span class="block">
							<a data-sveltekit-reload href="/blog?tag={post.tag}" class="font-head inline-block font-semibold text-xs mb-3 leading-none tracking-wide" style="color: var(--accent);">{post.tag.toUpperCase()}</a>
							<a href="/blog/{post.slug}" class="font-head block text-lg md:text-2xl hover:underline" style="color: var(--text-primary);">{post.title}</a>
						</span>
						<p class="font-mono text-sm md:text-base mt-2 md:mt-0" style="color: var(--text-muted);">{formatDate(post.createdAt)}</p>
					</li>
				{/each}
			</ul>
		</section>
	</div>
</div>


<style>
	
</style>