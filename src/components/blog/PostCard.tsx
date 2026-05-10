"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Link from "next/link";
import { MouseEvent, useMemo, CSSProperties } from "react";
import type { PostMeta } from "@/types/content";

interface PostCardProps {
  post: PostMeta;
  index: number;
}

const TIER_CONFIG = {
  Regular: {
    color: "var(--color-secondary)",
    glow: "var(--color-secondary-glow)",
  },
  Featured: {
    color: "var(--color-primary)",
    glow: "var(--color-primary-glow)",
  },
  Legendary: {
    color: "var(--color-legendary)",
    glow: "var(--color-legendary-glow)",
  },
} as const;

/**
 * Formats a date string based on its age relative to the current time.
 * @param {string} dateString - Valid date string parseable by Date()
 * @returns {string} Formatted date string
 */
function formatTechDate(dateString: string): string {
  const postDate = new Date(dateString);
  const currentDate = new Date();

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysDifference = (currentDate.getTime() - postDate.getTime()) / msPerDay;

  return postDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: daysDifference < 365 ? undefined : "numeric",
  });
}

const DATA_STREAMS = [
  { left: "8%", delay: 0.2, duration: 1.8, height: "120px" },
  { left: "26%", delay: 1.1, duration: 2.2, height: "80px" },
  { left: "42%", delay: 0.5, duration: 1.5, height: "150px" },
  { left: "64%", delay: 0.8, duration: 2.0, height: "100px" },
  { left: "82%", delay: 0.1, duration: 1.7, height: "130px" },
  { left: "94%", delay: 1.3, duration: 2.1, height: "90px" },
] as const;

/**
 * High-fidelity tech article card with localized dynamic theme injection.
 * Implements strict baseline grids and tier-based effects.
 *
 * @param {PostCardProps} props
 * @returns {JSX.Element}
 */
export default function PostCard({ post, index }: PostCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { importance } = post;
  const isLegendary = importance === "Legendary";
  const isFeatured = importance === "Featured";

  const dynamicStyles = {
    "--card-color": TIER_CONFIG[importance].color,
    "--card-glow": TIER_CONFIG[importance].glow,
  } as CSSProperties;

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const displayTags = post.tags.slice(0, 3);
  const extraTagsCount = Math.max(0, post.tags.length - 3);
  const formattedDate = useMemo(() => formatTechDate(post.date), [post.date]);

  return (
    <motion.article
      style={dynamicStyles}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      whileHover={{ scale: 1.005 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      className="pointer-events-auto group relative flex flex-col justify-between p-6 rounded-md bg-background border border-[color:color-mix(in_srgb,var(--card-color)_15%,transparent)] overflow-hidden transition-all duration-300 hover:border-[var(--card-color)] shadow-[0_0_0_transparent] hover:shadow-[0_0_20px_var(--card-glow)]"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-md opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              var(--card-glow),
              transparent 80%
            )
          `,
        }}
      />

      <div
        className={`absolute inset-0 tech-grid-bg transition-opacity duration-500 pointer-events-none z-0 mix-blend-screen
          ${isLegendary || isFeatured ? 'opacity-10 group-hover:opacity-30' : 'opacity-0 group-hover:opacity-20'}
        `}
      />

      {isLegendary && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-plus-lighter opacity-20 group-hover:opacity-100 transition-opacity duration-500">
          {DATA_STREAMS.map((stream, i) => (
            <motion.div
              key={i}
              className="absolute top-0 w-px"
              style={{
                left: stream.left,
                height: stream.height,
                background: "linear-gradient(to bottom, transparent, var(--card-color) 80%, #ffffff 100%)",
                boxShadow: "0 0 12px 1px var(--card-glow)",
              }}
              initial={{ y: "-100%" }}
              animate={{ y: "500%" }}
              transition={{
                repeat: Infinity,
                duration: stream.duration,
                delay: stream.delay,
                ease: "linear",
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-glow)] to-transparent opacity-0 group-hover:opacity-15 transition-opacity duration-500" />
        </div>
      )}

      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-transparent group-hover:border-[var(--card-color)] transition-colors duration-300 pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-transparent group-hover:border-[var(--card-color)] transition-colors duration-300 pointer-events-none z-10" />

      <div className="relative z-20">
        <h3 className="text-xl font-mono font-bold mb-3 text-foreground group-hover:text-[var(--card-color)] transition-colors flex items-center">
          <Link
            href={`/blog/${post.slug}`}
            className="focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--card-color)] rounded-sm w-full"
          >
            <span className="absolute inset-0 z-30" aria-hidden="true" />
            {post.title}

            <span className="inline-block ml-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--card-color)] font-black text-sm tracking-tighter">
              {">"}
            </span>
          </Link>
        </h3>
        <p className="text-muted font-mono text-sm leading-relaxed mb-6 group-hover:text-foreground transition-colors">
          {post.excerpt}
        </p>
      </div>

      <div className="mt-auto relative z-20 flex items-end justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="text-[var(--card-color)] opacity-50 font-mono text-xs uppercase hidden sm:block">
            TAGS:
          </span>
          <ul className="flex flex-wrap gap-2" aria-label="Article tags">
            {displayTags.map((tag) => (
              <li
                key={tag}
                className="px-2 py-1 text-xs font-mono text-[var(--card-color)] opacity-80 bg-[color:color-mix(in_srgb,var(--card-color)_10%,transparent)] border border-[color:color-mix(in_srgb,var(--card-color)_20%,transparent)] rounded-sm transition-all duration-300 group-hover:opacity-100 group-hover:bg-[color:color-mix(in_srgb,var(--card-color)_20%,transparent)] group-hover:border-[color:color-mix(in_srgb,var(--card-color)_50%,transparent)]"
              >
                {tag}
              </li>
            ))}
            {extraTagsCount > 0 && (
              <li className="px-2 py-1 text-xs font-mono text-[var(--card-color)] opacity-50 bg-transparent border border-[color:color-mix(in_srgb,var(--card-color)_10%,transparent)] rounded-sm">
                +{extraTagsCount}
              </li>
            )}
          </ul>
        </div>

        <div className="flex flex-col items-end gap-1 pl-4">
          <span className="text-xs font-mono text-muted/60 tracking-wider whitespace-nowrap group-hover:text-[var(--card-color)] group-hover:opacity-80 transition-colors">
            {formattedDate}
          </span>
          {(isFeatured || isLegendary) && (
            <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--card-color)] drop-shadow-[0_0_6px_var(--card-glow)] uppercase">
              {importance}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}