import { motion, useScroll, useSpring } from 'framer-motion';
import AlexandreChristie from './AlexandreChristie';
import { Dock } from './components/Dock';
import { Hero } from './components/Hero';
import { WhatIDo } from './components/WhatIDo';
import { Work } from './components/Work';
import { Process } from './components/Process';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { useSmoothScroll } from './lib/useSmoothScroll';
import styles from './App.module.css';

export default function App() {
  return window.location.hash === '#project=alexandre-christie'
    ? <AlexandreChristie />
    : <PortfolioHome />;
}

function PortfolioHome() {
  useSmoothScroll();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* Reading position for a page this long */}
      <motion.div className={styles.progress} style={{ scaleX: progress }} aria-hidden="true" />

      <main id="main">
        <div id="top" />
        <Hero />
        <WhatIDo />
        <Work />
        <Process />
        <Testimonials />
      </main>

      <Footer />
      <Dock />
    </>
  );
}
