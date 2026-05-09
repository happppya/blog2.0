"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard, { Post } from "@/components/home/PostCard";

interface ArticleClustersProps {
  categories: Record<string, Post[]>;
}

/**
 * Renders a highly interactive, accessible tab interface for article categories.
 * Utilizes shared layout animations for the active state and snappy entry/exit nodes.
 *
 * @param {ArticleClustersProps} props
 * @returns {JSX.Element}
 */
export default function ArticleClusters({ categories }: ArticleClustersProps) {
  const categoryKeys = Object.keys(categories);
  const [activeCategory, setActiveCategory] = useState<string>(categoryKeys[0]);

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex items-center justify-between border-b border-primary/20 pb-4">
        <h2 className="text-3xl font-serif text-foreground">
          Terminal Output // <span className="text-primary font-mono text-xl uppercase">Featured_Logs</span>
        </h2>
        
        <nav className="flex gap-2 relative" role="tablist" aria-label="Article Categories">
          {categoryKeys.map((cat) => {
            const isActive = activeCategory === cat;
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
                {cat}
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

      <div className="relative w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 4, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="tabpanel"
          >
            {categories[activeCategory].map((post, idx) => (
              <PostCard key={post.id} post={post} index={idx} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}