"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard, { Post } from "@/components/home/PostCard";

interface ArticleClustersProps {
  categories: Record<string, Post[]>;
}

/**
 * Renders a segmented control interface for article categories.
 * Prevents vertical layout shifts by constraining the cluster height.
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
        <h2 className="text-3xl font-serif text-foreground">Terminal Output // <span className="text-primary font-mono text-xl uppercase">Featured_Logs</span></h2>
        
        <nav className="flex gap-4" aria-label="Article Categories">
          {categoryKeys.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-mono text-sm px-4 py-2 transition-all duration-300 ${
                activeCategory === cat 
                  ? "text-primary border-b-2 border-primary bg-primary/5" 
                  : "text-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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