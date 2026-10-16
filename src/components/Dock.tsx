import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { Figure } from './ui/Figure';
import { type AssetKey } from '../lib/assets';
import { scrollToSection } from '../lib/scroll';
import styles from './Dock.module.css';

/**
 * The floating dock, node 1:3045.
 *
 * It is pinned to the viewport at all times. Figma draws it once at the bottom
 * of the hero because a static artboard has nowhere else to put it, but the
 * file records a dock icon wired to SCROLL_ANIMATE at node 1:3053 — it is
 * navigation, so it has to stay reachable from every section.
 *
 * It previously retreated while scrolling down, which meant it vanished for
 * most of a 12,000px page. That's gone: the only motion left is macOS-style
 * cursor-proximity magnification.
 */

const ITEMS: { key: AssetKey; label: string; target: string }[] = [
  { key: 'dockNotes', label: 'What I do', target: 'what-i-do' },
  { key: 'dockPhotos', label: 'Selected work', target: 'work' },
  { key: 'dockFinder', label: 'How I work', target: 'process' },
  { key: 'dockMail', label: 'Get in touch', target: 'contact' },
];

const BASE = 56;
const MAX = 84;
const RANGE = 140;
const POINTER_AWAY = -10000;

function DockIcon({
  item,
  pointerX,
  disabled,
}: {
  item: (typeof ITEMS)[number];
  pointerX: MotionValue<number>;
  disabled: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const distance = useTransform(pointerX, (x) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return RANGE;
    return x - (box.left + box.width / 2);
  });

  const target = useTransform(distance, [-RANGE, 0, RANGE], [BASE, MAX, BASE], { clamp: true });
  const size = useSpring(target, { stiffness: 320, damping: 24, mass: 0.5 });

  return (
    <a
      className={styles.item}
      href={`#${item.target}`}
      ref={ref}
      aria-label={item.label}
      onClick={(event) => {
        // Route through Lenis, which otherwise fights the browser's own jump
        event.preventDefault();
        scrollToSection(item.target);
      }}
    >
      <motion.span
        className={styles.iconWrap}
        style={disabled ? { width: BASE, height: BASE } : { width: size, height: size }}
      >
        <Figure name={item.key} alt="" className={styles.icon} priority />
      </motion.span>
      <span className={styles.tip} aria-hidden="true">
        {item.label}
      </span>
    </a>
  );
}

export function Dock() {
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(POINTER_AWAY);

  return (
    <nav
      className={styles.dock}
      aria-label="Section shortcuts"
      onPointerMove={(event) => pointerX.set(event.clientX)}
      onPointerLeave={() => pointerX.set(POINTER_AWAY)}
    >
      <div className={styles.tray}>
        {ITEMS.map((item) => (
          <DockIcon key={item.key} item={item} pointerX={pointerX} disabled={Boolean(reduced)} />
        ))}
      </div>
    </nav>
  );
}
