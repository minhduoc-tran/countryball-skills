import React from 'react';
import { clamp, easeOut, easeInOut, backOut, rnd, FONT, SCH, DrawOn, HEAD } from '../../engine';
import { PAL } from './kit-palette';

// Chapter C, "forgetting" props (pure functions of t; x, y = centre unless said).
//   toScreen(cx, cy, z, p)            world point -> screen point for a camT(cx, cy, z) camera (for screen-space glows).
//   NOTE_LINES                        Pip's loop timetable (the kit Notebook's default lines, copied for write-on).
//   <DuvetTop t />                    full-frame top-down duvet (blue, folds) lit by the desk lamp from the right.
//   <Pencil x y rot s />              a yellow pencil, x y = the tip.
//   <HeadSieve x y s t leak />        schematic head profile (facing right) full of glowing memory dots; leak 0..1
//                                     drains them out through cracks at the back of the skull, falling and fading.
//   <YearRoll x y t to? />            the year counting back 2026 -> to (1885) on a tear-off page (35 frames), blur while fast.
//   <OldPhoto t children />           a full-frame sepia photograph on a dark desk: scalloped white border, vignette.
//   <ScholarHead pose />              (via HeadOverlay) a full grey beard + round spectacles for the 1885 scientist.
//   <SyllableCard x y text rot? s? /> a small cream index card with a nonsense syllable (DAX, BOK...).
//   <ForgetChart t id />              axes NHỚ % / NGÀY, Ebbinghaus's curve drawing on (100% -> ~34% at day 1).
//   SPACED / spacedR(d)               the review model for the spaced chart (reviews at day 0, 1, 3, 7).
//   <PipHeadIcon x y s t />           Pip's hooded head as a chart marker (riding the tip of a curve).
//   <SchGround id t x0 x1 />          the schematic's dark grid over a wide strip (for tracking shots past the frame).

export const toScreen = (cx: number, cy: number, z: number, p: { x: number; y: number }) => ({ x: 960 + (p.x - cx) * z, y: 540 + (p.y - cy) * z });

export const NOTE_LINES = ['06:00 chuông', 'mẹ: ăn sáng', 'Mo: kể chuyện', 'mèo, chậu hoa', '16:00 mưa', 'bà cụ, ngã tư'];

export const DuvetTop: React.FC<{ t: number; id: string; warm?: number }> = ({ t, id, warm = 1 }) => (
  <g>
    <defs>
      <radialGradient id={`${id}lamp`} cx="0.78" cy="0.25" r="0.85">
        <stop offset="0" stopColor="#FFD9A0" stopOpacity={0.55 * warm} />
        <stop offset="0.5" stopColor="#FFB98A" stopOpacity={0.16 * warm} />
        <stop offset="1" stopColor="#000" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect x={-200} y={-200} width={2320} height={1480} fill="#3E4C7A" />
    {/* soft folds across the duvet */}
    {Array.from({ length: 7 }).map((_, k) => (
      <path key={k} d={`M -200 ${80 + k * 170 + rnd(3, k) * 40} Q 700 ${40 + k * 170 + rnd(4, k) * 90} 2120 ${120 + k * 170}`} stroke="#2E3A62" strokeWidth={34 + rnd(5, k) * 24} fill="none" opacity={0.55} />
    ))}
    {Array.from({ length: 7 }).map((_, k) => (
      <path key={`h${k}`} d={`M -200 ${60 + k * 170 + rnd(3, k) * 40} Q 700 ${20 + k * 170 + rnd(4, k) * 90} 2120 ${100 + k * 170}`} stroke="#6A7AAE" strokeWidth={6} fill="none" opacity={0.35} />
    ))}
    <rect x={-200} y={-200} width={2320} height={1480} fill={`url(#${id}lamp)`} style={{ mixBlendMode: 'screen' }} />
    <rect x={-200} y={-200} width={2320} height={1480} fill="#05040C" opacity={0.18 + 0.02 * Math.sin(t / 20)} />
  </g>
);

