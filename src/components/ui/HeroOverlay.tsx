"use client";

import { motion } from "framer-motion";

/**
 * Animated hero section overlay.
 * Uses strict theme variables for text, borders, and Framer Motion shadows.
 *
 * @returns React element containing the hero sequence
 */
export default function HeroOverlay() {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-center pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="pointer-events-auto p-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl"
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold font-merriweather mb-4 text-transparent bg-clip-text bg-linear-to-r from-white to-accent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Creative Developer
        </motion.h1>
        
        <motion.p 
          className="text-muted font-mono text-lg md:text-xl max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Building immersive digital experiences with Next.js, React Three Fiber, and Framer Motion.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px var(--color-accent-glow)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="mt-8 px-8 py-3 rounded-full bg-transparent border border-accent text-accent font-mono font-bold uppercase tracking-widest transition-colors hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
        >
          Explore Output
        </motion.button>
      </motion.div>
    </section>
  );
}