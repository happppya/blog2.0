import { Post, ArticleCategory, ARTICLE_CATEGORIES } from "@/types/ArticleTypes";

/**
 * Simulates fetching and organizing MDX posts by category.
 *
 * @returns {Promise<Record<ArticleCategory, Post[]>>}
 */
export async function getFeaturedPosts(): Promise<Record<ArticleCategory, Post[]>> {
  const allPosts: Post[] = [
    {
      id: '1',
      title: 'The Future of Server Components',
      excerpt: 'Why RSCs completely alter the mental model for frontend state management.',
      category: 'Web Architecture',
      tags: ['Next.js', 'React', 'TypeScript']
    },
    {
      id: '2',
      title: 'Headless UI Patterns',
      excerpt: 'Building unstyled, fully accessible component primitives from scratch.',
      category: 'UI/UX Engineering',
      tags: ['React', 'Tailwind']
    },
    {
      id: '3',
      title: 'WebGL Particle Systems',
      excerpt: 'Writing custom fragment shaders for high-density compute operations.',
      category: 'Graphics & Game Dev',
      tags: ['GLSL', 'WebGL', 'Math']
    },
    {
      id: '4',
      title: 'Optimizing React Three Fiber',
      excerpt: 'Memory management and draw-call reduction for 60fps browser rendering.',
      category: 'Graphics & Game Dev',
      tags: ['Three.js', 'React', 'TypeScript']
    },
    {
      id: '5',
      title: 'Noise Algorithms in JS',
      excerpt: 'Implementing Simplex and Perlin noise for infinite terrain generation.',
      category: 'Procedural Generation',
      tags: ['Math', 'TypeScript']
    },
    {
      id: '6',
      title: 'Micro-Interactions with Framer',
      excerpt: 'Mapping scroll velocity to spatial DOM transforms natively.',
      category: 'UI/UX Engineering',
      tags: ['Framer Motion', 'React']
    }
  ];

  // Initialize the record with all valid categories to ensure predictable UI order
  const categorized = {} as Record<ArticleCategory, Post[]>;
  
  // @ts-ignore - Tuple iteration type safety workaround
  ARTICLE_CATEGORIES.forEach(cat => categorized[cat] = []);

  allPosts.forEach(post => {
    categorized[post.category].push(post);
  });

  return categorized;
}