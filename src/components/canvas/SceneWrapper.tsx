"use client";

import dynamic from "next/dynamic";

/**
 * Client boundary for the WebGL Canvas.
 * Dynamically imports the R3F scene with SSR disabled to prevent Node.js window/document errors.
 * * @returns React element containing the client-only 3D scene
 */
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function SceneWrapper() {
  return <Scene />;
}