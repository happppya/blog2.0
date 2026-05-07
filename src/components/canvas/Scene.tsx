"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { AtmosphericGlow } from "./AtmosphericGlow";
import { LensedPhotonRing } from "./LensedPhotonRing";
import type { Group, Points as ThreePoints, Mesh, MeshBasicMaterial } from "three";
import { easing } from "maath";


interface AccretionDiskProps {
  count: number;
  innerRadius: number;
  outerRadius: number;
  color: string;
  size: number;
  speed: number;
}

/**
 * Generates an accretion disk utilizing exponential falloff math.
 */
function AccretionDisk({ count, innerRadius, outerRadius, color, size, speed }: AccretionDiskProps) {
  const meshRef = useRef<ThreePoints>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const distanceRatio = Math.pow(Math.random(), 3);
      const r = innerRadius + distanceRatio * (outerRadius - innerRadius);
      const theta = Math.random() * 2 * Math.PI;

      // Compresses the Y-axis to create a flat, sharp disk rather than a cloud
      const y = (Math.random() - 0.5) * (0.1 / (r - innerRadius + 0.2));

      pos[i * 3] = r * Math.cos(theta);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = r * Math.sin(theta);
    }
    return pos;
  }, [count, innerRadius, outerRadius]);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y -= delta * speed;
  });

  return (
    <Points ref={meshRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={color} size={size} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

/**
 * Constructs a hyper-dense, luminous ring just outside the event horizon.
 * Serves as the primary light source for the Bloom post-processing pass.
 */
function PhotonRing() {
  const meshRef = useRef<ThreePoints>(null);

  const positions = useMemo(() => {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI;
      // Locks particles to a strict, microscopic boundary
      const r = 0.52 + Math.random() * 0.02;

      pos[i * 3] = r * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      pos[i * 3 + 2] = r * Math.sin(theta);
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.5;
  });

  return (
    <Points ref={meshRef} positions={positions} stride={3} frustumCulled={false}>
      {/* Over-driven color value ensures aggressive bloom bleed */}
      <PointMaterial transparent color="#00ffff" size={0.008} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

/**
 * Renders an absolute black sphere to occlude background geometry.
 */
function EventHorizon() {
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
        <EventHorizon />

        <AccretionDisk count={1500} innerRadius={0.6} outerRadius={10.0} color="#96b9ff" size={0.015} speed={0.05} />
        <AccretionDisk count={1000} innerRadius={0.7} outerRadius={8.0} color="#96a5ff" size={0.025} speed={0.04} />
        <AccretionDisk count={100} innerRadius={0.7} outerRadius={8.0} color="#ffbb96" size={0.025} speed={0.04} />
        <AccretionDisk count={100} innerRadius={0.7} outerRadius={8.0} color="#ff9696" size={0.025} speed={0.04} />
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
      // Camera is pulled back to z: 7, viewing the origin from deep within the DeepSpace sphere (radius: 20)
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      className="fixed inset-0 z-[-1]"
    >
      <GravitationalSystem />

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={2.0} />
        <Vignette eskil={false} offset={0.3} darkness={0.9} />
      </EffectComposer>
    </Canvas>
  );
}