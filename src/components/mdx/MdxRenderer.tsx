import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode, { type Options as RehypeOptions } from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { MDXComponents } from '@components/mdx/MdxComponents';

const rehypeOptions: RehypeOptions = {
  theme: 'poimandres',
  keepBackground: false,
};

interface MDXRendererProps {
  source: string;
}

/**
 * Renders MDX content via RSC with syntax highlighting and auto-slugged headings.
 *
 * @param {MDXRendererProps} props - The component props containing the raw MDX string.
 * @returns {JSX.Element} The compiled MDX server component.
 */
export default async function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <MDXRemote
      source={source}
      components={MDXComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [rehypeSlug, [rehypePrettyCode, rehypeOptions]], 
        },
      }}
    />
  );
}