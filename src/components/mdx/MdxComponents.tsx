import type { MDXComponents as MDXComponentsType } from 'mdx/types';

export const MDXComponents: MDXComponentsType = {
  h1: (props) => (
    <h1 className="mb-6 font-serif text-3xl text-primary shadow-[0_0_15px_var(--color-primary-glow)]" {...props} />
  ),
  h2: (props) => (
    <h2 className="scroll-mt-32 mb-4 mt-8 border-b border-primary/20 pb-2 font-serif text-2xl text-foreground" {...props} />
  ),
  h3: (props) => (
    <h3 className="scroll-mt-32 mb-3 mt-6 font-serif text-xl text-foreground" {...props} />
  ),
  p: (props) => (
    <p className="mb-6 font-mono leading-relaxed text-muted" {...props} />
  ),
  code: ({ className, ...props }: React.ComponentPropsWithoutRef<'code'>) => {
    const isBlockCode = 'data-language' in props || 'data-theme' in props;

    if (isBlockCode) {
      return <code className={`font-mono text-sm ${className || ''}`} {...props} />;
    }

    return (
      <code 
        className="rounded border border-primary-glow bg-white/5 px-1.5 py-0.5 font-mono text-sm text-secondary backdrop-blur-md" 
        {...props} 
      />
    );
  },
  pre: (props) => (
    <pre 
      className="mb-6 overflow-x-auto rounded-lg border border-primary-glow bg-background/80 p-4 shadow-lg shadow-[var(--color-primary-glow)] backdrop-blur-xl" 
      {...props} 
    />
  ),
};