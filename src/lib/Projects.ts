import { Project, Skill } from '@/types/content';

/**
 * Retrieves static skill data for the portfolio.
 * @returns {Promise<Skill[]>} Array of categorized technical skills.
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

    // Extended Skills Based on New Projects
    { name: 'Unity', category: 'Game Development' },
    { name: 'C#', category: 'Game Development' },
    { name: 'Luau', category: 'Game Development' },
    { name: 'Roblox Studio', category: 'Game Development' },
    
    { name: 'Python', category: 'Scientific Computing' },
    { name: 'Qiskit', category: 'Scientific Computing' },
    
    { name: 'Rust', category: 'Systems' },
    { name: 'WebAssembly', category: 'Systems' },
  ];
}

/**
 * Retrieves static project data. 
 * IDs are defined as URL-safe slugs for potential dynamic routing.
 * @returns {Promise<Project[]>} Array of portfolio projects.
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
    },
    {
      id: 'voxelscape-generator',
      title: 'Voxelscape Generator',
      description: 'A highly optimized procedural terrain and dungeon generation engine built for Roblox. Utilizes advanced 3D Perlin noise algorithms and chunk-based streaming to handle massive, infinite voxel worlds efficiently.',
      techStack: ['Roblox Studio', 'Luau', 'Procedural Generation'],
      link: '/projects/voxelscape'
    },
    {
      id: 'kinetic-sandbox',
      title: 'Kinetic Sandbox',
      description: 'A performance-driven physics simulation sandbox built in Unity. Leverages the Data-Oriented Technology Stack (DOTS) and the Burst Compiler to calculate tens of thousands of rigid body collisions at high framerates.',
      techStack: ['Unity', 'C#', 'HLSL', 'Unity DOTS'],
      link: '/projects/kinetic'
    },
    {
      id: 'q-circuit-optimizer',
      title: 'Quantum Circuit Optimizer',
      description: 'An algorithmic toolset for minimizing gate depths in noisy intermediate-scale quantum (NISQ) circuits. Significantly reduces quantum decoherence errors by optimizing transpilation passes.',
      techStack: ['Python', 'Qiskit', 'NumPy', 'React'],
      link: '/projects/q-circuit'
    },
    {
      id: 'aether-physics-engine',
      title: 'Aether Engine',
      description: 'A deterministic 2D physics engine written in Rust and compiled to WebAssembly. Enables highly responsive, browser-based physical simulations with near-native performance and zero-allocation memory management.',
      techStack: ['Rust', 'WebAssembly', 'TypeScript', 'Next.js'],
      link: '/projects/aether'
    }
  ];
}