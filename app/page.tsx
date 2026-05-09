import HeroOverlay from "@/components/home/HeroOverlay";
import CanvasBackground from "@/components/canvas/CanvasBackground";
import Navbar from "@/components/global/Navbar";

import ArticleClusters from "@/components/home/ArticleClusters";
import EcosystemWorkspace from "@/components/home/EcosystemWorkspace";

import { getFeaturedPosts } from "@/lib/Posts";

export interface Skill {
  name: string;
  category: "Frontend" | "Backend" | "Graphics";
}

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link: string;
}

export async function getSkills(): Promise<Skill[]> {
  return [
    // Frontend
    { name: 'Next.js', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Framer Motion', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'Zustand', category: 'Frontend' },
    
    // Graphics
    { name: 'Three.js', category: 'Graphics' },
    { name: 'React Three Fiber', category: 'Graphics' },
    { name: 'WebGL', category: 'Graphics' },
    { name: 'GLSL Shaders', category: 'Graphics' },
    
    // Backend & Systems
    { name: 'Node.js', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Backend' },
    { name: 'Redis', category: 'Backend' },
    { name: 'tRPC', category: 'Backend' },
  ];
}

export async function getProjects(): Promise<Project[]> {
  return [
    {
      id: 'p1',
      title: 'Neon Protocol',
      description: 'A Web3 dashboard featuring real-time data visualization and high-frequency updates. Handles millions of state changes without dropping frames.',
      techStack: ['Next.js', 'TypeScript', 'Zustand', 'Tailwind CSS'],
      link: '/projects/neon'
    },
    {
      id: 'p2',
      title: 'Aura Configurator',
      description: 'An interactive 3D product configurator for automotive design. Implements complex PBR materials and environmental lighting.',
      techStack: ['React Three Fiber', 'Three.js', 'TypeScript', 'Zustand'],
      link: '/projects/aura'
    },
    {
      id: 'p3',
      title: 'Void Analytics',
      description: 'High-throughput telemetry ingestion engine. Processes and visualizes server node health in a highly optimized spatial layout.',
      techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'tRPC'],
      link: '/projects/void'
    },
    {
      id: 'p4',
      title: 'Lumina Shader Engine',
      description: 'A browser-based generative art platform. Allows users to write, compile, and share custom fragment shaders in real-time.',
      techStack: ['WebGL', 'GLSL Shaders', 'TypeScript', 'Framer Motion'],
      link: '/projects/lumina'
    }
  ];
}

/**
 * Main application entry point.
 * Aggregates all static and dynamic data clusters for the portfolio.
 *
 * @returns {JSX.Element}
 */
export default async function Home() {
  const [skills, projects, featuredPosts] = await Promise.all([
    getSkills(),
    getProjects(),
    getFeaturedPosts()
  ]);

  return (
    <main className="relative min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] selection:bg-[var(--color-primary-glow)] selection:text-[var(--color-foreground)] overflow-hidden">
      <CanvasBackground />

      <div className="relative z-10 w-full flex flex-col gap-32 pb-40">
        <Navbar />
        <HeroOverlay />

        <section id="ecosystem" className="max-w-7xl mx-auto w-full px-6">
          <EcosystemWorkspace skills={skills} projects={projects} />
        </section>

        <section id="featured-articles" className="max-w-7xl mx-auto w-full px-6">
          <ArticleClusters categories={featuredPosts} />
        </section>
      </div>
    </main>
  );
}