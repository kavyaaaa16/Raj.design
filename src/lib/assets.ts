/**
 * Asset manifest — the single source of truth for every image in the site.
 *
 * Components import `asset(...)` and only ever see a LOCAL path (`/assets/x.png`).
 * The `figmaUrl` field is build-time metadata consumed by `scripts/fetch-assets.mjs`;
 * it is never requested by the browser at runtime.
 *
 * Figma export URLs are short-lived (~7 days). `nodeId` is the durable reference:
 * if a URL has expired, re-export that node from the Figma file and drop the new
 * URL in here, or save the file straight to `public/assets/<file>`.
 */

export type AssetKey = keyof typeof MANIFEST;

interface AssetEntry {
  /** Filename under public/assets/ */
  file: string;
  /** Figma node id — durable, use this to re-export when a URL expires */
  nodeId: string;
  /** Short-lived Figma export URL, or null if it still needs exporting */
  figmaUrl: string | null;
  /** Human description, doubles as the default alt text */
  alt: string;
}

const FIGMA_FILE_KEY = 'LwvhD3NnxnLwmNF2r6GDiU';

export const figmaNodeUrl = (nodeId: string) =>
  `https://www.figma.com/design/${FIGMA_FILE_KEY}/?node-id=${nodeId.replace(':', '-')}`;

