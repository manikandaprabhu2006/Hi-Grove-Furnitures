import { createContext, useContext, useId } from 'react';

/**
 * Procedural teak furniture illustrations used as demo product imagery.
 * Real photography can replace them at any time: product.images accepts { kind: 'upload' | 'url', src }.
 */
const TONES = {
  natural: { mid: '#9A6238', dark: '#5E3720', light: '#C48A55' },
  rich: { mid: '#6B3E22', dark: '#361E12', light: '#93592F' },
  honey: { mid: '#B9824A', dark: '#7E5029', light: '#DDAC72' },
};
export const toneFor = (color = '') => (/rich/i.test(color) ? TONES.rich : /honey/i.test(color) ? TONES.honey : TONES.natural);

const Ctx = createContext({ id: 'x', tone: TONES.natural });

export function ArtSvg({ tone = TONES.natural, children, viewBox = '0 0 400 400', label, className, style, preserve = 'xMidYMid meet' }) {
  const id = useId().replace(/[^a-z0-9]/gi, '');
  const lines = [];
  for (let i = 0; i < 11; i++) {
    const y = i * 7.2 + 3;
    lines.push(
      <path key={i} d={`M0 ${y} C 45 ${y - 2 + (i % 3)} 110 ${y + 3 - (i % 2) * 2} 200 ${y + 1}`}
        stroke={i % 2 ? tone.dark : tone.light} strokeOpacity={i % 3 === 0 ? 0.34 : 0.22} strokeWidth={0.7 + (i % 3) * 0.45} fill="none" />,
    );
  }
  return (
    <Ctx.Provider value={{ id, tone }}>
      <svg viewBox={viewBox} preserveAspectRatio={preserve} role="img" aria-label={label} className={className}
        style={{ overflow: 'visible', display: 'block', width: '100%', height: '100%', ...style }}>
        <defs>
          <pattern id={`${id}w`} patternUnits="userSpaceOnUse" width="200" height="80">
            <rect width="200" height="80" fill={tone.mid} />{lines}
            <ellipse cx="128" cy="40" rx="9" ry="3.4" fill="none" stroke={tone.dark} strokeOpacity=".3" />
          </pattern>
          <pattern id={`${id}wg`} patternUnits="userSpaceOnUse" width="200" height="80" patternTransform="scale(3.6) rotate(-4)">
            <rect width="200" height="80" fill={tone.mid} />{lines}
            <ellipse cx="128" cy="40" rx="9" ry="3.4" fill="none" stroke={tone.dark} strokeOpacity=".4" />
          </pattern>
          <linearGradient id={`${id}sh`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".16" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".22" />
          </linearGradient>
          <linearGradient id={`${id}fab`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".28" /><stop offset="1" stopColor="#3a2a18" stopOpacity=".18" />
          </linearGradient>
          <linearGradient id={`${id}wallg`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#E9DFCC" /><stop offset="1" stopColor="#D9CBB2" />
          </linearGradient>
          <linearGradient id={`${id}glow`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFE9BF" stopOpacity=".0" /><stop offset="1" stopColor="#FFE3A8" stopOpacity=".55" />
          </linearGradient>
          <radialGradient id={`${id}spot`} cx=".5" cy=".4" r=".7">
            <stop offset="0" stopColor="#C9A45C" stopOpacity=".38" /><stop offset="1" stopColor="#C9A45C" stopOpacity="0" />
          </radialGradient>
        </defs>
        {children}
      </svg>
    </Ctx.Provider>
  );
}

const useIds = () => useContext(Ctx);

/** Wood block with grain + soft top light. `s` adds shade (>0) or highlight (<0). */
export function Wd({ x, y, w, h, r = 2, s = 0, g = false }) {
  const { id } = useIds();
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={`url(#${id}${g ? 'wg' : 'w'})`} />
      <rect x={x} y={y} width={w} height={h} rx={r} fill={`url(#${id}sh)`} />
      {s !== 0 && <rect x={x} y={y} width={w} height={h} rx={r} fill={s > 0 ? '#1a0e08' : '#fff'} opacity={Math.abs(s)} />}
    </g>
  );
}
export function Fab({ x, y, w, h, r = 6, c = '#D2C4AB' }) {
  const { id } = useIds();
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={c} />
      <rect x={x} y={y} width={w} height={h} rx={r} fill={`url(#${id}fab)`} />
      <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} rx={r} fill="none" stroke="#fff" strokeOpacity=".25" />
    </g>
  );
}
const Knob = ({ x, y }) => <circle cx={x} cy={y} r="2.6" fill="#C9A45C" stroke="#7a5e26" strokeWidth=".5" />;
const Bar = ({ x, y, w = 14 }) => <rect x={x} y={y} width={w} height="2.6" rx="1.3" fill="#C9A45C" stroke="#7a5e26" strokeWidth=".4" />;
const Leg = ({ x, y, w = 9, h, taper = 0 }) => (
  <g>
    <polygon points={`${x},${y} ${x + w},${y} ${x + w - taper},${y + h} ${x + taper},${y + h}`} fill="#4a2b18" />
    <polygon points={`${x},${y} ${x + w * 0.45},${y} ${x + w * 0.45 - taper * 0.5},${y + h} ${x + taper},${y + h}`} fill="#8d5a34" opacity=".55" />
  </g>
);

function Sofa({ n = 3 }) {
  const tw = 80 + n * 72, x0 = 200 - tw / 2;
  return (
    <g>
      <Wd x={x0 + 26} y={112} w={tw - 52} h={10} r={4} />
      {Array.from({ length: n }, (_, i) => <Fab key={`b${i}`} x={x0 + 34 + i * 72} y={120} w={68} h={52} r={9} />)}
      {Array.from({ length: n }, (_, i) => <Fab key={`s${i}`} x={x0 + 32 + i * 72} y={168} w={72} h={30} r={7} c="#D9CCB4" />)}
      <Wd x={x0 + 4} y={148} w={28} h={70} r={4} s={0.04} /><Wd x={x0 + tw - 32} y={148} w={28} h={70} r={4} s={0.04} />
      <Wd x={x0} y={140} w={38} h={10} r={4} s={-0.06} /><Wd x={x0 + tw - 38} y={140} w={38} h={10} r={4} s={-0.06} />
      <Wd x={x0 + 4} y={198} w={tw - 8} h={18} r={3} s={0.08} />
      <Leg x={x0 + 10} y={216} w={12} h={34} taper={2} /><Leg x={x0 + tw - 22} y={216} w={12} h={34} taper={2} />
    </g>
  );
}

function Lounge() {
  return (
    <g>
      <Wd x={136} y={96} w={128} h={96} r={12} s={0.06} />
      <Fab x={148} y={106} w={104} h={72} r={12} />
      <Fab x={146} y={176} w={108} h={28} r={9} c="#D9CCB4" />
      <Wd x={118} y={148} w={26} h={62} r={6} /><Wd x={256} y={148} w={26} h={62} r={6} />
      <Wd x={112} y={140} w={38} h={10} r={5} s={-0.08} /><Wd x={250} y={140} w={38} h={10} r={5} s={-0.08} />
      <Wd x={120} y={204} w={160} h={14} r={3} s={0.08} />
      <Leg x={126} y={218} w={11} h={32} taper={3} /><Leg x={263} y={218} w={11} h={32} taper={3} />
    </g>
  );
}

function Armchair() {
  const { id } = useIds();
  return (
    <g>
      <path d="M140 200 Q136 88 200 88 Q264 88 260 200 Z" fill={`url(#${id}w)`} />
      <path d="M140 200 Q136 88 200 88 Q264 88 260 200 Z" fill={`url(#${id}sh)`} />
      <path d="M152 190 Q150 102 200 102 Q250 102 248 190 Z" fill="#D2C4AB" />
      <path d="M152 190 Q150 102 200 102 Q250 102 248 190 Z" fill={`url(#${id}fab)`} />
      <Fab x={144} y={172} w={112} h={30} r={9} c="#D9CCB4" />
      <Wd x={124} y={150} w={20} h={58} r={5} /><Wd x={256} y={150} w={20} h={58} r={5} />
      <Wd x={122} y={204} w={156} h={12} r={3} s={0.08} />
      <Leg x={130} y={216} w={10} h={34} taper={3} /><Leg x={260} y={216} w={10} h={34} taper={3} />
    </g>
  );
}

function Coffee() {
  return (
    <g>
      <Leg x={104} y={186} w={12} h={64} taper={3} /><Leg x={284} y={186} w={12} h={64} taper={3} />
      <Wd x={118} y={222} w={164} h={8} r={2} s={0.1} />
      <Wd x={84} y={168} w={232} h={18} r={3} g />
      <rect x="150" y="150" width="46" height="8" rx="1" fill="#6f5b45" /><rect x="154" y="158" width="38" height="10" rx="1" fill="#c8b89c" />
      <path d="M254 168 Q246 138 258 128 Q270 138 262 168 Z" fill="#E4DACA" /><path d="M258 128 Q250 108 262 98 M258 130 Q272 112 270 100" stroke="#5f7a4a" strokeWidth="2.2" fill="none" />
    </g>
  );
}

function Nested() {
  return (
    <g>
      <Leg x={110} y={186} w={10} h={64} taper={2} /><Leg x={252} y={186} w={10} h={64} taper={2} />
      <Wd x={96} y={170} w={180} h={16} r={3} g />
      <Leg x={214} y={222} w={9} h={28} taper={2} /><Leg x={308} y={222} w={9} h={28} taper={2} />
      <Wd x={206} y={210} w={120} h={14} r={3} s={0.1} />
    </g>
  );
}

function Tv() {
  return (
    <g>
      <rect x="112" y="84" width="176" height="86" rx="3" fill="#15100d" /><rect x="116" y="88" width="168" height="78" rx="2" fill="#241a14" />
      <path d="M116 88 L200 88 L150 166 L116 166Z" fill="#fff" opacity=".05" /><rect x="188" y="170" width="24" height="8" fill="#15100d" />
      <Wd x={48} y={178} w={304} h={62} r={3} />
      <Wd x={56} y={186} w={92} h={46} r={2} s={0.1} /><Wd x={252} y={186} w={92} h={46} r={2} s={0.1} />
      <rect x="154" y="186" width="92" height="46" rx="2" fill="#1b110b" /><rect x="164" y="212" width="52" height="8" rx="1" fill="#3a2a1e" /><rect x="222" y="206" width="14" height="14" rx="1" fill="#3a2a1e" />
      <Bar x={132} y={205} w={4} /><Bar x={264} y={205} w={4} />
      <Leg x={60} y={240} w={10} h={10} /><Leg x={330} y={240} w={10} h={10} />
    </g>
  );
}

function Bed() {
  return (
    <g>
      <Wd x={64} y={66} w={272} h={116} r={6} />
      <Wd x={78} y={80} w={116} h={88} r={3} s={0.16} /><Wd x={206} y={80} w={116} h={88} r={3} s={0.16} />
      <Fab x={76} y={166} w={248} h={42} r={6} c="#E8DFCF" />
      <Fab x={92} y={148} w={84} h={28} r={12} c="#EFE7D8" /><Fab x={224} y={148} w={84} h={28} r={12} c="#EFE7D8" />
      <Fab x={76} y={186} w={248} h={22} r={4} c="#B8A688" />
      <Wd x={60} y={204} w={280} h={22} r={3} s={0.06} />
      <Leg x={68} y={226} w={16} h={24} /><Leg x={316} y={226} w={16} h={24} />
    </g>
  );
}

function Bedside() {
  return (
    <g>
      <Wd x={124} y={150} w={152} h={10} r={2} s={-0.06} />
      <Wd x={132} y={160} w={136} h={72} r={2} />
      <Wd x={138} y={166} w={124} h={28} r={2} s={0.12} /><Knob x={200} y={180} />
      <rect x="138" y="200" width="124" height="28" rx="2" fill="#1b110b" /><rect x="146" y="210" width="40" height="18" fill="#3a2a1e" />
      <Leg x={138} y={232} w={9} h={18} taper={1} /><Leg x={253} y={232} w={9} h={18} taper={1} />
      <path d="M232 150 L238 118 L262 118 L268 150 Z" fill="#EDE3CF" /><rect x="248" y="150" width="4" height="0" />
    </g>
  );
}

function Wardrobe() {
  return (
    <g>
      <Wd x={96} y={28} w={208} h={212} r={3} s={0.05} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Wd x={104 + i * 65} y={36} w={62} h={196} r={2} s={i === 1 ? -0.04 : 0.06} />
          <rect x={110 + i * 65} y={44} width="50" height="82" rx="1" fill="none" stroke="#2a190f" strokeOpacity=".5" />
          <rect x={110 + i * 65} y={134} width="50" height="90" rx="1" fill="none" stroke="#2a190f" strokeOpacity=".5" />
        </g>
      ))}
      <Bar x={158} y={126} w={2.6} /><rect x="160" y="120" width="2.6" height="16" rx="1.3" fill="#C9A45C" /><rect x="225" y="120" width="2.6" height="16" rx="1.3" fill="#C9A45C" />
      <Wd x={90} y={240} w={220} h={10} r={2} s={0.2} />
    </g>
  );
}

