import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode, { type Options as RehypeOptions } from 'rehype-pretty-code';
import { MDXComponents } from '@components/mdx/MdxComponents';

const rehypeOptions: RehypeOptions = {
  theme: 'poimandres',
  keepBackground: false,
};

interface MDXRendererProps {
  source: string;
}

export default async function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <MDXRemote
      source={source}
      components={MDXComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [[rehypePrettyCode, rehypeOptions]], 
        },
      }}
    />
  );
}