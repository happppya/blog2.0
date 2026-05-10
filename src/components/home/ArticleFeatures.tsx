"use client";

import { useState, useMemo, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "@/components/articles/PostCard";

import type { PostMeta } from "@/types/content";

interface ArticleFeaturesProps {
  categories: Record<string, PostMeta[]>;
}

/**
 * Renders a highly interactive, accessible tab interface for article categories.
 * Enforces alphabetical sorting while anchoring 'OTHER' to the tail of the stack.
 * Purges empty categories to prevent dead UI states.
 *
 * @param {ArticleFeaturesProps} props
 * @returns {JSX.Element | null}
 */
export default function ArticleFeatures({ categories }: ArticleFeaturesProps): JSX.Element | null {
  const sortedKeys = useMemo(() => {
    const activeKeys = Object.keys(categories).filter((key) => categories[key].length > 0);

    return activeKeys.sort((a, b) => {
      // Anchor "OTHER" strictly to the end of the array
      if (a === "OTHER") return 1;
      if (b === "OTHER") return -1;
      
      // Enforce strict alphabetical sorting for all other tech tags
      return a.localeCompare(b);
    });
  }, [categories]);

  const [activeCategory, setActiveCategory] = useState<string>(sortedKeys[0] || "");

  if (sortedKeys.length === 0) return null;

  const currentPosts = categories[activeCategory] || [];

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex items-center justify-between border-b border-primary/20 pb-4">
        <h2 className="text-3xl font-serif text-foreground">
          Article Features
        </h2>

        <nav className="flex gap-2 relative" role="tablist" aria-label="Article Categories">
          {sortedKeys.map((cat) => {
            const isActive = activeCategory === cat;
            const displayLabel = cat === "OTHER" ? "Misc" : cat;

            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat)}
                className={`relative font-mono text-sm px-4 py-2 transition-colors duration-200 z-10 ${
                  isActive ? "text-primary" : "text-muted hover:text-foreground"
                }`}
              >
                {displayLabel}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryIndicator"
                    className="absolute inset-0 border-b-2 border-primary bg-primary/5 z-[-1]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="relative w-full min-h-75">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 4, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="tabpanel"
          >
            {currentPosts.map((post, idx) => (
              <PostCard key={post.slug} post={post} index={idx} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}