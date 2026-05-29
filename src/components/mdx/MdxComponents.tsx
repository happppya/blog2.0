import type { MDXComponents as MDXComponentsType } from 'mdx/types';

export const MDXComponents: MDXComponentsType = {
  // --- Headings ---
  h1: (props) => (
    <h1 className="mb-6 font-serif text-3xl border-b border-primary/20 pb-2 text-primary" {...props} />
  ),
  h2: (props) => (
    <h2 className="scroll-mt-32 mb-4 mt-8 border-b border-primary/20 pb-2 font-serif text-2xl text-foreground" {...props} />
  ),
  h3: (props) => (
    <h3 className="scroll-mt-32 mb-3 mt-6 font-serif text-xl text-foreground" {...props} />
  ),
  h4: (props) => (
    <h4 className="scroll-mt-32 mb-3 mt-6 font-serif text-lg text-foreground" {...props} />
  ),

  // --- Core Text ---
  p: (props) => (
    <p className="mb-6 font-mono leading-relaxed text-muted" {...props} />
  ),
  strong: (props) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  em: (props) => (
    <em className="italic text-muted" {...props} />
  ),

  // --- Links ---
  a: (props) => (
    <a 
      className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary" 
      {...props} 
    />
  ),

  // --- Lists (Fix for #1) ---
  ul: (props) => (
    <ul className="mb-6 list-outside list-disc space-y-2 pl-6 font-mono text-muted marker:text-primary/70" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-6 list-outside list-decimal space-y-2 pl-6 font-mono text-muted marker:text-primary/70" {...props} />
  ),
  li: (props) => (
    <li className="leading-relaxed" {...props} />
  ),

  // --- Dividers (Fix for #2) ---
  hr: (props) => (
    <hr className="my-10 border-t border-primary/20 shadow-[0_0_10px_var(--color-primary-glow)]" {...props} />
  ),

  // --- Quotes ---
  blockquote: (props) => (
    <blockquote 
      className="my-6 border-l-4 border-primary/50 bg-primary/5 py-3 pl-6 pr-4 font-serif italic text-muted [&>p:last-child]:mb-0" 
      {...props} 
    />
  ),

  // --- Code & Preformatted ---
  code: ({ className, ...props }: React.ComponentPropsWithoutRef<'code'>) => {
    const isBlockCode = 'data-language' in props || 'data-theme' in props;

    if (isBlockCode) {
      return <code className={`font-mono text-sm ${className || ''}`} {...props} />;
    }

    return (
      <code 
        className="rounded border border-primary-glow bg-white/5 px-1.5 py-0.5 font-mono text-sm text-secondary" 
        {...props} 
      />
    );
  },
  pre: (props) => (
    <pre 
      className="mb-6 overflow-x-auto rounded-lg border border-primary-glow bg-background/80 p-4 shadow-(--color-primary-glow)" 
      {...props} 
    />
  ),

  // --- Tables ---
  table: (props) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border border-primary/20 bg-background/50">
      <table className="w-full text-left font-mono text-sm text-muted" {...props} />
    </div>
  ),
  thead: (props) => (
    <thead className="border-b border-primary/20 bg-primary/5" {...props} />
  ),
  tr: (props) => (
    <tr className="border-b border-primary/10 last:border-0 hover:bg-white/5" {...props} />
  ),
  th: (props) => (
    <th className="px-4 py-3 font-semibold text-foreground" {...props} />
  ),
  td: (props) => (
    <td className="px-4 py-3" {...props} />
  ),

  // --- Images ---
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      className="my-8 h-auto max-w-full rounded-lg border border-primary/20 shadow-[0_0_15px_rgba(0,0,0,0.5)]" 
      {...props} 
      alt={props.alt || ''}
    />
  ),
};