function Dresser() {
  return (
    <g>
      <Wd x={138} y={34} w={124} h={116} r={10} s={0.04} />
      <rect x="150" y="46" width="100" height="92" rx="4" fill="#CFD9DB" /><path d="M150 46 L200 46 L162 138 L150 138Z" fill="#fff" opacity=".35" />
      <Wd x={104} y={158} w={192} h={12} r={2} s={-0.05} />
      <Wd x={112} y={170} w={66} h={54} r={2} /><Wd x={222} y={170} w={66} h={54} r={2} />
      <Wd x={118} y={176} w={54} h={20} r={1} s={0.12} /><Wd x={118} y={200} w={54} h={20} r={1} s={0.12} />
      <Wd x={228} y={176} w={54} h={20} r={1} s={0.12} /><Wd x={228} y={200} w={54} h={20} r={1} s={0.12} />
      <Knob x={145} y={186} /><Knob x={145} y={210} /><Knob x={255} y={186} /><Knob x={255} y={210} />
      <Leg x={116} y={224} w={9} h={26} taper={2} /><Leg x={275} y={224} w={9} h={26} taper={2} />
      <Wd x={160} y={216} w={80} h={6} r={1} s={0.1} />
    </g>
  );
}

function DTable() {
  return (
    <g>
      <Wd x={100} y={166} w={16} h={84} r={2} s={0.04} /><Wd x={284} y={166} w={16} h={84} r={2} s={0.04} />
      <Wd x={116} y={212} w={168} h={8} r={2} s={0.12} />
      <Wd x={52} y={148} w={296} h={20} r={3} g />
      <ellipse cx="170" cy="146" rx="20" ry="4" fill="#EFE8DA" /><ellipse cx="240" cy="146" rx="20" ry="4" fill="#EFE8DA" />
      <path d="M198 148 Q194 126 204 118 Q214 126 210 148 Z" fill="#8a3f2a" opacity=".85" />
    </g>
  );
}

