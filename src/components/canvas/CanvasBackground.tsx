"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

/**
 * Hero-bound 3D canvas utilizing a gradient alpha-mask for seamless void integration.
 * @returns {JSX.Element | null}
 */
export default function CanvasBackground() {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();

  const opacity = useTransform(scrollY, [0, 800], [1, 0]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <motion.div
      style={{ opacity }}
      className="absolute top-0 left-0 z-0 w-full h-screen pointer-events-none [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
    >
      <Scene />
    </motion.div>
  );
}