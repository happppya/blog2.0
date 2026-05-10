
"use client";

import { useState, useMemo, JSX, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "@/components/blog/PostCard";
import { TIER_CONFIG, TierLevel } from "@/config/design-config";
import type { PostMeta } from "@/types/content";

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

/**
 * Computes the contextual terminal readout for active search parameters.
 *
 * @param {string} tier - Active tier state.
 * @param {string} category - Active category state.
 * @returns {string} Formatted UI string.
 */
const buildContextReadout = (tier: string, category: string): string => {
  const tierPrefix = tier === "ALL" ? "All" : tier;
  let topicSuffix: string;

  switch (category) {
    case SYS_KEYS.ALL:
      topicSuffix = "anything";
      break;
    case SYS_KEYS.OTHER:
      topicSuffix = "whatever else";
      break;
    default:
      topicSuffix = getDisplayLabel(category);
      break;
  }
  
  return `${tierPrefix} articles about ${topicSuffix}`.toLowerCase();
};

export default function ArticleDirectory({ allPosts, groupedPosts }: ArticleDirectoryProps): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<string>(SYS_KEYS.ALL);
  const [activeTier, setActiveTier] = useState<string | "ALL">("ALL");

  const directoryIndex = useMemo(() => buildCategoryIndex(groupedPosts), [groupedPosts]);

  const activeNodes = useMemo(() => {
    let nodes = activeCategory === SYS_KEYS.ALL ? allPosts : groupedPosts[activeCategory] || [];

    if (activeTier !== "ALL") {
      nodes = nodes.filter((post) => post.importance === activeTier);
    }

    return nodes;
  }, [activeCategory, activeTier, groupedPosts, allPosts]);

  const totalPosts = allPosts.length;

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-16 w-full max-w-7xl mx-auto items-start">
      <aside className="w-full md:w-64 shrink-0 md:sticky md:top-24 z-20">
        <div className="border border-primary/20 bg-background/50 backdrop-blur-md p-6 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)]">

          <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-4 opacity-80 flex items-center gap-2">
            {"> TOPICS"}
          </h3>

          <nav
            className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-6 md:pb-6 scrollbar-none border-b border-primary/10"
            role="tablist"
            aria-label="Filter by Topic"
          >
            {directoryIndex.map((key) => {
              const isActive = activeCategory === key;
              const count = key === SYS_KEYS.ALL ? totalPosts : groupedPosts[key]?.length || 0;

              return (
                <button
                  key={`cat-${key}`}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(key)}
                  className={`relative flex items-center justify-between font-mono text-sm px-4 py-2.5 transition-colors duration-200 text-left whitespace-nowrap md:whitespace-normal group ${isActive ? "text-primary" : "text-muted hover:text-foreground"
                    }`}
                >
                  <span className="relative z-10">{getDisplayLabel(key)}</span>
                  <span className="relative z-10 text-xs opacity-50 group-hover:opacity-100 transition-opacity">
                    [{count.toString().padStart(2, "0")}]
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="categoryIndicator"
                      className="absolute inset-0 border border-primary/30 bg-primary/10 rounded z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <h3 className="text-xs font-mono text-primary uppercase tracking-widest mt-6 mb-4 opacity-80 flex items-center gap-2">
            {"> TIER"}
          </h3>

          <nav
            className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-none"
            role="tablist"
            aria-label="Filter by Classification"
          >
            <button
              role="tab"
              aria-selected={activeTier === "ALL"}
              onClick={() => setActiveTier("ALL")}
              className={`relative flex items-center font-mono text-sm px-4 py-2.5 transition-colors duration-200 text-left whitespace-nowrap ${activeTier === "ALL" ? "text-primary" : "text-muted hover:text-foreground"
                }`}
            >
              <span className="relative z-10">Any</span>
              {activeTier === "ALL" && (
                <motion.div
                  layoutId="tierIndicator"
                  className="absolute inset-0 border border-primary/30 bg-primary/5 rounded z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </button>

            {Object.entries(TIER_CONFIG).map(([tier, config]) => {
              const isActive = activeTier === tier;

              const dynamicStyles = {
                "--btn-color": config.color,
                "--btn-glow": config.glow,
              } as CSSProperties;

              return (
                <button
                  key={`tier-${tier}`}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTier(tier as TierLevel)}
                  style={dynamicStyles}
                  className={`relative flex items-center font-mono text-sm px-4 py-2.5 transition-all duration-300 text-left whitespace-nowrap group ${isActive ? "text-[var(--btn-color)]" : "text-muted hover:text-[var(--btn-color)]"
                    }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {tier}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="tierIndicator"
                      className="absolute inset-0 border rounded z-0 bg-[color:color-mix(in_srgb,var(--btn-color)_10%,transparent)] border-[color:color-mix(in_srgb,var(--btn-color)_40%,transparent)] shadow-[0_0_15px_var(--btn-glow)]"
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
        <div className="mb-8 border-b border-primary/10 pb-4">
          <div className="flex justify-between items-end mb-3">
            <h1 className="text-4xl font-serif text-foreground flex items-center gap-4">
              Blog
            </h1>
            <div className="flex flex-col items-end">
              <span className="font-mono text-[12px] uppercase text-primary/50 tracking-widest">
                {activeNodes.length.toString()} RESULTS
              </span>
            </div>
          </div>

          <p className="font-mono text-sm text-muted/60 flex items-center gap-2 before:content-['>'] before:text-primary/40">
            {buildContextReadout(activeTier, activeCategory)}
          </p>
        </div>

        <AnimatePresence mode="popLayout">
          {activeNodes.length > 0 ? (
            <motion.div
              key={`${activeCategory}-${activeTier}`}
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
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full py-20 flex flex-col items-center justify-center border border-dashed border-primary/20 rounded-lg bg-primary/5"
            >
              <span className="text-primary/50 font-mono text-sm mb-2">NOTHING HERE YET</span>
              <p className="text-muted font-mono">Try changing your search parameters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}