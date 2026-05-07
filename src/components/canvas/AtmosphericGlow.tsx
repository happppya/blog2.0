"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mesh, ShaderMaterial } from "three";

const VERTEX_SHADER = `
  varying vec3 vNormal;
  void main() {
    // Transform normals into view space
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  varying vec3 vNormal;
  uniform vec3 color;
  uniform float power;
  uniform float multiplier;
  
  void main() {
    // Clamp the base to 0.0 to prevent NaN failures in the pow() function
    float dotProduct = dot(vNormal, vec3(0.0, 0.0, 1.0));
    float base = max(0.0, 0.6 - dotProduct);
    float intensity = pow(base, power);
    
    gl_FragColor = vec4(color, 1.0) * intensity * multiplier;
  }
`;

interface AtmosphericGlowProps {
  color?: string;
  radius?: number;
}

/**
 * Renders a volumetric, gaseous aura using a custom Fresnel shader.
 * Completely transparent at the camera-facing center, fading to intense glow at the edges.
 * * @param {string} color - Hex code matching the photon ring for seamless bleeding.
 * @param {number} radius - Must be slightly larger than the Event Horizon geometry.
 */
export function AtmosphericGlow({ color = "#00f3ff", radius = 0.48 }: AtmosphericGlowProps) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color(color) },
    power: { value: 0.5 }, // Controls the sharpness of the inner cutoff
    multiplier: { value: 0 } // Controls peak brightness for Bloom ingestion
  }), [color]);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    // Subtle, organic pulsing driven by the fragment shader multiplier
    materialRef.current.uniforms.multiplier.value = 1.2 + Math.sin(clock.elapsedTime * 5) * 0.2;
  });

  return (
    <mesh ref={meshRef} renderOrder={1}>
      <sphereGeometry args={[radius, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.BackSide} // Render on the inside to prevent weird depth sorting with the disk
      />
    </mesh>
  );
}