function ChairAt({ x = 0, k = 1 }) {
  return (
    <g transform={`translate(${x} ${250 - 250 * k}) scale(${k})`}>
      <Wd x={148} y={86} w={104} h={9} r={3} />
      {[0, 1, 2, 3, 4].map((i) => <Wd key={i} x={156 + i * 20} y={95} w={9} h={70} r={2} s={0.06} />)}
      <Wd x={144} y={164} w={112} h={12} r={3} s={-0.04} />
      <Leg x={150} y={176} w={9} h={74} taper={2} /><Leg x={241} y={176} w={9} h={74} taper={2} />
      <Wd x={158} y={220} w={84} h={6} r={2} s={0.15} />
    </g>
  );
}
const DChair = () => (<g><ChairAt x={-58} k={0.88} /><ChairAt x={58} k={0.88} /></g>);

function Bench() {
  return (
    <g>
      <Wd x={94} y={196} w={18} h={54} r={2} s={0.06} /><Wd x={288} y={196} w={18} h={54} r={2} s={0.06} />
      <Wd x={112} y={226} w={176} h={8} r={2} s={0.14} />
      <Wd x={70} y={180} w={260} h={18} r={3} g />
    </g>
  );
}

function Cabinet() {
  return (
    <g>
      <Wd x={106} y={26} w={188} h={116} r={3} />
      <rect x="116" y="36" width="168" height="96" rx="2" fill="#1e130c" />
      {[0, 1].map((i) => <ellipse key={i} cx={158 + i * 84} cy="122" rx="24" ry="5" fill="#E7DFCF" />)}
      {[0, 1].map((i) => <rect key={`p${i}`} x={140 + i * 84} y="66" width="36" height="52" rx="3" fill="#E7DFCF" opacity=".9" />)}
      <rect x="116" y="36" width="168" height="96" rx="2" fill="#cfe0e2" opacity=".28" /><rect x="198" y="36" width="4" height="96" fill="#5a3722" />
      <path d="M116 36 L170 36 L128 132 L116 132Z" fill="#fff" opacity=".18" />
      <Wd x={100} y={142} w={200} h={100} r={3} s={0.03} />
      <Wd x={108} y={150} w={90} h={84} r={2} s={0.1} /><Wd x={202} y={150} w={90} h={84} r={2} s={0.1} />
      <Knob x={190} y={190} /><Knob x={210} y={190} />
      <Wd x={96} y={242} w={208} h={8} r={2} s={0.2} />
    </g>
  );
}

