import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Figure } from './ui/Figure';
import { Pill } from './ui/Pill';
import { type AssetKey } from '../lib/assets';
import { popIn, inViewLoose, EASE_OUT } from '../lib/motion';
import styles from './Work.module.css';

/**
 * Selected work — nodes 1:1996 / 1:2042.
 *
 * Each project is a browser window pinned to the page with a paperclip, sitting
 * at its own angle. The rotations below are the literal Figma values (converted
 * from Figma's counter-clockwise convention to CSS's clockwise one).
 *
 * Cards settle into that angle as they arrive, and straighten on hover — the
 * pinned-photo metaphor the layout is already reaching for.
 */

interface Project {
  title: string;
  tags: string[];
  image: AssetKey;
  clip: AssetKey;
  /** CSS degrees — Figma rotation negated */
  rotate: number;
  clipRotate: number;
  href: string;
}

const PROJECTS: Project[] = [
  {
    title: 'TechExpo Gujarat',
    tags: ['Branding & Website', 'Figma', '2026'],
    image: 'workTechExpo',
    clip: 'paperclipBlue',
    rotate: 7.65,
    clipRotate: -20,
    href: '#',
  },
  {
    title: 'Honigdachs',
    tags: ['Website Design', 'Figma', '2026'],
    image: 'workHonigdachs',
    clip: 'paperclipRed',
    rotate: -3.12,
    clipRotate: -20,
    href: '#',
  },
  {
    title: 'Alexandre Christie',
    tags: ['Visual Concept', 'Figma', '2026'],
    image: 'workAlexandreChristie',
    clip: 'paperclipRedAlt',
    rotate: -7,
    clipRotate: -27.14,
    href: '#',
  },
  {
    title: 'HealthFit',
    tags: ['Branding & App', 'Figma', '2026'],
    image: 'workHealthFit',
    clip: 'paperclipBlue',
    rotate: 7.65,
    clipRotate: -20,
    href: '#',
  },
  {
    title: 'Miro',
    tags: ['Brand Identity', 'Photoshop', '2026'],
    image: 'workMiro',
    clip: 'paperclipRed',
    rotate: -7,
    clipRotate: -20,
    href: '#',
  },
];

function projectEntrance(rotate: number, index: number, xOffset: number): Variants {
  return {
    hidden: {
      opacity: 0,
      x: index % 2 === 0 ? -xOffset : xOffset,
      y: 64,
      rotate: 0,
      scale: 0.94,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate,
      scale: 1,
      transition: { duration: 0.75, ease: EASE_OUT },
    },
  };
}

function useSmallScreen() {
  const [smallScreen, setSmallScreen] = useState(() =>
    window.matchMedia('(max-width: 599px)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 599px)');
    const update = () => setSmallScreen(mediaQuery.matches);
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return smallScreen;
}

function ProjectCard({ project, index, smallScreen }: { project: Project; index: number; smallScreen: boolean }) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      className={styles.card}
      variants={reduced ? undefined : projectEntrance(project.rotate, index, smallScreen ? 24 : 80)}
      initial={reduced ? undefined : 'hidden'}
      whileInView={reduced ? undefined : 'visible'}
      viewport={inViewLoose}
      style={reduced ? { rotate: project.rotate } : undefined}
      whileHover={reduced ? undefined : { rotate: 0, scale: 1.03, y: -8 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    >
      <a className={styles.link} href={project.href} aria-label={`${project.title} — ${project.tags.join(', ')}`}>
        <div className={styles.chrome} aria-hidden="true">
          <span className={`${styles.light} ${styles.red}`} />
          <span className={`${styles.light} ${styles.amber}`} />
          <span className={`${styles.light} ${styles.green}`} />
        </div>

        <div className={styles.screen}>
          <Figure name={project.image} alt="" className={styles.shot} />
        </div>

        <footer className={styles.meta}>
          <h3 className={styles.title}>{project.title}</h3>
          <ul className={styles.tags}>
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </footer>
      </a>

      <Figure
        name={project.clip}
        alt=""
        className={styles.clip}
        style={{ rotate: `${project.clipRotate}deg` }}
      />
    </motion.article>
  );
}

export function Work() {
  const reduced = useReducedMotion();
  const smallScreen = useSmallScreen();

  return (
    <section className={styles.section} id="work" aria-labelledby="work-title">
      <header className={styles.header}>
        <motion.div
          variants={popIn(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
        >
          <Pill tone="periwinkle" className={styles.badge}>
            Product stories
          </Pill>
        </motion.div>

        {/*
          Figma parks the record beside the last line ("Work"), which only works
          because that line is short. Type here is fluid, so the break point
          moves — the record rides in the text flow instead of floating over it,
          which keeps it adjacent to the final word at every width.
        */}
        <h2 className={styles.heading} id="work-title">
          A Collection<br />Of My Recent<br />Work
          <motion.span
            className={styles.vinyl}
            animate={reduced ? undefined : { rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          >
            <Figure name="vinylRecord" alt="" />
          </motion.span>
        </h2>
      </header>

      <div className={styles.grid}>
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} smallScreen={smallScreen} />
        ))}
      </div>
    </section>
  );
}
