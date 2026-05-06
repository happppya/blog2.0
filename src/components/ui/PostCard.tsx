"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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
 * Glassmorphic article card with viewport entry animation.
 * @param post - Post data object
 * @param index - Array index for staggering the animation delay
 */
export default function PostCard({ post, index }: PostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="pointer-events-auto group relative flex flex-col justify-between p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden hover:border-[#00f3ff]/50 transition-colors duration-300"
    >
      {/* Cyber-glow hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00f3ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        <h3 className="text-2xl font-[family-name:var(--font-merriweather)] font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#888888] group-hover:to-[#00f3ff] transition-all">
          <Link href={`/blog/${post.id}`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f3ff] rounded-sm">
            <span className="absolute inset-0" aria-hidden="true" />
            {post.title}
          </Link>
        </h3>
        <p className="text-[#888888] font-[family-name:var(--font-fira-code)] text-sm leading-relaxed mb-6">
          {post.excerpt}
        </p>
      </div>

      <ul className="flex flex-wrap gap-2 mt-auto relative z-10" aria-label="Article tags">
        {post.tags.map(tag => (
          <li key={tag} className="px-2 py-1 text-xs font-[family-name:var(--font-fira-code)] text-[#00f3ff] bg-[#00f3ff]/10 border border-[#00f3ff]/20 rounded backdrop-blur-sm">
            {tag}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}