export const Pencil: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = -35, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 0 L 22 -9 L 22 9 Z" fill="#E9C9A0" stroke="#1D2033" strokeWidth={3} strokeLinejoin="round" />
    <path d="M 0 0 L 8 -3.3 L 8 3.3 Z" fill="#1D2033" />
    <rect x={22} y={-9} width={210} height={18} fill="#F2B33D" stroke="#1D2033" strokeWidth={3} />
    <rect x={22} y={-9} width={210} height={6} fill="#FFD77A" />
    <rect x={232} y={-10} width={22} height={20} fill="#B9B4AA" stroke="#1D2033" strokeWidth={3} />
    <rect x={254} y={-10} width={26} height={20} rx={5} fill="#E8706A" stroke="#1D2033" strokeWidth={3} />
  </g>
);

// a head in profile facing right: crown, brow, nose, chin, jaw, neck (local units, ~300 tall at s 1)
const HEAD_D = 'M -40 150 L -40 100 Q -110 80 -112 -10 Q -114 -130 -10 -150 Q 90 -160 120 -60 Q 128 -30 124 -4 L 150 30 Q 154 40 140 42 L 132 44 Q 136 62 128 70 Q 136 80 124 92 Q 100 110 66 100 L 60 150';

export const HeadSieve: React.FC<{ x: number; y: number; s?: number; t: number; leak: number }> = ({ x, y, s = 1, t, leak }) => {
  const dots = 26;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={HEAD_D} fill="#16243A" stroke={SCH.line} strokeWidth={6} strokeLinejoin="round" />
      {/* cracks at the back of the skull, opening as the leak starts */}
      <path d="M -108 -70 L -96 -48 L -110 -26 L -98 -2 L -112 20 L -100 44 L -108 62" stroke="#0A1220" strokeWidth={14} fill="none" opacity={clamp(leak * 5)} strokeLinejoin="round" />
      <path d="M -108 -70 L -96 -48 L -110 -26 L -98 -2 L -112 20 L -100 44 L -108 62" stroke={SCH.live} strokeWidth={4} fill="none" opacity={clamp(leak * 5)} strokeLinejoin="round" />
      {Array.from({ length: dots }).map((_, i) => {
        const hx = -70 + rnd(11, i) * 150;
        const hy = -110 + rnd(12, i) * 150;
        const k = clamp((leak - (i / dots) * 0.7) / 0.3);
        // drift to the back of the head, then fall out of it
        const ex = -120 - rnd(13, i) * 60;
        const fx = hx + (ex - hx) * easeInOut(clamp(k * 2));
        const fy = hy + (k > 0.5 ? (k - 0.5) * 2 * (260 + rnd(14, i) * 120) : 0) + (ex - hx) * 0;
        const tw = 0.6 + 0.4 * Math.sin(t / 5 + i);
        return <circle key={i} cx={fx} cy={fy} r={7 + rnd(15, i) * 6} fill={PAL.cyan} opacity={(1 - clamp((k - 0.5) * 2)) * tw} style={{ filter: `drop-shadow(0 0 6px ${PAL.cyan})` }} />;
      })}
    </g>
  );
};

