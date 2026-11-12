import React from 'react';
import { LOOKS, Look, Glow, FONT, rnd, clamp, easeOut } from '../../engine';

// Chapter E: the "things that make the world richer" (school, clinic, well, medical school), a morning-hills
// backdrop, rice, a backpack, nón-lá shoppers, and costumes for the people Pip's money pays (white coat, teacher).

export const COAT: Look = { ...LOOKS.suit, jacket: '#EDEAE0', jacketShade: '#CFCABC', accent: '#3E8C86', limb: '#EDEAE0', hair: '#2A1C18', skin: '#D9B896', skinShade: '#C4A27E', hand: '#D9B896' };
export const TEACHER: Look = { ...LOOKS.mom, jacket: '#4E8AA0', jacketShade: '#3C6E82', accent: '#F2B33D', hair: '#2A2230' };
export const KID_A: Look = { ...LOOKS.sis, jacket: '#F2B33D', jacketShade: '#D4922A', accent: '#E9654B', shoe: '#E9654B' };
export const KID_B: Look = { ...LOOKS.mo, jacket: '#E9654B', jacketShade: '#C7503A', accent: '#F2B33D', shoe: '#2B2F3A' };

/** A morning landscape: sky, a low sun, three rows of hills in daylight greens, drifting clouds. y0 = horizon. */
export const DayHills: React.FC<{ id: string; t: number; y0?: number; sunX?: number; warm?: number; peaks?: boolean }> = ({ id, t, y0 = 600, sunX = 1450, warm = 1, peaks = false }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7FC4E8" />
        <stop offset="0.7" stopColor="#FFE2B4" />
        <stop offset="1" stopColor={warm ? '#FFC98A' : '#FFE9C8'} />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={2720} height={y0 + 420} fill={`url(#${id}sky)`} />
    <circle cx={sunX} cy={y0 - 130} r={70} fill="#FFF1C4" />
    <Glow x={sunX} y={y0 - 130} r={520} o={0.5} />
    {[0, 1, 2].map((i) => {
      const cx = ((i * 760 + t * (0.25 + i * 0.07)) % 3000) - 500;
      return (
        <g key={i} opacity={0.85} transform={`translate(${cx} ${150 + i * 70})`}>
          <ellipse rx={130} ry={30} fill="#fff" /><ellipse cx={-60} cy={-18} rx={70} ry={28} fill="#fff" /><ellipse cx={50} cy={-24} rx={80} ry={30} fill="#fff" />
        </g>
      );
    })}
    {peaks ? (
      <g>
        <path d={`M -400 ${y0 + 20} L -100 ${y0 - 330} L 150 ${y0 - 120} L 520 ${y0 - 420} L 900 ${y0 - 60} L 1250 ${y0 - 360} L 1650 ${y0 - 100} L 2000 ${y0 - 400} L 2400 ${y0 - 80} V ${y0 + 40} Z`} fill="#8FA6C4" />
        <path d={`M 520 ${y0 - 420} l -60 90 l 50 -20 l 40 40 l 30 -50 l 40 20 Z M 1250 ${y0 - 360} l -50 80 l 40 -16 l 36 30 l 26 -44 l 36 18 Z M 2000 ${y0 - 400} l -56 90 l 46 -18 l 40 34 l 28 -50 l 40 20 Z`} fill="#F4F1EC" opacity={0.9} />
        <rect x={-400} y={y0 - 120} width={2800} height={160} fill="#FFE6C4" opacity={0.35} />
      </g>
    ) : null}
    <path d={`M -400 ${y0} Q 200 ${y0 - 190} 700 ${y0 - 40} T 1500 ${y0 - 110} T 2400 ${y0 - 30} V ${y0 + 600} H -400 Z`} fill="#8DBE92" />
    <path d={`M -400 ${y0 + 30} Q 300 ${y0 - 90} 900 ${y0 + 20} T 1800 ${y0 - 40} T 2400 ${y0 + 20} V ${y0 + 600} H -400 Z`} fill="#6DAA77" />
    <path d={`M -400 ${y0 + 90} Q 400 ${y0 + 10} 1000 ${y0 + 90} T 2400 ${y0 + 60} V ${y0 + 600} H -400 Z`} fill="#4F9060" />
  </g>
);

