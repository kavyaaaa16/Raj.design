import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Figure } from './ui/Figure';
import { type AssetKey } from '../lib/assets';
import { EASE_OUT } from '../lib/motion';
import styles from './WhatIDo.module.css';

/**
 * "What I do" — node 3:1721.
 *
 * In Figma this is a 2,653px section holding a sticky text block and three
 * images parked at 934 / 1568 / 2282. All three headings sit at 35% opacity,
 * which only makes sense if something is meant to raise one of them at a time.
 *
 * So: scroll position picks the active service, its heading goes to full
 * opacity, and the matching image is the one on screen. The 35% state is the
 * resting state, exactly as drawn.
 */

const SERVICES: { title: string; image: AssetKey }[] = [
  { title: 'Visual Design', image: 'whatIDoArtDirection' },
  { title: 'UI/UX Design', image: 'whatIDoBranding' },
  { title: 'Product Design', image: 'whatIDoUiUx' },
];

const BLURB =
  'Somewhere between sports, bad jokes, good design, and way too many iterations, I’m just trying to make things that feel right.';

export function WhatIDo() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(-1);


  /*
   * The active service is decided by which image is actually on screen, not by
   * slicing the section into equal thirds: Figma parks the three images at 35%,
   * 59% and 86% of the section, so even bands light the wrong heading.
   *
   * The margin collapses the viewport to a 1px line at its centre, so a slot
   * becomes active exactly as it crosses the middle of the screen.
   */
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = slotRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) setActive(index);
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );

    for (const slot of slotRefs.current) {
      if (slot) observer.observe(slot);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="what-i-do" aria-labelledby="what-i-do-title">
      <div className={styles.sticky}>
        <motion.div className={styles.copy}>
          <p className={styles.eyebrow}>(WHAT I DO)</p>

          <h2 className={styles.headings} id="what-i-do-title">
            {SERVICES.map((service, i) => (
              <motion.span
                key={service.title}
                className={styles.heading}
                animate={{
                  opacity: i === active ? 1 : 0.35,
                  scale: reduced ? 1 : i === active ? 1 : 0.97,
                  backgroundPosition: i === active ? '100% 0%' : '0% 0%',
                }}
                transition={{ duration: reduced ? 0 : 1.1, ease: EASE_OUT }}
              >
                {service.title}
              </motion.span>
            ))}
          </h2>

          <p className={styles.blurb}>{BLURB}</p>

          <div className={styles.progress} aria-hidden="true">
            {SERVICES.map((service, i) => (
              <span
                key={service.title}
                className={`${styles.tick} ${i === active ? styles.tickOn : ''}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* The three scrolling images, alternating side to side as in Figma */}
      <div className={styles.rail} aria-hidden="true">
        {SERVICES.map((service, i) => (
          <div
            key={service.title}
            ref={(node) => {
              slotRefs.current[i] = node;
            }}
            className={`${styles.slot} ${i % 2 === 0 ? styles.slotLeft : styles.slotRight}`}
          >
            <motion.figure
              className={styles.frame}
              initial={{ opacity: 0, y: 48, rotate: i % 2 === 0 ? -3 : 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -2 : 2 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <Figure name={service.image} alt="" className={styles.image} />
            </motion.figure>
          </div>
        ))}
      </div>
    </section>
  );
}