export const YearRoll: React.FC<{ x: number; y: number; t: number; s?: number; to?: number }> = ({ x, y, t, s = 1, to = 1885 }) => {
  const p = easeOut(clamp((t - 2) / 26));
  const year = Math.round(2026 - (2026 - to) * p);
  const speed = t > 2 && t < 26 ? 1 - p : 0;
  const land = t >= 28 ? 1 + 0.1 * Math.exp(-(t - 28) / 3) * Math.cos((t - 28) * 1.5) : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * land})`}>
      {/* the page stack behind, pages flicking up as the years run back */}
      {[3, 2, 1].map((k) => <rect key={k} x={-330 + k * 6} y={-230 + k * 8} width={660} height={460} rx={18} fill={k % 2 ? '#D8CDB0' : '#E6DCC2'} stroke="#3A2E22" strokeWidth={4} />)}
      <rect x={-330} y={-230} width={660} height={460} rx={18} fill="#F1E7CF" stroke="#3A2E22" strokeWidth={5} />
      <rect x={-330} y={-230} width={660} height={90} rx={18} fill="#B8483E" />
      <rect x={-330} y={-160} width={660} height={20} fill="#B8483E" />
      {[-200, -70, 70, 200].map((cx) => <circle key={cx} cx={cx} cy={-200} r={12} fill="#2A1E18" />)}
      <text x={0} y={-168} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill="#F6EFE3" letterSpacing={8}>NĂM</text>
      <g style={speed > 0.05 ? { filter: `blur(${speed * 4}px)` } : undefined}>
        <text x={0} y={110} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={230} fill="#2A1E18">{year}</text>
      </g>
      {/* flicking page corners while it runs */}
      {speed > 0.05 ? <path d={`M 330 ${-140 + ((t * 40) % 300)} q -80 30 -140 120`} stroke="#3A2E22" strokeWidth={4} fill="none" opacity={0.5 * speed} /> : null}
    </g>
  );
};

export const OldPhoto: React.FC<{ t: number; id: string; children: React.ReactNode }> = ({ t, id, children }) => (
  <g>
    <defs>
      <clipPath id={`${id}clip`}><rect x={330} y={130} width={1260} height={800} /></clipPath>
      <radialGradient id={`${id}vig`} cx="0.5" cy="0.5" r="0.62">
        <stop offset="0.55" stopColor="#2A1A0E" stopOpacity={0} />
        <stop offset="1" stopColor="#2A1A0E" stopOpacity={0.85} />
      </radialGradient>
    </defs>
    {/* the dark desk it lies on */}
    <rect x={-200} y={-200} width={2320} height={1480} fill="#1A120E" />
    <circle cx={960} cy={500} r={900} fill="#3A2A1E" opacity={0.6} />
    <g transform={`rotate(${-2 + 0.3 * Math.sin(t / 30)} 960 540)`}>
      <rect x={300} y={100} width={1320} height={860} fill="#000" opacity={0.4} transform="translate(14 18)" />
      <rect x={300} y={100} width={1320} height={860} fill="#EFE6D2" />
      {/* scalloped edge */}
      {Array.from({ length: 44 }).map((_, k) => <circle key={`a${k}`} cx={300 + k * 30.7} cy={100} r={9} fill="#1A120E" />)}
      {Array.from({ length: 44 }).map((_, k) => <circle key={`b${k}`} cx={300 + k * 30.7} cy={960} r={9} fill="#1A120E" />)}
      <g clipPath={`url(#${id}clip)`}>
        {children}
        {/* the sepia: a warm brown multiply, then a faded lift, the vignette, a few scratches */}
        <rect x={330} y={130} width={1260} height={800} fill="#B08A5A" style={{ mixBlendMode: 'color' }} opacity={0.85} />
        <rect x={330} y={130} width={1260} height={800} fill="#E8D2A8" opacity={0.14} />
        <rect x={330} y={130} width={1260} height={800} fill={`url(#${id}vig)`} />
        {[0, 1, 2].map((k) => <path key={k} d={`M ${500 + rnd(41, k) * 900} 130 l ${(rnd(42, k) - 0.5) * 60} 800`} stroke="#F4E6C8" strokeWidth={2} opacity={0.12} />)}
      </g>
    </g>
  </g>
);

/** The scientist's beard and spectacles, drawn in the rig's head space (use inside <HeadOverlay>). */
export const ScholarBits: React.FC<{ yaw: number }> = ({ yaw }) => {
  const ay = Math.min(1, Math.abs(yaw));
  const sx = 1 - 0.28 * ay;
  const fx = yaw * 30;
  return (
    <g>
      <g transform={`translate(${fx} 0) scale(${sx} 1)`}>
        {/* a full beard round the jaw, the mouth hidden in it */}
        <path d={`M -54 ${HEAD.y + 6} Q -58 ${HEAD.y + 84} 0 ${HEAD.y + 104} Q 58 ${HEAD.y + 84} 54 ${HEAD.y + 6} Q 40 ${HEAD.y + 40} 0 ${HEAD.y + 34} Q -40 ${HEAD.y + 40} -54 ${HEAD.y + 6} Z`} fill="#8E8A90" stroke="#2A2630" strokeWidth={4} strokeLinejoin="round" />
        <path d={`M -20 ${HEAD.y + 56} Q 0 ${HEAD.y + 70} 20 ${HEAD.y + 56} M -30 ${HEAD.y + 76} Q 0 ${HEAD.y + 92} 30 ${HEAD.y + 76}`} stroke="#6A666E" strokeWidth={3} fill="none" />
        <path d={`M -24 ${HEAD.y + 28} Q 0 ${HEAD.y + 18} 24 ${HEAD.y + 28}`} stroke="#8E8A90" strokeWidth={9} fill="none" strokeLinecap="round" />
        {/* round spectacles */}
        {[-21, 21].map((cx) => (ay > 0.72 && Math.sign(cx) === (yaw > 0 ? -1 : 1) ? null : <circle key={cx} cx={cx} cy={HEAD.y - 4} r={15} fill="#FFFFFF" fillOpacity={0.1} stroke="#2A2630" strokeWidth={3.5} />))}
        {ay <= 0.72 ? <path d={`M -6 ${HEAD.y - 6} L 6 ${HEAD.y - 6}`} stroke="#2A2630" strokeWidth={3.5} /> : null}
      </g>
      {/* receding grey hair at the sides */}
      <path transform={`translate(${-yaw * 14} 0)`} d={`M -62 ${HEAD.y - 4} Q -66 ${HEAD.y - 44} -44 ${HEAD.y - 52} L -40 ${HEAD.y - 20} Z M 62 ${HEAD.y - 4} Q 66 ${HEAD.y - 44} 44 ${HEAD.y - 52} L 40 ${HEAD.y - 20} Z`} fill="#8E8A90" />
    </g>
  );
};

