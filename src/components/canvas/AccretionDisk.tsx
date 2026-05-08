"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points as ThreePoints, ShaderMaterial, Color } from "three";

interface AccretionDiskProps {
  count: number;
  innerRadius: number;
  outerRadius: number;
  color: string;
  size: number;
  speed: number;
}

const vertexShader = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uSize;

  void main() {
    vec3 pos = position;
    
    float radius = length(pos.xz);
    
    float angularVelocity = uSpeed / pow(radius, 1.5);
    float angle = uTime * angularVelocity;
    
    float c = cos(angle);
    float s = sin(angle);
    mat2 rotationMatrix = mat2(c, -s, s, c);
    
    pos.xz = rotationMatrix * pos.xz;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    gl_PointSize = uSize * (10.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    float alpha = smoothstep(0.5, 0.1, dist);
    gl_FragColor = vec4(uColor, alpha);
  }
`;

/**
 * GPU-accelerated Accretion Disk utilizing differential rotation.
 * Offloads positional math to vertex shaders to maintain 60fps at high particle counts.
 * * @param {AccretionDiskProps} props - Configuration for particle distribution and material
 * @returns {JSX.Element}
 */
export function AccretionDisk({ count, innerRadius, outerRadius, color, size, speed }: AccretionDiskProps) {
  const pointsRef = useRef<ThreePoints>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSpeed: { value: speed },
    uSize: { value: size * 100 }, 
    uColor: { value: new Color(color) }
  }), [color, speed, size]);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const distanceRatio = Math.pow(Math.random(), 3);
      const r = innerRadius + distanceRatio * (outerRadius - innerRadius);
      const theta = Math.random() * 2 * Math.PI;

      const y = (Math.random() - 0.5) * (0.1 / (r - innerRadius + 0.2));

      pos[i * 3] = r * Math.cos(theta);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = r * Math.sin(theta);
    }
    return pos;
  }, [count, innerRadius, outerRadius]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </points>
  );
}