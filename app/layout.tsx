import type { Metadata } from "next";
import { Merriweather, Fira_Code, Tinos } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/global/Navbar";

const titleFont = Tinos({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-title",
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
        className={`${titleFont.variable} ${firaCode.variable} font-mono antialiased bg-background text-foreground selection:bg-primary selection:text-background`}
        suppressHydrationWarning
      >
        <Navbar/>
        {children}
      </body>
    </html>
  );
}