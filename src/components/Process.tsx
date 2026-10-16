import { useRef, type ReactNode, type RefObject } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { Figure } from './ui/Figure';
import { Pill } from './ui/Pill';
import { popIn } from '../lib/motion';
import styles from './Process.module.css';

/**
 * How I work — node 8:3949.
 *
 * The four steps are one pinned scene rather than four stacked blocks. Each
 * step rises and piles onto the one before it, then the delivery box climbs in
 * from below, swallows the pile, and carries it off screen as the scene
 * unpins.
 *
 * Figma records no scroll behaviour at all (every node is SCROLLS), so the
 * pile is design intent the static file could not express: three notes drawn
 * at three different angles and a box whose whole job is to receive them.
 *
 * Under reduced motion the scene is replaced by a plain stacked list — no
 * pinning, no scroll hijack, same content and order.
 */

/*
 * Beat sheet. Step one is already in place as the scene pins so the
 * stage is never empty on entry — an empty pinned screen reads as a broken
 * page, not as anticipation.
 */
const ENTER: ReadonlyArray<readonly [number, number]> = [
  [0, 0.001],
  [0.16, 0.28],
  [0.32, 0.44],
];
const BOX_IN = [0.46, 0.66] as const;
const COLLECT = [0.6, 0.68] as const;

interface StepCardProps {
  progress: MotionValue<number>;
  index: number;
  /** Resting angle, taken from Figma (CSS degrees) */
  rotate: number;
  children: ReactNode;
}

function StackedStep({ progress, index, rotate, children }: StepCardProps) {
  const [start, settled] = ENTER[index];
  // Each card rests slightly higher than the last so the pile shows its edges
  const rest = `${-index * 3.5}%`;

  const immediate = index === 0;
  const y = useTransform(progress, [start, settled, COLLECT[0], COLLECT[1]], immediate ? [rest, rest, rest, '15%'] : ['70%', rest, rest, '15%']);
  const scale = useTransform(progress, [start, settled, COLLECT[0], COLLECT[1]], immediate ? [1, 1, 1, 0.24] : [0.88, 1, 1, 0.24]);
  const opacity = useTransform(progress, [start, start + 0.04, COLLECT[1] - 0.08, COLLECT[1]], immediate ? [1, 1, 1, 1] : [0, 1, 1, 1]);
  const rot = useTransform(progress, [start, settled], immediate ? [rotate, rotate] : [0, rotate]);

  return (
    <motion.div
      className={styles.stackItem}
      style={{ y, scale, opacity, rotate: rot, zIndex: 10 + index }}
    >
      {children}
    </motion.div>
  );
}

interface ProcessSceneProps {
  sceneRef: RefObject<HTMLDivElement>;
  progress: MotionValue<number>;
}

function ProcessScene({ sceneRef, progress }: ProcessSceneProps) {
  // Rises until its open mouth sits over the pile, then holds
  // 270% of its own height clears the bottom of the stage entirely; at 120% a
  // slice of the box sat visible at the foot of the screen from the first frame.
  const boxY = useTransform(progress, [BOX_IN[0], BOX_IN[1]], ['270%', '22%'], {
    clamp: true,
  });
  const boxOpacity = useTransform(progress, [BOX_IN[0], BOX_IN[0] + 0.02], [0, 1], { clamp: true });
  const copyOpacity = useTransform(progress, [0.8, 0.9], [0, 1], { clamp: true });
  const sceneOpacity = useTransform(progress, [0, 0.001], [0, 1], { clamp: true });

  return (
    <div className={styles.scene} ref={sceneRef}>
      <motion.div className={styles.stage} style={{ opacity: sceneOpacity }}>
        <StackedStep progress={progress} index={0} rotate={-2}>
          <StepOne />
        </StackedStep>
        <StackedStep progress={progress} index={1} rotate={-6}>
          <StepTwo />
        </StackedStep>
        <StackedStep progress={progress} index={2} rotate={6}>
          <StepThree />
        </StackedStep>

        {/* Sits above the pile so the notes disappear behind its front wall */}
        <motion.div className={styles.boxLayer} style={{ y: boxY, opacity: boxOpacity }}>
          <div className={styles.boxInner}>
            <Figure name="processDeliveryBox" alt="" className={styles.box} />
            <motion.div className={styles.deliveryCopy} style={{ opacity: copyOpacity }}>
              <p className={styles.deliveryTitle}>04- Delivery</p>
              <p className={styles.deliveryLead}>Out of Figma, finally</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      <p className="visually-hidden">
        Step four, delivery: out of Figma, finally — the previous three steps are collected and
        handed over.
      </p>
    </div>
  );
}

