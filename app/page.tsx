import HeroOverlay from "@/components/home/HeroOverlay";
import CanvasBackground from "@/components/canvas/CanvasBackground";

import ArticleClusters from "@/components/home/ArticleFeatures";
import EcosystemWorkspace from "@/components/home/SkillsAndProjects";

import { getCategorizedPosts } from "@/lib/posts";
import { getSkills, getProjects } from "@/lib/projects";

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
    getCategorizedPosts(["Next.js", "WebGL", "TypeScript"], true)
  ]);

  return (
    <main className="relative min-h-screen bg-background text-foreground selection:bg-primary-glow selection:text-foreground overflow-hidden">
      <CanvasBackground />

      <div className="relative z-10 w-full flex flex-col gap-32 pb-40">
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