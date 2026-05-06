import type { Metadata } from "next";
import { Merriweather, Fira_Code } from "next/font/google";
import "./globals.css";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Creative Developer | Immersive Tech Blog",
  description: "Exploring Next.js, React Three Fiber, and digital aesthetics.",
};

/**
 * Root server layout.
 * Injects optimized font variables and enforces dark-mode baseline.
 * * @param props - Component props
 * @param props.children - Child server or client components
 * @returns The root HTML document structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body 
        className={`${merriweather.variable} ${firaCode.variable} font-mono antialiased bg-[#050505] text-[#ededed] selection:bg-[#00f3ff] selection:text-[#050505]`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}