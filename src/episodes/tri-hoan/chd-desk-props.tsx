import React from 'react';
import {
  Hero, Pose, basePose, faceAt, clamp, easeOut, backOut, reachAngle, LOOKS, Bedroom, Glow, FONT,
} from '../../engine';

// Chapter D props (1/4): the sticky note motif, the timer pill, Pip's desk world (Bedroom + desk + chair + laptop seen
// from the side), the laptop seen from the front with a slide app on its screen. All pure functions of t.

export const PIP = LOOKS.pipHood;
export const NOTE_Y = '#FFE27A';

/** The yellow "MAI LÀM" sticky note, slightly crooked, centred on (x, y), 120 square at s = 1. `peel` 0..1 curls a corner; `cross` 0..1 strikes it out. */
export const Sticky: React.FC<{ x: number; y: number; s?: number; rot?: number; text?: [string, string]; peel?: number; cross?: number; o?: number; color?: string; ink?: string; size?: number }> = ({
  x, y, s = 1, rot = -4, text = ['MAI', 'LÀM'], peel = 0, cross = 0, o = 1, color = NOTE_Y, ink = '#5A3B12', size = 44,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <rect x={-56} y={-52} width={120} height={120} fill="#000" opacity={0.22} />
    <path d={`M -60 -60 L 60 -60 L 60 ${60 - 34 * peel} L ${60 - 34 * peel} 60 L -60 60 Z`} fill={color} />
    <path d={`M -60 -60 L 60 -60 L 60 -46 L -60 -46 Z`} fill="#000" opacity={0.07} />
    {peel > 0 ? <path d={`M 60 ${60 - 34 * peel} L ${60 - 34 * peel} 60 L ${60 - 34 * peel * 1.5} ${60 - 34 * peel * 0.2} Z`} fill="#D9B84E" /> : null}
    <text y={-2} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={size} fill={ink}>{text[0]}</text>
    <text y={42} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={size} fill={ink}>{text[1]}</text>
    {cross > 0 ? <path d={`M -70 -66 L ${-70 + 140 * clamp(cross)} ${-66 + 132 * clamp(cross)}`} stroke="#E0392B" strokeWidth={13} strokeLinecap="round" /> : null}
    {cross > 1 ? <path d={`M 70 -66 L ${70 - 140 * clamp(cross - 1)} ${-66 + 132 * clamp(cross - 1)}`} stroke="#E0392B" strokeWidth={13} strokeLinecap="round" /> : null}
  </g>
);

/** A dark pill with a big mono readout (the genre's timer), centred on (x, y). `ring` (0..1) draws a sweep round it. */
export const TimerPill: React.FC<{ x: number; y: number; text: string; s?: number; color?: string; ring?: number; w?: number }> = ({ x, y, text, s = 1, color = '#FFE27A', ring, w = 360 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-w / 2} y={-80} width={w} height={160} rx={80} fill="#0B0816" opacity={0.82} />
    <rect x={-w / 2} y={-80} width={w} height={160} rx={80} fill="none" stroke={color} strokeWidth={5} opacity={0.9} pathLength={1} strokeDasharray={ring === undefined ? undefined : `${clamp(ring)} 1`} />
    <text y={36} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={112} fill={color} letterSpacing={4}>{text}</text>
  </g>
);

/** A planet disc with soft shading; `ring` adds Saturn's ring. */
export const Planet: React.FC<{ x: number; y: number; r: number; c: string; ring?: boolean }> = ({ x, y, r, c, ring }) => (
  <g transform={`translate(${x} ${y})`}>
    {ring ? <ellipse rx={r * 1.7} ry={r * 0.4} fill="none" stroke="#E9C98A" strokeWidth={r * 0.16} transform="rotate(-18)" /> : null}
    <circle r={r} fill={c} />
    <circle r={r * 0.9} cx={-r * 0.2} cy={-r * 0.2} fill="#FFF" opacity={0.14} />
  </g>
);

const PLANETS: [string, boolean][] = [['#E9A04A', false], ['#C9B58A', false], ['#4A8FD0', false], ['#D2603E', false], ['#E8C27A', true], ['#7FB6C9', false]];

/** The slide app (generic): a title bar with the file name, a column of slide thumbnails, the slide itself. Local size w x h, origin at its top-left. */
export const SlideApp: React.FC<{ w: number; h: number; t: number; text?: string; thumbs?: number; page?: number; caret?: boolean; planetOn?: number }> = ({
  w, h, t, text = '', thumbs = 1, page = 0, caret = true, planetOn = 0,
}) => {
  const tb = h * 0.1;
  const tw = w * 0.22;
  const sx = tw + 18;
  const sw = w - sx - 14;
  const sh = h - tb - 28;
  return (
    <g>
      <rect width={w} height={h} fill="#E9E5DD" />
      <rect width={w} height={tb} fill="#3B3F5C" />
      {[0, 1, 2].map((i) => <circle key={i} cx={20 + i * 22} cy={tb / 2} r={6} fill={['#FF6B5E', '#FFC24A', '#5BE08A'][i]} />)}
      <text x={w / 2} y={tb / 2 + 9} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={Math.max(14, h * 0.045)} fill="#F6EFE3">HỆ MẶT TRỜI.pptx</text>
      <rect y={tb} width={tw} height={h - tb} fill="#CFC9BE" />
      {PLANETS.slice(0, 6).map(([c, ring], i) => {
        const k = backOut(clamp(thumbs - i));
        const th = (h - tb - 20) / 6.3;
        return k > 0 ? (
          <g key={i} transform={`translate(${10} ${tb + 10 + i * (th + 6) + th / 2}) scale(${k}) translate(0 ${-th / 2})`}>
            <rect width={tw - 20} height={th} rx={4} fill="#FFFFFF" stroke={i === Math.floor(thumbs - 0.01) ? '#FF8A3D' : '#A9A396'} strokeWidth={3} />
            <Planet x={(tw - 20) / 2} y={th / 2} r={th * 0.28} c={c} ring={ring} />
          </g>
        ) : null;
      })}
      <rect x={sx} y={tb + 14} width={sw} height={sh} fill="#FFFFFF" stroke="#BDB7AA" strokeWidth={2} />
      <rect x={sx + 24} y={tb + 40} width={sw * 0.5} height={sh * 0.1} fill="#2B2B3A" opacity={text ? 0 : 0.14} />
      <text x={sx + 28} y={tb + 40 + sh * 0.14} fontFamily={FONT.ui} fontWeight={700} fontSize={Math.max(18, sw * 0.052)} fill="#23232F">{text}</text>
      {caret && text !== undefined && Math.floor(t / 8) % 2 === 0 ? <rect x={sx + 28 + text.length * Math.max(18, sw * 0.052) * 0.6} y={tb + 40 + sh * 0.14 - sh * 0.1} width={4} height={sh * 0.12} fill="#FF8A3D" /> : null}
      {planetOn > 0 ? <Planet x={sx + sw * 0.72} y={tb + 14 + sh * 0.66} r={sh * 0.2 * backOut(clamp(planetOn))} c="#E9A04A" ring /> : null}
      {page > 0 ? Array.from({ length: 6 }).map((_, i) => {
        const p = clamp(page * 6 - i);
        return <rect key={i} x={sx + 28} y={tb + 40 + sh * (0.34 + i * 0.09)} width={sw * (i % 3 === 2 ? 0.45 : 0.78) * p} height={sh * 0.035} rx={4} fill="#4A4A5E" opacity={0.75} />;
      }) : null}
    </g>
  );
};

/** The laptop from the front, hinge line at y; `open` (0..1) lifts the lid (a vertical scale about the hinge). Screen content is drawn in the lid's local space (w x h). */
export const LaptopFront: React.FC<{ x: number; y: number; w?: number; open?: number; id: string; glow?: number; children?: (w: number, h: number) => React.ReactNode }> = ({ x, y, w = 900, open = 1, id, glow = 1, children }) => {
  const h = w * 0.62;
  const iw = w - 36;
  const ih = h - 36;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M ${-w / 2 - 50} 0 L ${w / 2 + 50} 0 L ${w / 2 + 90} ${w * 0.05} Q 0 ${w * 0.075} ${-w / 2 - 90} ${w * 0.05} Z`} fill="#8E8A9A" />
      <path d={`M ${-w / 2 - 90} ${w * 0.05} Q 0 ${w * 0.075} ${w / 2 + 90} ${w * 0.05} L ${w / 2 + 90} ${w * 0.062} Q 0 ${w * 0.09} ${-w / 2 - 90} ${w * 0.062} Z`} fill="#5C586A" />
      <rect x={-w * 0.07} y={w * 0.012} width={w * 0.14} height={w * 0.016} rx={6} fill="#6E6A7C" />
      <g transform={`scale(1 ${Math.max(0.02, open)})`}>
        <rect x={-w / 2} y={-h} width={w} height={h} rx={16} fill="#232130" />
        <clipPath id={`${id}lc`}><rect x={-iw / 2} y={-h + 18} width={iw} height={ih} rx={4} /></clipPath>
        <rect x={-iw / 2} y={-h + 18} width={iw} height={ih} rx={4} fill="#0F121C" />
        {open > 0.8 && children ? (
          <g clipPath={`url(#${id}lc)`} opacity={glow}><g transform={`translate(${-iw / 2} ${-h + 18})`}>{children(iw, ih)}</g></g>
        ) : null}
      </g>
      {open > 0.8 ? <Glow x={0} y={-h * 0.5} r={w * 0.8} kind="cool" o={0.28 * glow} /> : null}
    </g>
  );
};

