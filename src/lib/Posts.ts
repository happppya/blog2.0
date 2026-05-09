import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';
import { PostMeta } from '@/types/Content';

const POSTS_DIR = path.join(process.cwd(), 'src/content/posts');

/**
 * Parses the local filesystem to retrieve and sort all MDX post metadata.
 * Memoized per request lifecycle to eliminate redundant I/O operations.
 *
 * @returns {Promise<PostMeta[]>} Array of post metadata sorted by date descending.
 */
export const getAllPosts = cache(async (): Promise<PostMeta[]> => {
  try {
    const files = await fs.readdir(POSTS_DIR);

    const posts = await Promise.all(
      files
        .filter((file) => file.endsWith('.mdx'))
        .map(async (file) => {
          const slug = file.replace(/\.mdx$/, '');
          const filePath = path.join(POSTS_DIR, file);
          const fileContent = await fs.readFile(filePath, 'utf-8');

          const { data } = matter(fileContent);

          return {
            slug,
            title: data.title,
            excerpt: data.excerpt,
            importance: data.importance,
            tags: data.tags || [],
            date: data.date,
            excludeFromFeatured: data.excludeFromFeatured ?? false,
          } as PostMeta;
        })
    );

    return posts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
  } catch (error) {
    console.error(`[FS Error] Failed to read posts directory:`, error);
    return [];
  }
});

/**
 * Categorizes posts by target tags, routing unmatched posts into an 'OTHER' bucket.
 *
 * @param {string[]} targetTags - High-priority tags to segment into distinct UI feeds.
 * @param {boolean} [onlyFeatured=false] - When true, strips out posts flagged with excludeFromFeatured.
 * @returns {Promise<Record<string, PostMeta[]>>} Segmented dictionary mapping tags.
 */
export async function getCategorizedPosts(
  targetTags: string[],
  onlyFeatured: boolean = false
): Promise<Record<string, PostMeta[]>> {
  const posts = await getAllPosts(); 

  const categorizedFeed = targetTags.reduce(
    (acc, tag) => ({ ...acc, [tag]: [] }),
    { OTHER: [] } as Record<string, PostMeta[]>
  );

  for (const post of posts) {
    if (onlyFeatured && (post.excludeFromFeatured || post.importance === "Regular")) {
      continue;
    }

    const matchedTags = post.tags.filter((tag) => targetTags.includes(tag));

    if (matchedTags.length > 0) {
      matchedTags.forEach((tag) => categorizedFeed[tag].push(post));
    } else {
      categorizedFeed['OTHER'].push(post);
    }
  }

  return categorizedFeed;
}