import HeroOverlay from "@/components/ui/HeroOverlay";
import ArticleGrid from "@/components/ui/ArticleGrid";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CanvasBackground from "@/components/canvas/CanvasBackground";
import Navbar from "@/components/ui/Navbar";

const getPosts = async () => [
  { id: '1', title: 'Mastering R3F Performance', excerpt: 'Techniques for locking 60fps in React Three Fiber.', tags: ['React', '3D', 'Performance'] },
  { id: '2', title: 'The Future of Server Components', excerpt: 'Why RSCs change everything for frontend architecture.', tags: ['Next.js', 'Architecture'] },
  { id: '3', title: 'Building Glassmorphic UI', excerpt: 'Leveraging Tailwind for cyber-aesthetic overlays.', tags: ['CSS', 'Design'] },
];

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="relative min-h-screen bg-[#050505] text-[#ededed] selection:bg-[#00f3ff] selection:text-[#050505]">
      <ScrollProgress />
      
      {/* Scroll-linked dynamic background */}
      <CanvasBackground />

      <div className="relative z-10 pointer-events-none">
        <HeroOverlay />
        <Navbar />
        
        <section id="articles" className="min-h-screen max-w-7xl mx-auto px-6 py-24">
          <ArticleGrid posts={posts} />
        </section>
      </div>
    </main>
  );
}