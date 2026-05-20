"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import type { Skill, Project } from "@/types/content";
import { ProjectSpine } from "./ProjectSpine";

interface KineticEcosystemProps {
  skills: Skill[];
  projects: Project[];
}

/**
 * KineticEcosystem
 * Refined spatial interface. Blends deep editorial structure with immersive kinetic lighting.
 */
export default function KineticEcosystem({ skills, projects }: KineticEcosystemProps) {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [cycleFocus, setCycleFocus] = useState<string | null>(null);

  const activeProject = projects[activeProjectIndex];

  const groupedSkills = useMemo(() => {
    return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});
  }, [skills]);

  const cycleProjectByTech = useCallback(
    (techName: string) => {
      const validIndices = projects.reduce<number[]>((acc, project, idx) => {
        if (project.techStack.includes(techName)) acc.push(idx);
        return acc;
      }, []);

      if (!validIndices.length) return;

      const currentPos = validIndices.indexOf(activeProjectIndex);
      const nextIdx =
        currentPos === -1
          ? validIndices[0]
          : validIndices[(currentPos + 1) % validIndices.length];

      setActiveProjectIndex(nextIdx);
      setCycleFocus(techName);
    },
    [projects, activeProjectIndex]
  );

  const handleManualIndexChange = useCallback((idx: number) => {
    setActiveProjectIndex(idx);
    setCycleFocus(null);
  }, []);

 return (
    // THE FIX: grid grid-rows-[1fr_auto] ensures strict, impenetrable cell boundaries.
    // min-h-[100svh] ensures it fills the screen, but can grow beyond it on tiny mobile screens.
    <section className="relative w-full min-h-[100svh] overflow-x-hidden bg-background text-foreground grid grid-rows-[1fr_auto]">
      
      {/* 01. Innovative Project Spine (Absolute left) */}
      <ProjectSpine 
        projects={projects}
        currentIndex={activeProjectIndex} 
        setIndex={handleManualIndexChange}
        cycleFocus={cycleFocus}
      />

      {/* 02. The Monolith (Occupies Row 1: 1fr) */}
      <ProjectTitle 
        project={activeProject} 
      />

      {/* 03. High-Contrast Skill Matrix (Occupies Row 2: auto) */}
      <HighContrastSkillMatrix
        groupedSkills={groupedSkills}
        projects={projects}
        activeProject={activeProject}
        hoveredTech={hoveredTech}
        setHoveredTech={setHoveredTech}
        onSkillClick={cycleProjectByTech}
        cycleFocus={cycleFocus}
      />
    </section>
  );
}

/**
 * HighContrastSkillMatrix
 * Utilizes primary color glow for cycle focus and active dependency views. High contrast headers.
 */
