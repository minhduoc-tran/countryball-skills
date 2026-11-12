import React from 'react';
import { rnd, Glow } from '../../engine';
import { PAL } from './kit-palette';

// Đà Nẵng beach by day, eye level, fills 0..1920 x 1080 (draw it under the camera group). Pure function of t.
//   <DanangBeach id t drain={0..1} people? />
//   drain 0: calm sea to the shoreline (y 800). drain -> 1: the waterline runs out to the horizon (y 470) and uncovers
//   wet sand -> mud -> rocks + weed -> a dark edge of a drop right at the horizon (visible from drain ~0.93).
//   people: tiny bathers/walkers on the sand [{x, y (feet, >= 830), s?, c? shirt}]; default 4 figures, [] for none.
//   beachWaterlineY(drain) = y of the water's edge (place fish at y > it, boats at y < it). BEACH = { H: 470, SHORE: 800 }.
//   Layout: Sơn Trà mountain on the left horizon (peak 355, 283), hotel strip on the right horizon (x 1020+), palms at
//   x 170 (left, big) and x 1740 (right), parasol at x 1330, sun at (1480, 140).

export const BEACH = { H: 470, SHORE: 800 };
/** y of the water's edge for a drain value (perspective: it covers the last metres quickly). */
export const beachWaterlineY = (drain: number) => BEACH.H + (BEACH.SHORE - BEACH.H) * Math.pow(1 - Math.min(1, Math.max(0, drain)), 1.2);

type Person = { x: number; y: number; s?: number; c?: string };
const DEFAULT_PEOPLE: Person[] = [
  { x: 640, y: 905, s: 1, c: '#E04B3A' },
  { x: 790, y: 960, s: 1.15, c: '#2E86C1' },
  { x: 1120, y: 880, s: 0.85, c: '#F2B632' },
  { x: 1500, y: 940, s: 1.1, c: '#3E9C6B' },
];

const Frond: React.FC<{ x: number; y: number; a: number; len: number; t: number; i: number; col: string }> = ({ x, y, a, len, t, i, col }) => {
  const r = (a * Math.PI) / 180;
  const sw = Math.sin(t / 34 + i * 1.3) * 6;
  const ex = x + Math.cos(r) * len;
  const ey = y + Math.sin(r) * len * 0.5 + len * 0.42 + sw;
  const cx = x + Math.cos(r) * len * 0.55;
  const cy = y + Math.sin(r) * len * 0.5 - len * 0.32 + sw * 0.5;
  return <path d={`M ${x} ${y} Q ${cx} ${cy - 16} ${ex} ${ey} Q ${cx} ${cy + 22} ${x} ${y + 6} Z`} fill={col} stroke="#1F5A33" strokeWidth={2} strokeLinejoin="round" />;
};

const Palm: React.FC<{ x: number; top: number; lean: number; s: number; t: number }> = ({ x, top, lean, s, t }) => (
  <g>
    <path d={`M ${x - 18 * s} 1090 Q ${x + lean * 0.2} ${(1090 + top) / 2} ${x + lean - 6 * s} ${top} L ${x + lean + 8 * s} ${top} Q ${x + lean * 0.3 + 10 * s} ${(1090 + top) / 2} ${x + 18 * s} 1090 Z`} fill="#8A6540" stroke="#4A3320" strokeWidth={3} />
    {Array.from({ length: 9 }).map((_, k) => <path key={k} d={`M ${x - 16 * s + k * 0.4} ${1060 - k * ((1060 - top) / 9)} q ${lean * 0.06 + 14 * s} -6 ${28 * s} 0`} stroke="#4A3320" strokeWidth={2.5} fill="none" opacity={0.5} />)}
    {[-165, -135, -105, -75, -45, -15, 195, 15].map((a, i) => <Frond key={i} x={x + lean} y={top} a={a} len={(190 + (i % 3) * 25) * s} t={t} i={i} col={i % 2 ? '#3E9455' : '#2F7A44'} />)}
    <circle cx={x + lean - 6 * s} cy={top + 14} r={11 * s} fill="#6B4A2A" />
    <circle cx={x + lean + 10 * s} cy={top + 18} r={10 * s} fill="#6B4A2A" />
  </g>
);

