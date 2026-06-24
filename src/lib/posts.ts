import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';
import { PostMeta } from '@/types/content';

const POSTS_DIR = path.join(process.cwd(), 'src/content/posts');

/**
 * Extracts folder names from a relative file path to generate automated tags.
 * Ignores root paths and directories prefixed with '!'.
 *
 * @param {string} relativeFilePath - File path relative to POSTS_DIR.
 * @returns {string[]} Array of sanitized folder names.
 */
const extractFolderTags = (relativeFilePath: string): string[] => {
  const dirPath = path.dirname(relativeFilePath);
  if (dirPath === '.') return [];

  return dirPath
    .split(path.sep)
    .filter((folder) => folder && !folder.startsWith('!'));
};

/**
 * Parses the local filesystem recursively to retrieve and sort all MDX metadata.
 * Flattens the routing structure by extracting only the basename as the slug.
 * Appends sanitized parent directory names to the post tags.
 *
 * @returns {Promise<PostMeta[]>} Array of post metadata sorted by date descending.
 */
export const getAllPosts = cache(async (): Promise<PostMeta[]> => {
  try {
    const files = await fs.readdir(POSTS_DIR, { recursive: true });

    const posts = await Promise.all(
      files
        .map((file) => file.toString())
        .filter((file) => file.endsWith('.mdx'))
        .map(async (file) => {
          const slug = path.basename(file, '.mdx');
          const filePath = path.join(POSTS_DIR, file);
          const fileContent = await fs.readFile(filePath, 'utf-8');

          const { data } = matter(fileContent);
          
          const folderTags = extractFolderTags(file);
          const mergedTags = Array.from(new Set([...(data.tags || []), ...folderTags]));

          return {
            slug,
            title: data.title,
            excerpt: data.excerpt,
            importance: data.importance,
            tags: mergedTags,
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

/**
 * Scans nested directory structure to find and parse a specific MDX post by its flattened slug.
 *
 * @param {string} slug - The flattened post identifier (basename).
 * @returns {Promise<{ content: string, frontmatter: PostMeta } | null>} The parsed MDX payload or null.
 */
export const getPostBySlug = cache(async (slug: string) => {
  try {
    const files = await fs.readdir(POSTS_DIR, { recursive: true });
    const targetFilename = `${slug}.mdx`;
    
    const matchedRelativePath = files
      .map((file) => file.toString())
      .find((file) => path.basename(file) === targetFilename);

    if (!matchedRelativePath) return null;

    const filePath = path.join(POSTS_DIR, matchedRelativePath);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    const { data, content } = matter(fileContent);

    const folderTags = extractFolderTags(matchedRelativePath);
    const mergedTags = Array.from(new Set([...(data.tags || []), ...folderTags]));

    return {
      frontmatter: {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        importance: data.importance,
        tags: mergedTags,
        date: data.date,
        excludeFromFeatured: data.excludeFromFeatured ?? false,
      } as PostMeta,
      content,
    };
  } catch (error: any) {
    if (error.code === 'ENOENT') return null;
    console.error(`[FS Error] Failed to read post payload for ${slug}:`, error);
    return null;
  }
});

/**
 * Extracts all deeply nested MDX basenames.
 * Bypasses file content parsing for maximum performance.
 *
 * @returns {Promise<string[]>} Array of slug strings matching the original API contract.
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(POSTS_DIR, { recursive: true });
    
    return files
      .map((file) => file.toString())
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => path.basename(file, '.mdx'));
  } catch (error) {
    console.error(`[FS Error] Failed to read slugs:`, error);
    return [];
  }
}