function HighContrastSkillMatrix({ 
  groupedSkills, 
  projects,
  activeProject, 
  hoveredTech, 
  setHoveredTech, 
  onSkillClick,
  cycleFocus
}: {
  groupedSkills: Record<string, Skill[]>;
  projects: Project[];
  activeProject: Project;
  hoveredTech: string | null;
  setHoveredTech: (tech: string | null) => void;
  onSkillClick: (tech: string) => void;
  cycleFocus: string | null;
}) {
  const activeTechStack = new Set(activeProject.techStack);

  return (
 <div className="z-20 pointer-events-none px-8 md:pl-48 md:pr-12 pb-12 w-full">
      <div className="flex flex-wrap justify-start items-start gap-x-16 gap-y-10 max-w-6xl mx-auto w-full pointer-events-auto border-t border-foreground/10 pt-10">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="flex flex-col gap-4 min-w-[180px]">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-primary border-b border-primary/20 pb-2 w-full">
              {category}
            </h4>
            
            <ul className="flex flex-col gap-2 items-start">
              {categorySkills.map((skill) => {
                const isCycleFocus = cycleFocus === skill.name;
                const isActiveDependency = activeTechStack.has(skill.name);
                const isHovered = hoveredTech === skill.name;
                
                const validProjects = projects.filter(p => p.techStack.includes(skill.name));
                const totalOccurrences = validProjects.length;
                const currentRank = validProjects.findIndex(p => p.id === activeProject.id) + 1;

                const showCycleIndicator = isCycleFocus || (isHovered && totalOccurrences > 1);

                // ZERO LAYOUT SHIFT: Font colors mutate, but padding is rigid. Background is absolute.
                let textStyle = "text-muted-foreground/50 group-hover:text-primary";
                if (isCycleFocus) {
                  textStyle = "text-background font-bold";
                } else if (isActiveDependency) {
                  textStyle = "text-primary font-bold drop-shadow-[0_0_8px_var(--color-primary-glow)]";
                }

                return (
                  <li key={skill.name} className="relative flex items-center h-7">
                    <button
                      onClick={() => onSkillClick(skill.name)}
                      onMouseEnter={() => setHoveredTech(skill.name)}
                      onMouseLeave={() => setHoveredTech(null)}
                      disabled={totalOccurrences === 0}
                      className={`group relative flex items-center gap-2.5 text-left transition-all duration-300 ease-out px-2.5 -ml-2.5 h-full ${
                        totalOccurrences === 0 ? "opacity-20 cursor-not-allowed" : "cursor-pointer"
                      }`}
                      style={{ transform: isHovered && !isCycleFocus ? "translateX(8px)" : "translateX(0)" }}
                    >
                      {/* Hardware Accelerated Active Plate */}
                      {isCycleFocus && (
                        <motion.div 
                          layoutId="active-skill-plate"
                          className="absolute inset-0 bg-primary rounded-sm shadow-[0_0_15px_var(--color-primary-glow)]"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}

                      <span className={`relative z-10 font-mono text-xs md:text-sm transition-colors duration-300 whitespace-nowrap ${textStyle}`}>
                        {skill.name}
                      </span>

                      {/* Proximate Cycle Indicator */}
                      <AnimatePresence>
                        {showCycleIndicator && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`relative z-10 font-mono text-[11px] whitespace-nowrap tracking-widest ${
                              isCycleFocus ? "text-background/80" : "text-primary/70"
                            }`}
                          >
                            [{currentRank}/{totalOccurrences}]
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

      </div>
    </div>
  );
}

function ProjectTitle({ project }: { project: Project }) {
  return (
    <div className="relative z-10 grid place-items-center pointer-events-none pl-20 md:pl-24 pr-8 py-16 w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          // Decreased the initial scale/blur delta so there is less distance to travel
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.98 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          // THE FIX: Isolated exit transition to get the old node out of the DOM in 150ms
          exit={{ 
            opacity: 0, 
            filter: "blur(10px)", 
            scale: 1.02, 
            transition: { duration: 0.15, ease: "easeIn" } 
          }}
          // Aggressive, snappy bezier curve for the entrance
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center max-w-[950px] w-full"
        >
          <motion.h2 
            className="text-[clamp(2.5rem,5.5vw,7rem)] font-serif leading-[0.82] tracking-tighter uppercase mix-blend-difference text-foreground drop-shadow-[0_0_15px_var(--color-primary-glow)]"
            layoutId="project-title"
          >
            {project.title}
          </motion.h2>

          <div className="mt-10 overflow-hidden">
            <motion.p
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              // Compressed delay from 0.15 to 0.05
              transition={{ delay: 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm md:text-base font-mono text-muted-foreground max-w-xl mx-auto leading-relaxed"
            >
              {project.description}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            // Compressed delay from 0.4 to 0.15. Faster overall duration.
            transition={{ delay: 0.15, duration: 0.4, ease: "circOut" }}
            className="mt-14 pointer-events-auto"
          >
            <Link
              href={project.link}
              className="group relative inline-flex items-center gap-5 px-8 py-4 border border-primary/20 hover:border-primary/70 text-primary font-mono text-[11px] uppercase tracking-[0.25em] transition-colors duration-400 drop-shadow-[0_0_8px_var(--color-primary-glow)] hover:bg-primary/5"
            >
              <span>Execute Sequence</span>
              <span className="group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}