function Desk() {
  return (
    <g>
      <rect x="112" y="98" width="86" height="44" rx="3" fill="#20262b" /><rect x="116" y="102" width="78" height="36" rx="1" fill="#5a7a92" opacity=".7" /><path d="M116 102 L170 102 L140 138 L116 138Z" fill="#fff" opacity=".12" />
      <rect x="100" y="140" width="112" height="3" fill="#8b8f94" />
      <Wd x={56} y={142} w={288} h={14} r={2} g />
      <Wd x={70} y={156} w={12} h={94} r={2} /><Wd x={252} y={156} w={84} h={88} r={2} s={0.03} />
      <Wd x={258} y={162} w={72} h={34} r={1} s={0.12} /><Wd x={258} y={202} w={72} h={34} r={1} s={0.12} />
      <Bar x={286} y={176} /><Bar x={286} y={216} />
      <Wd x={252} y={244} w={84} h={6} r={1} s={0.2} />
      <path d="M300 142 L296 112 L318 112 L322 142Z" fill="#EDE3CF" /><rect x="306" y="112" width="4" height="0" />
    </g>
  );
}

function OChair() {
  return (
    <g>
      <Wd x={152} y={72} w={96} h={10} r={5} />
      <Fab x={158} y={80} w={84} h={82} r={14} c="#B9B0A0" />
      <Wd x={138} y={146} w={8} h={40} r={2} /><Wd x={254} y={146} w={8} h={40} r={2} />
      <Wd x={130} y={142} w={26} h={8} r={3} s={-0.08} /><Wd x={244} y={142} w={26} h={8} r={3} s={-0.08} />
      <Fab x={148} y={168} w={104} h={24} r={8} c="#B9B0A0" />
      <Wd x={146} y={192} w={108} h={9} r={2} s={0.08} />
      <rect x="196" y="200" width="8" height="30" fill="#4a2b18" /><Wd x={140} y={230} w={120} h={8} r={4} s={0.12} />
      <Leg x={146} y={238} w={7} h={12} /><Leg x={247} y={238} w={7} h={12} />
    </g>
  );
}

