
import { Project, Skill } from '@/types/content';

/**
 * Retrieves static skill data for the portfolio.
 * * @returns {Promise<Skill[]>} Array of categorized technical skills.
 */
export async function getSkills(): Promise<Skill[]> {
  return [
    { name: 'Next.js', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Framer Motion', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'Zustand', category: 'Frontend' },
    
    { name: 'Three.js', category: 'Graphics' },
    { name: 'React Three Fiber', category: 'Graphics' },
    { name: 'WebGL', category: 'Graphics' },
    { name: 'GLSL Shaders', category: 'Graphics' },
    
    { name: 'Node.js', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Backend' },
    { name: 'Redis', category: 'Backend' },
    { name: 'tRPC', category: 'Backend' },
  ];
}

/**
 * Retrieves static project data. 
 * IDs are defined as URL-safe slugs for potential dynamic routing.
 * * @returns {Promise<Project[]>} Array of portfolio projects.
 */
export async function getProjects(): Promise<Project[]> {
  return [
    {
      id: 'neon-protocol',
      title: 'Neon Protocol',
      description: 'A Web3 dashboard featuring real-time data visualization and high-frequency updates. Handles millions of state changes without dropping frames.',
      techStack: ['Next.js', 'TypeScript', 'Zustand', 'Tailwind CSS'],
      link: '/projects/neon'
    },
    {
      id: 'aura-configurator',
      title: 'Aura Configurator',
      description: 'An interactive 3D product configurator for automotive design. Implements complex PBR materials and environmental lighting.',
      techStack: ['React Three Fiber', 'Three.js', 'TypeScript', 'Zustand'],
      link: '/projects/aura'
    },
    {
      id: 'void-analytics',
      title: 'Void Analytics',
      description: 'High-throughput telemetry ingestion engine. Processes and visualizes server node health in a highly optimized spatial layout.',
      techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'tRPC'],
      link: '/projects/void'
    },
    {
      id: 'lumina-shader-engine',
      title: 'Lumina Shader Engine',
      description: 'A browser-based generative art platform. Allows users to write, compile, and share custom fragment shaders in real-time.',
      techStack: ['WebGL', 'GLSL Shaders', 'TypeScript', 'Framer Motion'],
      link: '/projects/lumina'
    }
  ];
}