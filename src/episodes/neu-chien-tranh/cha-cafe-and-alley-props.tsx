import React from 'react';
import { FONT, clamp, backOut, rnd, Street, Glow, LOOKS } from '../../engine';

// Chapter A props, part 1: the sunny-Sunday world. A blurred street behind a low plastic cafe table, iced milk coffee
// glasses, the calendar of identical days, silhouetted runners (crowd, drawn from behind so they have no faces), and
// the thin smoke column far on the horizon. Pure functions of the shot clock.

export const PIP = LOOKS.pipHood;
export const MO = LOOKS.mo;
export const SIS = LOOKS.sis;
export const MOM = LOOKS.mom;

/** The street, soft and warm, as the background of a cafe medium: the camera sits on the cafe sidewalk. */
export const CafeBack: React.FC<{ t: number; id: string; blur?: number }> = ({ t, id, blur = 10 }) => (
  <g>
    <g filter={`url(#blur${blur})`}>
      <Street t={t} id={id} market={0.6} veil={0.22} />
      <rect x={-400} y={-300} width={2720} height={1700} fill="#FFC890" opacity={0.16} style={{ mixBlendMode: 'screen' }} />
    </g>
    <Glow x={960} y={470} r={700} o={0.3} />
  </g>
);

/** A low plastic cafe table: a blue drum with a lighter top; `y` is the top's centre line, `w` its width. Draw AFTER
 * the seated people so the drum hides their hips and legs. */
