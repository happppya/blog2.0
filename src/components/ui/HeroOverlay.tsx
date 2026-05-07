"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  Terminal as IconTerminal,
  CpuIcon as IconCpu,
  Activity as IconActivity,
  Layers as IconLayers,
  Box as IconBox,
  Globe as IconGlobe,
  Folder as IconFolder,
  Code as IconCode,
  History as IconHistory,
  Zap as IconZap,
} from "lucide-react";
import {
  FaGithub as IconGithub,
  FaLinkedin as IconLinkedin,
} from "react-icons/fa";

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
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const telemetryVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { delay: 1, duration: 0.6 } },
};

export default function HeroOverlay() {
  return (
    <section className="relative z-10 w-full min-h-screen px-6 md:px-12 lg:px-24 flex items-center pointer-events-none">
      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
        {/* LEFT COLUMN: Identity */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 pointer-events-auto flex flex-col items-start text-left"
        >
          {/* Status Badge */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 mb-6 px-3 py-1 rounded-sm bg-primary/5 border border-primary/20 backdrop-blur-sm"
          >
            <IconActivity size={12} className="text-primary animate-pulse" />
            <span className="text-[10px] font-mono text-primary uppercase tracking-[0.25em]">
              AVAILABLE
            </span>
          </motion.div>

          {/* Scaled-down Title */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-bold font-merriweather mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-[#8fb9f7] to-[#4f56f7] leading-[1.1] filter drop-shadow-sm"
          >
            alexander
          </motion.h1>

          {/* Narrower Subtitle with Console Background */}
          <motion.div
            variants={itemVariants}
            className="relative group max-w-md mb-10"
          >
            {/* Console Visual Wrapper */}
            <div className="absolute -inset-y-3 -inset-x-4 bg-primary/[0.03] border-l border-primary/40 backdrop-blur-[4px] shadow-[10px_0_30px_-15px_rgba(143,185,247,0.1)]" />

            <div className="relative py-1 pr-2 overflow-hidden">
              <p className="text-primary/90 font-mono text-sm md:text-base leading-relaxed tracking-tight">
                <span className="text-primary/70 font-bold mr-2">
                  Software Engineer.
                </span>
                Engineering high-fidelity, interactive digital experiences.
                Bridging the gap between robust system architecture and
                immersive 3D web environments.
              </p>
            </div>
          </motion.div>

          {/* Action Interface */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-8"
          >
            <Link
              href="#articles"
              className="group relative px-8 py-3.5 bg-transparent border border-primary/30 text-primary font-mono text-xs font-bold uppercase tracking-widest overflow-hidden transition-all hover:border-primary"
            >
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity" />

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-primary/60" />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-primary/60" />

              <span className="relative z-10 flex items-center gap-3">
                EXECUTE_WORK <IconTerminal size={14} />
              </span>
            </Link>

            <div className="flex items-center gap-6">
              {[
                { icon: IconGithub, href: "#", label: "SRC" },
                { icon: IconLinkedin, href: "#", label: "LNK" },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="group flex flex-col items-center gap-1.5 text-muted hover:text-primary transition-colors"
                >
                  <social.icon size={18} />
                  <span className="text-[9px] font-mono opacity-40 group-hover:opacity-100 transition-opacity tracking-tighter">
                    {social.label}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN: Integrated Telemetry & Competencies */}
        <motion.div
          variants={telemetryVariants}
          initial="hidden"
          animate="show"
          className="hidden lg:flex lg:col-span-4 lg:col-start-10 flex-col gap-4 w-70 pointer-events-none select-none"
        >
          <div className="p-6 border border-white/5 bg-white/[0.02] backdrop-blur-xl rounded-sm relative flex flex-col gap-8">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-[10px] font-mono text-primary/80 uppercase tracking-[0.2em]">
                STATS
              </span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse" />
                <span className="text-[9px] font-mono text-muted/50">
                  LIVE
                </span>
              </div>
            </div>

            {/* Meaningful Portfolio Stats */}
            <div className="space-y-4">
              {[
                { label: "Completed Projects", val: "24", icon: IconFolder },
                { label: "Lines of Code", val: "1.2M", icon: IconCode },
                { label: "Exp. Runtime", val: "6 Years", icon: IconHistory },
                { label: "System Uptime", val: "99.9%", icon: IconZap },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <stat.icon
                      size={12}
                      className="text-primary/40 group-hover:text-primary/80 transition-colors"
                    />
                    <span className="text-[12px] font-mono text-muted/60 uppercase">
                      {stat.label}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-white/90">
                    {stat.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer Tag */}
            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[9px] font-mono text-primary/30 tracking-[0.3em]">
                ALEXANDER LU
                <br/>axlu810@gmail.com
                <br/>706-616-0644
              </span>
              
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
