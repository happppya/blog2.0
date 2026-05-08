"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Vector3, Group, Mesh } from "three";
import { easing } from "maath";

import { Lensing } from "./GravitationalLensing";
import type { GravitationalLensingEffect } from "@/effects/GravitationalLensingEffect";

import { LensedPhotonRing } from "./LensedPhotonRing";
import { AccretionDisk } from "./AccretionDisk";
import { AtmosphericGlow } from "./AtmosphericGlow";

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

/**
 * Orchestrates the gravitational system and projects coordinates for the lensing shader.
 */
function GravitationalSystem({ effectRef }: { effectRef: React.RefObject<GravitationalLensingEffect | null> }) {
  const systemRef = useRef<Group>(null);
  const singularityRef = useRef<Group>(null);
  const { camera, size } = useThree();

  useFrame((state, delta) => {
    if (systemRef.current) {
      easing.dampE(
        systemRef.current.rotation,
        [state.pointer.y / 8, -state.pointer.x / 8, 0],
        0.5,
        delta
      );
    }

    if (singularityRef.current && effectRef.current) {
      const pos = new Vector3();
      singularityRef.current.getWorldPosition(pos);
      pos.project(camera);

      const x = (pos.x * 0.5) + 0.5;
      const y = (pos.y * 0.5) + 0.5;

      const centerUniform = effectRef.current.uniforms.get("center");
      if (centerUniform) {
        centerUniform.value.set(x, y);
      }
      const aspectUniform = effectRef.current.uniforms.get("aspect");
      if (aspectUniform) {
        aspectUniform.value = size.width / size.height;
      }
    }
  });

  return (
    <group ref={systemRef}>
      <group rotation={[Math.PI / 3, 0, -Math.PI / 6]}>
        <group ref={singularityRef} />

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
 * Root 3D Scene container with post-processing pipeline.
 */
export default function Scene() {
  const lensingRef = useRef<GravitationalLensingEffect>(null);

  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", preserveDrawingBuffer: true, alpha: true }}
    >
      <GravitationalSystem effectRef={lensingRef} />

      <EffectComposer>
        <Lensing ref={lensingRef} mass={0.8} innerRadius={0.08} outerRadius={0.105} aspect={1.0} />
        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={2.0} />
        <Vignette eskil={false} offset={0.3} darkness={0.9} />
      </EffectComposer>
    </Canvas>
  );
}