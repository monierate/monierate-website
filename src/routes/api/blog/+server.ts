import { json } from '@sveltejs/kit';
import allPosts from '$lib/blog/posts.json';  // Bundled from static/posts.json (adjust path if needed)
import type { PageServerLoad } from '../../(main)/$types';

export const GET: PageServerLoad = async ({ url }) => {
  const tag = url.searchParams.get('tag') || '';

  let posts: any[] = [...allPosts];  // Copy to avoid mutating

  if (tag.length > 0) {
    const searchTag = tag.toLowerCase();
    posts = posts.filter(post => 
      post.tags && post.tags.some((t: any) => t.toLowerCase().includes(searchTag))
    );
  }

  // Optional: Limit for perf (e.g., top 20)
  // posts = posts.slice(0, 20);

  return json(posts);
};