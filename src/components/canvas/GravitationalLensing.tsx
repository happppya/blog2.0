"use client";

import { forwardRef, useMemo } from "react";
import { Vector2 } from "three";
import { GravitationalLensingEffect } from "@/effects/GravitationalLensingEffect";

export interface LensingProps {
  mass?: number;
  center?: Vector2;
  aspect?: number;
  innerRadius?: number;
  outerRadius?: number;
}

/**
 * R3F component wrapper for GravitationalLensingEffect.
 * @param {LensingProps} props 
 * @returns {JSX.Element}
 */
export const Lensing = forwardRef<GravitationalLensingEffect, LensingProps>(
  (
    { 
      mass = 0.15, 
      center = new Vector2(0.5, 0.5), 
      aspect = 1.0, 
      innerRadius = 0.1, 
      outerRadius = 0.4 
    }, 
    ref
  ) => {
    const effect = useMemo(
      () => new GravitationalLensingEffect({ mass, center, aspect, innerRadius, outerRadius }),
      [mass, center, aspect, innerRadius, outerRadius]
    );
    
    return <primitive ref={ref} object={effect} dispose={null} />;
  }
);

Lensing.displayName = "Lensing";