function Bookshelf() {
  const cols = ['#7a2f28', '#2f4a3a', '#c9a45c', '#3b3f5a', '#8a5a34', '#d8ccb6', '#5a2a3a', '#4c5a3a'];
  const shelves = [58, 98, 138, 178, 218];
  return (
    <g>
      <Wd x={124} y={16} w={152} h={234} r={3} s={0.04} />
      <rect x="132" y="24" width="136" height="218" fill="#22140d" />
      {shelves.map((y, si) => (
        <g key={y}>
          {Array.from({ length: si === 4 ? 0 : 9 }, (_, i) => (
            <rect key={i} x={135 + i * 14 + (si % 2) * 2} y={y - 24 + ((i * 7 + si * 3) % 6)} width={11 + (i % 3)} height={24 - ((i * 7 + si * 3) % 6)} fill={cols[(i + si * 3) % cols.length]} opacity=".92" />
          ))}
          <Wd x={128} y={y} w={144} h={6} r={1} s={-0.02} />
        </g>
      ))}
      <Wd x={120} y={242} w={160} h={8} r={2} s={0.2} />
    </g>
  );
}

function Storage() {
  return (
    <g>
      <Wd x={100} y={120} w={200} h={112} r={3} />
      <Wd x={108} y={128} w={90} h={96} r={2} s={0.1} /><Wd x={202} y={128} w={90} h={96} r={2} s={0.1} />
      <Knob x={190} y={172} /><Knob x={210} y={172} />
      <Wd x={96} y={228} w={208} h={8} r={2} s={0.2} />
      <Leg x={106} y={236} w={10} h={14} /><Leg x={284} y={236} w={10} h={14} />
      <rect x="140" y="98" width="46" height="22" rx="1" fill="#c8b89c" /><rect x="146" y="88" width="40" height="10" rx="1" fill="#6f5b45" />
    </g>
  );
}

