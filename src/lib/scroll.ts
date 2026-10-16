import type Lenis from 'lenis';

/**
 * Module-level handle on the Lenis instance.
 *
 * Lenis drives scrolling itself, so `scrollIntoView()` and native anchor jumps
 * fight it — the page lurches, or lands in the wrong place. Anything that wants
 * to move the page goes through here instead, and falls back to native
 * scrolling when Lenis is off (reduced motion, touch devices).
 */
let instance: Lenis | null = null;

export const setLenis = (next: Lenis | null): void => {
  instance = next;
};

/**
 * Scroll to a section by id. Mirrors the one interaction recorded in the Figma
 * prototype: a dock icon click that scroll-animates to the work section
 * (node 1:3053 → 1:1998, SCROLL_ANIMATE, 600ms).
 */
export function scrollToSection(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;

  if (instance) {
    instance.scrollTo(target, { duration: 1.1, offset: 0 });
    return;
  }

  target.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  });
}
