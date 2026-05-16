"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import type { Skill, Project } from "@/types/content";
import { ProjectNodeTrack } from "./ProjectNodeTrack";

interface EcosystemWorkspaceProps {
  skills: Skill[];
  projects: Project[];
}

/**
 * EcosystemWorkspace
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

  /**
   * Scans the project matrix for a specific technology and cycles the active index.
   * @param {string} techName - The technology identifier to query.
   */
  const cycleProjectByTech = useCallback((techName: string) => {
    const validIndices = projects.reduce<number[]>((acc, project, idx) => {
      if (project.techStack.includes(techName)) acc.push(idx);
      return acc;
    }, []);

    if (!validIndices.length) return;

    const currentPos = validIndices.indexOf(activeProjectIndex);
    const nextIdx = currentPos === -1 
      ? validIndices[0] 
      : validIndices[(currentPos + 1) % validIndices.length];

    setActiveProjectIndex(nextIdx);
  }, [projects, activeProjectIndex]);

  return (
    <section className="w-full flex flex-col gap-6 items-start max-w-7xl mx-auto">
      <ProjectNodeTrack
        projects={projects}
        activeProjectIndex={activeProjectIndex}
        setActiveProjectIndex={setActiveProjectIndex}
        hoveredTech={hoveredTech}
      />
      
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch min-h-[500px]">
        <ProjectDetailView project={activeProject} />
        
        <SkillsSummary
          groupedSkills={groupedSkills}
          hoveredTech={hoveredTech}
          setHoveredTech={setHoveredTech}
          activeProjectTech={activeProject.techStack}
          onSkillClick={cycleProjectByTech}
          projects={projects}
          activeProjectIndex={activeProjectIndex}
        />
      </div>
    </section>
  );
}

interface ProjectDetailViewProps {
  project: Project;
}

/**
 * ProjectDetailView
 * Stripped of redundant tech tags. Focuses entirely on narrative and execution.
 */
function ProjectDetailView({ project }: ProjectDetailViewProps) {
  return (
    <main className="w-full h-full relative rounded-md border border-primary/20 bg-background/50 backdrop-blur-md overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col h-full p-8 relative z-10"
        >
          <div className="w-full h-56 bg-primary/5 border border-primary/20 rounded-sm mb-8 flex items-center justify-center bg-[linear-gradient(var(--color-primary-glow)_1px,transparent_1px),linear-gradient(90deg,var(--color-primary-glow)_1px,transparent_1px)] bg-[size:24px_24px]">
            <span className="font-mono text-primary/30 text-xs tracking-widest uppercase">
              No_Visual_Data
            </span>
          </div>

          <h3 className="text-3xl font-serif text-foreground mb-4">{project.title}</h3>
          
          <p className="text-muted font-mono text-sm leading-relaxed flex-grow">
            {project.description}
          </p>

          <div className="mt-8 flex justify-end">
            <Link
              href={project.link}
              className="group relative px-8 py-3 font-mono text-xs uppercase tracking-widest text-background bg-primary hover:bg-secondary transition-colors rounded-sm overflow-hidden"
            >
              <span className="relative z-10 font-bold">Execute //</span>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

interface SkillsSummaryProps {
  groupedSkills: Record<string, Skill[]>;
  hoveredTech: string | null;
  setHoveredTech: (tech: string | null) => void;
  activeProjectTech: string[];
  onSkillClick: (tech: string) => void;
  projects: Project[];
  activeProjectIndex: number;
}

/**
 * SkillsSummary
 * Renders the skill tree and computes real-time pagination subsets for active node discovery.
 */
export function SkillsSummary({
  groupedSkills,
  hoveredTech,
  setHoveredTech,
  activeProjectTech,
  onSkillClick,
  projects,
  activeProjectIndex,
}: SkillsSummaryProps) {
  const activeProject = projects[activeProjectIndex];

  const skillMetrics = useMemo(() => {
    const metrics: Record<string, { total: number; current: number }> = {};
    
    Object.values(groupedSkills).flat().forEach((skill) => {
      metrics[skill.name] = { total: 0, current: 0 };
    });

    projects.forEach((proj) => {
      proj.techStack.forEach((tech) => {
        if (metrics[tech]) metrics[tech].total += 1;
      });
    });

    activeProjectTech.forEach((tech) => {
      if (!metrics[tech]) return;
      const matchingProjects = projects.filter((p) => p.techStack.includes(tech));
      metrics[tech].current = matchingProjects.findIndex((p) => p.id === activeProject.id) + 1;
    });

    return metrics;
  }, [projects, activeProject, activeProjectTech, groupedSkills]);

  return (
    <aside className="w-full h-full flex flex-col gap-6 border border-primary/10 p-8 rounded-md bg-primary/5 overflow-y-auto custom-scrollbar">
      <header className="border-b border-primary/20 pb-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-serif text-foreground">Skills</h2>
        </div>
        <p className="font-mono text-[10px] text-muted/50 uppercase tracking-widest">
          {"> Click any skill to see related projects"}
        </p>
      </header>

      <div className="flex flex-col gap-8 mt-2">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="flex flex-col gap-4">
            <h3 className="font-mono text-primary/40 uppercase tracking-widest text-xs">
              // {category}
            </h3>
            <ul className="flex flex-wrap gap-2" aria-label={`${category} skills`}>
              {categorySkills.map((skill) => {
                const isHovered = hoveredTech === skill.name;
                const isActiveProjectDependency = activeProjectTech.includes(skill.name);
                const metrics = skillMetrics[skill.name] || { total: 0, current: 0 };
                
                const paginationText = `[${metrics.current}/${metrics.total}]`;
                
                let buttonClasses = "bg-background border-primary/20 text-muted hover:border-primary/50";
                
                if (isHovered) {
                  buttonClasses = "bg-primary border-primary text-background shadow-[0_0_15px_var(--color-primary-glow)] z-10";
                } else if (isActiveProjectDependency) {
                  buttonClasses = "bg-primary/15 border-primary/60 text-primary shadow-[inset_0_0_10px_var(--color-primary-glow)]";
                }

                return (
                  <li key={skill.name}>
                    <button
                      onClick={() => onSkillClick(skill.name)}
                      onMouseEnter={() => setHoveredTech(skill.name)}
                      onMouseLeave={() => setHoveredTech(null)}
                      onFocus={() => setHoveredTech(skill.name)}
                      onBlur={() => setHoveredTech(null)}
                      disabled={metrics.total === 0}
                      className={`group relative flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs border rounded-sm transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                        metrics.total === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      } ${buttonClasses}`}
                      aria-label={isActiveProjectDependency ? `Cycle projects using ${skill.name}` : `View projects using ${skill.name}`}
                    >
                      <span className="whitespace-nowrap">{skill.name}</span>
                      
                      <span className="max-w-0 opacity-0 group-hover:max-w-[40px] group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap overflow-hidden text-[10px] tracking-widest font-bold">
                        {paginationText}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}