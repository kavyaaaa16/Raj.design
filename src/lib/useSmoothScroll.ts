import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from 'framer-motion';
import { setLenis } from './scroll';

/**
 * Inertial scrolling. This is what makes a long scroll-driven page feel
 * deliberate rather than jumpy, and it keeps the sticky "what I do" section
 * from snapping between services.
 *
 * Disabled entirely under prefers-reduced-motion and on coarse pointers, where
 * the platform's own momentum scrolling is better than anything we'd add.
 */
export function useSmoothScroll(): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
    });

    setLenis(lenis);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      setLenis(null);
      lenis.destroy();
    };
  }, [reduced]);
}
