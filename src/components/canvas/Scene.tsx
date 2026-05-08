"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import type { Group, Mesh } from "three";

import { easing } from "maath";

import { AtmosphericGlow } from "./AtmosphericGlow";
import { LensedPhotonRing } from "./LensedPhotonRing";
import { AccretionDisk } from "./AccretionDisk";

/**
 * Renders an absolute black sphere to occlude background geometry.
 */
function BlackSphere() {
  const meshRef = useRef<Mesh>(null);

  return (
    <mesh ref={meshRef} renderOrder={1}>
      <sphereGeometry args={[0.4, 64, 64]} />
      <meshBasicMaterial color="#000000" />
    </mesh>
  );
}

function GravitationalSystem() {
  const trackingGroupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!trackingGroupRef.current) return;

    easing.dampE(
      trackingGroupRef.current.rotation,
      [state.pointer.y / 8, -state.pointer.x / 8, 0],
      0.5,
      delta
    );
  });

  return (
    <group ref={trackingGroupRef}>

      <group rotation={[Math.PI / 3, 0, -Math.PI / 6]}>
        
        <BlackSphere />

        <AccretionDisk count={1500} innerRadius={0.6} outerRadius={10.0} color="#96b9ff" size={0.05} speed={0.1} />
        <AccretionDisk count={1000} innerRadius={0.7} outerRadius={8.0} color="#96a5ff" size={0.05} speed={0.09} />
        <AccretionDisk count={100} innerRadius={0.7} outerRadius={8.0} color="#ffbb96" size={0.06} speed={0.09} />
        <AccretionDisk count={100} innerRadius={0.7} outerRadius={8.0} color="#ff9696" size={0.06} speed={0.08} />
        <AccretionDisk count={20} innerRadius={0.7} outerRadius={8.0} color="#ffbb96" size={0.09} speed={0.08} />
        <AccretionDisk count={100} innerRadius={0.7} outerRadius={8.0} color="#cb96ff" size={0.08} speed={0.08} />
        <AtmosphericGlow color="#5970ff" radius={0.48} />
        <LensedPhotonRing 
          color="#5970ff" 
          innerRadius={0.42} 
          stretch={5.0} 
          pinch={0.8} 
        />
      </group>
    </group>
  );
}

/**
 * Root 3D Scene container.
 */
export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: true, alpha: true }}
    >
      <GravitationalSystem />

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={2.0} />
        <Vignette eskil={false} offset={0.3} darkness={0.9} />
      </EffectComposer>
    </Canvas>
  );
}