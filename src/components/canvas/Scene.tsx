"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
// @ts-expect-error - maath currently lacks perfect types for this import path
import * as random from "maath/random/dist/maath-random.esm";
import type { Points as ThreePoints } from "three";

function ParticleSwarm(props: any) {
  const ref = useRef<ThreePoints>(null);
  // Create a sphere of 5000 particles
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((state, delta) => {
    if (!ref.current) return;
    // Rotate the entire particle system slowly
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#00f3ff"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <ParticleSwarm />
      
      <EffectComposer>
        <Bloom luminanceThreshold={0} mipmapBlur intensity={1.5} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
}