// ---------------- Pip's desk world (side view): Bedroom behind, desk to the right, Pip seated in profile ----------------
export const FLOOR = 800;
export const SEAT_S = 1.4;
export const SEAT_HIP = FLOOR - 68 * SEAT_S - 36;
export const DESK = { x0: 1010, x1: 1640, top: 652 };
export const KEYS = { x: 1220, y: DESK.top - 10 };

export const seatedPip = (extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x: 930, y: SEAT_HIP, scale: SEAT_S, yaw: 0.8, facing: 1, legL: { a: 84, b: -82 }, legR: { a: 78, b: -78 }, armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 }, ...extra,
});

/** Both hands on the keys: a little wobble of the arms is the typing. `rate` 0 = resting. */
export const typingPip = (t: number, extra: Partial<Pose> = {}): Pose => {
  const base = seatedPip(extra);
  const a = reachAngle(base, { x: KEYS.x, y: KEYS.y });
  return { ...base, armR: { a: a - 4 + 4 * Math.sin(t * 1.3), b: 4 }, armL: { a: -(a + 3 + 4 * Math.sin(t * 1.1 + 1)), b: 4 }, headTilt: 3, look: 0.5, ...extra };
};

/** The laptop from the side on the desk, screen toward Pip (to the left); `open` 0..1 swings the lid up. */
export const LaptopSide: React.FC<{ x: number; y: number; open: number; glow?: number; note?: boolean }> = ({ x, y, open, glow = 1, note = false }) => {
  const ang = -90 + 102 * easeOut(clamp(open));
  const L = 118;
  const hx = x + 70;
  const hy = y - 10;
  const ex = hx + Math.sin((ang * Math.PI) / 180) * L;
  const ey = hy - Math.cos((ang * Math.PI) / 180) * L;
  return (
    <g>
      <rect x={x - 82} y={y - 14} width={160} height={14} rx={5} fill="#8E8A9A" />
      <rect x={x - 82} y={y - 3} width={160} height={5} fill="#5C586A" />
      <path d={`M ${hx} ${hy} L ${ex} ${ey}`} stroke="#232130" strokeWidth={11} strokeLinecap="round" />
      <path d={`M ${hx - 5} ${hy} L ${ex - 5} ${ey}`} stroke="#4A4660" strokeWidth={3} strokeLinecap="round" />
      {open > 0.5 ? <Glow x={ex - 40} y={ey + 50} r={190} kind="cool" o={0.5 * glow * clamp((open - 0.5) * 2)} /> : null}
      {note && open > 0.9 ? <Sticky x={ex + 2} y={ey + 38} s={0.3} rot={-5} /> : null}
    </g>
  );
};

