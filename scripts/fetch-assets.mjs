#!/usr/bin/env node
/**
 * Downloads every image referenced by src/lib/assets.ts into public/assets/.
 *
 *   npm run assets            # preferred: mints fresh URLs from the Figma API
 *   npm run assets -- --force # re-download files that are already present
 *
 * ── Why a token ────────────────────────────────────────────────────────────
 * Figma's export URLs expire about 7 days after they are generated, so any URL
 * baked into this repo is guaranteed to rot. With a personal access token the
 * script asks Figma for fresh URLs on every run against the durable node ids in
 * the manifest, which makes this repeatable forever.
 *
 *   1. Figma → your avatar → Settings → Security → Personal access tokens
 *   2. Generate a token with "File content: read-only"
 *   3. Save it next to this project so you never have to paste it again:
 *        echo 'FIGMA_TOKEN=figd_your_token_here' >> .env.local
 *      (.env.local is gitignored — the token never leaves your machine.)
 *
 * Without a token the script falls back to whatever `figmaUrl` values are in the
 * manifest, which may well have expired.
 */

import { mkdir, writeFile, access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'assets');
const force = process.argv.includes('--force');
const CONCURRENCY = 6;
const FILE_KEY = 'LwvhD3NnxnLwmNF2r6GDiU';
const API = 'https://api.figma.com/v1';

const deepLink = (nodeId) =>
  `https://www.figma.com/design/${FILE_KEY}/?node-id=${nodeId.replace(':', '-')}`;

/** Read FIGMA_TOKEN from the environment or from .env.local. */
async function readToken() {
  if (process.env.FIGMA_TOKEN) return process.env.FIGMA_TOKEN.trim();
  try {
    const env = await readFile(join(root, '.env.local'), 'utf8');
    const match = env.match(/^\s*FIGMA_TOKEN\s*=\s*(.+)\s*$/m);
    if (match) return match[1].trim().replace(/^['"]|['"]$/g, '');
  } catch {
    /* no .env.local — fall through */
  }
  return null;
}

/** Parse the manifest out of the TS source without needing a TS runtime. */
async function loadManifest() {
  const src = await readFile(join(root, 'src', 'lib', 'assets.ts'), 'utf8');
  const body = src.slice(src.indexOf('export const MANIFEST'));
  const entries = [];
  const re =
    /(\w+):\s*\{\s*file:\s*'([^']+)',\s*nodeId:\s*'([^']+)',\s*figmaUrl:\s*(?:'([^']+)'|null)/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    entries.push({ key: m[1], file: m[2], nodeId: m[3], url: m[4] ?? null });
  }
  return entries;
}

const exists = (p) =>
  access(p, constants.F_OK).then(
    () => true,
    () => false,
  );

/**
 * Ask Figma for fresh render URLs. One request per format; `ids` is batched, so
 * this is two requests for the whole site rather than one per asset.
 */
async function mintUrls(token, entries) {
  const byFormat = { svg: [], png: [] };
  for (const e of entries) {
    byFormat[e.file.endsWith('.svg') ? 'svg' : 'png'].push(e);
  }

  const minted = new Map();
  for (const [format, group] of Object.entries(byFormat)) {
    if (group.length === 0) continue;
    const ids = group.map((e) => e.nodeId).join(',');
    const scale = format === 'png' ? '&scale=2' : '';
    const res = await fetch(`${API}/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=${format}${scale}`, {
      headers: { 'X-Figma-Token': token },
    });

    if (!res.ok) {
      const hint =
        res.status === 403
          ? 'token rejected — check it is valid and has file read access'
          : `HTTP ${res.status}`;
      throw new Error(`Figma API: ${hint}`);
    }

    const body = await res.json();
    if (body.err) throw new Error(`Figma API: ${body.err}`);
    for (const e of group) {
      const url = body.images?.[e.nodeId];
      if (url) minted.set(e.key, url);
    }
  }
  return minted;
}

async function download(entry) {
  const dest = join(outDir, entry.file);

  if (!force && (await exists(dest))) return { ...entry, status: 'skipped' };
  if (!entry.url) return { ...entry, status: 'missing-url' };

  try {
    const res = await fetch(entry.url, { redirect: 'follow' });
    if (!res.ok) return { ...entry, status: 'failed', detail: `HTTP ${res.status}` };
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength === 0) return { ...entry, status: 'failed', detail: 'empty response' };
    await writeFile(dest, buf);
    return { ...entry, status: 'downloaded', bytes: buf.byteLength };
  } catch (err) {
    return { ...entry, status: 'failed', detail: err.message };
  }
}

/** Fixed-size worker pool. */
async function pool(items, size, worker) {
  const results = [];
  let cursor = 0;
  const runners = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index]);
    }
  });
  await Promise.all(runners);
  return results;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  let entries = await loadManifest();

  if (entries.length === 0) {
    console.error('Could not parse any entries from src/lib/assets.ts.');
    process.exit(1);
  }

  const token = await readToken();

  if (token) {
    process.stdout.write(`Minting fresh URLs for ${entries.length} nodes from the Figma API … `);
    try {
      const minted = await mintUrls(token, entries);
      entries = entries.map((e) => (minted.has(e.key) ? { ...e, url: minted.get(e.key) } : e));
      console.log(`got ${minted.size}.`);
    } catch (err) {
      console.log('failed.');
      console.log(`  ${err.message}`);
      console.log('  Falling back to the URLs stored in the manifest (these expire).\n');
    }
  } else {
    console.log('No FIGMA_TOKEN found — using the URLs stored in the manifest.');
    console.log('These expire about 7 days after they were generated. To make this');
    console.log('repeatable, create a personal access token in Figma (Settings →');
    console.log('Security → Personal access tokens) and run:\n');
    console.log("  echo 'FIGMA_TOKEN=figd_your_token_here' >> .env.local\n");
  }

  console.log(`Fetching ${entries.length} assets into public/assets/ …\n`);
  const results = await pool(entries, CONCURRENCY, download);

  const by = (s) => results.filter((r) => r.status === s);
  for (const r of by('downloaded')) {
    console.log(`  ✓ ${r.file}  (${(r.bytes / 1024).toFixed(0)} kB)`);
  }
  if (by('skipped').length) {
    console.log(`  · ${by('skipped').length} already present (use --force to refresh)`);
  }

  const pending = [...by('missing-url'), ...by('failed')];
  if (pending.length) {
    const expired = by('failed').some((r) => /HTTP 40[34]/.test(r.detail ?? ''));
    console.log('\nCould not fetch:');
    for (const r of pending) {
      console.log(`  ! ${r.file}  — ${r.status === 'missing-url' ? 'no URL' : r.detail}`);
      console.log(`      node ${r.nodeId}  ${deepLink(r.nodeId)}`);
    }
    if (expired && !token) {
      console.log(
        '\n  HTTP 403/404 on every asset means the stored URLs have expired.\n' +
          '  Add a FIGMA_TOKEN as described above and re-run — that mints fresh\n' +
          '  URLs from the node ids and will not go stale again.',
      );
    } else {
      console.log(
        '\n  Export each node by hand (PNG 2x, or SVG), save it into public/assets/\n' +
          '  under the filename shown, then re-run. The site renders a labelled\n' +
          '  placeholder until then.',
      );
    }
  }

  console.log(`\nDone — ${by('downloaded').length} downloaded, ${pending.length} pending.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
