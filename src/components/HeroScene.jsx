import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArtSvg, Shape, Plant, toneFor } from './FurnitureArt';

/** Layered living-room scene with mouse parallax. Purely illustrative demo art. */
export default function HeroScene() {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 }), sy = useSpring(my, { stiffness: 60, damping: 18 });
  const back = { x: useTransform(sx, (v) => v * -6), y: useTransform(sy, (v) => v * -4) };
  const mid = { x: useTransform(sx, (v) => v * -14), y: useTransform(sy, (v) => v * -8) };
  const fore = { x: useTransform(sx, (v) => v * -30), y: useTransform(sy, (v) => v * -14) };
  const tilt = { rotateY: useTransform(sx, (v) => v * 1.4), rotateX: useTransform(sy, (v) => v * -1) };
  const onMove = (e) => {
    const b = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - b.left) / b.width - 0.5) * 2); my.set(((e.clientY - b.top) / b.height - 0.5) * 2);
  };
  const tone = toneFor('Natural Teak');
  const L = (children, style) => <motion.div className="hscene__layer" style={style}><ArtSvg tone={tone} viewBox="0 0 800 520" preserve="xMidYMax slice" label="">{children}</ArtSvg></motion.div>;
  return (
    <div className="hscene" onPointerMove={onMove} onPointerLeave={() => { mx.set(0); my.set(0); }} role="img" aria-label="Illustration of a teak living room with a sofa, coffee table and lounge chair">
      <motion.div className="hscene__stage" style={tilt}>
        {L(
          <g>
            <defs>
              <linearGradient id="hwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A2115" /><stop offset="1" stopColor="#2A180F" /></linearGradient>
              <linearGradient id="hwin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE9BF" /><stop offset="1" stopColor="#F2C98A" /></linearGradient>
              <linearGradient id="hbeam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFDFA0" stopOpacity=".5" /><stop offset="1" stopColor="#FFDFA0" stopOpacity="0" /></linearGradient>
            </defs>
            <rect x="-200" y="-200" width="1200" height="620" fill="url(#hwall)" />
            {Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 60 - 20} y="-200" width="2" height="620" fill="#000" opacity=".12" />)}
            <rect x="500" y="46" width="180" height="250" rx="2" fill="url(#hwin)" /><rect x="500" y="46" width="180" height="250" fill="none" stroke="#B9824A" strokeWidth="6" />
            <path d="M590 46 V296 M500 170 H680" stroke="#B9824A" strokeWidth="4" />
            <path d="M500 296 L330 440 L700 440 L680 296Z" fill="url(#hbeam)" />
            <rect x="90" y="52" width="240" height="8" fill="#1a0e08" opacity=".5" />
            <path d="M200 -200 V-20" stroke="#C9A45C" strokeWidth="2" /><path d="M170 -20 L230 -20 L246 40 L154 40Z" fill="#EFE5D0" /><ellipse cx="200" cy="44" rx="60" ry="26" fill="#FFE3A8" opacity=".35" />
          </g>,
          back,
        )}
        {L(
          <g>
            <rect x="-200" y="400" width="1200" height="300" fill="#6A3D22" />
            {Array.from({ length: 12 }, (_, i) => <rect key={i} x="-200" y={400 + i * 12 + i * i * 0.6} width="1200" height="1.5" fill="#1a0e08" opacity=".4" />)}
            <rect x="-200" y="400" width="1200" height="300" fill="#000" opacity=".1" />
            <ellipse cx="400" cy="432" rx="340" ry="42" fill="#CDBA9A" opacity=".92" /><ellipse cx="400" cy="430" rx="318" ry="34" fill="none" stroke="#A88F68" strokeOpacity=".7" />
            <g transform="translate(96 60) scale(.8)"><Shape type="art" /></g>
            <g transform="translate(-10 125) scale(1.1)"><Shape type="sofa3" /></g>
            <g transform="translate(340 225) scale(.7)"><Shape type="side" /></g>
            <g transform="translate(380 219) scale(.5)"><Shape type="lamp" /></g>
            <g transform="translate(470 150)"><Shape type="lounge" /></g>
            <g transform="translate(190 222) scale(.85)"><Shape type="coffee" /></g>
          </g>,
          mid,
        )}
        {L(
          <g><Plant x={26} y={476} s={1.5} /><Plant x={770} y={470} s={1.25} /></g>,
          fore,
        )}
        <span className="hscene__glow" aria-hidden="true" />
      </motion.div>
    </div>
  );
}
