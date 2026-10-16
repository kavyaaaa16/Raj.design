import type { Transition, Variants } from 'framer-motion';

/**
 * Motion vocabulary for the site.
 *
 * The Figma file is a static artboard, so these fill in what it could not show:
 * the page-load sequence, the sticky-scroll service switch, the card entrances,
 * and the reactive bits (dock magnification, cursor-following eyes).
 *
 * Every consumer pairs these with `useReducedMotion()` and falls back to a
 * plain opacity fade — or to nothing at all — when motion is not wanted.
 */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;

export const springSoft: Transition = { type: 'spring', stiffness: 220, damping: 28, mass: 0.9 };
export const springSnappy: Transition = { type: 'spring', stiffness: 420, damping: 32, mass: 0.6 };

/** Viewport trigger used by every scroll-revealed element. */
export const inView = { once: true, amount: 0.3 } as const;
export const inViewLoose = { once: true, amount: 0.15 } as const;

/** Parent that staggers its children in. */
export const stagger = (gap = 0.07, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** The default reveal: rise and fade. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

/** Pills and stickers pop rather than rise — they read as physical objects. */
export const popIn = (rotate = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.82, rotate: rotate * 0.35 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate,
    transition: { type: 'spring', stiffness: 340, damping: 22, mass: 0.7 },
  },
});

/** Cards settle into their Figma rotation from a slightly flatter, lower start. */
export const settleIn = (rotate: number): Variants => ({
  hidden: { opacity: 0, y: 64, rotate: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    rotate,
    scale: 1,
    transition: { duration: 0.75, ease: EASE_OUT },
  },
});

/** Headline reveal, one word at a time, masked by an overflow-hidden parent. */
export const wordUp: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.7, ease: EASE_OUT } },
};

/** Motion-safe variant chooser. */
export const safe = <T>(reduced: boolean, motionValue: T, stillValue: T): T =>
  reduced ? stillValue : motionValue;

export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};
