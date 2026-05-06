"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

/**
 * Hero-bound 3D background.
 * Uses `absolute` positioning to lock to the top of the document.
 * It will naturally scroll out of the viewport as the user scrolls down.
 */
export default function CanvasBackground() {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();

  // Smoothly fade to black as it scrolls up and out of view
  const opacity = useTransform(scrollY, [0, 800], [1, 0]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <motion.div
      style={{ opacity }}
      className="absolute top-0 left-0 w-full h-screen z-0 pointer-events-none"
    >
      <Scene />
    </motion.div>
  );
}