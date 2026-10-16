import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { usePointer } from '../../lib/usePointer';
import styles from './Eyes.module.css';

/**
 * The two discs on the footer panel (nodes 36:139 / 36:142) are eyes: each is a
 * 53px white circle holding a 31px black pupil that Figma has frozen part-way
 * out of frame. Static, they just look like an offset bug.
 *
 * Here the pupils track the pointer, clamped to a radius so they stay inside
 * the sclera. Without a pointer — touch, or reduced motion — they run a slow
 * idle blink-and-glance instead of locking in one direction.
 */

const PUPIL_TRAVEL = 9; // px, keeps the 31px pupil inside the 53px disc

function Eye({ idle }: { idle: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const pointer = usePointer();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 22, mass: 0.5 });

  useEffect(() => {
    if (idle || !pointer.active || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    const dx = pointer.x - cx;
    const dy = pointer.y - cy;
    const distance = Math.hypot(dx, dy) || 1;
    // Normalise, then ease so the pupil reaches its limit smoothly rather than
    // pinning the moment the cursor leaves the disc.
    const reach = Math.min(1, distance / 260);
    x.set((dx / distance) * PUPIL_TRAVEL * reach);
    y.set((dy / distance) * PUPIL_TRAVEL * reach);
  }, [pointer, idle, x, y]);

  return (
    <div className={styles.eye} ref={ref}>
      <motion.span
        className={styles.pupil}
        style={idle ? undefined : { x: sx, y: sy }}
        animate={
          idle
            ? { x: [0, 6, -6, 0], y: [0, -3, 2, 0] }
            : undefined
        }
        transition={
          idle
            ? { duration: 7, repeat: Infinity, ease: 'easeInOut' }
            : undefined
        }
      />
    </div>
  );
}

export function Eyes() {
  const reduced = useReducedMotion();
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    setCoarse(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const idle = Boolean(reduced) || coarse;

  return (
    <div className={styles.eyes} aria-hidden="true">
      <Eye idle={idle} />
      <Eye idle={idle} />
    </div>
  );
}
