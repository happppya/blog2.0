"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Link from "next/link";
import { MouseEvent } from "react";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
}

interface PostCardProps {
  post: Post;
  index: number;
}

/**
 * Tech-themed article card utilizing Tailwind v4 @theme colors.
 * Features mechanical interactions, grid-reveals, and a dynamic spotlight.
 *
 * @param {PostCardProps} props - Component properties
 * @returns {JSX.Element} Animated article card
 */
export default function PostCard({ post, index }: PostCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1, scale: 1.005 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1, 
        type: "spring", 
        stiffness: 400, 
        damping: 30 
      }}
      onMouseMove={handleMouseMove}
      className="pointer-events-auto group relative flex flex-col justify-between p-6 rounded-md bg-background border border-primary/10 overflow-hidden hover:border-primary/50 transition-colors duration-300 shadow-none hover:shadow-[0_0_15px_var(--color-primary-glow)]"
    >
      {/* Dynamic Cyber-Spotlight using your --color-primary-glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-md opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              var(--color-primary-glow),
              transparent 80%
            )
          `,
        }}
      />

      {/* Tech Grid Overlay - Uses primary-glow but dialed back with opacity */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--color-primary-glow)_1px,transparent_1px),linear-gradient(90deg,var(--color-primary-glow)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none mix-blend-screen" />

      {/* Corner Bracket Accents (Top Right & Bottom Left) */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/0 group-hover:border-primary/60 transition-colors duration-300 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/0 group-hover:border-primary/60 transition-colors duration-300 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10">
        <h3 className="text-xl font-mono font-bold mb-3 text-foreground group-hover:text-primary transition-colors flex items-center">
          <Link
            href={`/blog/${post.id}`}
            className="focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm w-full"
          >
            <span className="absolute inset-0 z-20" aria-hidden="true" />
            {post.title}
            
            {/* Terminal Command Prompt Arrow */}
            <span className="inline-block ml-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-secondary font-black text-sm tracking-tighter">
              {">"}
            </span>
          </Link>
        </h3>
        <p className="text-muted font-mono text-sm leading-relaxed mb-6 group-hover:text-foreground transition-colors">
          {post.excerpt}
        </p>
      </div>

      {/* Tag Array */}
      <div className="mt-auto relative z-10 flex items-center gap-2">
        <span className="text-primary/50 font-mono text-xs uppercase hidden sm:block">
          TAGS:
        </span>
        <ul className="flex flex-wrap gap-2" aria-label="Article tags">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="px-2 py-1 text-xs font-mono text-primary/80 bg-primary/10 border border-primary/20 rounded-sm transition-all duration-300 group-hover:text-primary group-hover:bg-primary/20 group-hover:border-primary/50"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}