export const MANIFEST = {
  // ── Hero ────────────────────────────────────────────────────────────────
  heroBackground: {
    file: 'hero-background.png',
    nodeId: '1:1651',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/74e28f8c-41bb-4b6a-93fe-a4a2e1450d3a.png',
    alt: 'Wildflower-covered hillside under a tall cloud',
  },
  heroAvatar: {
    file: 'raj-avatar.png',
    nodeId: '1:1665',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/9bb403f3-824d-4552-a435-7b4b71d14f95.png',
    alt: 'Raj Chhatwani',
  },

  // ── What I do (sticky scroll) ───────────────────────────────────────────
  whatIDoArtDirection: {
    file: 'what-art-direction.png',
    nodeId: '3:1735',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/c369bb10-df62-45de-bd4f-5704325eb259.png',
    alt: 'Art direction work',
  },
  whatIDoBranding: {
    file: 'what-branding.png',
    nodeId: '3:1739',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/10a21251-1921-4e7a-a808-8b86301ea135.png',
    alt: 'Branding work',
  },
  whatIDoUiUx: {
    file: 'what-ui-ux.png',
    nodeId: '3:1743',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/07c9c52e-193f-4456-9ea5-8efad6e5f11d.png',
    alt: 'UI/UX design work',
  },

  // ── Selected work ───────────────────────────────────────────────────────
  vinylRecord: {
    file: 'vinyl-record.png',
    nodeId: '8:4032',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/b80ece1b-4308-421c-950c-198ab3947523.png',
    alt: 'Vinyl record',
  },
  workTechExpo: {
    file: 'work-techexpo.png',
    nodeId: '1:2067',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/ad727ba4-9d1b-4959-b684-bb3f55855e83.png',
    alt: 'TechExpo Gujarat branding and website',
  },
  workHonigdachs: {
    file: 'work-honigdachs.png',
    nodeId: '1:2118',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/6613efa7-5006-4270-a754-17960515ef45.png',
    alt: 'Honigdachs website design',
  },
  workAlexandreChristie: {
    file: 'work-alexandre-christie.png',
    nodeId: '1:2172',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/1ea8a23f-298b-4a49-925d-ea556e56b0bf.png',
    alt: 'Alexandre Christie visual concept',
  },
  workHealthFit: {
    file: 'work-healthfit.png',
    nodeId: '8:4054',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/be93a4ae-a162-4dca-b51d-d0e113323127.png',
    alt: 'HealthFit branding and app',
  },
  workMiro: {
    file: 'work-miro.png',
    nodeId: '8:4091',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/b1a29ab1-98fd-4ebb-bd51-3786f1649ec7.png', // hit the Figma export rate limit — re-export node 8:4091
    alt: 'Miro brand identity',
  },
  paperclipBlue: {
    file: 'paperclip-blue.svg',
    nodeId: '1:2094',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/b4015a09-1139-47d1-a208-828d5638ec43.svg',
    alt: '',
  },
  paperclipRed: {
    file: 'paperclip-red.svg',
    nodeId: '1:2148',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/814cd72a-dbd1-4a03-a1ab-6634ef563cbf.svg',
    alt: '',
  },
  paperclipRedAlt: {
    file: 'paperclip-red-alt.svg',
    nodeId: '18:7242',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/030bacad-7cc3-4902-a252-98a5b6f20e1a.svg',
    alt: '',
  },

  // ── Process ─────────────────────────────────────────────────────────────
  processEye: {
    file: 'process-eye.png',
    nodeId: '34:69',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/b56ae503-f856-4cc7-93dd-dd98aaec3d34.png',
    alt: 'Glass eye ornament',
  },
  processCamera: {
    file: 'process-camera.png',
    nodeId: '8:3960',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/ee328898-9f97-4b20-943a-e180e289495c.png',
    alt: 'Compact film camera',
  },
  paperNote: {
    file: 'paper-note.png',
    nodeId: '8:3974',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/036fe31d-25d6-4f97-9de9-517321d010cd.png',
    alt: '',
  },
  processPolaroid: {
    file: 'process-polaroid.png',
    nodeId: '8:3997',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/040d3ee5-2ebe-4119-8729-91899043fe40.png',
    alt: 'Raj working on a tablet',
  },
  processPolaroidClip: {
    file: 'process-polaroid-clip.png',
    nodeId: '8:4000',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/9a46bb0f-fcb0-4077-a5d9-a0131a637f9f.png',
    alt: '',
  },
  processFilmStrip: {
    file: 'process-film-strip.png',
    nodeId: '8:4017',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/d6ba38b6-b5bd-41ff-96cd-ff4151e712e2.png',
    alt: '',
  },
  processArrow: {
    file: 'process-arrow.svg',
    nodeId: '8:4007',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/13abd654-55f7-42a2-a622-8ba6f921f923.svg',
    alt: '',
  },
  processDeliveryBox: {
    file: 'process-delivery-box.png',
    nodeId: '8:4020',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/f3148f66-513b-4da2-affc-643ffe2952be.png',
    alt: 'Open cardboard box with a smiling face',
  },

  // ── Testimonials ────────────────────────────────────────────────────────
  testimonialsHeart: {
    file: 'testimonials-heart.png',
    nodeId: '15:7056',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/63c903e7-c537-4fdf-bf5c-4b5a6b79ef3d.png',
    alt: 'Glossy pink heart',
  },
  testimonialsCamera: {
    file: 'testimonials-camera.png',
    nodeId: '15:7058',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/34687559-6cd9-4429-b486-797e72857b3a.png',
    alt: 'Compact film camera',
  },
  testimonialPhotoTechExpo: {
    file: 'testimonial-photo-techexpo.png',
    nodeId: '15:7097',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/b2c58f94-4e1a-4a2e-a690-7f06c23e68cf.png',
    alt: 'A single sunflower backlit by golden hour light',
  },
  testimonialPhotoHonigdachs: {
    file: 'testimonial-photo-honigdachs.png',
    nodeId: '15:7131',
    figmaUrl: null, // hit the Figma export rate limit — re-export node 15:7131
    alt: 'Woman in focus photography',
  },
  testimonialPhotoKarishma: {
    file: 'testimonial-photo-karishma.png',
    nodeId: '15:7165',
    figmaUrl: null, // hit the Figma export rate limit — re-export node 15:7165
    alt: 'A man in a black baseball cap against a blue sky',
  },
  testimonialClip: {
    file: 'testimonial-clip.png',
    nodeId: '15:7100',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/f20d9231-5dc3-456f-844b-2ee52899dc41.png',
    alt: '',
  },

  // ── Footer ──────────────────────────────────────────────────────────────
  footerNote: {
    file: 'footer-note.png',
    nodeId: '36:164',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/4d568e73-301a-4962-a3f8-63169c2d64ea.png',
    alt: '',
  },
  footerRecordButton: {
    file: 'footer-record-button.png',
    nodeId: '36:184',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/e8abd881-a871-440a-ac38-4423d627a354.png',
    alt: '',
  },

  // ── Dock ────────────────────────────────────────────────────────────────
  dockNotes: {
    file: 'dock-notes.png',
    nodeId: '1:3051',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/7d5b1afb-55f3-4e11-a8b9-0db3ccc7befe.png',
    alt: 'Notes',
  },
  dockPhotos: {
    file: 'dock-photos.png',
    nodeId: '1:3055',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/20477879-9ea2-4162-a7a2-7024bae5675b.png',
    alt: 'Photos',
  },
  dockFinder: {
    file: 'dock-finder.png',
    nodeId: '1:3059',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/9ddc6263-de26-4295-ae3f-01b65bd09fc9.png',
    alt: 'Finder',
  },
  dockMail: {
    file: 'dock-mail.png',
    nodeId: '1:3063',
    figmaUrl: 'https://www.figma.com/api/mcp/asset/cd11b6cc-6173-4690-af26-fc30c0b1e8e5.png',
    alt: 'Mail',
  },
} satisfies Record<string, AssetEntry>;

/** Local URL for an asset. This is the only form that reaches the browser. */
export const asset = (key: AssetKey): string => import.meta.env.BASE_URL + 'assets/' + MANIFEST[key].file;

/** Description from the manifest, used as default alt text. */
export const altText = (key: AssetKey): string => MANIFEST[key].alt;
