"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  path: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "HOME" },
  { path: "/articles", label: "BLOG" },
  { path: "/lab", label: "LAB" },
];

/**
 * Brand identifier.
 * @returns {JSX.Element}
 */
const BrandLogo = () => (
  <Link href="/" className="group flex items-center gap-2 outline-none w-fit">
    <span className="text-xs font-mono font-bold text-foreground tracking-widest uppercase transition-all duration-300 group-hover:drop-shadow-[0_0_8px_var(--color-primary-glow)]">
      <span className="text-secondary">ALEXANDER LU</span>
    </span>
  </Link>
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
        className={`pointer-events-auto w-full max-w-5xl grid grid-cols-[1fr_auto_1fr] items-center px-6 py-3 rounded-sm border transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="flex justify-start">
          <BrandLogo />
        </div>

        <div className="flex items-center justify-center gap-2">
          <AnimatePresence>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="relative px-5 py-2 group outline-none"
                >
                  <span
                    className={`relative z-10 text-[10px] font-mono tracking-[0.2em] transition-colors ${
                      isActive
                        ? "text-primary drop-shadow-[0_0_8px_var(--color-primary-glow)]"
                        : "text-muted group-hover:text-foreground"
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
                      className="absolute inset-0 bg-primary/5 border border-primary/20 rounded-sm " 
                    >
                      <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_10px_1px_var(--color-primary-glow)]" />
                      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-primary/60" />
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-primary/60" />
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </AnimatePresence>
        </div>

      </motion.nav>
    </motion.header>
  );
}