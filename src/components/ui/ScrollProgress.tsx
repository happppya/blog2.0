"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Global scroll progress indicator.
 * Mounts strictly on the client to prevent SSR hydration mismatches via `useScroll`.
 *
 * @returns React element or null during SSR
 */
export default function ScrollProgress() {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return null during SSR to guarantee HTML payload matches
  if (!isMounted) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-50 shadow-[0_0_10px_var(--color-primary)]"
      style={{ scaleX }}
      role="progressbar"
      aria-label="Reading progress"
    />
  );
}