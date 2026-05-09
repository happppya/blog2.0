"use client";

import { useState, useMemo, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "@/components/articles/PostCard";
import type { PostMeta } from "@/types/Content";

interface ArticleDirectoryProps {
  allPosts: PostMeta[];
  groupedPosts: Record<string, PostMeta[]>;
}

const SYS_KEYS = {
  ALL: "ALL",
  OTHER: "OTHER",
} as const;

const DISPLAY_MAP: Record<string, string> = {
  [SYS_KEYS.ALL]: "Everything",
  [SYS_KEYS.OTHER]: "Misc",
};

/**
 * Maps internal system keys to user-facing display labels.
 *
 * @param {string} key - The raw category key.
 * @returns {string} Formatted UI label.
 */
const getDisplayLabel = (key: string): string => DISPLAY_MAP[key] || key;

/**
 * Constructs a deterministic, ordered list of directory categories.
 * Enforces 'ALL' at position 0, alphabetical tags in the center, and 'OTHER' at the terminus.
 *
 * @param {Record<string, PostMeta[]>} grouped - Categorized content dictionary.
 * @returns {string[]} Optimized array of active category keys.
 */
const buildCategoryIndex = (grouped: Record<string, PostMeta[]>): string[] => {
  const keys = Object.keys(grouped).filter(
    (k) => k !== SYS_KEYS.OTHER && grouped[k]?.length > 0
  );

  const sortedKeys = keys.sort((a, b) => a.localeCompare(b));
  const finalIndex = [SYS_KEYS.ALL, ...sortedKeys];

  if (grouped[SYS_KEYS.OTHER]?.length > 0) {
    finalIndex.push(SYS_KEYS.OTHER);
  }

  return finalIndex;
};

export default function ArticleDirectory({ allPosts, groupedPosts }: ArticleDirectoryProps): JSX.Element {
  const [activeKey, setActiveKey] = useState<string>(SYS_KEYS.ALL);

  const directoryIndex = useMemo(() => buildCategoryIndex(groupedPosts), [groupedPosts]);

  const activeNodes = useMemo(() => {
    if (activeKey === SYS_KEYS.ALL) return allPosts;
    return groupedPosts[activeKey] || [];
  }, [activeKey, groupedPosts, allPosts]);

  const totalPosts = allPosts.length;

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-16 w-full max-w-7xl mx-auto items-start">
      <aside className="w-full md:w-64 shrink-0 md:sticky md:top-24 z-20">
        <div className="border border-primary/20 bg-background/50 backdrop-blur-md p-6 rounded-lg">
          <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-6 opacity-80">
            System.Query(Directory)
          </h3>

          <nav
            className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-none"
            role="tablist"
            aria-label="Filter Articles"
          >
            {directoryIndex.map((key) => {
              const isActive = activeKey === key;
              const count = key === SYS_KEYS.ALL ? totalPosts : groupedPosts[key]?.length || 0;
              const label = getDisplayLabel(key);

              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveKey(key)}
                  className={`relative flex items-center justify-between font-mono text-sm px-4 py-3 transition-colors duration-200 text-left whitespace-nowrap md:whitespace-normal group ${
                    isActive ? "text-primary" : "text-muted hover:text-foreground"
                  }`}
                >
                  <span className="relative z-10">{label}</span>
                  <span className="relative z-10 text-xs opacity-50 group-hover:opacity-100 transition-opacity">
                    [{count.toString().padStart(2, "0")}]
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="directoryCategoryIndicator"
                      className="absolute inset-0 border border-primary/30 bg-primary/10 rounded z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 w-full min-h-[50vh]">
        <div className="mb-8 border-b border-primary/10 pb-4 flex justify-between items-end">
          <h1 className="text-4xl font-serif text-foreground">
            Articles / {" "}
            <span className="text-primary font-mono text-2xl uppercase drop-shadow-[0_0_8px_var(--color-primary-glow)]">
              {getDisplayLabel(activeKey)}
            </span>
          </h1>
          <span className="font-mono text-sm text-muted">
            {activeNodes.length} result(s)
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeKey}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-6"
            role="tabpanel"
          >
            {activeNodes.map((post, idx) => (
              <PostCard key={post.slug} post={post} index={idx} />
            ))}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}