/** Bedroom behind a desk, chair and the laptop; children draw above everything (props, UI). Pip is drawn here so it sits behind the desk edge. */
export const DeskWorld: React.FC<{ t: number; id: string; pose?: Pose; face?: ReturnType<typeof faceAt>; open?: number; lamp?: number; veil?: number; note?: boolean; warm?: number; hidePip?: boolean }> = ({
  t, id, pose, face, open = 1, lamp = 1, veil = 0.22, note = false, warm = 0.5, hidePip = false,
}) => {
  const p = pose ?? typingPip(t);
  return (
    <g>
      <Bedroom t={t + 40} id={id} veil={veil} lamp={lamp} crossed={0} clock="21:30" />
      <ellipse cx={1320} cy={FLOOR + 6} rx={360} ry={22} fill="#000" opacity={0.35} />
      <ellipse cx={900} cy={FLOOR + 4} rx={130} ry={14} fill="#000" opacity={0.35} />
      {/* chair */}
      <rect x={846} y={SEAT_HIP - 130} width={16} height={190} rx={6} fill="#6B4B3E" />
      <rect x={852} y={SEAT_HIP + 56} width={170} height={16} rx={7} fill="#7C5846" />
      <rect x={918} y={SEAT_HIP + 70} width={14} height={FLOOR - SEAT_HIP - 70} fill="#4A3A34" />
      {!hidePip ? <Hero look={PIP} pose={{ ...p, ...(face ?? {}) }} rimId="rimR" shadow={0} /> : null}
      {/* desk: top slab, front panel, legs */}
      <rect x={DESK.x0 + 24} y={DESK.top + 14} width={14} height={FLOOR - DESK.top - 14} fill="#4A3426" />
      <rect x={DESK.x1 - 38} y={DESK.top + 14} width={14} height={FLOOR - DESK.top - 14} fill="#4A3426" />
      <rect x={DESK.x0} y={DESK.top} width={DESK.x1 - DESK.x0} height={18} rx={4} fill="#8A6244" />
      <rect x={DESK.x0} y={DESK.top} width={DESK.x1 - DESK.x0} height={5} rx={2} fill="#B58A62" />
      <rect x={DESK.x0 + 30} y={DESK.top + 18} width={DESK.x1 - DESK.x0 - 60} height={36} fill="#5A3E2C" />
      <LaptopSide x={1250} y={DESK.top} open={open} note={note} />
      {/* a mug and a lamp-lit book on the right of the desk */}
      <rect x={1500} y={DESK.top - 38} width={38} height={38} rx={6} fill="#D9534F" />
      <rect x={1380} y={DESK.top - 12} width={90} height={12} fill="#3E8C86" />
      <rect x={1388} y={DESK.top - 22} width={80} height={10} fill="#E9C46A" />
      <Glow x={1250} y={DESK.top - 90} r={420} o={warm} />
      <rect x={-400} y={-400} width={2720} height={1900} fill="#FFA960" opacity={0.2} style={{ mixBlendMode: 'overlay' }} />
    </g>
  );
};
