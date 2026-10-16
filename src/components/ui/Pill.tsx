import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import styles from './Pill.module.css';

export type PillTone = 'sky' | 'periwinkle' | 'lilac' | 'olive' | 'paper';

interface PillProps extends Omit<HTMLMotionProps<'span'>, 'children'> {
  tone?: PillTone;
  size?: 'md' | 'sm';
  children: ReactNode;
}

/**
 * The recurring badge from the Figma file: a rounded capsule with a 4px white
 * border sitting on top of the fill (nodes 8:4033, 8:3961, 15:7084, 36:171 …).
 *
 * The white border is drawn as an inset ring rather than a real border so the
 * capsule's outer size stays exactly what Figma specifies.
 */
export const Pill = forwardRef<HTMLSpanElement, PillProps>(function Pill(
  { tone = 'sky', size = 'md', children, className, ...rest },
  ref,
) {
  return (
    <motion.span
      ref={ref}
      className={[styles.pill, styles[tone], styles[size], className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </motion.span>
  );
});
