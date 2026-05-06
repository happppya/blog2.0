"use client";

import { motion } from "framer-motion";

/**
 * Animated hero section overlay.
 * Utilizes Framer Motion for staggered entry animations and glassmorphic UI.
 * Must declare pointer-events-auto on interactive elements to pierce the layout wrapper.
 * * @returns React element containing the hero sequence
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
          className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-merriweather)] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00f3ff]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Creative Developer
        </motion.h1>
        
        <motion.p 
          className="text-[#888888] font-[family-name:var(--font-fira-code)] text-lg md:text-xl max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Building immersive digital experiences with Next.js, React Three Fiber, and Framer Motion.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(0, 243, 255, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="mt-8 px-8 py-3 rounded-full bg-transparent border border-[#00f3ff] text-[#00f3ff] font-[family-name:var(--font-fira-code)] font-bold uppercase tracking-widest transition-colors hover:bg-[#00f3ff]/10 focus:outline-none focus:ring-2 focus:ring-[#00f3ff] focus:ring-offset-2 focus:ring-offset-[#050505]"
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