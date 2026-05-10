import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode, { type Options as RehypeOptions } from 'rehype-pretty-code';
import { getPostBySlug } from '@/lib/posts';
import { MDXComponents } from '@/components/mdx/MdxComponents';
import { TIER_CONFIG, TierLevel } from '@/config/design-config';

const rehypeOptions: RehypeOptions = {
  theme: 'poimandres',
  keepBackground: false,
};

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Server Component rendering an individual MDX blog post with dynamic tier-based styling.
 * Applies build-time syntax highlighting via Shiki without client-side JS overhead.
 *
 * @param {BlogPostPageProps} props - Next.js dynamic route parameters.
 * @returns {Promise<JSX.Element>} The compiled MDX page payload.
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { title, excerpt, date, tags, importance = 'Regular' } = post.frontmatter;

  const tierKey = (importance in TIER_CONFIG ? importance : 'Regular') as TierLevel;
  const tierStyles = TIER_CONFIG[tierKey];

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC', 
  }).format(new Date(date));

  return (
    <article 
      className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-32 sm:pt-40"
      style={{
        '--tier-color': tierStyles.color,
        '--tier-glow': tierStyles.glow,
      } as React.CSSProperties}
    >
      <header className="relative mb-14 border-b border-(--tier-color)/20 pb-8">
        <div 
          className="absolute -inset-x-6 -top-10 -z-10 h-32 opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(ellipse at center, var(--tier-glow) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="mb-6 flex items-center justify-between gap-4 border-l-2 border-(--tier-color) pl-3">
          <time dateTime={date} className="font-mono text-sm tracking-tight text-(--tier-color)">
            {formattedDate}
          </time>

          {tierKey !== 'Regular' && (
            <span className="flex items-center rounded-sm border border-(--tier-color)/50 bg-(--tier-color)/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-(--tier-color) shadow-[0_0_4px_var(--tier-glow)] backdrop-blur-md">
              {tierKey}
            </span>
          )}
        </div>

        <h1 className="mb-4 font-serif text-4xl tracking-wide text-foreground drop-shadow-md md:text-5xl">
          {title}
        </h1>
        
        {excerpt && (
          <p className="mb-8 font-sans text-lg font-light leading-relaxed text-muted">
            {excerpt}
          </p>
        )}
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 font-mono text-xs text-[var(--tier-color)]">
            {tags.map((tag: string) => (
              <span 
                key={tag}
                className="rounded border border-[var(--tier-color)]/30 bg-[var(--tier-color)]/5 px-2.5 py-0.5 backdrop-blur-md transition-colors hover:bg-[var(--tier-color)]/20 hover:shadow-[0_0_5px_var(--tier-glow)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose-container prose prose-invert max-w-none prose-headings:font-serif prose-code:font-mono">
        <MDXRemote 
          source={post.content} 
          components={MDXComponents} 
          options={{
            mdxOptions: {
              remarkPlugins: [],
              rehypePlugins: [[rehypePrettyCode, rehypeOptions]],
            },
          }}
        />
      </div>
    </article>
  );
}