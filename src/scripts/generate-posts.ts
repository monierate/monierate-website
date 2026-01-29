import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';  // npm i glob (for dir scanning)

const blogDir = path.join(process.cwd(), '/src/blog');
const outputPath = path.join(process.cwd(), '/src/lib/blog/posts.json');  // Outputs to static/ for bundling

// Type from your $lib/blog/types (adjust as needed)
interface Post {
  slug: string;
  title: string;
  createdAt: string;
  tags: string[];
  published: boolean;
  // Add other fields like featuredImage if needed
}

async function generatePosts() {
  const files = await glob('*.md', { cwd: blogDir });
  const posts = [];

  for (const file of files) {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);

    if (!data || typeof data !== 'object') continue;

    const slug = file.replace('.md', '');
    const post: Post = {
      ...(data as Post),
      slug
    };  // No full content—just metadata!

    if (post.published) {
      posts.push(post);
    }
  }

  // Sort newest first
  posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Write to static/ (Vite bundles this)
  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
  console.log(`Generated ${posts.length} posts to ${outputPath}`);
}

generatePosts();