const Bather: React.FC<Person & { t: number; k: number }> = ({ x, y, s = 1, c = '#E04B3A', t, k }) => {
  const bob = Math.sin(t / 22 + k * 2) * 1.5;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      <ellipse cx={0} cy={2} rx={22} ry={5} fill="#000" opacity={0.18} />
      <path d="M -6 -34 L -8 0 M 6 -34 L 8 0" stroke="#C48A5E" strokeWidth={6} strokeLinecap="round" />
      <rect x={-12} y={-76} width={24} height={46} rx={10} fill={c} stroke={PAL.ink} strokeWidth={3} />
      <path d="M -12 -66 L -22 -42 M 12 -66 L 22 -42" stroke="#C48A5E" strokeWidth={6} strokeLinecap="round" />
      <circle cx={0} cy={-90} r={13} fill="#D9A070" stroke={PAL.ink} strokeWidth={3} />
      <path d="M -13 -92 Q 0 -108 13 -92 Q 0 -98 -13 -92 Z" fill="#2A1A14" />
    </g>
  );
};

export const DanangBeach: React.FC<{ id: string; t: number; drain?: number; people?: Person[] }> = ({ id, t, drain = 0, people = DEFAULT_PEOPLE }) => {
  const { H, SHORE } = BEACH;
  const wl = beachWaterlineY(drain);
  const LIP = H + 46;
  const crestPath = (y: number, amp: number, ph: number) => {
    let d = `M -60 ${y}`;
    for (let x = -60; x <= 1980; x += 60) d += ` L ${x} ${y + Math.sin(x * 0.011 + ph) * amp}`;
    return d;
  };
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5DB7EA" /><stop offset="0.7" stopColor="#B9E2F5" /><stop offset="1" stopColor="#F2F6EE" />
        </linearGradient>
        <linearGradient id={`${id}sea`} gradientUnits="userSpaceOnUse" x1="0" y1={H} x2="0" y2={SHORE}>
          <stop offset="0" stopColor={PAL.seaDeep} /><stop offset="0.45" stopColor={PAL.seaTop} /><stop offset="1" stopColor="#5BC0DA" />
        </linearGradient>
        <linearGradient id={`${id}gnd`} gradientUnits="userSpaceOnUse" x1="0" y1={H} x2="0" y2={SHORE}>
          <stop offset="0" stopColor={PAL.abyssDeep} /><stop offset="0.15" stopColor="#3A2F27" /><stop offset="0.4" stopColor="#54463A" />
          <stop offset="0.7" stopColor="#6E5C44" /><stop offset="0.9" stopColor={PAL.wet} /><stop offset="1" stopColor="#B7A27C" />
        </linearGradient>
        <linearGradient id={`${id}sand`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F0DDB0" /><stop offset="1" stopColor="#D9BD86" /></linearGradient>
        <linearGradient id={`${id}drop`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6E5A48" /><stop offset="0.25" stopColor={PAL.abyssDeep} /><stop offset="1" stopColor={PAL.abyssTop} /></linearGradient>
        <linearGradient id={`${id}hz`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F2F6EE" stopOpacity="0" /><stop offset="1" stopColor="#F2F6EE" stopOpacity="0.45" /></linearGradient>
        <linearGradient id={`${id}sheen`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" stopOpacity="0.38" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" /></linearGradient>
      </defs>
      <rect x={-100} y={-100} width={2120} height={H + 100} fill={`url(#${id}sky)`} />
      <Glow x={1480} y={140} r={520} o={0.55 + 0.25 * drain} />
      <circle cx={1480} cy={140} r={64} fill="#FFFBE0" />
      {[0, 1, 2, 3].map((i) => {
        const x = ((i * 520 + t * 0.18) % 2300) - 200;
        const y = 120 + (i % 2) * 90 + i * 14;
        return (
          <g key={i} opacity={0.9}>
            <ellipse cx={x} cy={y} rx={110} ry={24} fill="#FFFFFF" /><ellipse cx={x + 50} cy={y - 18} rx={70} ry={26} fill="#FFFFFF" /><ellipse cx={x - 50} cy={y - 10} rx={56} ry={20} fill="#FFFFFF" />
          </g>
        );
      })}
      {/* Sơn Trà, far and near ridge, the little radar dome on the peak */}
      <path d={`M -60 ${H} L -60 370 Q 90 345 210 312 Q 300 270 365 284 Q 450 296 530 338 Q 700 408 900 ${H - 24} Q 960 ${H - 8} 1010 ${H} Z`} fill="#86AEB0" />
      <path d={`M -60 ${H} L -60 410 Q 120 392 240 372 Q 330 350 410 372 Q 560 410 700 ${H - 18} Q 760 ${H - 4} 800 ${H} Z`} fill="#5E9078" />
      <circle cx={362} cy={286} r={6} fill="#F4F1EA" />
      {/* hotel strip on the far right shore */}
      <path d={`M 1000 ${H} Q 1040 ${H - 10} 1100 ${H - 8} L 2000 ${H - 8} L 2000 ${H + 6} Z`} fill="#6E9A6A" />
      {Array.from({ length: 13 }).map((_, i) => {
        const w = 52 + rnd(3, i) * 44;
        const h = 56 + rnd(4, i) * 100;
        const x = 1060 + i * 72 + rnd(5, i) * 14;
        const col = ['#EFE6D6', '#D9E6EC', '#F3DDB8', '#E8C9A8'][i % 4];
        return (
          <g key={i} opacity={0.94}>
            <rect x={x} y={H - 8 - h} width={w} height={h} fill={col} />
            <rect x={x + w * 0.7} y={H - 8 - h} width={w * 0.3} height={h} fill="#000" opacity={0.1} />
            {Array.from({ length: Math.floor(h / 22) }).map((_, r) => <rect key={r} x={x + 7} y={H - 2 - h + r * 22 + 4} width={w * 0.62} height={6} fill="#7FA6BE" opacity={0.7} />)}
          </g>
        );
      })}
      <rect x={-100} y={H - 90} width={2120} height={100} fill={`url(#${id}hz)`} />
      {/* the revealed ground, the drop at the far end, then the sea over it */}
      <rect x={-100} y={H} width={2120} height={SHORE - H + 40} fill={`url(#${id}gnd)`} />
      <rect x={-100} y={H} width={2120} height={LIP - H} fill={`url(#${id}drop)`} />
      <path d={`M -100 ${LIP} ` + Array.from({ length: 36 }).map((_, i) => `L ${-100 + i * 60} ${LIP + (rnd(8, i) - 0.5) * 7}`).join(' ')} stroke="#9A8566" strokeWidth={4} fill="none" />
      {Array.from({ length: 16 }).map((_, i) => {
        const k = 0.12 + rnd(11, i) * 0.8;
        const y = H + (SHORE - H) * k * 0.97 + 22;
        return <ellipse key={`p${i}`} cx={rnd(12, i) * 1920} cy={y} rx={30 + k * 90} ry={2 + k * 7} fill="#CFEAF5" opacity={0.42 * (1 - k * 0.4)} />;
      })}
      {Array.from({ length: 48 }).map((_, i) => {
        const k = 0.1 + rnd(21, i) * 0.85;
        const y = H + 24 + (SHORE - H - 24) * (1 - k) * 0.98;
        const sz = 6 + (y - H) * 0.12 * (0.5 + rnd(22, i));
        const x = rnd(23, i) * 1920;
        return (
          <g key={`r${i}`}>
            <ellipse cx={x} cy={y + sz * 0.45} rx={sz * 1.7} ry={sz * 0.3} fill="#000" opacity={0.3} />
            <ellipse cx={x} cy={y} rx={sz * 1.5} ry={sz * 0.8} fill={i % 3 ? '#5A4D40' : '#6E6050'} stroke={PAL.ink} strokeWidth={1.5} />
            <ellipse cx={x - sz * 0.3} cy={y - sz * 0.3} rx={sz * 0.8} ry={sz * 0.3} fill="#A8987E" opacity={0.45} />
            {i % 3 === 0 ? [0, 1, 2].map((s) => <path key={s} d={`M ${x - sz + s * sz * 0.7} ${y} q ${Math.sin(t / 18 + i + s) * 4} ${-sz * 1.4} ${Math.sin(t / 22 + s) * 5} ${-sz * 2}`} stroke="#3E5A32" strokeWidth={2.6} fill="none" strokeLinecap="round" />) : null}
          </g>
        );
      })}
      {drain < 0.999 ? (
        <g>
          <path d={crestPath(wl, 3, t * 0.07) + ` L 1980 ${H} L -60 ${H} Z`} fill={`url(#${id}sea)`} />
          {Array.from({ length: 9 }).map((_, i) => {
            const p = (t * 0.004 + i / 9) % 1;
            const y = H + (wl - H) * Math.pow(p, 1.7);
            return <path key={i} d={crestPath(y, 1 + p * 6, i * 1.7 + t * 0.05)} stroke="#E8F7FC" strokeWidth={1.4 + p * 4} fill="none" opacity={Math.sin(p * Math.PI) * 0.5} />;
          })}
          {Array.from({ length: 22 }).map((_, i) => {
            const y = H + 6 + rnd(31, i) * Math.max(0, wl - H - 12);
            return <rect key={i} x={rnd(32, i) * 1900} y={y} width={14 + (y - H) * 0.14} height={2.5} rx={1.2} fill="#FFFFFF" opacity={0.5 * Math.max(0, Math.sin(t / 7 + i * 3))} />;
          })}
          <path d={crestPath(wl + Math.sin(t * 0.06) * 6, 4, t * 0.08)} stroke="#FFFFFF" strokeWidth={7} fill="none" opacity={0.85} />
          {drain > 0.01 ? <rect x={-100} y={wl + 3} width={2120} height={38} fill={`url(#${id}sheen)`} /> : null}
        </g>
      ) : null}
      {/* dry sand in front */}
      <path d={`M -100 ${SHORE + 4} Q 500 ${SHORE - 10} 1000 ${SHORE + 4} T 2100 ${SHORE + 4} L 2100 1100 L -100 1100 Z`} fill={`url(#${id}sand)`} />
      <path d={`M -100 ${SHORE + 4} Q 500 ${SHORE - 10} 1000 ${SHORE + 4} T 2100 ${SHORE + 4}`} stroke={PAL.wet} strokeWidth={10} fill="none" opacity={0.55} />
      {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={rnd(41, i) * 1920} cy={SHORE + 30 + rnd(42, i) * 260} r={1.5 + rnd(43, i) * 2} fill="#B99A62" opacity={0.5} />)}
      {/* parasol */}
      <g>
        <path d="M 1332 760 L 1320 940" stroke="#6B4A2A" strokeWidth={7} />
        <path d="M 1190 790 Q 1330 640 1470 790 Z" fill="#E04B3A" stroke={PAL.ink} strokeWidth={3} />
        <path d="M 1285 735 L 1260 790 M 1380 735 L 1400 790 M 1330 715 L 1330 790" stroke="#FFFFFF" strokeWidth={14} opacity={0.9} />
        <ellipse cx={1320} cy={945} rx={90} ry={12} fill="#000" opacity={0.14} />
      </g>
      {people.map((p, i) => <Bather key={i} {...p} t={t} k={i} />)}
      <Palm x={170} top={520} lean={46} s={1.35} t={t} />
      <Palm x={1740} top={610} lean={-34} s={1} t={t + 40} />
    </g>
  );
};
