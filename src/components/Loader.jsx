import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/** Short branded splash. Shown once per session; skipped when reduced motion is requested. */
export default function Loader({ children }) {
  const skip = typeof window !== 'undefined' && (sessionStorage.getItem('hgf:splash') || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [show, setShow] = useState(!skip);
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => { sessionStorage.setItem('hgf:splash', '1'); setShow(false); }, 1500);
    return () => clearTimeout(t);
  }, [show]);
  return (
    <>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div className="splash" exit={{ opacity: 0 }} transition={{ duration: 0.45 }} aria-hidden="true">
            <div className="splash__logo">
              <motion.img src="/brand/logo-full.webp" alt="" width="1000" height="786" initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }} />
              <motion.span className="splash__sweep" initial={{ left: '0%' }} animate={{ left: '100%' }} transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
