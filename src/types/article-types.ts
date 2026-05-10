/**
 * Core taxonomy arrays defined as constant tuples.
 * This guarantees strict type checking and predictable UI rendering order.
 */
export const ARTICLE_CATEGORIES = [
  "Web Architecture",
  "Graphics & Game Dev",
  "Procedural Generation",
  "UI/UX Engineering",
] as const;

export const ARTICLE_TAGS = [
  "Next.js",
  "React",
  "GLSL",
  "WebGL",
  "TypeScript",
  "Three.js",
  "Tailwind",
  "Math",
  "Framer Motion",
] as const;

export type ArticleCategory = typeof ARTICLE_CATEGORIES[number];
export type ArticleTag = typeof ARTICLE_TAGS[number];

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  tags: ArticleTag[];
}