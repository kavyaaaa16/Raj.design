import { useState, type CSSProperties } from 'react';
import { asset, altText, MANIFEST, type AssetKey } from '../../lib/assets';

interface FigureProps {
  /** Key into the asset manifest */
  name: AssetKey;
  /** Overrides the manifest description. Pass "" for decorative images. */
  alt?: string;
  className?: string;
  style?: CSSProperties;
  /** Above-the-fold images load eagerly; everything else is lazy. */
  priority?: boolean;
  draggable?: boolean;
}

/**
 * Every image in the site goes through here.
 *
 * Assets live outside the repo (they're fetched from Figma by `npm run assets`),
 * so a missing file is a normal state during setup rather than a bug. When one
 * fails to load we render a labelled placeholder carrying the Figma node id,
 * which keeps layout intact and tells you exactly what to re-export.
 */
export function Figure({
  name,
  alt,
  className,
  style,
  priority = false,
  draggable = false,
}: FigureProps) {
  const [failed, setFailed] = useState(false);
  const entry = MANIFEST[name];
  const description = alt ?? altText(name);

  if (failed) {
    return (
      <div className={`asset-fallback ${className ?? ''}`} style={style} role="img" aria-label={description || entry.file}>
        <span>
          {entry.file}
          <br />
          node {entry.nodeId}
        </span>
      </div>
    );
  }

  return (
    <img
      src={asset(name)}
      alt={description}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      draggable={draggable}
      onError={() => setFailed(true)}
    />
  );
}