function Art() {
  return (
    <g>
      <rect x="110" y="52" width="180" height="152" fill="#000" opacity=".16" transform="translate(6 8)" />
      {Array.from({ length: 10 }, (_, i) => <Wd key={i} x={110 + i * 18} y={52} w={17} h={148 + ((i * 5) % 3) * 0} r={1} s={[0.12, -0.02, 0.2, 0.05, -0.08][i % 5]} g={i % 2 === 0} />)}
    </g>
  );
}

function Side() {
  const { id } = useIds();
  return (
    <g>
      <Leg x={140} y={176} w={9} h={74} taper={4} /><Leg x={252} y={176} w={9} h={74} taper={4} />
      <Leg x={192} y={186} w={10} h={64} taper={1} />
      <ellipse cx="200" cy="184" rx="86" ry="14" fill="#3a2115" />
      <rect x="114" y="170" width="172" height="14" fill={`url(#${id}w)`} /><rect x="114" y="170" width="172" height="14" fill={`url(#${id}sh)`} />
      <ellipse cx="200" cy="170" rx="86" ry="14" fill={`url(#${id}wg)`} /><ellipse cx="200" cy="170" rx="86" ry="14" fill="#fff" opacity=".08" />
      <path d="M170 168 Q166 138 176 128 Q186 138 182 168 Z" fill="#E4DACA" />
    </g>
  );
}

function Lamp() {
  const { id } = useIds();
  return (
    <g>
      <circle cx="200" cy="120" r="96" fill={`url(#${id}spot)`} />
      <polygon points="146,84 254,84 236,152 164,152" fill="#EFE5D0" /><polygon points="146,84 200,84 200,152 164,152" fill="#fff" opacity=".28" />
      <rect x="196" y="150" width="8" height="20" fill="#C9A45C" />
      <path d="M182 250 Q158 222 186 196 Q196 186 194 170 L206 170 Q204 186 214 196 Q242 222 218 250 Z" fill={`url(#${id}w)`} />
      <path d="M182 250 Q158 222 186 196 Q196 186 194 170 L206 170 Q204 186 214 196 Q242 222 218 250 Z" fill={`url(#${id}sh)`} />
    </g>
  );
}

function Tray() {
  return (
    <g>
      <Wd x={96} y={220} w={208} h={16} r={7} g />
      <ellipse cx="112" cy="228" rx="9" ry="3" fill="#2a190f" /><ellipse cx="288" cy="228" rx="9" ry="3" fill="#2a190f" />
      <Wd x={124} y={202} w={152} h={16} r={7} s={-0.05} />
      <rect x="160" y="176" width="26" height="26" rx="3" fill="#EFE8DA" /><rect x="212" y="184" width="30" height="18" rx="9" fill="#C9A45C" opacity=".85" />
    </g>
  );
}

export const SHAPES = {
  sofa3: { C: () => <Sofa n={3} />, box: [46, 354, 104, 250] }, sofa2: { C: () => <Sofa n={2} />, box: [66, 334, 104, 250] },
  lounge: { C: () => <Lounge />, box: [110, 290, 90, 250] }, armchair: { C: Armchair, box: [118, 282, 86, 250] },
  coffee: { C: Coffee, box: [84, 316, 96, 250] }, nested: { C: Nested, box: [96, 326, 166, 250] },
  tv: { C: Tv, box: [48, 352, 82, 250] }, bed: { C: Bed, box: [60, 340, 64, 250] },
  bedside: { C: Bedside, box: [124, 276, 116, 250] }, wardrobe: { C: Wardrobe, box: [90, 310, 28, 250] },
  dresser: { C: Dresser, box: [104, 296, 32, 250] }, dtable: { C: DTable, box: [52, 348, 114, 250] },
  dchair: { C: DChair, box: [84, 316, 86, 250] }, bench: { C: Bench, box: [70, 330, 178, 250] },
  cabinet: { C: Cabinet, box: [100, 300, 24, 250] }, desk: { C: Desk, box: [56, 344, 96, 250] },
  ochair: { C: OChair, box: [128, 272, 70, 250] }, bookshelf: { C: Bookshelf, box: [120, 280, 14, 250] },
  storage: { C: Storage, box: [96, 304, 86, 250] }, art: { C: Art, box: [110, 296, 52, 208] },
  side: { C: Side, box: [114, 286, 116, 250] }, lamp: { C: Lamp, box: [146, 254, 82, 250] },
  tray: { C: Tray, box: [96, 304, 172, 238] },
};

