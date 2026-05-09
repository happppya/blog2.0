"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

/**
 * @description Hero-bound 3D layer. Applies an alpha-mask for void integration 
 * and fades out on scroll. Binds global pointer events to bypass DOM layers.
 * * @returns {JSX.Element | null}
 */
export default function CanvasBackground() {
  const [eventSource, setEventSource] = useState<HTMLElement | null>(null);
  const { scrollY } = useScroll();
  
  const opacity = useTransform(scrollY, [0, 800], [1, 0]);

  useEffect(() => {
    setEventSource(document.body);
  }, []);

  if (!eventSource) return null;

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 z-0 h-screen w-full pointer-events-none [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
    >
      <Scene eventSource={eventSource} />
    </motion.div>
  );
}