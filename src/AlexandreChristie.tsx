import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Footer } from './components/Footer';
import { Dock } from './components/Dock';
import { Figure } from './components/ui/Figure';
import styles from './AlexandreChristie.module.css';

const gallery = ['Campaign frame 01', 'Exploded watch detail', 'Campaign frame 02', 'Case study still', 'Rose gold case', 'Cosmic purple finish', 'Movement study', 'Dial detail', 'Cosmic Green watch'];
const landingImages = [
  { name: 'Cosmic landing page', src: 'case-study-hero.png', left: 11, top: -0.17, width: 352.7088, height: 200.3482 },
  { name: 'Cosmic campaign portrait', src: 'case-study-campaign.png', left: 11, top: 224, width: 168, height: 365.2537 },
  { name: 'Cosmic Green product page', src: 'case-study-product.png', left: 195, top: 224, width: 168, height: 365.2537 },
  { name: 'Watch specifications and movement', src: 'case-study-specs.png', left: 11, top: 613, width: 352.71, height: 272.1255 },
  { name: 'Video placeholder', src: '', left: 11, top: 895, width: 172, height: 356 },
  { name: 'Orbit campaign', src: 'case-study-orbit.png', left: 195, top: 895.17, width: 168, height: 357.3134 },
];

function BrowserDots() {
  return <div className={styles.dots} aria-hidden="true"><i /><i /><i /></div>;
}

function Window({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.window} ${className}`}><div className={styles.chrome}><BrowserDots /></div>{children}</div>;
}

function Note({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <article className={styles.note}><span className={styles.tape} /><p className={styles.noteTitle}>{number} — {title}</p><p className={styles.noteCopy}>{children}</p></article>;
}

export default function AlexandreChristie() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleWidth, setTitleWidth] = useState<number>();

  useLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const measure = () => setTitleWidth(title.getBoundingClientRect().width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(title);
    return () => observer.disconnect();
  }, []);

  return <div className={styles.page}>
    <header className={styles.hero}>
      <div className={styles.topbar}>
        <div className={styles.trafficLights} aria-label="Window controls"><i /><i /><i /></div>
        <div className={styles.address}><span>⌕</span><span>Alexandre Christie Case Study</span><span>↻</span></div>
        <Figure name="dockFinder" alt="Finder" className={styles.finderIcon} />
      </div>
      <div className={styles.heroWindow}>
        <div className={styles.heroVisual}>
          <img src={`${import.meta.env.BASE_URL}assets/case-study-cover.png`} alt="Cosmic collection campaign displayed in a gallery space" className={styles.heroImage} />
        </div>
        <Figure name="vinylRecord" alt="Vinyl record" className={styles.heroRecord} />
      </div>
      <div className={styles.intro}>
        <h1 ref={titleRef}>Alexandre Christie</h1>
        <p style={titleWidth ? { width: `${titleWidth}px` } : undefined}>This case study showcases my end-to-end creative work for Alexandre Christie’s Cosmic collection, spanning visual direction, landing page design, 10+ lifestyle images, three campaign videos—including one fully AI-generated film—and three Instagram carousels, all crafted to create a cohesive luxury brand experience.</p>
      </div>
    </header>

    <main className={styles.content}>
      <section className={styles.section}>
        <div className={styles.phoneScreen} role="img" aria-label="Mobile screen mockup placeholder" />
        <Note number="01" title="Designing the Digital Experience">I developed the visual direction and creative assets for the Cosmic product landing page, shaping how the collection would be introduced, experienced, and explored.</Note>
        <Window className={styles.landingWindow}>
          <div className={styles.landingGallery} aria-label="Cosmic landing page image layout">
            {landingImages.map((image) => <div className={image.src ? styles.landingImageFrame : styles.videoSlot} key={image.name} style={{ left: image.left, top: image.top, width: image.width, height: image.height }}>
              {image.src && <img className={styles.landingImage} src={`${import.meta.env.BASE_URL}assets/${image.src}`} alt={image.name} loading="lazy" />}
            </div>)}
          </div>
        </Window>
      </section>

      <section className={styles.section}>
        <Note number="02" title="Crafting the Campaign Films">I created three campaign videos, exploring how motion, atmosphere, and visual storytelling could elevate the product beyond static imagery.</Note>
        <Window className={styles.campaignWindow}>
          <p className={styles.campaignLead}>One of the most distinctive executions was a fully AI-generated film. Instead of relying on a simple text prompt, I first developed the visual frames in Photoshop, carefully establishing the composition, lighting, environment, and product placement. I then used those frames as the foundation for the visual direction, guiding the generation process toward the intended cinematic result.</p>
          <div className={styles.gallery}>{gallery.map((item, index) => <div className={styles.galleryTile} key={item}><Figure name="workAlexandreChristie" alt={item} /><span>0{index + 1}</span></div>)}</div>
          <div className={styles.videoStrip}><div /><div /><div /></div>
        </Window>
      </section>

      <section className={styles.section}>
        <Note number="03" title="Extending the Story to Instagram">I created visually engaging, product-focused social content that carried Cosmic’s premium visual identity across Instagram through cohesive compositions and storytelling.</Note>
        <Window className={styles.socialWindow}>
          <h2 className={styles.pillLabel}>Instagram stories</h2>
          <div className={styles.story}><span>◉ &nbsp; alexandrechristie_india &nbsp; <b>✓</b></span><div className={styles.eclipse}>555</div><small>A Cosmic Change Is Coming</small></div>
          <h2 className={styles.pillLabel}>Carousels</h2>
          <div className={styles.carouselMock}><div className={styles.socialHead}>◉ &nbsp; alexandrechristie_india &nbsp; <b>✓</b></div><div className={styles.carouselVisual}>SOMETHING IS<br />SHIFTING.</div><div className={styles.socialActions}>♡　◯　↻　➤　　▱</div></div>
        </Window>
        <div className={styles.results}><span>Results!</span><b>200k Views</b><b>51K Engagement</b><b>1.8× Higher Watch Time</b></div>
        <div className={styles.delivered}><span>I delivered</span><p>→ 20+ Static Posts<br />→ 4 Reels<br />→ 3 Hook Variations<br />→ Landing Page</p></div>
      </section>

      <a className={styles.nextProject} href={`${import.meta.env.BASE_URL}#work`}><span>Back to the collection</span><strong>Let’s work<br />together <i>↗</i></strong></a>
    </main>
    <Footer />
    <Dock />
  </div>;
}