export const CafeTable: React.FC<{ x: number; y: number; w?: number; h?: number; id: string }> = ({ x, y, w = 560, h = 300, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}drum`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#2C5C9A" />
        <stop offset="0.55" stopColor="#3A7AC8" />
        <stop offset="1" stopColor="#25507F" />
      </linearGradient>
    </defs>
    <ellipse cx={x} cy={y + h} rx={w * 0.5} ry={26} fill="#000" opacity={0.3} />
    <path d={`M ${x - w * 0.46} ${y} L ${x - w * 0.5} ${y + h} Q ${x} ${y + h + 40} ${x + w * 0.5} ${y + h} L ${x + w * 0.46} ${y} Z`} fill={`url(#${id}drum)`} />
    <ellipse cx={x} cy={y} rx={w * 0.5} ry={32} fill="#8FB8EA" />
    <ellipse cx={x} cy={y + 4} rx={w * 0.47} ry={27} fill="#6FA0DC" />
    <path d={`M ${x - w * 0.3} ${y - 6} Q ${x} ${y - 20} ${x + w * 0.3} ${y - 6}`} stroke="#C8E0FF" strokeWidth={4} fill="none" opacity={0.6} strokeLinecap="round" />
  </g>
);

/** A glass of cà phê sữa đá: condensed milk at the bottom, coffee, ice, a straw. `x y` = base centre; 100 wide x 160 tall at s = 1. */
export const IcedCoffee: React.FC<{ x: number; y: number; s?: number; t?: number; tilt?: number }> = ({ x, y, s = 1, t = 0, tilt = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={56} ry={9} fill="#000" opacity={0.3} />
    <path d="M -46 0 L -54 -160 L 54 -160 L 46 0 Z" fill="#FFFFFF" opacity={0.28} />
    <path d="M -44 -2 L -48 -34 L 48 -34 L 44 -2 Z" fill="#F4E6C8" />
    <path d="M -48 -34 L -52 -138 L 52 -138 L 48 -34 Z" fill="#6B3E22" />
    <path d="M -48 -34 L -50 -64 L 50 -64 L 48 -34 Z" fill="#9A6A40" opacity={0.7} />
    {[[-22, -100, 8], [18, -112, -12], [-4, -76, 20], [26, -86, 6]].map(([cx, cy, r], i) => (
      <rect key={i} x={cx - 17} y={cy - 17 + Math.sin(t / 9 + i * 1.7) * 2.5} width={34} height={34} rx={6} fill="#FFF6E6" opacity={0.7} transform={`rotate(${r} ${cx} ${cy})`} />
    ))}
    <path d="M -54 -160 L -48 -34" stroke="#FFFFFF" strokeWidth={5} opacity={0.5} />
    <path d="M 18 -142 L 40 -212" stroke="#E0584A" strokeWidth={9} strokeLinecap="round" />
    <ellipse cx={0} cy={-160} rx={54} ry={8} fill="#FFFFFF" opacity={0.35} />
  </g>
);

/** A calendar of identical days: a grid of the same sunny tile, ticked off one after another from t0. */
export const DayCalendar: React.FC<{ x: number; y: number; t: number; t0?: number; every?: number }> = ({ x, y, t, t0 = 4, every = 1.3 }) => {
  const cols = 8;
  const rows = 5;
  const w = 150;
  const h = 130;
  const ticked = Math.floor(Math.max(0, t - t0) / every);
  return (
    <g transform={`translate(${x - (cols * w) / 2} ${y - (rows * h) / 2})`}>
      {Array.from({ length: cols * rows }).map((_, i) => {
        const cx = (i % cols) * w + w / 2;
        const cy = Math.floor(i / cols) * h + h / 2;
        const done = i < ticked;
        const pop = i === ticked - 1 ? backOut(clamp(((t - t0) / every - i) * 2)) : 1;
        return (
          <g key={i} transform={`translate(${cx} ${cy})`}>
            <rect x={-w / 2 + 8} y={-h / 2 + 8} width={w - 16} height={h - 16} rx={14} fill="#FFF3DC" stroke="#C9A46A" strokeWidth={4} />
            <circle cx={0} cy={-6} r={20} fill="#FFC94A" />
            {Array.from({ length: 8 }).map((_, k) => (
              <path key={k} d="M 0 -34 L 0 -42" transform={`rotate(${k * 45} 0 -6)`} stroke="#FFC94A" strokeWidth={5} strokeLinecap="round" />
            ))}
            <text y={40} textAnchor="middle" fontFamily={FONT.hand} fontSize={30} fill="#8A6A3A">CN</text>
            {done ? (
              <path d="M -26 -4 L -6 18 L 28 -26" stroke="#4CA86A" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" fill="none" transform={`scale(${pop})`} opacity={0.9} />
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

/** A person seen from behind, running: no face, dark flat colour. `x y` = feet; ~170 tall at s = 1. */
export const RunnerSil: React.FC<{ x: number; y: number; s?: number; phase: number; dir?: 1 | -1; color?: string; bag?: boolean }> = ({ x, y, s = 1, phase, dir = 1, color = '#2B2540', bag = false }) => {
  const a = Math.sin(phase) * 30;
  const bob = Math.abs(Math.cos(phase)) * 5;
  return (
    <g transform={`translate(${x} ${y - bob * s}) scale(${dir * s} ${s})`}>
      <ellipse cx={0} cy={bob * s} rx={42} ry={7} fill="#000" opacity={0.25} />
      <path d={`M -10 -80 L ${-10 + a * 0.9} 0 M 10 -80 L ${10 - a * 0.9} 0`} stroke={color} strokeWidth={17} strokeLinecap="round" />
      <path d={`M 0 -150 L ${-24 - a * 0.5} -105 M 0 -150 L ${24 + a * 0.5} -105`} stroke={color} strokeWidth={13} strokeLinecap="round" />
      <path d="M -22 -82 Q -26 -150 0 -154 Q 26 -150 22 -82 Z" fill={color} />
      <circle cx={0} cy={-176} r={22} fill={color} />
      {bag ? <rect x={-20} y={-148} width={40} height={52} rx={10} fill="#4A3A6A" /> : null}
    </g>
  );
};

/** A thin column of smoke far on the horizon (x y = its base): grey-brown, drifting, ~`h` tall, thin. Never an explosion. */
export const SmokeColumn: React.FC<{ x: number; y: number; h?: number; t: number; o?: number }> = ({ x, y, h = 300, t, o = 0.7 }) => (
  <g opacity={o} filter="url(#blur6)">
    {Array.from({ length: 16 }).map((_, i) => {
      const k = i / 15;
      const sway = Math.sin(t / 26 + k * 3.2) * 16 * k + k * k * 30;
      const rise = ((t * 0.5 + i * 14) % 14) * 0.2;
      return <ellipse key={i} cx={x + sway} cy={y - k * h - rise} rx={8 + k * 24} ry={15 + k * 9} fill={k > 0.6 ? '#4A3A52' : '#34283E'} opacity={0.95 - k * 0.3} />;
    })}
  </g>
);

/** Heads turning: small helper for the bar of cafe customers behind the table (pure silhouettes with a phone glow). */
export const CafeGuest: React.FC<{ x: number; y: number; s?: number; seed: number; glow?: number; turn?: number }> = ({ x, y, s = 1, seed, glow = 0, turn = 0 }) => {
  const col = ['#5B4A6E', '#6E4A4A', '#3E5A6E', '#5A6E4A'][Math.floor(rnd(seed, 2) * 4)];
  const tilt = turn * 14 * (rnd(seed, 3) > 0.5 ? 1 : -1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -50 0 Q -54 -110 0 -118 Q 54 -110 50 0 Z" fill={col} />
      <g transform={`rotate(${tilt} 0 -122)`}>
        <circle cx={0} cy={-158} r={34} fill="#E8C0A0" />
        <path d={`M -34 -162 Q -30 -204 0 -202 Q 34 -204 34 -162 Q 20 -178 0 -176 Q -20 -178 -34 -162 Z`} fill="#2A1C18" />
        <circle cx={-12} cy={-156} r={4} fill="#2A1C18" />
        <circle cx={12} cy={-156} r={4} fill="#2A1C18" />
      </g>
      {glow > 0 ? (
        <g>
          <Glow x={0} y={-80} r={150} kind="cool" o={0.55 * glow} />
          <rect x={-18} y={-104} width={36} height={60} rx={7} fill="#CFE6FF" opacity={0.95 * glow} transform={`rotate(${-8} 0 -74)`} />
        </g>
      ) : null}
    </g>
  );
};


/** An arm entering from off frame, in a cast member's colours (sleeve + mitten), as InsertArm does for Pip. */
export const LookArm: React.FC<{ look: typeof PIP; x: number; y: number; fx: number; fy: number; rot?: number; s?: number; width?: number; rim?: string }> = ({ look, x, y, fx, fy, rot = 0, s = 4.8, width = 112, rim = 'rimR' }) => {
  const d = `M ${x + (fx - x) * 0.08} ${y + (fy - y) * 0.08} Q ${x + (fx - x) * 0.45 + 40} ${y + (fy - y) * 0.45} ${fx} ${fy}`;
  return (
    <g filter={`url(#${rim})`}>
      <path d={d} stroke={look.line} strokeWidth={width + 18} fill="none" strokeLinecap="round" />
      <path d={d} stroke={look.limb} strokeWidth={width} fill="none" strokeLinecap="round" />
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
        <path d="M -11 -2 Q -14 14 -6 18 L 7 18 Q 14 14 11 -2 Z" fill={look.hand} stroke={look.line} strokeWidth={2.6} strokeLinejoin="round" />
        <ellipse cx={-10} cy={6} rx={4.5} ry={7} fill={look.hand} stroke={look.line} strokeWidth={2.4} />
      </g>
    </g>
  );
};

/** A plastic cafe stool seen from the front: `x` centre, `y` the ground; the seat is 68 * s high (a seated hip height). */
export const Stool: React.FC<{ x: number; y: number; s: number; color?: string }> = ({ x, y, s, color = '#C84A3E' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={52} ry={8} fill="#000" opacity={0.3} />
    <path d="M -34 -64 L -44 0 L 44 0 L 34 -64 Z" fill={color} />
    <path d="M 10 -64 L 18 0 L 44 0 L 34 -64 Z" fill="#000" opacity={0.15} />
    <ellipse cx={0} cy={-64} rx={38} ry={9} fill={color} />
    <ellipse cx={0} cy={-66} rx={38} ry={9} fill="#fff" opacity={0.2} />
  </g>
);

/** A hugging arm drawn by hand: from a shoulder `a` curving through `c` to a hand resting at `b`, in a cast member's colours. */
export const HugArm: React.FC<{ look: typeof PIP; a: [number, number]; c: [number, number]; b: [number, number]; s?: number; p?: number }> = ({ look, a, c, b, s = 1.5, p = 1 }) => {
  const e: [number, number] = [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p];
  const d = `M ${a[0]} ${a[1]} Q ${c[0]} ${c[1]} ${e[0]} ${e[1]}`;
  return (
    <g>
      <path d={d} stroke={look.line} strokeWidth={(11 + 7) * s} fill="none" strokeLinecap="round" />
      <path d={d} stroke={look.limb} strokeWidth={11 * s} fill="none" strokeLinecap="round" />
      <circle cx={e[0]} cy={e[1]} r={9 * s} fill={look.hand} stroke={look.line} strokeWidth={2.6 * s} />
    </g>
  );
};