/** A small school: red roof, three windows, a door, a flag on a pole. Origin ground centre, ~320 wide. */
export const School: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={190} ry={14} fill="#000" opacity={0.25} />
    <rect x={-150} y={-150} width={300} height={150} fill="#F4E2B8" stroke="#6B4B2E" strokeWidth={4} />
    <rect x={-150} y={-30} width={300} height={30} fill="#D9BE8A" />
    <path d="M -172 -148 L 0 -226 L 172 -148 Z" fill="#C8483A" stroke="#6E241C" strokeWidth={4} />
    {[-100, 100].map((wx) => <rect key={wx} x={wx - 28} y={-118} width={56} height={52} rx={4} fill="#9AD3EC" stroke="#6B4B2E" strokeWidth={4} />)}
    <rect x={-26} y={-96} width={52} height={96} rx={4} fill="#8A5A3C" stroke="#4A2E20" strokeWidth={4} />
    <circle cx={14} cy={-46} r={4} fill="#F2C48A" />
    <path d="M 0 -250 V -300" stroke="#6B4B2E" strokeWidth={5} />
    <path d={`M 0 -300 q 24 ${-6 + Math.sin(t / 5) * 4} 46 6 q -24 ${6 + Math.sin(t / 5) * 4} -46 8 Z`} fill="#E9654B" />
  </g>
);

/** A village clinic: white walls, a green cross over the door, a little awning. */
export const Clinic: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={160} ry={12} fill="#000" opacity={0.25} />
    <rect x={-120} y={-130} width={240} height={130} fill="#F7F4EC" stroke="#5B6470" strokeWidth={4} />
    <path d="M -136 -128 H 136 L 120 -150 H -120 Z" fill="#3E8C86" stroke="#27605C" strokeWidth={4} />
    <rect x={-22} y={-86} width={44} height={86} rx={4} fill="#9AD3EC" stroke="#5B6470" strokeWidth={4} />
    <path d="M -9 -118 h 18 v -18 h -18 Z" fill="none" />
    <path d="M -8 -142 h 16 v 12 h 12 v 16 h -12 v 12 h -16 v -12 h -12 v -16 h 12 Z" fill="#2FBF71" stroke="#1D7A47" strokeWidth={3} transform="translate(0 6) scale(0.9)" />
    {[-82, 82].map((wx) => <rect key={wx} x={wx - 20} y={-100} width={40} height={40} rx={4} fill="#9AD3EC" stroke="#5B6470" strokeWidth={4} />)}
  </g>
);

/** A village well: a stone ring, a little tiled roof on two posts, a rope and bucket, clear water. */
export const Well: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={110} ry={14} fill="#000" opacity={0.25} />
    <rect x={-70} y={-60} width={140} height={60} fill="#A9A59C" stroke="#5C584F" strokeWidth={4} />
    <ellipse cx={0} cy={-60} rx={70} ry={16} fill="#6EB6D8" stroke="#5C584F" strokeWidth={4} />
    <ellipse cx={-14 + Math.sin(t / 6) * 6} cy={-60} rx={18} ry={4} fill="#fff" opacity={0.5} />
    {[-52, -18, 18, 52].map((bx, i) => <path key={i} d={`M ${bx} -58 V -2`} stroke="#5C584F" strokeWidth={2} opacity={0.5} />)}
    <path d="M -62 -60 V -150 M 62 -60 V -150" stroke="#6B4B2E" strokeWidth={9} />
    <path d="M -90 -146 L 0 -190 L 90 -146 Z" fill="#C8483A" stroke="#6E241C" strokeWidth={4} />
    <path d="M 0 -150 V -90" stroke="#E9D8A0" strokeWidth={3} />
    <path d="M -12 -90 h 24 l -4 22 h -16 Z" fill="#8A5A3C" stroke="#4A2E20" strokeWidth={3} />
  </g>
);

