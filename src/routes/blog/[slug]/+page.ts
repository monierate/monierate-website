import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import Adverts from '$data/adverts.json';
import allPosts from '$lib/blog/posts.json';  // From your build script (adjust alias/path if needed)

export const prerender = false;  // Still key: No build-time prerendering of 100+ pages

export const load: PageLoad = async ({ params }) => {
	try {
		// Fast lookup: Check if slug exists in pre-built JSON (no FS!)
		const postMeta = allPosts.find(p => p.slug === params.slug && p.published);
		if (!postMeta) {
			throw new Error(`Post not found: ${params.slug}`);  // Triggers 404 below
		}

		// Lazy-load full content via dynamic import (Vite handles bundling)
		const post = await import(`../../../blog/${params.slug}.md`);

		return {
			slug: params.slug,
			metadata: post.metadata,  // Full frontmatter (or use postMeta if you want to avoid re-parsing)
			content: post.default,    // Rendered MD as Svelte component (mdsvex magic)
			advert: Adverts.blog
		};
	} catch (e) {
		console.error(`Blog load failed for slug: ${params.slug}`, e);
		throw error(404, `Could not find post: ${params.slug}`);
	}
};