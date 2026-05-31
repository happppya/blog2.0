'use client';

import { useRef, RefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { GravitationalSystem } from './GravitationalSystem';
import { Lensing } from './Lensing';

interface SceneProps {
  eventSource?: RefObject<HTMLElement>;
}

export default function Scene({ eventSource }: SceneProps) {
  // Reference to pipe uniforms directly into the lensing effect without React state overhead
  const lensingRef = useRef<any>(null);

  return (
    <Canvas
      eventSource={eventSource}
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ 
        antialias: false, 
        powerPreference: "high-performance", 
        preserveDrawingBuffer: true, 
        alpha: true,
        stencil: false,
        depth: false
      }}
    >
      <GravitationalSystem effectRef={lensingRef} />

      <EffectComposer multisampling={0}>
        {/* Custom Gravitational Lensing Shader */}
        <Lensing ref={lensingRef} mass={0.8} innerRadius={0.08} outerRadius={0.105} aspect={1.0} />

        <Bloom
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          mipmapBlur
          intensity={3.5}
        />

        <Vignette
          eskil={false}
          offset={0.35}
          darkness={0.95}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </Canvas>
  );
}