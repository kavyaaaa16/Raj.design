import { useEffect, useState } from 'react';

export interface PointerPosition {
  x: number;
  y: number;
  /** False until the pointer has actually moved, so we don't jump on mount. */
  active: boolean;
}

/**
 * Viewport-space pointer position, updated on a rAF so a fast mouse can't
 * queue up more React renders than the display can show.
 *
 * Returns `active: false` on touch devices, letting consumers fall back to an
 * idle animation instead of freezing in place.
 */
export function usePointer(): PointerPosition {
  const [pos, setPos] = useState<PointerPosition>({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let frame = 0;
    let latest = { x: 0, y: 0 };

    const flush = () => {
      frame = 0;
      setPos({ x: latest.x, y: latest.y, active: true });
    };

    const onMove = (event: PointerEvent) => {
      latest = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(flush);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return pos;
}
