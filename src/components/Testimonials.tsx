import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Figure } from './ui/Figure';
import { Pill, type PillTone } from './ui/Pill';
import { type AssetKey } from '../lib/assets';
import { popIn, inViewLoose, stagger, EASE_OUT } from '../lib/motion';
import styles from './Testimonials.module.css';

/**
 * Testimonials — node 15:7047.
 *
 * Each card carries a quote plus a taped paper note listing the outcomes as
 * coloured pills. The pills stagger in once the note is on screen, which is the
 * one moment in the section worth animating: it's the part a reader scans.
 */

interface Testimonial {
  client: string;
  quote: string;
  aside?: string;
  results: { label: string; tone: PillTone }[];
  photo: AssetKey;
}

const TESTIMONIALS: Testimonial[] = [
  {
    client: 'TechExpo',
    quote:
      '“Working with Raj made our branding process much clearer. He helped us shape the visual identity, bring the logo to life, and create a consistent look across our website and brand assets.”',
    results: [
      { label: 'Cohesive visual identity', tone: 'lilac' },
      { label: 'Brand Consistency', tone: 'periwinkle' },
      { label: 'Better User Experience', tone: 'sky' },
    ],
    photo: 'testimonialPhotoTechExpo',
  },
  {
    client: 'Honigdachs',
    quote:
      '“The redesign gave us a much clearer visual direction. The new structure made the brand easier to understand and helped visitors move through the website more naturally.”',
    results: [
      { label: 'Clearer navigation', tone: 'lilac' },
      { label: '68% watch-through', tone: 'periwinkle' },
      { label: '1.1m views', tone: 'sky' },
    ],
    photo: 'testimonialPhotoHonigdachs',
  },
  {
    client: 'Karishma Khemani',
    quote:
      '“The content captured exactly the feeling we wanted for the brand. Everything looked effortless, lived-in, and genuinely inviting.”',
    aside: '6 Reels · 20 photos',
    results: [
      { label: '32% ↑ CTR', tone: 'lilac' },
      { label: '68% watch-through', tone: 'periwinkle' },
      { label: '1.1m views', tone: 'sky' },
    ],
    photo: 'testimonialPhotoKarishma',
  },
];

function Card({ item }: { item: Testimonial }) {
  const reduced = useReducedMotion();

  return (
    <motion.figure
      className={styles.card}
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewLoose}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      <figcaption className={styles.client}>{item.client}</figcaption>
      <blockquote className={styles.quote}>{item.quote}</blockquote>
      {item.aside && <p className={styles.aside}>{item.aside}</p>}

      <div className={styles.note}>
        <Figure name="paperNote" alt="" className={styles.noteBg} />
        <div className={styles.noteBody}>
          <p className={styles.resultsLabel}>Results:</p>
          <motion.ul
            className={styles.results}
            variants={stagger(0.1, 0.15)}
            initial={reduced ? undefined : 'hidden'}
            whileInView={reduced ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.5 }}
          >
            {item.results.map((result) => (
              <motion.li key={result.label} variants={reduced ? undefined : popIn(0)}>
                <Pill tone={result.tone} size="sm">
                  {result.label}
                </Pill>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>

      <div className={styles.photo}>
        <Figure name={item.photo} className={styles.photoImg} />
        <Figure name="testimonialClip" alt="" className={styles.photoClip} />
      </div>
    </motion.figure>
  );
}

export function Testimonials() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start end', 'start center'],
  });
  const headingFilter = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(1.5px)']);
  return (
    <section className={styles.section} id="testimonials" aria-labelledby="testimonials-title">
      <motion.header className={styles.header} style={{ filter: headingFilter }}>
        <motion.div
          className={styles.badgeTop}
          variants={popIn(-2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.7 }}
        >
          <Pill tone="sky">Aesthetics are nice</Pill>
        </motion.div>

        <h2 className={styles.heading} id="testimonials-title">
          Okay, but will it work?
        </h2>

        <motion.div
          className={styles.badgeBottom}
          variants={popIn(2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.7 }}
        >
          <Pill tone="olive">Functionality is better.</Pill>
        </motion.div>

        <Figure name="testimonialsHeart" alt="" className={styles.heart} />
        <Figure name="testimonialsCamera" alt="" className={styles.camera} />
      </motion.header>

      <div className={styles.grid} ref={gridRef}>
        {TESTIMONIALS.map((item) => (
          <Card key={item.client} item={item} />
        ))}
      </div>
    </section>
  );
}
