// Lensing.tsx
'use client';

import { forwardRef, useMemo } from 'react';
import { LensingEffect } from './LensingEffect';

interface LensingProps {
  mass?: number;
  innerRadius?: number;
  outerRadius?: number;
  aspect?: number;
}

export const Lensing = forwardRef<LensingEffect, LensingProps>((props, ref) => {
  const effect = useMemo(() => new LensingEffect(props), [props]);
  return <primitive ref={ref} object={effect} dispose={null} />;
});

Lensing.displayName = 'Lensing';