import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/types/content";

interface SpineNodeProps {
  project: Project;
  index: number;
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

/**
 * SpineNode
 * Indicator logic completely removed from the leaf node.
 */
function SpineNode({ project, index, isActive, isExpanded, onClick }: SpineNodeProps) {
  let stateClass = "text-muted-foreground/40 hover:text-primary hover:bg-primary/5";
  if (isActive) stateClass = "text-primary bg-primary/10 drop-shadow-[0_0_12px_var(--color-primary-glow)] border-l-[3px] border-primary";
  else stateClass += " border-l-[3px] border-transparent"; 

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center h-[72px] shrink-0 w-full focus:outline-none transition-colors duration-400 ease-out overflow-hidden ${stateClass}`}
      aria-label={`View ${project.title}`}
    >
      <div className="flex items-center h-full px-6 gap-6 relative z-10 w-full">
        {/* Fixed Ultra-Thin Index Number */}
        <span className={`font-mono text-[10px] tracking-[0.2em] shrink-0 transition-colors duration-300 w-5 text-center ${isActive ? 'text-primary font-bold' : ''}`}>
          {(index + 1).toString().padStart(2, '0')}
        </span>

        {/* Global Kinetic Reveal */}
        <AnimatePresence mode="popLayout">
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5, transition: { duration: 0.15 } }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-[11px] tracking-[0.15em] uppercase whitespace-nowrap text-left"
            >
              {project.title}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}

/**
 * ProjectSpine
 * Now acts as a floating glass panel with an external negative-space kinetic rail.
 */
export function ProjectSpine({ 
  projects, 
  currentIndex, 
  setIndex,
  cycleFocus 
}: { 
  projects: Project[], 
  currentIndex: number, 
  setIndex: (i: number) => void,
  cycleFocus: string | null
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const COLLAPSED_WIDTH = 76; 
  const EXPANDED_WIDTH = 320; 

  return (
    <motion.div 
      animate={{ width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
      transition={{ type: "spring", stiffness: 400, damping: 35, mass: 0.8 }}
      // Floating offset to allow the left-side rail to exist in physical space
      className="absolute left-4 md:left-8 top-6 bottom-6 z-40 pointer-events-auto"
    >
      {/* THE KINETIC RAIL (Physically outside the box) */}
      <AnimatePresence>
        {cycleFocus !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: currentIndex * 72 
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              y: { type: "spring", stiffness: 600, damping: 40, mass: 0.5 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            // Pushed to -left-[26px] to comfortably clear the expanded bounds
            className="absolute -left-[26px] top-[112px] w-2 h-2 rounded-full bg-primary z-50 shadow-[0_0_20px_6px_var(--color-primary-glow)] ring-[3px] ring-background"
          />
        )}
      </AnimatePresence>

      {/* THE GLASS BOX */}
      <div className="w-full h-full bg-background/95 backdrop-blur-md border border-foreground/10 rounded-xl flex flex-col overflow-hidden shadow-2xl shadow-background/50">
        
        {/* Master Toggle */}
        <div className="w-full h-16 flex items-center border-b border-foreground/5 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center h-full px-6 focus:outline-none group"
            aria-label={isExpanded ? "Collapse Index" : "Expand Index"}
          >
            <div className="flex items-center gap-6 text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              <div className="relative w-4 h-4 shrink-0 flex items-center justify-center ml-0.5">
                <motion.span 
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  className="absolute w-full h-[1.5px] bg-current" 
                />
                <motion.span 
                  animate={{ rotate: isExpanded ? 0 : 90, opacity: isExpanded ? 0 : 1 }}
                  className="absolute w-full h-[1.5px] bg-current" 
                />
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, filter: "blur(2px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(2px)" }}
                    className="font-mono text-[9px] uppercase tracking-[0.3em] font-bold"
                  >
                    Index
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </button>
        </div>

        {/* Project Roster Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative">
          <div className="relative flex flex-col py-4">
            {projects.map((project, idx) => (
              <SpineNode
                key={project.id}
                project={project}
                index={idx}
                isActive={idx === currentIndex}
                isExpanded={isExpanded}
                onClick={() => {
                  setIndex(idx);
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}