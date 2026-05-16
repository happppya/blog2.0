"use client";

import { useEffect, useRef, useState, useCallback, MouseEvent, WheelEvent } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/types/content";
import { useInteractiveScroll } from "./use-interactive-scroll";

interface ProjectNodeTrackProps {
  projects: Project[];
  activeProjectIndex: number;
  setActiveProjectIndex: (index: number) => void;
  hoveredTech: string | null;
}

/**
 * ProjectNodeTrack
 * A high-density horizontal scroll track with tactile dragging, wheel translation, and visual overflow indicators.
 */
export function ProjectNodeTrack({ projects, activeProjectIndex, setActiveProjectIndex, hoveredTech }: ProjectNodeTrackProps) {
  const { scrollRef, events, isDragging } = useInteractiveScroll<HTMLDivElement>();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
  }, [scrollRef]);

  useEffect(() => {
    checkScrollState();
    window.addEventListener("resize", checkScrollState);
    return () => window.removeEventListener("resize", checkScrollState);
  }, [checkScrollState]);

  useEffect(() => {
    const activeElement = scrollRef.current?.children[activeProjectIndex] as HTMLElement;
    if (activeElement && scrollRef.current && !isDragging) {
      const container = scrollRef.current;
      const scrollPosition = activeElement.offsetLeft - (container.clientWidth / 2) + (activeElement.clientWidth / 2);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth"
      });
    }
  }, [activeProjectIndex, scrollRef, isDragging]);

  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full border-b border-primary/20 pb-px group">
      {/* Left Overflow Indicator */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none transition-opacity duration-300 flex items-center justify-start pl-2 ${
          canScrollLeft ? "opacity-100" : "opacity-0"
        }`}
      >
        <button 
          onClick={() => scrollByAmount(-200)}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-[0_0_10px_var(--color-primary-glow)] backdrop-blur-sm pointer-events-auto transition-all"
          aria-label="Scroll Left"
        >
          &larr;
        </button>
      </div>

      {/* Interactive Track */}
      <nav 
        ref={scrollRef}
        {...events}
        onScroll={checkScrollState}
        className={`w-full flex flex-row items-center gap-1 overflow-x-auto no-scrollbar ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        aria-label="Project Node Sequence"
      >
        {projects.map((project, index) => {
          const isActive = index === activeProjectIndex;
          const hasHoveredTech = hoveredTech ? project.techStack.includes(hoveredTech) : false;
          const isDimmed = hoveredTech && !hasHoveredTech;

          return (
            <button
              key={project.id}
              onClick={() => !isDragging && setActiveProjectIndex(index)}
              aria-current={isActive ? "step" : undefined}
              className={`relative px-5 py-3 text-left font-mono text-xs uppercase tracking-widest transition-all duration-300 flex-shrink-0 flex items-center gap-3 ${
                isActive ? "text-primary" : "text-muted hover:text-foreground"
              } ${isDimmed ? "opacity-20 grayscale" : "opacity-100"}`}
            >
              <span className="opacity-40 pointer-events-none">[{ (index + 1).toString().padStart(2, "0") }]</span>
              <span className="z-10 whitespace-nowrap pointer-events-none">{project.title}</span>

              {isActive && (
                <motion.div
                  layoutId="nodeTrackIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_var(--color-primary-glow)] z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {hasHoveredTech && (
                <span className="absolute top-1/2 -translate-y-1/2 right-1 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary-glow)] animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Overflow Indicator */}
      <div 
        className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none transition-opacity duration-300 flex items-center justify-end pr-2 ${
          canScrollRight ? "opacity-100" : "opacity-0"
        }`}
      >
        <button 
          onClick={() => scrollByAmount(200)}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-[0_0_10px_var(--color-primary-glow)] backdrop-blur-sm pointer-events-auto transition-all"
          aria-label="Scroll Right"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}