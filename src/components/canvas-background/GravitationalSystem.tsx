'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { easing } from 'maath';
import * as THREE from 'three';
import { VortexMaterial } from './VortexMaterial';

extend({ VortexMaterial });

interface SystemProps {
  effectRef: React.RefObject<any>;
}

export function GravitationalSystem({ effectRef }: SystemProps) {
  const materialRef = useRef<any>(null);
  const { viewport, size } = useThree();
  
  // Memoize resolution to prevent unnecessary uniform re-allocations
  const resolution = useMemo(() => new THREE.Vector2(size.width, size.height), [size]);

  useFrame((state, delta) => {
    if (!materialRef.current) return;

    // Time increment
    materialRef.current.uTime += delta;
    
    // Smooth damp the pointer for fluid inertia
    easing.damp2(
      materialRef.current.uPointer,
      [state.pointer.x, state.pointer.y],
      0.2,
      delta
    );

    // Sync uniform resolution
    materialRef.current.uResolution.copy(resolution);

    // Kinetic sync (mocked logic here, you would sync this with Lenis store/context)
    // materialRef.current.uScrollVelocity = useLenisStore.getState().velocity;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      {/* @ts-ignore - Fiber extension typings */}
      <vortexMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}