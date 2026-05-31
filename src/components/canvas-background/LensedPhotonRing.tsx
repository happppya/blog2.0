"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ShaderMaterial } from "three";
import { easing } from "maath";

const VERTEX_SHADER = `
  varying vec3 vLocalPos;
  void main() {
    vLocalPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  varying vec3 vLocalPos;
  uniform vec3 color;
  uniform float innerRadius;
  uniform float stretch;
  uniform float pinch;
  uniform float angle;
  
  void main() {
    float dist = length(vLocalPos.xy);
    if (dist < innerRadius) discard; 
    
    float distFromEdge = dist - innerRadius;
    
    // 2D Rotation Matrix mapping
    float c = cos(angle);
    float s = sin(angle);
    mat2 rotMatrix = mat2(c, -s, s, c);
    
    // Mathematically spin the directional vector before applying the pinch
    vec2 rotatedDir = rotMatrix * normalize(vLocalPos.xy);
    
    float angularPenalty = pow(abs(rotatedDir.y), 1.0 / pinch);
    float distanceAcceleration = 1.0 + (distFromEdge * 2.0);
    
    float decayMultiplier = mix(1.0 / stretch, 12.0 * distanceAcceleration, angularPenalty);
    float scaledDist = distFromEdge * decayMultiplier;
    
    float intensity = exp(-scaledDist * 6.0); 
    
    gl_FragColor = vec4(color, 1.0) * intensity * 2.5;
  }
`;

interface LensedPhotonRingProps {
  color?: string;
  innerRadius?: number;
  stretch?: number; 
  pinch?: number;
  angle?: number; 
}

/**
 * Parametric anamorphic photon streak with integrated matrix rotation.
 * @param {number} innerRadius - Anchors inside the EventHorizon (0.4).
 * @param {number} stretch - Defines X-axis light bleed length.
 * @param {number} pinch - Defines Z-axis curve aggression.
 * @param {number} angle - Rotation in radians (e.g., Math.PI / 2 for 90 degrees).
 */
export function LensedPhotonRing({ 
  color = "#00ffff", 
  innerRadius = 0.38,
  stretch = 4.0, 
  pinch = 2.5,
  angle = 0    
}: LensedPhotonRingProps) {

  const materialRef = useRef<ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color(color) },
    innerRadius: { value: innerRadius },
    stretch: { value: stretch },
    pinch: { value: pinch },
    angle: { value: angle }
  }), [color, innerRadius, stretch, pinch, angle]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.pinch.value =
        pinch - Math.sin(state.clock.elapsedTime * 5) * 0.05;
    }

    if (groupRef.current) {
      easing.dampE(
        groupRef.current.rotation,
        [
          Math.PI / 2 + 0.7 + state.pointer.y / 8,
          Math.PI + 0.5,
          Math.PI / 2 - 0.12 + state.pointer.x / 8 + state.pointer.y / 8
        ],
        0.5,
        delta
      );
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <planeGeometry args={[24, 24]} />

        <shaderMaterial
          ref={materialRef}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}