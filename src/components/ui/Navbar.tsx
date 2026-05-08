"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command, Terminal } from "lucide-react";

interface NavItem {
  path: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "OVERVIEW" },
  { path: "/articles", label: "ARTICLES" },
  { path: "/lab", label: "LAB" },
];

/**
 * Brand identifier utilizing a monolithic terminal aesthetic.
 * @returns {JSX.Element}
 */
const BrandLogo = () => (
  <Link href="/" className="flex items-center gap-2 group outline-none">
    <div className="flex items-center justify-center w-6 h-6 bg-primary/10 border border-primary/30 rounded-sm group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
      <Terminal size={12} className="text-primary" />
    </div>
    <span className="text-xs font-mono font-bold text-[#ededed] tracking-widest uppercase">
      Sys<span className="text-primary/60">.Nav</span>
    </span>
  </Link>
);

/**
 * Keyboard shortcut hint for command palette integration.
 * @returns {JSX.Element}
 */
const CommandIndicator = () => (
  <button
    aria-label="Open Command Palette"
    className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-white/[0.03] border border-white/5 rounded-sm hover:bg-white/[0.08] transition-colors outline-none cursor-pointer"
  >
    <Command size={10} className="text-muted/60" />
    <span className="text-[10px] font-mono text-muted/60 tracking-wider">K</span>
  </button>
);

/**
 * Floating HUD navigation bar with scroll-reactive glassmorphism.
 * @returns {JSX.Element}
 */
export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-6 py-6 pointer-events-none"
    >
      <motion.nav
        layout
        className={`pointer-events-auto flex items-center justify-between w-full max-w-4xl px-4 py-3 rounded-sm border transition-all duration-300 ${
          isScrolled
            ? "bg-[#0A0A0B]/80 backdrop-blur-md border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
            : "bg-transparent border-transparent"
        }`}
      >
        <BrandLogo />

        <div className="flex items-center gap-1">
          <AnimatePresence>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="relative px-4 py-1.5 group outline-none"
                >
                  <span
                    className={`relative z-10 text-[10px] font-mono tracking-[0.2em] transition-colors ${
                      isActive
                        ? "text-primary drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]"
                        : "text-muted/60 group-hover:text-[#ededed]"
                    }`}
                  >
                    {item.label}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      className="absolute inset-0 bg-white/[0.04] border border-white/10 rounded-sm"
                    >
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_10px_1px_rgba(0,243,255,0.5)]" />
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </AnimatePresence>
        </div>

        <CommandIndicator />
      </motion.nav>
    </motion.header>
  );
}