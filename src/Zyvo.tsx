import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Footer } from './components/Footer';
import { Dock } from './components/Dock';
import { Figure } from './components/ui/Figure';
import { CgfProjectCard } from './components/Work';
import { RiseText, TypewriterText } from './components/ScrollText';
import styles from './Zyvo.module.css';

const logoStudies = [
  { label: 'First Zyvo lettering explorations', src: 'zyvo-identity-1.png' },
  { label: 'Zyvo wordmark sketches', src: 'zyvo-identity-2.png' },
  { label: 'Zyvo wordmark construction', src: 'zyvo-identity-3.png' },
  { label: 'Refining the Zyvo logo proportions', src: 'zyvo-identity-4.png' },
  { label: 'Zyvo logo iterations', src: 'zyvo-identity-5.png' },
  { label: 'Final Zyvo logo', src: 'zyvo-identity-6.png' },
  { label: 'The V and crow symbol', src: 'zyvo-identity-7.png' },
  { label: 'Zyvo wordmark', src: 'zyvo-identity-8.png' },
  { label: 'Zyvo logo with Crafted to Inspire tagline', src: 'zyvo-identity-9.png' },
];

function Dots() {
  return <div className={styles.dots} aria-hidden="true"><i /><i /><i /></div>;
}

function Window({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.window} ${className}`}><div className={styles.chrome}><Dots /></div>{children}</div>;
}

function Note({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <article className={styles.note}><span className={styles.tape} /><TypewriterText as="p" className={styles.noteTitle} speed={0.008}>{`${number} — ${title}`}</TypewriterText><TypewriterText as="p" className={styles.noteCopy} speed={0.008}>{String(children)}</TypewriterText></article>;
}

export default function Zyvo() {
  const phoneVideoRef = useRef<HTMLVideoElement>(null);
  const controlsTimer = useRef<number | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);

  useEffect(() => {
    const video = phoneVideoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.25) video.pause();
    }, { threshold: [0, 0.25] });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (controlsTimer.current !== undefined) window.clearTimeout(controlsTimer.current);
  }, []);

  const revealControls = () => {
    setControlsVisible(true);
    if (controlsTimer.current !== undefined) window.clearTimeout(controlsTimer.current);
    controlsTimer.current = window.setTimeout(() => setControlsVisible(false), 2200);
  };

  const togglePlayback = () => {
    const video = phoneVideoRef.current;
    if (!video) return;
    if (video.paused) void video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    else video.pause();
  };

  return <div className={styles.page}>
    <header className={styles.hero}>
      <div className={styles.topbar}>
        <div className={styles.trafficLights} aria-label="Window controls"><i /><i /><i /></div>
        <div className={styles.address}><span aria-hidden="true">⌕</span><span>Zyvo Case Study</span><span aria-hidden="true">↻</span></div>
        <Figure name="dockFinder" alt="Finder" className={styles.finderIcon} />
      </div>
      <div className={styles.heroVisual}>
        <img src={`${import.meta.env.BASE_URL}assets/work-zyvo.png`} alt="ZYVO identity card set on dark woven fabric" className={styles.heroCover} />
        <Figure name="vinylRecord" alt="Vinyl record" className={styles.heroRecord} />
      </div>
      <div className={styles.intro}>
        <h1>ZYVO</h1>
        <RiseText>A personal brand built around culinary passion, creativity, and the art of bringing flavours to life. For Chef Viraj Nayak, I developed a distinctive visual identity that reflects his vision of creating a brand extending beyond the kitchen into everyday products such as tea masala, coffee, and more. The objective was to create an identity that felt refined, memorable, and deeply connected to his personality.</RiseText>
      </div>
    </header>

    <main className={styles.content}>
      <section className={styles.introSection} aria-label="Brand identity overview">
        <div className={styles.phoneScreen} onPointerDown={revealControls}>
          <video ref={phoneVideoRef} className={styles.phoneVideo} src={`${import.meta.env.BASE_URL}assets/zyvo-screen.mp4`} aria-label="ZYVO brand film" autoPlay muted={isMuted} loop playsInline preload="metadata" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
          <button className={`${styles.videoPlayButton} ${controlsVisible ? styles.controlsVisible : ''}`} type="button" onClick={togglePlayback} aria-label={isPlaying ? 'Pause video' : 'Play video'} tabIndex={controlsVisible ? 0 : -1}>
            <svg viewBox="0 0 24 24" aria-hidden="true">{isPlaying ? <><path d="M8 5v14M16 5v14" /></> : <path d="m8 5 11 7-11 7z" />}</svg>
          </button>
          <button className={`${styles.videoMuteButton} ${controlsVisible ? styles.controlsVisible : ''}`} type="button" onClick={() => setIsMuted((muted) => !muted)} aria-label={isMuted ? 'Unmute video' : 'Mute video'} tabIndex={controlsVisible ? 0 : -1}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4H4z" />{isMuted ? <path d="m17 9 5 6m0-6-5 6" /> : <><path d="M16 9a5 5 0 0 1 0 6" /><path d="M18.5 6.5a9 9 0 0 1 0 11" /></>}</svg>
          </button>
        </div>
        <Window className={styles.identityWindow}>
          <img src={`${import.meta.env.BASE_URL}assets/case-study-portrait.png`} alt="Designer portrait" className={styles.portrait} />
          <TypewriterText as="p" className={styles.identityLead} speed={0.006}>Every strong identity begins with understanding the person behind it. I explored the brand’s vision, personality, and aspirations to establish a direction that felt authentic to Chef Viraj while allowing the brand to grow into a diverse product range.</TypewriterText>
          <div className={styles.studyGrid}>{logoStudies.map((item, index) => <div key={item.src} className={`${styles.studyTile} ${index > 5 ? styles.logoTile : ''}`}><img src={`${import.meta.env.BASE_URL}assets/${item.src}`} alt={item.label} loading="lazy" /></div>)}</div>
        </Window>
      </section>

      <section className={styles.section}>
        <Note number="01" title="Crafting the Logo">I created a sleek, versatile logo that reflects the brand’s essence through minimalism and thoughtful detailing, designed to translate seamlessly across packaging and digital touchpoints.</Note>
        <Window className={styles.brandWindow}>
          <img src={`${import.meta.env.BASE_URL}assets/zyvo-brand-architecture.png`} alt="ZYVO brand architecture with a peacock and the final logo" className={styles.peacockPanel} loading="lazy" />
          <img src={`${import.meta.env.BASE_URL}assets/zyvo-brand-personality.png`} alt="Defining the ZYVO brand personality" className={styles.plumPanel} loading="lazy" />
          <img src={`${import.meta.env.BASE_URL}assets/zyvo-symbol.png`} alt="The ZYVO symbol of intelligence and its meaning" className={styles.symbolPanel} loading="lazy" />
          <img src={`${import.meta.env.BASE_URL}assets/zyvo-letter-v.png`} alt="The letter V and flying crow concept" className={styles.letterPanel} loading="lazy" />
          <img src={`${import.meta.env.BASE_URL}assets/zyvo-crow-meaning.png`} alt="The crow represents sharp observation and intelligence" className={styles.meaningPanel} loading="lazy" />
          <img src={`${import.meta.env.BASE_URL}assets/zyvo-palette.png`} alt="ZYVO soft beige and rich plum color palette" className={styles.palettePanel} loading="lazy" />
          <img src={`${import.meta.env.BASE_URL}assets/zyvo-logo-plum.png`} alt="Final ZYVO logo on a rich plum background" className={styles.logoPanel} loading="lazy" />
          <img src={`${import.meta.env.BASE_URL}assets/zyvo-spices-logo.png`} alt="Final ZYVO logo over spices" className={styles.spicePanel} loading="lazy" />
        </Window>
      </section>

      <section className={styles.section}>
        <div className={styles.results}>
          <span className={styles.tape} />
          <TypewriterText as="h2">Results!</TypewriterText>
          <TypewriterText as="b">Brand Recognition</TypewriterText><TypewriterText as="b">Visual Impact</TypewriterText><TypewriterText as="b">Distinctive Identity</TypewriterText>
        </div>
      </section>

      <div className={styles.nextCase}><CgfProjectCard /></div>
    </main>
    <Footer />
    <Dock />
  </div>;
}