/** A medical school: a wide building with a clock-less pediment, rows of windows and a green cross; `rise` 0..1 builds it up from the ground. */
export const MedSchool: React.FC<{ x: number; y: number; s?: number; rise: number; id: string }> = ({ x, y, s = 1, rise, id }) => {
  const h = 330 * easeOut(clamp(rise));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs><clipPath id={`${id}clip`}><rect x={-300} y={-h - 10} width={600} height={h + 10} /></clipPath></defs>
      <ellipse cx={0} cy={4} rx={330} ry={16} fill="#000" opacity={0.25} />
      <g clipPath={`url(#${id}clip)`}>
        <rect x={-260} y={-300} width={520} height={300} fill="#F1E8D6" stroke="#6B5B46" strokeWidth={5} />
        <rect x={-260} y={-300} width={520} height={34} fill="#D9C9A8" />
        <path d="M -290 -296 L 0 -372 L 290 -296 Z" fill="#B7B0A0" stroke="#6B5B46" strokeWidth={5} />
        {[0, 1, 2].map((r) => [-200, -130, -60, 60, 130, 200].map((wx) => <rect key={`${r}${wx}`} x={wx - 22} y={-250 + r * 74} width={44} height={48} rx={4} fill="#8CCBE6" stroke="#6B5B46" strokeWidth={3} />))}
        <rect x={-40} y={-110} width={80} height={110} rx={5} fill="#7A5236" stroke="#4A2E20" strokeWidth={4} />
        <circle cx={0} cy={-320} r={28} fill="#fff" stroke="#6B5B46" strokeWidth={4} />
        <path d="M -6 -340 h 12 v 14 h 14 v 12 h -14 v 14 h -12 v -14 h -14 v -12 h 14 Z" fill="#2FBF71" />
      </g>
    </g>
  );
};

/** A patch of rice: n stalks of height h swaying; heads droop at the top. Origin at the base centre. */
export const Rice: React.FC<{ x: number; y: number; w: number; h: number; n?: number; t: number; seed?: number; grain?: string }> = ({ x, y, w, h, n = 14, t, seed = 1, grain = '#E9C24A' }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: n }).map((_, i) => {
      const bx = (i / (n - 1) - 0.5) * w + (rnd(seed, i) - 0.5) * 16;
      const hh = h * (0.82 + rnd(seed + 2, i) * 0.3);
      const sw = Math.sin(t / 14 + i * 0.7) * 10;
      return (
        <g key={i}>
          <path d={`M ${bx} 0 Q ${bx + sw * 0.4} ${-hh * 0.6} ${bx + sw + 14} ${-hh}`} stroke="#6FA84A" strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d={`M ${bx + sw + 14} ${-hh} q 26 ${hh * 0.06} 30 ${hh * 0.2}`} stroke={grain} strokeWidth={9} fill="none" strokeLinecap="round" />
        </g>
      );
    })}
  </g>
);

/** A new school backpack on a kid's back (draw it BEFORE the Hero, which hides the strap side). */
export const Backpack: React.FC<{ x: number; y: number; s?: number; color?: string; flip?: boolean }> = ({ x, y, s = 1, color = '#E9654B', flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <rect x={-30} y={-52} width={60} height={92} rx={18} fill={color} stroke="#14121C" strokeWidth={4} />
    <rect x={-22} y={-4} width={44} height={34} rx={9} fill="#fff" opacity={0.2} />
    <path d="M -22 -34 H 22" stroke="#14121C" strokeWidth={4} opacity={0.5} />
    <circle cx={0} cy={-12} r={6} fill="#F2B33D" />
  </g>
);

/** A shopper in profile with a nón lá, facing left; `bob` is a small nod. */
export const Shopper: React.FC<{ x: number; y: number; s?: number; color?: string; bob?: number; flip?: boolean }> = ({ x, y, s = 1, color = '#4A6A8A', bob = 0, flip = false }) => (
  <g transform={`translate(${x} ${y - bob}) scale(${flip ? -s : s} ${s})`} filter="url(#rimL)">
    <path d="M -46 0 Q -50 -150 -6 -190 Q 40 -150 46 0 Z" fill={color} />
    <path d="M -46 0 Q -50 -150 -6 -190 L -6 0 Z" fill="#000" opacity={0.15} />
    <circle cx={-6} cy={-228} r={34} fill="#D9B896" />
    <path d="M -76 -236 L -6 -296 L 64 -236 Q -6 -226 -76 -236 Z" fill="#E9D8A0" stroke="#8A7440" strokeWidth={4} />
    <path d="M -50 -246 Q -6 -270 40 -246" stroke="#8A7440" strokeWidth={3} fill="none" />
  </g>
);

/** A little pop of text in the hand face, for tags. */
export const HandTag: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; rot?: number }> = ({ x, y, text, size = 60, color = '#FFE27A', rot = 0 }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT.hand} fontSize={size} fill={color} stroke="#1A1230" strokeWidth={8} paintOrder="stroke" transform={`rotate(${rot} ${x} ${y})`}>{text}</text>
);