/* ── Step content ─────────────────────────────────────────────────────── */

function StepOne() {
  return (
    <div className={styles.note}>
      <Figure name="paperNote" alt="" className={styles.noteBg} />
      <div className={styles.noteBody}>
        <p className={styles.stepLabel}>01 - Tell me what we’re building.</p>
        <p className={styles.noteText}>
          Give me the product, the problem, the audience, the goals, and whatever you already have.
          Half-baked ideas are welcome. We’ll figure out the rest.
        </p>
        <Pill tone="sky" size="sm">
          brief attached
        </Pill>
      </div>
    </div>
  );
}

function StepTwo() {
  return (
    <div className={`${styles.card} ${styles.cardCream}`}>
      <p className={styles.cardTitle}>
        02 -<br />
        I’ll make sense of it.
      </p>
      <p className={styles.cardText}>
        I dig into the problem, explore directions, question the obvious, and turn it into a clear
        design direction.
      </p>
      <div className={styles.polaroid}>
        <Figure name="processPolaroid" alt="Raj working on a tablet" className={styles.polaroidImg} />
        <Figure name="processPolaroidClip" alt="" className={styles.polaroidClip} />
      </div>
    </div>
  );
}

function StepThree() {
  return (
    <div className={`${styles.card} ${styles.cardSky}`}>
      <p className={styles.cardTitle}>03 — I make it look right</p>
      <p className={styles.cardLead}>
        <Figure name="processArrow" alt="" className={styles.arrow} />
        <span>Lights, camera, coffee.</span>
      </p>
      <p className={styles.cardText}>
        Pixels, prototypes, and probably too many iterations. I turn ideas into thoughtful product
        experiences and visuals that feel clear, intentional, and worth looking at.
      </p>
      <Figure name="processFilmStrip" alt="" className={styles.film} />
    </div>
  );
}

/** Reduced-motion fallback: the same four steps, plainly stacked. */
function ProcessList() {
  return (
    <ol className={styles.plainList}>
      <li style={{ rotate: '-2deg' }}>
        <StepOne />
      </li>
      <li style={{ rotate: '-6deg' }}>
        <StepTwo />
      </li>
      <li style={{ rotate: '6deg' }}>
        <StepThree />
      </li>
      <li>
        <div className={styles.boxInner}>
          <Figure name="processDeliveryBox" alt="" className={styles.box} />
          <div className={styles.deliveryCopy}>
            <p className={styles.deliveryTitle}>04- Delivery</p>
            <p className={styles.deliveryLead}>Out of Figma, finally</p>
          </div>
        </div>
      </li>
    </ol>
  );
}

export function Process() {
  const reduced = Boolean(useReducedMotion());
  const sceneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start start', 'end end'],
  });
  const headerY = useTransform(scrollYProgress, [0.997, 1], ['0%', '-120%'], { clamp: true });

  return (
    <section className={styles.section} id="process" aria-labelledby="process-title">
      <motion.header
        className={`${styles.header} ${reduced ? styles.headerStatic : ''}`}
        style={reduced ? undefined : { y: headerY }}
      >
        <motion.div
          className={styles.badgeTop}
          variants={popIn(-2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.7 }}
        >
          <Pill tone="sky">You bring the brief</Pill>
        </motion.div>

        <h2 className={styles.heading} id="process-title">
          I’ll take care of the overthinking.
        </h2>

        <motion.div
          className={styles.badgeBottom}
          variants={popIn(2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.7 }}
        >
          <Pill tone="olive">Then the fun part begins.</Pill>
        </motion.div>

        <Figure name="processEye" alt="" className={styles.eye} />
        <Figure name="processCamera" alt="" className={styles.camera} />
      </motion.header>

      {reduced ? <ProcessList /> : <ProcessScene sceneRef={sceneRef} progress={scrollYProgress} />}
    </section>
  );
}
