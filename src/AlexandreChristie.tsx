import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Footer } from './components/Footer';
import { Dock } from './components/Dock';
import { Figure } from './components/ui/Figure';
import styles from './AlexandreChristie.module.css';

const gallery = [
  { name: 'Purple glow watch', src: 'case-study-gallery-glow.png' },
  { name: 'Exploded watch', src: 'case-study-gallery-exploded.png' },
  { name: 'Purple glow watch', src: 'case-study-gallery-glow.png' },
  { name: 'Exploded watch', src: 'case-study-gallery-exploded.png' },
  { name: 'Rose gold case', src: 'case-study-gallery-rose-case.png' },
  { name: 'Purple case detail', src: 'case-study-gallery-purple-case.png' },
  { name: 'Watch movement components', src: 'case-study-gallery-movement.png' },
  { name: 'Cosmic Green dial detail', src: 'case-study-gallery-dial.png' },
  { name: 'Cosmic Green watch', src: 'case-study-gallery-watch.png' },
];
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

function PhoneCarousel({ ariaLabel = 'Campaign image carousel', imageSrc }: { ariaLabel?: string; imageSrc?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const activeSlide = track?.children[1] as HTMLElement | undefined;
    if (track && activeSlide) {
      track.scrollLeft = activeSlide.offsetLeft - (track.clientWidth - activeSlide.offsetWidth) / 2;
    }
  }, []);

  return <div className={`${styles.phoneCarousel} ${imageSrc ? styles.imageCarousel : ''}`} ref={trackRef} role="region" aria-label={ariaLabel} tabIndex={0}>
    {[1, 2, 3].map((number) => <div className={styles.phoneSlide} key={number} role="img" aria-label={`${ariaLabel} ${number}${imageSrc ? '' : ' placeholder'}`}>
      {imageSrc && <img className={styles.phoneSlideImage} src={`${import.meta.env.BASE_URL}assets/${imageSrc}`} alt="" loading="lazy" />}
    </div>)}
  </div>;
}

function InstagramStory() {
  const [activeStory, setActiveStory] = useState(0);
  const changeStory = (direction: number) => setActiveStory((current) => (current + direction + 3) % 3);

  return <div className={styles.storyFrame}>
    <img
      src={`${import.meta.env.BASE_URL}assets/case-study-instagram-story.png`}
      alt="Alexandre Christie Instagram story: A Cosmic Change Is Coming"
      className={styles.storyImage}
      onClick={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        changeStory(event.clientX < bounds.left + bounds.width / 2 ? -1 : 1);
      }}
    />
    <div className={styles.storyProgress} role="group" aria-label="Choose Instagram story">
      {[0, 1, 2].map((index) => <button key={index} type="button" aria-label={`Show story ${index + 1}`} aria-pressed={activeStory === index} onClick={() => setActiveStory(index)}><span className={activeStory === index ? styles.progressActive : ''} /></button>)}
    </div>
  </div>;
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
          <img src={`${import.meta.env.BASE_URL}assets/case-study-portrait.png`} alt="Raj planning the campaign film" className={styles.campaignPortrait} />
          <p className={styles.campaignLead}>One of the most distinctive executions was a fully AI-generated film. Instead of relying on a simple text prompt, I first developed the visual frames in Photoshop, carefully establishing the composition, lighting, environment, and product placement. I then used those frames as the foundation for the visual direction, guiding the generation process toward the intended cinematic result.</p>
          <div className={styles.gallery}>{gallery.map((item, index) => <div className={styles.galleryTile} key={`${item.src}-${index}`}><img src={`${import.meta.env.BASE_URL}assets/${item.src}`} alt={item.name} loading="lazy" /></div>)}</div>
          <PhoneCarousel />
        </Window>
      </section>

      <section className={styles.section}>
        <Note number="03" title="Extending the Story to Instagram">I created visually engaging, product-focused social content that carried Cosmic’s premium visual identity across Instagram through cohesive compositions and storytelling.</Note>
        <Window className={styles.socialWindow}>
          <h2 className={styles.pillLabel}>Instagram stories</h2>
          <InstagramStory />
          <h2 className={styles.pillLabel}>Carousels</h2>
          <PhoneCarousel ariaLabel="Instagram carousel posts" imageSrc="case-study-instagram-carousel.png" />
        </Window>
        <div className={styles.results}>
          <img className={styles.resultsPaper} src={`${import.meta.env.BASE_URL}assets/case-study-results-paper.png`} alt="" aria-hidden="true" />
          <div className={styles.resultsContent}><span>Results!</span><b>200k Views</b><b>51K Engagement</b><b>1.8× Higher Watch Time</b></div>
        </div>
        <div className={styles.delivered}><img className={styles.deliveredClip} src={`${import.meta.env.BASE_URL}assets/process-polaroid-clip.png`} alt="" aria-hidden="true" /><span>I delivered</span><p>→ 20+ Static Posts<br />→ 4 Reels<br />→ 3 Hook Variations<br />→ Landing Page</p></div>
      </section>

      <a className={styles.nextCase} href={`${import.meta.env.BASE_URL}#work`} aria-label="View the Honigdachs project">
        <Window className={styles.honigdachsWindow}>
          <img className={styles.honigdachsClip} src={`${import.meta.env.BASE_URL}assets/paperclip-blue.svg`} alt="" aria-hidden="true" />
          <img className={styles.honigdachsPhoto} src={`${import.meta.env.BASE_URL}assets/work-honigdachs.png`} alt="Honigdachs flower shop website in a field of flowers" loading="lazy" />
          <div className={styles.honigdachsMeta}><strong>Honigdachs</strong><span>Website Design</span><span>Figma</span><span>2026</span></div>
        </Window>
      </a>

    </main>
    <Footer />
    <Dock />
  </div>;
}