export const SyllableCard: React.FC<{ x: number; y: number; text: string; rot?: number; s?: number; o?: number }> = ({ x, y, text, rot = 0, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <rect x={-92} y={-56} width={184} height={112} rx={8} fill="#000" opacity={0.3} transform="translate(6 8)" />
    <rect x={-92} y={-56} width={184} height={112} rx={8} fill="#F4EEDF" stroke="#3A2E22" strokeWidth={4} />
    <path d="M -80 -32 L 80 -32" stroke="#C8382E" strokeWidth={2} opacity={0.6} />
    <text x={0} y={30} textAnchor="middle" fontFamily={FONT.hand} fontSize={62} fill="#22315A">{text}</text>
  </g>
);

// ---------- charts ----------
/** Chart frame: origin and scale. Days on x (0..days), memory % on y (0..100). */
export const chartXY = (c: { x0: number; y0: number; w: number; h: number; days: number }, d: number, r: number) => ({ x: c.x0 + (d / c.days) * c.w, y: c.y0 - (r / 100) * c.h });

// Ebbinghaus (1885) savings, as days -> %: 20 min 58, 1 h 44, 9 h 36, 1 day 34, 2 days 28, 6 days 25
const EBB: [number, number][] = [[0, 100], [0.014, 58], [0.042, 44], [0.375, 36], [1, 34], [2, 28], [6, 25]];
/** Smooth-ish interpolation of the Ebbinghaus points. */
export const ebb = (d: number) => {
  for (let i = 0; i < EBB.length - 1; i++) {
    const [a, ra] = EBB[i];
    const [b, rb] = EBB[i + 1];
    if (d <= b) {
      const k = (d - a) / (b - a);
      return ra + (rb - ra) * (1 - Math.pow(1 - k, 1.6));
    }
  }
  return EBB[EBB.length - 1][1];
};

export const ChartAxes: React.FC<{ c: { x0: number; y0: number; w: number; h: number; days: number }; t: number; ticks: number[]; unit?: string }> = ({ c, t, ticks, unit = 'NGÀY' }) => {
  const a = easeOut(clamp(t / 8));
  return (
    <g opacity={a}>
      <path d={`M ${c.x0} ${c.y0 - c.h - 30} L ${c.x0} ${c.y0} L ${c.x0 + c.w + 40} ${c.y0}`} stroke={SCH.line} strokeWidth={6} fill="none" strokeLinecap="round" />
      {[100, 50].map((r) => (
        <g key={r}>
          <path d={`M ${c.x0 - 14} ${c.y0 - (r / 100) * c.h} L ${c.x0 + c.w} ${c.y0 - (r / 100) * c.h}`} stroke={SCH.dim} strokeWidth={2} strokeDasharray="10 12" opacity={0.6} />
          <text x={c.x0 - 26} y={c.y0 - (r / 100) * c.h + 14} textAnchor="end" fontFamily={FONT.ui} fontSize={38} fill={SCH.dim}>{`${r}%`}</text>
        </g>
      ))}
      {ticks.map((d) => (
        <g key={d}>
          <path d={`M ${chartXY(c, d, 0).x} ${c.y0} l 0 16`} stroke={SCH.line} strokeWidth={4} />
          <text x={chartXY(c, d, 0).x} y={c.y0 + 58} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill={SCH.dim}>{d}</text>
        </g>
      ))}
      <text x={c.x0 + c.w + 40} y={c.y0 + 108} textAnchor="end" fontFamily={FONT.ui} fontSize={34} fill={SCH.dim} letterSpacing={3}>{unit}</text>
      <text x={c.x0 + 20} y={c.y0 - c.h - 40} fontFamily={FONT.ui} fontSize={38} fill={SCH.line} letterSpacing={4}>NHỚ</text>
    </g>
  );
};

/** Path of f(d) over [d0, d1] in chart space. */
export const curveD = (c: { x0: number; y0: number; w: number; h: number; days: number }, f: (d: number) => number, d0: number, d1: number, n = 80) =>
  Array.from({ length: n + 1 }).map((_, i) => {
    const d = d0 + ((d1 - d0) * i) / n;
    const p = chartXY(c, d, f(d));
    return `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }).join(' ');

// spaced review: reviews at day 0, 1, 3, 7; each decay is slower (tau grows) and floors higher
export const SPACED = [{ d: 0, tau: 0.47, floor: 25 }, { d: 1, tau: 1.6, floor: 45 }, { d: 3, tau: 4.5, floor: 62 }, { d: 7, tau: 14, floor: 75 }];
export const spacedR = (d: number) => {
  let k = 0;
  for (let i = 0; i < SPACED.length; i++) if (d >= SPACED[i].d) k = i;
  const s = SPACED[k];
  return s.floor + (100 - s.floor) * Math.exp(-(d - s.d) / s.tau);
};

export const CurveDraw: React.FC<{ d: string; t: number; dur: number; color?: string; width?: number }> = ({ d, t, dur, color = SCH.live, width = 9 }) => (
  <g style={{ filter: `drop-shadow(0 0 12px ${color}aa)` }}>
    <DrawOn d={d} t={t} dur={dur} color={color} width={width} />
  </g>
);

export const Pop: React.FC<{ t: number; x: number; y: number; children: React.ReactNode }> = ({ t, x, y, children }) =>
  t < 0 ? null : <g transform={`translate(${x} ${y}) scale(${backOut(clamp(t / 8))})`} opacity={clamp(t / 3)}>{children}</g>;

export const SchGround: React.FC<{ id: string; t: number; x0: number; x1: number }> = ({ id, t, x0, x1 }) => (
  <g>
    <defs>
      <pattern id={`${id}g`} width={40} height={40} patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke={SCH.grid} strokeWidth={1.5} />
      </pattern>
      <pattern id={`${id}g5`} width={200} height={200} patternUnits="userSpaceOnUse">
        <path d="M 200 0 L 0 0 0 200" fill="none" stroke={SCH.grid} strokeWidth={3} />
      </pattern>
    </defs>
    <rect x={x0} y={-600} width={x1 - x0} height={2400} fill={SCH.ground} />
    <g transform={`translate(${(t * 0.4) % 40} 0)`}>
      <rect x={x0 - 40} y={-600} width={x1 - x0 + 40} height={2400} fill={`url(#${id}g)`} />
      <rect x={x0 - 40} y={-600} width={x1 - x0 + 40} height={2400} fill={`url(#${id}g5)`} />
    </g>
  </g>
);

export const PipHeadIcon: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(t / 6) * 6})`}>
    <circle r={46} fill={PAL.cyan} opacity={0.25} style={{ filter: `drop-shadow(0 0 16px ${PAL.cyan})` }} />
    <circle r={36} fill="#2E2B3D" stroke="#121019" strokeWidth={4} />
    <circle cx={4} cy={3} r={27} fill="#F6EFE3" />
    <circle cx={-5} cy={0} r={4} fill="#1D2033" />
    <circle cx={13} cy={0} r={4} fill="#1D2033" />
    <path d="M -2 13 Q 5 18 12 13" stroke="#1D2033" strokeWidth={3} fill="none" strokeLinecap="round" />
  </g>
);
