"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export interface Skill {
  name: string;
  category: "Frontend" | "Backend" | "Graphics";
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link: string;
}

interface EcosystemWorkspaceProps {
  skills: Skill[];
  projects: Project[];
}

/**
 * An interactive workspace bridging skills and deployed projects.
 * Hovering a skill node highlights the corresponding architecture.
 *
 * @param {EcosystemWorkspaceProps} props
 * @returns {JSX.Element}
 */
export default function EcosystemWorkspace({ skills, projects }: EcosystemWorkspaceProps) {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  const activeProject = projects[activeProjectIndex];

  const groupedSkills = useMemo(() => {
    return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});
  }, [skills]);

  return (
    <div className="w-full flex flex-col gap-24">
      {/* --- SKILLS CONTROL SURFACE --- */}
      <section className="w-full flex flex-col gap-8">
        <h2 className="text-3xl font-serif text-foreground border-b border-primary/20 pb-4">
          System <span className="text-primary font-mono text-xl uppercase">Capabilities</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="flex flex-col gap-4">
              <h3 className="font-mono text-primary/50 uppercase tracking-widest text-xs">
                // {category}
              </h3>
              <ul className="flex flex-wrap gap-3" aria-label={`${category} skills`}>
                {categorySkills.map((skill) => {
                  const isHovered = hoveredTech === skill.name;
                  
                  return (
                    <li key={skill.name}>
                      <button
                        onMouseEnter={() => setHoveredTech(skill.name)}
                        onMouseLeave={() => setHoveredTech(null)}
                        onFocus={() => setHoveredTech(skill.name)}
                        onBlur={() => setHoveredTech(null)}
                        className={`px-3 py-1.5 font-mono text-sm border rounded-sm transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                          isHovered
                            ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_var(--color-primary-glow)]"
                            : "bg-background border-primary/20 text-muted hover:border-primary/50"
                        }`}
                      >
                        {skill.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* --- PROJECT HUD --- */}
      <section className="w-full flex flex-col gap-8">
        <h2 className="text-3xl font-serif text-foreground border-b border-primary/20 pb-4">
          Deployed <span className="text-primary font-mono text-xl uppercase">Architecture</span>
        </h2>

        <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
          {/* Master List */}
          <nav className="flex flex-row lg:flex-col gap-2 w-full lg:w-1/3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            {projects.map((project, index) => {
              const isActive = index === activeProjectIndex;
              const hasHoveredTech = hoveredTech ? project.techStack.includes(hoveredTech) : false;
              const isDimmed = hoveredTech && !hasHoveredTech;

              return (
                <button
                  key={project.id}
                  onClick={() => setActiveProjectIndex(index)}
                  className={`relative px-4 py-4 text-left font-mono text-sm transition-all duration-300 flex items-center gap-3 rounded-md border border-transparent ${
                    isActive ? "text-primary" : "text-muted hover:text-foreground"
                  } ${isDimmed ? "opacity-30 grayscale" : "opacity-100"} ${
                    hasHoveredTech && !isActive ? "border-primary/50 bg-primary/5" : ""
                  }`}
                >
                  <span className="opacity-50 text-xs">{(index + 1).toString().padStart(2, '0')}</span>
                  {project.title}
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeProjectIndicator"
                      className="absolute inset-0 border border-primary/40 bg-primary/10 rounded-md -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Status Indicator for linked tech */}
                  {hasHoveredTech && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_var(--color-primary-glow)] animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Detail View */}
          <div className="w-full lg:w-2/3 relative rounded-md border border-primary/20 bg-background/50 backdrop-blur-sm overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full p-8 relative z-10"
              >
                <div className="w-full h-64 bg-primary/5 border border-primary/20 rounded-sm mb-8 flex items-center justify-center bg-[linear-gradient(var(--color-primary-glow)_1px,transparent_1px),linear-gradient(90deg,var(--color-primary-glow)_1px,transparent_1px)] bg-[size:20px_20px]">
                   <span className="font-mono text-primary/40 text-xs tracking-widest uppercase">
                     Media_Source_Not_Found
                   </span>
                </div>

                <h3 className="text-3xl font-serif text-foreground mb-4">
                  {activeProject.title}
                </h3>
                
                <p className="text-muted font-mono text-sm leading-relaxed mb-8 max-w-2xl">
                  {activeProject.description}
                </p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                  <ul className="flex flex-wrap gap-2">
                    {activeProject.techStack.map((tech) => {
                      const isHighlighted = hoveredTech === tech;
                      
                      return (
                        <li
                          key={tech}
                          className={`px-2 py-1 text-xs font-mono rounded-sm transition-colors duration-300 ${
                            isHighlighted 
                              ? "text-background bg-primary shadow-[0_0_10px_var(--color-primary-glow)]" 
                              : "text-primary/80 bg-primary/10 border border-primary/20"
                          }`}
                        >
                          {tech}
                        </li>
                      );
                    })}
                  </ul>

                  <Link
                    href={activeProject.link}
                    className="group relative px-6 py-2 font-mono text-sm uppercase tracking-wider text-background bg-primary hover:bg-secondary transition-colors rounded-sm overflow-hidden"
                  >
                    <span className="relative z-10 font-bold">Initialize</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}