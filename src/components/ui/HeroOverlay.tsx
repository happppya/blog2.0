"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  Terminal as IconTerminal,
  Activity as IconActivity,
  Folder as IconFolder,
  Code as IconCode,
  History as IconHistory,
  Zap as IconZap,
  Layers as IconLayers,
} from "lucide-react";
import {
  FaGithub as IconGithub,
  FaLinkedin as IconLinkedin,
} from "react-icons/fa";
import { JSX } from "react";

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

/**
 * Animated activity badge indicating system status.
 * @param {Object} props
 * @param {Variants} props.variants - Framer motion variants for orchestration.
 * @returns {JSX.Element}
 */
const StatusBadge = ({ variants }: { variants: Variants }): JSX.Element => (
  <motion.div variants={variants} className="mb-6">
    <div className="flex items-center gap-3 px-3 py-1 rounded-sm bg-black/60 border border-primary/30 shadow-[inset_0_0_12px_rgba(143,185,247,0.15)]">
      <IconActivity size={12} className="text-primary animate-pulse" />
      <span className="text-[10px] font-mono text-primary uppercase tracking-[0.25em]">
        AVAILABLE
      </span>
    </div>
  </motion.div>
);

interface HeroTitleProps {
  text: string;
  variants: Variants;
}

/**
 * Primary typographic element for the hero section.
 * @param {HeroTitleProps} props
 * @returns {JSX.Element}
 */
export const HeroTitle = ({ text, variants }: HeroTitleProps): JSX.Element => {
  return (
    <motion.h1
      variants={variants}
      className="mb-6 select-none font-title text-5xl tracking-tight antialiased md:text-7xl lg:text-8xl flex items-baseline bg-linear-to-br from-white to-primary bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(0,243,255,0.15)] selection:bg-primary/30"
    >
      {text}
    </motion.h1>
  );
};

/**
 * Glassmorphic subtitle container explaining developer focus.
 * @param {Object} props
 * @param {Variants} props.variants - Framer motion variants.
 * @returns {JSX.Element}
 */
const HeroSubtitle = ({ variants }: { variants: Variants }): JSX.Element => (
  <motion.div variants={variants} className="relative group max-w-md mb-10">
    <div className="absolute -inset-y-3 inset-x-0 w-full backdrop-blur-md bg-gradient-to-r from-black/80 via-black/50 to-transparent border-l-2 border-primary/50 shadow-[10px_0_30px_-15px_rgba(143,185,247,0.2)] z-0" />
    <div className="relative py-1 pl-6 z-10">
      <p className="text-primary/90 font-mono text-sm md:text-base leading-relaxed tracking-tight">
        <span className="text-primary/70 font-bold mr-2">
          Software Engineer.
        </span>
        Engineering high-fidelity, interactive digital experiences. Bridging the
        gap between robust system architecture and immersive 3D web environments.
      </p>
    </div>
  </motion.div>
);

/**
 * Primary Call-to-Action and social links.
 * @param {Object} props
 * @param {Variants} props.variants - Framer motion variants.
 * @returns {JSX.Element}
 */
const ActionLinks = ({ variants }: { variants: Variants }): JSX.Element => {
  const socials = [
    { icon: IconGithub, href: "#", label: "SRC" },
    { icon: IconLinkedin, href: "#", label: "LNK" },
  ];

  return (
    <motion.div variants={variants} className="flex flex-col sm:flex-row items-center gap-8">
      <Link
        href="#articles"
        className="group relative px-8 py-3.5 bg-black/40 border border-primary/30 text-primary font-mono text-xs font-bold uppercase tracking-widest overflow-hidden transition-all hover:border-primary hover:bg-black/60"
      >
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-primary/60" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-primary/60" />
        <span className="relative z-10 flex items-center gap-3">
          VIEW WORK <IconTerminal size={14} />
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {socials.map((social, index) => (
          <Link
            key={index}
            href={social.href}
            className="group flex flex-col items-center gap-1.5 text-muted hover:text-primary transition-colors"
            aria-label={`Link to ${social.label}`}
          >
            <social.icon size={18} />
            <span className="text-[9px] font-mono opacity-40 group-hover:opacity-100 transition-opacity tracking-tighter">
              {social.label}
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

/**
 * High-fidelity data display card showcasing system statistics.
 * @param {Object} props
 * @param {Variants} props.variants - Framer motion variants.
 * @returns {JSX.Element}
 */
const TelemetryCard = ({ variants }: { variants: Variants }): JSX.Element => {
  const stats = [
    { label: "Completed Projects", val: "24", icon: IconFolder },
    { label: "Lines of Code", val: "1.2M", icon: IconCode },
    { label: "Exp. Runtime", val: "6 Years", icon: IconHistory },
    { label: "System Uptime", val: "99.9%", icon: IconZap },
  ];

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="show"
      className="hidden lg:flex lg:col-span-4 lg:col-start-10 flex-col gap-4 w-70 pointer-events-none select-none"
    >
      <div className="p-7 bg-[#0A0A0B] border border-[#222] shadow-[0_25px_65px_-10px_rgba(0,0,0,1)] rounded-sm relative flex flex-col gap-8 overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute top-0 left-0 bottom-0 w-0.5 bg-primary/40" />
        
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex justify-between items-center border-b border-white/5 pb-4">
          <span className="text-[10px] font-mono text-primary/70 uppercase tracking-[0.2em]">
            SYSTEM STATS
          </span>
          <div className="flex items-center gap-2 px-2 py-0.5 bg-black/50 border border-white/5 rounded-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" />
            <span className="text-[9px] font-mono text-white/50">LIVE</span>
          </div>
        </div>

        <div className="relative z-10 space-y-2">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex items-center justify-between group/stat -mx-2 px-2 py-2 rounded-sm transition-colors hover:bg-white/2"
            >
              <div className="flex items-center gap-3">
                <stat.icon
                  size={13}
                  className="text-primary/30 group-hover/stat:text-primary/80 transition-colors"
                />
                <span className="text-[11px] font-mono text-muted/60 uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
              <span className="text-xs font-mono text-white/90 drop-shadow-sm">
                {stat.val}
              </span>
            </div>
          ))}
        </div>

        <div className="relative z-10 pt-5 border-t border-white/5 flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-white/80 tracking-[0.2em]">
              ALEXANDER LU
            </span>
            <span className="text-[9px] font-mono text-primary/40 tracking-wider">
              axlu810@gmail.com
            </span>
          </div>
          <IconLayers size={14} className="text-white/10" />
        </div>
      </div>
    </motion.div>
  );
};

export default function HeroOverlay() {
  return (
    <section className="relative z-10 w-full min-h-screen px-6 md:px-12 lg:px-24 flex items-center pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 pointer-events-auto flex flex-col items-start text-left"
        >
          <StatusBadge variants={itemVariants} />
          <HeroTitle text="Alexander" variants={itemVariants} />
          <HeroSubtitle variants={itemVariants} />
          <ActionLinks variants={itemVariants} />
        </motion.div>

        <TelemetryCard variants={telemetryVariants} />
      </div>
    </section>
  );
}