import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Figure } from './ui/Figure';
import { wordUp, popIn, EASE_OUT } from '../lib/motion';
import styles from './Hero.module.css';

const HEADLINE = 'Someone Had To Fix The Alignment';

/**
 * Hero — node 1:1649.
 *
 * Figma shows one frozen frame. Three things are added here:
 *  1. a load sequence (logo, glass card, then the headline word by word);
 *  2. parallax on the photograph as the page scrolls away;
 *  3. the two service stickers, which exist in the file (nodes 1:1683, 1:1722)
 *     but are set to hidden — they're clearly meant to arrive after the title.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '18%']);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-28%']);
  const contentFade = useTransform(scrollYProgress, [0, 0.75], [1, reduced ? 1 : 0]);

  return (
    <section className={styles.hero} ref={sectionRef} aria-labelledby="hero-title">
      <motion.div className={styles.photo} style={{ y: photoY, scale: photoScale }}>
        <Figure name="heroBackground" priority className={styles.photoImg} />
        <div className={styles.scrim} aria-hidden="true" />
      </motion.div>

      <motion.a
        className={styles.wordmark}
        href="#top"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
      >
        RAJ.DESIGNS®
      </motion.a>

      <motion.div className={styles.content} style={{ y: contentY, opacity: contentFade }}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.25 }}
        >
          <Figure name="heroAvatar" priority className={styles.avatar} />
          <span className={styles.cardText}>
            <strong className={styles.name}>Raj Chhatwani</strong>
            <span className={styles.role}>Visual and Interactive Designer</span>
          </span>
        </motion.div>

        <h1 className={styles.title} id="hero-title">
          <span className="visually-hidden">{HEADLINE}</span>
          <span className={styles.titleLines} aria-hidden="true">
            {HEADLINE.split(' ').map((word, i) => (
              <span className={styles.wordMask} key={`${word}-${i}`}>
                <motion.span
                  className={styles.word}
                  variants={wordUp}
                  initial={reduced ? undefined : 'hidden'}
                  animate={reduced ? undefined : 'visible'}
                  transition={{ delay: 0.42 + i * 0.055, duration: 0.7, ease: EASE_OUT }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>

        {/* Hidden in Figma (nodes 1:1683 / 1:1722) — restored as timed stickers */}
        <motion.span
          className={`${styles.sticker} ${styles.stickerLeft}`}
          variants={popIn(-8)}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.15 }}
        >
          Visual Design
        </motion.span>
        <motion.span
          className={`${styles.sticker} ${styles.stickerRight}`}
          variants={popIn(14)}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.32 }}
        >
          UX Design
        </motion.span>
      </motion.div>

      <motion.div
        className={styles.scrollHint}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        <span className={styles.scrollDot} />
      </motion.div>
    </section>
  );
}
