import type { CSSProperties, ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { riseIn } from '../lib/motion';

type TextTag = 'p' | 'h2' | 'span' | 'b' | 'strong';

export function TypewriterText({
  children,
  as = 'span',
  className,
  speed = 0.012,
}: {
  children: string;
  as?: TextTag;
  className?: string;
  speed?: number;
}) {
  const reduced = useReducedMotion();
  const variants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: speed } },
  };
  const props = {
    className,
    variants: reduced ? undefined : variants,
    initial: reduced ? undefined : 'hidden',
    whileInView: reduced ? undefined : 'visible',
    viewport: { once: true, amount: 0.35 },
    'aria-label': children,
    children: [...children].map((letter, index) => (
      <motion.span
        key={`${letter}-${index}`}
        style={{ display: 'inline', font: 'inherit', letterSpacing: 'inherit', lineHeight: 'inherit' }}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        aria-hidden="true"
      >
        {letter}
      </motion.span>
    )),
  };

  switch (as) {
    case 'p': return <motion.p {...props} />;
    case 'h2': return <motion.h2 {...props} />;
    case 'b': return <motion.b {...props} />;
    case 'strong': return <motion.strong {...props} />;
    default: return <motion.span {...props} />;
  }
}

export function RiseText({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const reduced = useReducedMotion();
  return <motion.p
    className={className}
    style={style}
    variants={reduced ? undefined : riseIn}
    initial={reduced ? undefined : 'hidden'}
    whileInView={reduced ? undefined : 'visible'}
    viewport={{ once: true, amount: 0.25 }}
  >{children}</motion.p>;
}
