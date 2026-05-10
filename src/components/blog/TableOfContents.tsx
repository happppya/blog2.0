'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Heading {
  id: string;
  text: string;
  level: number;
  parentId?: string;
}

const slugify = (text: string): string =>
  text.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

/**
 * High-fidelity HUD Table of Contents.
 * Utilizes Framer Motion's layout engine to prevent thrashing during nested list expansions.
 */
export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  
  const clickLock = useRef(false);
  const lockTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let intersectionObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    const initializeTOC = (): boolean => {
      const elements = Array.from(document.querySelectorAll('.prose-container h2, .prose-container h3'));
      if (elements.length === 0) return false;

      let currentParentId: string | undefined = undefined;

      const parsedHeadings = elements.map((elem, idx) => {
        const text = elem.textContent || '';
        const id = elem.id || slugify(text) || `heading-${idx}`;
        if (!elem.id) elem.id = id;

        const level = Number(elem.tagName.charAt(1));
        if (level === 2) currentParentId = id;

        return { id, text, level, parentId: level === 3 ? currentParentId : undefined };
      });

      setHeadings(parsedHeadings);

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (clickLock.current) return;
          
          const visibleEntries = entries.filter((entry) => entry.isIntersecting);
          if (visibleEntries.length > 0) {
            setActiveId(visibleEntries[0].target.id);
          }
        },
        { rootMargin: '-20% 0px -40% 0px' }
      );

      elements.forEach((elem) => intersectionObserver!.observe(elem));
      return true;
    };

    if (!initializeTOC()) {
      mutationObserver = new MutationObserver(() => {
        if (initializeTOC()) mutationObserver!.disconnect();
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    const handleScroll = () => {
      if (clickLock.current || headings.length === 0) return;
      
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
      if (isAtBottom) {
        setActiveId(headings[headings.length - 1].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      intersectionObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (lockTimeout.current) clearTimeout(lockTimeout.current);
    };
  }, [headings.length]);

  const handleLinkClick = (id: string) => {
    clickLock.current = true;
    setActiveId(id);
    
    if (lockTimeout.current) clearTimeout(lockTimeout.current);
    lockTimeout.current = setTimeout(() => {
      clickLock.current = false;
    }, 1000); 
  };

  if (headings.length === 0) return null;

  const activeHeading = headings.find((h) => h.id === activeId);
  const activeSectionId = activeHeading?.level === 2 ? activeHeading.id : activeHeading?.parentId;

  return (
    <nav 
      aria-label="Table of Contents" 
      className="hidden xl:block sticky top-32 w-64 self-start rounded-xl border-none p-5"
    >
      <h4 className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary-glow)]" />
        CONTENTS
      </h4>
      
      <div className="relative">
        <div className="absolute left-0.75 top-0 bottom-0 w-[1px] bg-white/5 rounded-full" />
        
        <ul className="flex flex-col space-y-1">
          <AnimatePresence initial={false}>
            {headings.map((heading) => {
              const isVisible = heading.level === 2 || heading.parentId === activeSectionId;
              if (!isVisible) return null;

              const isActive = activeId === heading.id;

              return (
                <motion.li 
                  layout
                  key={heading.id} 
                  initial={{ opacity: 0, height: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
                  exit={{ opacity: 0, height: 0, filter: 'blur(4px)' }}
                  transition={{ 
                    opacity: { duration: 0.2 }, 
                    layout: { type: 'spring', bounce: 0, duration: 0.4 } 
                  }}
                  className="relative pl-4"
                >
                  <a
                    href={`#${heading.id}`}
                    onClick={() => handleLinkClick(heading.id)}
                    style={{ paddingLeft: `${(heading.level - 2) * 0.75}rem` }}
                    className={`block py-1.5 font-mono text-[13px] leading-relaxed transition-all duration-300 ${
                      isActive 
                        ? 'text-primary drop-shadow-[0_0_8px_var(--color-primary-glow)] font-medium' 
                        : 'text-muted/80 hover:text-foreground'
                    }`}
                  >
                    {heading.text}
                  </a>
                  
                  {isActive && (
                    <motion.div
                      layoutId="active-toc-indicator"
                      className="absolute left-0 top-0 bottom-0 my-auto h-4 w-[2px] rounded-r-md bg-primary shadow-[0_0_10px_var(--color-primary-glow)]"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </nav>
  );
}