import adapter from '@sveltejs/adapter-auto';
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
    adapter: adapter(),
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
