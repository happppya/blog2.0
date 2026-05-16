import { useEffect, useRef, useState, MouseEvent } from "react";

/**
 * High-performance physics engine for tactile interactions.
 * Combines standard drag-to-scroll with an interpolated requestAnimationFrame loop 
 * to convert discrete, choppy mouse-wheel ticks into fluid horizontal momentum.
 */
export function useInteractiveScroll<T extends HTMLElement>() {
  const scrollRef = useRef<T>(null);
  
  // Drag State
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  
  // Physics State
  const targetScroll = useRef(0);
  const isLerping = useRef(false);

  // --- DRAG MECHANICS ---
  const onMouseDown = (e: MouseEvent<T>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    
    // Kill any existing wheel momentum when the user clicks to grab
    targetScroll.current = scrollRef.current.scrollLeft;
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e: MouseEvent<T>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // 2x drag velocity multiplier
    const newScroll = scrollLeft.current - walk;
    
    scrollRef.current.scrollLeft = newScroll;
    targetScroll.current = newScroll; // Synchronize physics target with drag position
  };

  // --- WHEEL PHYSICS ENGINE ---
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let rafId: number;

    const lerpScroll = () => {
      if (!el) return;
      
      const current = el.scrollLeft;
      const dist = targetScroll.current - current;
      
      // If we are close enough to the target, snap to it and kill the animation loop
      if (Math.abs(dist) < 0.5) {
        el.scrollLeft = targetScroll.current;
        isLerping.current = false;
        return;
      }

      // Interpolation factor: 0.1 means move 10% of the remaining distance per frame.
      // Lower = slower/smoother. Higher = snappier.
      el.scrollLeft = current + dist * 0.12; 
      
      rafId = requestAnimationFrame(lerpScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      // Ignore native horizontal scrolls (e.g., trackpads) so we don't double-apply physics
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      
      e.preventDefault();

      // If we aren't currently animating, set the target to exactly where we are now
      if (!isLerping.current) {
        targetScroll.current = el.scrollLeft;
      }

      // Add wheel delta to target. We apply a 1.2x multiplier to make it feel less heavy.
      const maxScroll = el.scrollWidth - el.clientWidth;
      const rawTarget = targetScroll.current + e.deltaY * 1.2;
      
      // Clamp the target so we don't try to animate past the physical boundaries
      targetScroll.current = Math.max(0, Math.min(rawTarget, maxScroll));

      // Boot up the animation loop if it's idle
      if (!isLerping.current) {
        isLerping.current = true;
        rafId = requestAnimationFrame(lerpScroll);
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    
    return () => {
      el.removeEventListener("wheel", handleWheel);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return { 
    scrollRef, 
    events: { onMouseDown, onMouseLeave, onMouseUp, onMouseMove }, 
    isDragging 
  };
}