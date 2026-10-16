import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { Figure } from './ui/Figure';
import { Pill } from './ui/Pill';
import { Eyes } from './ui/Eyes';
import { popIn, stagger, inViewLoose, EASE_OUT } from '../lib/motion';
import styles from './Footer.module.css';

/**
 * Contact — nodes 36:128 onward.
 *
 * The black panel is the page's loudest element, so it gets the one piece of
 * pointer-reactive motion: a magnetic pull toward the cursor, plus the eyes
 * (see ui/Eyes) that the Figma file draws frozen mid-glance.
 */

const LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/', tone: 'lilac' as const },
  { label: 'Behance', href: 'https://behance.net/', tone: 'sky' as const },
  { label: 'Email', href: 'mailto:hello@raj.designs', tone: 'periwinkle' as const },
];

function MagneticPanel({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 200, damping: 20, mass: 0.6 });

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    // Pull up to 14px toward the pointer, scaled by distance from centre.
    x.set(((event.clientX - (box.left + box.width / 2)) / box.width) * 28);
    y.set(((event.clientY - (box.top + box.height / 2)) / box.height) * 20);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`${styles.panel} on-dark`}
      style={reduced ? undefined : { x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewLoose}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

export function Footer() {
  const reduced = useReducedMotion();

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.inner}>
        <MagneticPanel>
          <h2 className={styles.heading}>Let&rsquo;s work together</h2>
          <Eyes />
          <Figure name="footerRecordButton" alt="" className={styles.record} />
        </MagneticPanel>

        <div className={styles.note}>
          <Figure name="footerNote" alt="" className={styles.noteBg} />
          <div className={styles.noteBody}>
            <motion.p
              className={styles.sayHi}
              variants={stagger(0.14)}
              initial={reduced ? undefined : 'hidden'}
              whileInView={reduced ? undefined : 'visible'}
              viewport={{ once: true, amount: 0.5 }}
              aria-label="SAY HI!"
            >
              {'SAY HI!'.split('').map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.p>
            <motion.ul
              className={styles.links}
              variants={stagger(0.09, 0.12)}
              initial={reduced ? undefined : 'hidden'}
              whileInView={reduced ? undefined : 'visible'}
              viewport={{ once: true, amount: 0.5 }}
            >
              {LINKS.map((link) => (
                <motion.li key={link.label} variants={reduced ? undefined : popIn(0)}>
                  <a href={link.href} className={styles.link}>
                    <Pill tone={link.tone} size="sm">
                      {link.label}
                    </Pill>
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>

        <p className={styles.colophon}>
          <span>RAJ.DESIGNS®</span>
          <span>Visual and Interactive Designer</span>
        </p>
      </div>
    </footer>
  );
}
