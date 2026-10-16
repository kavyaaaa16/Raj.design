# RAJ.DESIGNS® — portfolio

A code build of the `FInal-Portfolio` Figma file ([node 1:1540](https://www.figma.com/design/LwvhD3NnxnLwmNF2r6GDiU/?node-id=1-1540)),
responsive from 320px to desktop, with the motion the static file implies.

React 18 · TypeScript · Vite · CSS Modules · Framer Motion · Lenis

---

## Getting started

```bash
npm install
npm run assets     # downloads the images from Figma into public/assets/
npm run dev
```

### One-time Figma token setup (recommended)

Figma's export URLs expire about 7 days after they're generated, so any URL
committed to this repo will eventually 404. Point the script at the Figma API
instead and it mints fresh URLs from the durable node ids on every run:

1. Figma → your avatar → **Settings → Security → Personal access tokens**
2. Generate one with **File content: read-only**
3. `echo 'FIGMA_TOKEN=figd_your_token_here' >> .env.local`

`.env.local` is gitignored; the token stays on your machine. After that
`npm run assets` is repeatable forever and the stored URLs are never used.

| Script | What it does |
| --- | --- |
| `npm run assets` | Fetches every image in the manifest. `-- --force` re-downloads. |
| `npm run dev` | Dev server on :5173 |
| `npm run build` | Typecheck, then production build to `dist/` |
| `npm run preview` | Serve the built output |
| `npm run typecheck` | `tsc --noEmit` |

---

## Images

Fetched images **are** committed (`public/assets/` is not gitignored). Figma
export URLs expire, so the downloaded files are the durable copy — once they're
in the repo a clean clone builds with no network, no token and no Figma access,
and `npm run assets` is only needed when a design actually changes.

`src/lib/assets.ts` is the manifest: each entry maps a logical name to its
filename, its **Figma node id**, and a fallback Figma export URL.

Components only ever touch `asset('heroBackground')` → `/assets/hero-background.png`.
No Figma URL is ever requested by the browser.

**Figma export URLs expire after about 7 days.** The node id is the durable
reference. When a URL has gone stale, `npm run assets` prints the node id and a
deep link — export it, drop it in `public/assets/` under the filename shown, done.
Until then `<Figure>` renders a labelled placeholder naming the node, so the
layout stays intact rather than showing broken-image icons.

Two assets have no stored URL at all and need either a token (above) or a
manual export:

| File | Node |
| --- | --- |
| `testimonial-photo-honigdachs.png` | `15:7131` |
| `testimonial-photo-karishma.png` | `15:7165` |

---

## Fidelity

Values were read out of the Figma file rather than measured off screenshots.

**Colours** — `#f7f0e5` paper, `#97c9f0` sky, `#ccd7ff` periwinkle, `#ddc2fc`
lilac, `#696212` olive, plus the `#fd5d5c` / `#fac900` / `#34c75a` window
controls. All in `src/styles/tokens.css`, each annotated with its node.

**Type** — four families, all self-hosted via Fontsource so nothing depends on a
CDN: Bagel Fat One (display), Plus Jakarta Sans (UI), Cal Sans (the conversational
copy and pills), Caveat ("SAY HI!").

**Rotations** — Figma measures counter-clockwise, CSS clockwise, so every angle is
negated. The project cards are `+7.65°`, `−3.12°`, `−7°`, `+7.65°`, `−7°`.

**Responsive** — Figma only contains a 425px artboard, so desktop is an extension
rather than a copy. Type uses `clamp()` whose lower bound is the literal Figma
value at 425px. Single-column stacks become 2- then 3-column grids with
staggered offsets, so the rotated cards keep reading as a pinboard instead of a
tidy table.

---

## Motion

Figma renders one frozen frame per section. These decisions fill the gap, and
each is grounded in something the file already shows:

| Where | What it does | Why |
| --- | --- | --- |
| Hero | Load sequence, then word-by-word headline; photo parallax on scroll | Establishes the display face as the main event |
| Hero stickers | "Visual Design" / "UX Design" pop in late | Both exist in the file as `visible: false` (nodes `1:1683`, `1:1722`) |
| What I do | Scroll picks the active service; its heading goes 35% → 100% | All three sit at 35% opacity over a sticky block — only meaningful if one lifts at a time |
| Work | Cards settle into their Figma angle, straighten on hover | The paperclips make these pinned photos |
| Work | Vinyl record spins | It is a record |
| Process | Pinned scene: steps 01–03 pile up, then the box rises, swallows the pile and carries it off | Three notes at three angles plus a box whose only job is to receive them |
| Testimonials | Result pills stagger in | The part a reader actually scans |
| Footer | Two discs track the cursor | Nodes `36:139` / `36:142` are eyes with pupils frozen mid-glance |
| Footer | Panel pulls toward the pointer | The loudest element earns the one magnetic moment |
| Dock | Permanently pinned; proximity magnification; icons scroll-animate to sections | It's a macOS dock, and node `1:3053` is wired to SCROLL_ANIMATE → the work section |

**Reduced motion is honoured throughout.** `useReducedMotion()` gates every
component: parallax, magnification, magnetism and the eye tracking all switch
off, entrances collapse to plain fades, and Lenis never initialises. The site is
fully usable with no animation at all.

---

## Accessibility

- Skip link to `#main`; landmarks and one `<h1>`
- Visible focus rings, flipped to white on the dark footer panel
- Decorative images take `alt=""`; the dock exposes real labels
- Headline reveal keeps a plain-text copy for screen readers, animating an
  `aria-hidden` duplicate
- Inertial scroll is disabled on coarse pointers so native momentum wins

---

## Structure

```
src/
  lib/
    assets.ts           manifest — filenames, node ids, export URLs
    motion.ts           shared variants and easings
    usePointer.ts       rAF-throttled pointer position
    useSmoothScroll.ts  Lenis, gated on reduced-motion and pointer type
  components/
    Hero · WhatIDo · Work · Process · Testimonials · Footer · Dock
    ui/  Figure (asset fallback) · Pill · Eyes
  styles/
    tokens.css          every value traced to a Figma node
    global.css          reset, focus, reduced-motion
scripts/
  fetch-assets.mjs      concurrent downloader with per-node reporting
```

---

## Verification

Layout is checked with headless Chromium rather than by eye. `scripts/` has no
test runner wired up yet, but the checks that were run are worth repeating after
any type or layout change:

- **Horizontal overflow** at 320 / 390 / 430 / 768 / 1024 / 1440 / 1920 —
  `documentElement.scrollWidth` must equal `window.innerWidth` at every width.
- **Heading wrap** — "A Collection Of My Recent Work" should break into three
  lines, matching Figma. Four is acceptable where the record wraps with it.
- **Dock pinning** — its viewport-relative top must not change across scroll.

Two traps this caught, both worth knowing about:

`ch` is useless as a measure for Bagel Fat One. It is keyed to the `0` glyph,
which in this face is far narrower than its average letter, so a `13ch` measure
collapsed every heading to one word per line. Heading measures are in `em`, set
**on the heading element itself** — on a wrapper, `em` resolves against the
wrapper's inherited 18px, not the heading's 72px.

`container-type` on the step cards did not give their children a usable query
size; `cqw` collapsed and the step text rendered at ~11px instead of ~27px. The
container now lives on the stack wrapper, which has a stable layout width.

## Known gaps

- The three assets listed above need exporting.
- Project cards link to `#`. Wire up real case-study routes when they exist.
- Social links point at bare `instagram.com` / `behance.net` and a placeholder
  `hello@raj.designs` — the Figma file doesn't contain the real destinations.
