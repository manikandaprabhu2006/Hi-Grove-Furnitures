import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { FurnitureArt } from './FurnitureArt';

const ArtOfWood = lazy(() => import('./ArtOfWood'));

const STAGES = [
  { name: 'Raw wood', text: 'It starts with a teak log, its rings and colour untouched.', view: 'grain' },
  { name: 'Cut', text: 'The log is sawn into boards, each one following the grain.', view: 'grain' },
  { name: 'Crafted', text: 'Boards are shaped and joined into a frame that will carry years of use.', view: 'detail' },
  { name: 'Finished', text: 'Sanding and finishing bring out the warmth and depth of the grain.', view: 'front' },
  { name: 'Furniture', text: 'The finished piece is ready to take its place at the centre of a home.', view: 'lifestyle' },
];

const webgl = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } };

/** "The Art of Wood": scroll-driven 3D on capable desktops, a light animated version elsewhere. */
export default function CraftSection() {
  const outer = useRef(null);
  const progress = useRef(0);
  const [stage, setStage] = useState(0);
  const [near, setNear] = useState(false);
  const [light, setLight] = useState(true);
  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => { progress.current = v; setStage(Math.min(4, Math.floor(v * 5))); });

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 900px)').matches;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setLight(!(desktop && !calm && webgl()));
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '600px 0px' });
    outer.current && io.observe(outer.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="craft grain-bg" id="craft" ref={outer} aria-labelledby="craft-h">
      <div className="craft__sticky">
        <div className="craft__text">
          <p className="kicker">The art of wood</p>
          <h2 id="craft-h" className="display">EVERY GRAIN TELLS A STORY.</h2>
          <ol className="craft__steps">
            {STAGES.map((s, i) => (
              <li key={s.name} className={i === stage ? 'is-on' : i < stage ? 'is-done' : ''}><span>{s.name}</span></li>
            ))}
          </ol>
          <p className="craft__desc" aria-live="polite">{STAGES[stage].text}</p>
          <div className="craft__bar"><motion.i style={{ scaleX: scrollYProgress }} /></div>
        </div>
        <div className="craft__visual">
          {!light && near ? (
            <Suspense fallback={<div className="craft__load" />}><ArtOfWood progress={progress} /></Suspense>
          ) : (
            <div className="craft__lite">
              {STAGES.map((s, i) => (
                <motion.div key={s.name} className="craft__lite-img" animate={{ opacity: i === stage ? 1 : 0, scale: i === stage ? 1 : 1.05 }} transition={{ duration: 0.6 }}>
                  <FurnitureArt shape="dtable" view={s.view} name="Teak dining table" dims={{ width: 180, depth: 90, height: 76, unit: 'cm' }} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
