"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Terminal as IconTerminal, CpuIcon as IconCpu, Activity as IconActivity, Network as IconNetwork } from "lucide-react";
import { FaGithub as IconGithub, FaLinkedin as IconLinkedin } from "react-icons/fa";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  },
};

const hudVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: "easeOut", delay: 0.6 },
  },
};

/**
 * Asymmetrical hero overlay integrating identity presentation and system telemetry.
 * Engineered to sit atop an R3F canvas without obstructing the central viewport.
 *
 * @returns {JSX.Element} Split-grid hero sequence
 */
export default function HeroOverlay() {
  return (
    <section className="relative z-10 w-full min-h-screen px-6 md:px-12 lg:px-24 flex items-center pointer-events-none">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 pointer-events-auto flex flex-col items-start text-left"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8 px-4 py-1.5 rounded-sm bg-primary/10 border-l-2 border-primary">
            <IconActivity size={14} className="text-primary animate-pulse" />
            <span className="text-xs font-mono text-primary uppercase tracking-widest">
              System Online // Open to Work
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-bold font-merriweather mb-6 text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted leading-tight"
          >
            Creative <br /> Developer.
          </motion.h1>
          
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6 text-muted font-mono text-sm md:text-base border border-white/5 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-md">
            <IconTerminal size={16} className="text-secondary" />
            <p>React 19 :: R3F :: WebGL :: Framer</p>
          </motion.div>

          <motion.p 
            variants={itemVariants}
            className="text-muted font-mono text-base md:text-lg max-w-xl mb-10 leading-relaxed"
          >
            Engineering high-fidelity, interactive digital experiences. Bridging the gap between robust system architecture and immersive 3D web environments.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6">
            <Link 
              href="#articles"
              className="group relative px-8 py-3 bg-background border border-primary text-primary font-mono font-bold uppercase tracking-widest overflow-hidden transition-all hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              aria-label="Scroll to articles"
            >
              <span className="relative z-10 group-hover:drop-shadow-[0_0_8px_var(--color-primary-glow)] transition-all">
                Execute Routine
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {[
                { icon: IconGithub, href: "https://github.com", label: "GitHub Profile" },
                { icon: IconLinkedin, href: "https://linkedin.com", label: "LinkedIn Profile" }
              ].map((social, index) => (
                <Link 
                  key={index} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2 text-muted hover:text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <social.icon size={22} />
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={hudVariants}
          initial="hidden"
          animate="show"
          className="hidden lg:flex lg:col-span-4 lg:col-start-9 pointer-events-auto flex-col gap-4"
        >
          <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />
            
            <h3 className="font-mono text-xs text-muted uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
              Node Status
            </h3>

            <ul className="space-y-4 font-mono text-sm">
              <li className="flex justify-between items-center">
                <span className="text-muted flex items-center gap-2"><IconCpu size={14}/> Core Processing</span>
                <span className="text-foreground">Optimal</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-muted flex items-center gap-2"><IconNetwork size={14}/> Neural Link</span>
                <span className="text-primary">Active</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-muted flex items-center gap-2"><IconActivity size={14}/> R3F Render</span>
                <span className="text-secondary">144fps</span>
              </li>
            </ul>

            <div className="mt-8 grid grid-cols-6 gap-1 opacity-20">
              {[...Array(24)].map((_, i) => (
                <div key={i} className={`h-2 w-full rounded-sm ${i % 7 === 0 ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}