export const Shape = ({ type, ...rest }) => {
  const S = (SHAPES[type] || SHAPES.side).C;
  return <g {...rest}><S /></g>;
};

const Plant = ({ x = 0, y = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-16 0 L-12 -34 L12 -34 L16 0 Z" fill="#B7A68B" /><path d="M-16 0 L-12 -34 L-2 -34 L-4 0 Z" fill="#fff" opacity=".18" />
    {[[-24, -84, -30], [-6, -100, -8], [14, -92, 16], [26, -70, 38], [-30, -62, -48]].map(([dx, dy, rot], i) => (
      <path key={i} d="M0 -34 Q-14 -70 0 -100 Q14 -70 0 -34" transform={`translate(${dx / 2.4} 0) rotate(${rot} 0 -34)`} fill={i % 2 ? '#4d6a3f' : '#3f5a34'} />
    ))}
  </g>
);
export { Plant };

const Room = ({ shape, tone }) => (
  <g>
    <rect x="-500" y="-500" width="1400" height="800" fill="#E6DAC5" />
    <rect x="252" y="30" width="110" height="170" rx="2" fill="#F8EFD9" /><rect x="252" y="30" width="110" height="170" fill="none" stroke="#B9A582" strokeWidth="4" />
    <path d="M307 30 V200 M252 115 H362" stroke="#B9A582" strokeWidth="3" />
    <path d="M252 200 L120 320 L360 320 L362 200 Z" fill="#FFE3A8" opacity=".22" />
    <rect x="36" y="62" width="70" height="90" fill="#3A2115" /><rect x="42" y="68" width="58" height="78" fill="#C9B79A" /><path d="M42 146 L70 104 L100 146 Z" fill="#8A6A48" opacity=".55" />
    <rect x="-500" y="300" width="1400" height="500" fill="#7E4E2E" />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x="-500" y={300 + i * 14 + i * i * 0.5} width="1400" height="1.6" fill="#2a190f" opacity=".28" />)}
    <rect x="-500" y="300" width="1400" height="500" fill="#000" opacity=".04" />
    <ellipse cx="200" cy="330" rx="170" ry="24" fill="#CDBA9A" /><ellipse cx="200" cy="328" rx="150" ry="18" fill="none" stroke="#A88F68" strokeOpacity=".6" />
    <Plant x={48} y={300} s={1.1} />
  </g>
);

