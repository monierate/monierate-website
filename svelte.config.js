import adapter from '@sveltejs/adapter-cloudflare';
import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const mdsvexOptions = {
	extensions: ['.md'],
	layout: {
		blog: path.resolve(__dirname, 'src/blog/mdsvex.svelte')
	}
};

const config = {
	extensions: ['.svelte', '.md'],
	kit: {
		adapter: adapter({
			// Add fallback for SPA/client-side routing—crucial for 404 prevention
			fallback: 'spa',
			routes: {
				// Exclude prerendered/static pages (keeps _routes.json small; worker handles the rest)
				exclude: ['<prerendered>', '/uploads/*', '/icons/*', '/media/*', '/robots.txt']
				// No need for 'include'—defaults cover dynamic routes
			}
		}),
		alias: {
			$data: 'src/data'
		}
	},
	preprocess: [
		preprocess({
			postcss: true
		}),
		mdsvex(mdsvexOptions)
	]
};

export default config;