/** A single product image. `view` picks the composition. */
export function FurnitureArt({ shape = 'side', view = 'front', color, dims, name, className }) {
  const tone = toneFor(color);
  const b = (SHAPES[shape] || SHAPES.side).box;
  const label = `${name || 'Teak furniture'}, ${view} view`;
  const place = 'translate(0 50)';
  if (view === 'grain') {
    return (
      <ArtSvg tone={tone} label={`${name} teak grain close-up`} className={className}>
        <GrainView tone={tone} />
      </ArtSvg>
    );
  }
  const bgFront = (
    <g>
      <rect x="-500" y="-500" width="1400" height="800" fill="#E9E0D1" />
      <rect x="-500" y="-500" width="1400" height="800" fill="url(#frontfade)" />
      <rect x="-500" y="300" width="1400" height="500" fill="#D8CAB4" />
      <ellipse cx="200" cy="304" rx={(b[1] - b[0]) / 1.6} ry="9" fill="#2a190f" opacity=".2" />
    </g>
  );
  return (
    <ArtSvg tone={tone} label={label} className={className}>
      <defs>
        <linearGradient id="frontfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F4EEE2" /><stop offset="1" stopColor="#DFD3BF" /></linearGradient>
      </defs>
      {view === 'lifestyle' && (
        <g><Room />
          <ellipse cx="200" cy="304" rx={(b[1] - b[0]) / 1.5} ry="8" fill="#000" opacity=".25" />
          <g transform={`${place} translate(200 0) scale(.94) translate(-200 0)`}><Shape type={shape} /></g>
          <Plant x={366} y={300} s={0.9} />
        </g>
      )}
      {view === 'front' && (<g>{bgFront}<g transform={place}><Shape type={shape} /></g></g>)}
      {view === 'side' && (
        <g>
          <rect x="-500" y="-500" width="1400" height="800" fill="#2B1A10" /><rect x="-500" y="-500" width="1400" height="800" fill="url(#frontspot)" />
          <defs><radialGradient id="frontspot" cx=".5" cy=".45" r=".55"><stop offset="0" stopColor="#C9A45C" stopOpacity=".3" /><stop offset="1" stopColor="#C9A45C" stopOpacity="0" /></radialGradient></defs>
          <rect x="-500" y="300" width="1400" height="500" fill="#1A0F09" />
          <ellipse cx="200" cy="304" rx={(b[1] - b[0]) / 1.6} ry="9" fill="#000" opacity=".5" />
          <g transform={`${place} translate(400 0) scale(-1 1)`}><Shape type={shape} /></g>
        </g>
      )}
      {view === 'detail' && (
        <g>
          {bgFront}
          <g transform={`translate(200 210) scale(2.1) translate(-200 -${(b[2] + b[3]) / 2 - 40})`}><Shape type={shape} /></g>
        </g>
      )}
      {view === 'dims' && <DimsView shape={shape} b={b} dims={dims} />}
    </ArtSvg>
  );
}

function GrainView({ tone }) {
  const { id } = useIds();
  return (
    <g>
      <rect x="-500" y="-500" width="1400" height="1400" fill={`url(#${id}wg)`} />
      <rect x="-500" y="-500" width="1400" height="1400" fill="#000" opacity=".1" />
      <rect x="-500" y="-500" width="1400" height="1400" fill={`url(#${id}spot)`} opacity=".9" />
      <rect x="-500" y="-500" width="1400" height="1400" fill={`url(#${id}sh)`} opacity=".6" />
    </g>
  );
}

function DimsView({ shape, b, dims }) {
  const [x1, x2, y1, y2] = b;
  const oy = 50;
  const T = (props) => <text fontFamily="Hanken Grotesk Variable, sans-serif" fontSize="13" fill="#3A2115" fontWeight="600" textAnchor="middle" {...props} />;
  return (
    <g>
      <rect x="-500" y="-500" width="1400" height="1400" fill="#F3ECDE" />
      <g stroke="#B9A582" strokeOpacity=".35" strokeWidth=".6">
        {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${-100 + i * 20} -100 V 700 M -100 ${-100 + i * 20} H 700`} />)}
      </g>
      <g transform={`translate(0 ${oy})`} opacity=".92"><Shape type={shape} /></g>
      <g stroke="#6B3E22" strokeWidth="1.2" fill="none">
        <path d={`M${x1} ${y2 + oy + 26} H${x2} M${x1} ${y2 + oy + 20} v12 M${x2} ${y2 + oy + 20} v12`} />
        <path d={`M${x2 + 26} ${y1 + oy} V${y2 + oy} M${x2 + 20} ${y1 + oy} h12 M${x2 + 20} ${y2 + oy} h12`} />
      </g>
      <T x={(x1 + x2) / 2} y={y2 + oy + 46}>{dims?.width ? `${dims.width} ${dims.unit || 'cm'} wide` : ''}</T>
      <T x={x2 + 44} y={(y1 + y2) / 2 + oy} transform={`rotate(90 ${x2 + 44} ${(y1 + y2) / 2 + oy})`}>{dims?.height ? `${dims.height} ${dims.unit || 'cm'} high` : ''}</T>
      <T x={200} y={y1 + oy - 14} fontSize="11" fill="#6B3E22">{dims?.depth ? `Depth ${dims.depth} ${dims.unit || 'cm'}` : ''}</T>
    </g>
  );
}

export { Room };
