import React from 'react';
import { Glow, LOOKS, Look, clamp, easeOut, rnd, LEG_LEN } from '../../engine';
import { Steam } from '../tien-vo-han/che-xoi-cart-and-money-props';
import { GRANDMA, WORKER } from '../khong-ai-ngheo/cast-looks';

// Chapter C, week one: the neighbours' kindness. A huge porridge pot, bowls, the mechanic's phone-charging station
// built on a car battery, and a few extra neighbours (the same rig in other clothes).
// All props are drawn in HERO-LOCAL units: pass the hero's `scale` as `s` and the floor y (= hip y + LEG_LEN * s) as `y`.

export { GRANDMA, WORKER };
/** The neighbours: recoloured cast, so nobody looks like a main character. */
export const NEIGHBOUR_A: Look = { ...LOOKS.mo, jacket: '#B5523B', jacketShade: '#94412E', accent: '#F2C14E', hair: '#1E1618', extra: undefined };
export const NEIGHBOUR_B: Look = { ...LOOKS.mom, jacket: '#3E7A6E', jacketShade: '#2F6258', accent: '#E8D49A', hair: '#2A2420', extra: 'bob' };
export const NEIGHBOUR_C: Look = { ...LOOKS.suit, jacket: '#6C7C9A', jacketShade: '#566580', accent: '#D9B26A', hair: '#B9B6C2', extra: undefined };
export const NEIGHBOUR_D: Look = { ...LOOKS.sis, jacket: '#C9923E', jacketShade: '#A87830', accent: '#E86B5A', hair: '#2A1C18', extra: 'bunches' };

/** The hip y that puts a hero's feet on floor line `floorY`. */
export const hipFor = (floorY: number, s: number) => floorY - LEG_LEN * s;

/** A bowl of porridge (x, y = base centre), about 64 wide at s 1; `steam` draws the wisp. */
export const Bowl: React.FC<{ x: number; y: number; s?: number; t: number; steam?: boolean; full?: number }> = ({ x, y, s = 1, t, steam = true, full = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={30} ry={5} fill="#000" opacity={0.25} />
    <path d="M -32 -34 L 32 -34 Q 30 -4 12 -2 L -12 -2 Q -30 -4 -32 -34 Z" fill="#F4EFE2" stroke="#7D705C" strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M -28 -16 Q 0 -10 28 -16" stroke="#3E8C86" strokeWidth={3} fill="none" />
    <ellipse cx={0} cy={-34} rx={32} ry={7} fill="#FBF7EC" stroke="#7D705C" strokeWidth={2.5} />
    <ellipse cx={0} cy={-34} rx={27} ry={5} fill="#EBD9A8" opacity={full} />
    <ellipse cx={-6} cy={-35} rx={7} ry={1.8} fill="#FFF4CF" opacity={0.7 * full} />
    {steam ? <Steam x={0} y={-40} t={t} n={3} h={70} w={8} o={0.5} seed={3} /> : null}
  </g>
);

/**
 * The huge porridge pot on a coal brazier. layer "back": brazier, coals, rim, porridge, steam; layer "front": the
 * body and handles (draw the cook, then the ladle, between them so the ladle dips behind the pot's front wall).
 * x = centre, y = floor line. The rim stands 170 above the floor, so it sits at a standing cook's waist.
 */
export const PorridgePot: React.FC<{ x: number; y: number; s?: number; t: number; layer: 'back' | 'front'; glow?: number }> = ({ x, y, s = 1, t, layer, glow = 1 }) => {
  const fl = 1 + 0.08 * Math.sin(t * 0.9) + 0.05 * Math.sin(t * 2.3);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {layer === 'back' ? (
        <g>
          <ellipse cx={0} cy={6} rx={130} ry={16} fill="#000" opacity={0.35} />
          <path d="M -70 0 L -54 -44 L 54 -44 L 70 0 Z" fill="#3A302C" stroke="#17120F" strokeWidth={4} strokeLinejoin="round" />
          <path d="M -50 -22 Q 0 -34 50 -22" stroke="#FF8A3D" strokeWidth={9} fill="none" opacity={0.9 * fl} strokeLinecap="round" />
          <Glow x={0} y={-30} r={230 * fl} kind="warm" o={0.6 * glow} />
          <ellipse cx={0} cy={-170} rx={100} ry={22} fill="#2E2926" />
          <ellipse cx={0} cy={-168} rx={90} ry={17} fill="#E8D49A" />
          <ellipse cx={-20} cy={-170} rx={44} ry={7} fill="#FBF0C8" opacity={0.7} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={-50 + i * 34 + Math.sin(t / 9 + i) * 4} cy={-168 + Math.sin(t / 7 + i * 2) * 4} r={3 + (i % 2)} fill="#FFF8DD" opacity={0.5} />
          ))}
          <Steam x={66} y={-176} t={t} n={7} h={230} w={34} o={0.58} seed={5} />
        </g>
      ) : (
        <g>
          <path d="M -104 -168 L -100 -64 Q -96 -42 -64 -42 L 64 -42 Q 96 -42 100 -64 L 104 -168 Q 0 -146 -104 -168 Z" fill="#9A9AA8" stroke="#2A2630" strokeWidth={4.5} strokeLinejoin="round" />
          <path d="M 40 -160 L 104 -168 L 100 -64 Q 96 -42 64 -42 L 40 -42 Z" fill="#7A7A8A" opacity={0.65} />
          <path d="M -104 -168 Q 0 -146 104 -168" stroke="#C9C9D4" strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d="M -98 -128 Q -138 -128 -134 -108 Q -130 -92 -100 -96 M 98 -128 Q 138 -128 134 -108 Q 130 -92 100 -96" stroke="#2A2630" strokeWidth={9} fill="none" strokeLinecap="round" />
          <path d="M -82 -150 L -80 -76" stroke="#E8E8F2" strokeWidth={5} strokeLinecap="round" opacity={0.35} />
        </g>
      )}
    </g>
  );
};

/** A ladle from a hand (hx, hy) down to the porridge at (px, py): wooden handle and an iron cup. */
export const Ladle: React.FC<{ hx: number; hy: number; px: number; py: number; s?: number; lift?: number }> = ({ hx, hy, px, py, s = 1, lift = 0 }) => {
  const ang = (Math.atan2(py - hy, px - hx) * 180) / Math.PI;
  const len = Math.hypot(px - hx, py - hy);
  return (
    <g transform={`translate(${hx} ${hy}) rotate(${ang})`}>
      <rect x={-20 * s} y={-5 * s} width={len + 20 * s} height={10 * s} rx={5 * s} fill="#A5703E" stroke="#4A2E18" strokeWidth={2.5 * s} />
      <g transform={`translate(${len} 0) rotate(${-lift})`}>
        <path d={`M 0 ${-16 * s} Q ${34 * s} ${-14 * s} ${32 * s} ${10 * s} Q ${16 * s} ${24 * s} 0 ${14 * s} Z`} fill="#9A9AA8" stroke="#2A2630" strokeWidth={3 * s} />
      </g>
    </g>
  );
};

// ---------- the phone-charging station ----------
const PHONE_COLS = ['#5BC0EB', '#9BE564', '#F7B267', '#C792EA', '#5BC0EB', '#9BE564'];

/** One phone lying/leaning on the table: dark body, a glowing screen with a battery level filling up. x, y = bottom centre. */
export const ChargingPhone: React.FC<{ x: number; y: number; s?: number; lit: number; level: number; col?: string; tilt?: number }> = ({ x, y, s = 1, lit, level, col = '#5BC0EB', tilt = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
    <rect x={-20} y={-84} width={40} height={84} rx={7} fill="#15151F" stroke="#3A3A4C" strokeWidth={2.5} />
    <rect x={-16} y={-79} width={32} height={74} rx={4} fill={lit > 0.1 ? col : '#202030'} opacity={lit > 0.1 ? 0.35 + 0.65 * lit : 1} />
    {lit > 0.1 ? (
      <g>
        <rect x={-11} y={-48} width={22} height={11} rx={2} fill="none" stroke="#fff" strokeWidth={2} />
        <rect x={-9} y={-46} width={18 * clamp(level)} height={7} rx={1} fill="#fff" />
        <path d="M 2 -70 L -5 -58 L 0 -58 L -2 -50 L 6 -62 L 1 -62 Z" fill="#fff" opacity={0.9} />
      </g>
    ) : null}
  </g>
);

/**
 * The station: a car battery with clamps, a power strip, a row of `n` phones charging, a bare bulb on the battery,
 * a cardboard sign. `t` drives the glow and the filling battery icons; `built` 0..1 builds it up (cable draws on).
 * x = table centre, y = floor line. The table top is 118 above the floor (a standing mechanic's hip-high bench).
 */
export const ChargeStation: React.FC<{ x: number; y: number; s?: number; t: number; n?: number; built?: number; sign?: boolean }> = ({ x, y, s = 1, t, n = 6, built = 1, sign = true }) => {
  const top = -118;
  const cable = easeOut(clamp(built * 1.4));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={190} ry={13} fill="#000" opacity={0.35} />
      {/* table: legs, top */}
      <path d="M -160 -112 L -168 0 M 160 -112 L 168 0" stroke="#3A2A22" strokeWidth={11} strokeLinecap="round" />
      <path d="M -168 -40 L 168 -40" stroke="#3A2A22" strokeWidth={6} />
      <rect x={-190} y={top} width={380} height={14} rx={4} fill="#8A6244" stroke="#3A2418" strokeWidth={3} />
      <rect x={-190} y={top} width={380} height={5} rx={2} fill="#B58A62" opacity={0.7} />
      {/* the battery */}
      <g transform={`translate(-112 ${top})`} opacity={clamp(built * 3)}>
        <rect x={-52} y={-64} width={104} height={64} rx={6} fill="#1E2430" stroke="#0C0F16" strokeWidth={3} />
        <rect x={-52} y={-64} width={104} height={14} rx={5} fill="#2E3648" />
        <rect x={-34} y={-82} width={20} height={18} rx={3} fill="#C94A3E" />
        <rect x={14} y={-82} width={20} height={18} rx={3} fill="#2A2A32" />
        <text x={-22} y={-68} fontSize={11} fill="#fff" textAnchor="middle" fontWeight={700}>+</text>
        <path d="M -52 -30 L 52 -30" stroke="#F2C14E" strokeWidth={4} />
        <circle cx={-26} cy={-14} r={4} fill="#5EE08A" opacity={0.6 + 0.4 * Math.sin(t / 5)} />
      </g>
      {/* clamp cables from the battery to the strip */}
      <path d={`M -98 ${top - 74} Q -60 ${top - 130} -20 ${top - 26} T 48 ${top - 8}`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - cable} stroke="#C94A3E" strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d={`M -126 ${top - 74} Q -90 ${top - 150} -50 ${top - 20} T 48 ${top - 4}`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - cable} stroke="#1A1A22" strokeWidth={7} fill="none" strokeLinecap="round" />
      {/* strip */}
      <rect x={20} y={top - 14} width={150} height={14} rx={4} fill="#E8E2D2" stroke="#6A604C" strokeWidth={2.5} opacity={clamp(built * 2)} />
      {/* the phones */}
      {Array.from({ length: n }).map((_, i) => {
        const on = clamp((built - 0.35 - i * 0.07) * 6);
        return <ChargingPhone key={i} x={34 + i * 25} y={top - 14} lit={on * (0.9 + 0.1 * Math.sin(t / 4 + i))} level={0.25 + ((t * 0.006 + i * 0.13) % 0.7)} col={PHONE_COLS[i % 6]} tilt={-4 + (i % 3) * 3} s={0.82} />;
      })}
      {/* a pole at the right end of the table with a bare bulb on an arm and a cardboard sign hung from it */}
      <g opacity={clamp(built * 2)}>
        <path d={`M 176 ${top} L 176 ${top - 300} Q 176 ${top - 326} 130 ${top - 326} L 90 ${top - 326}`} stroke="#2A2630" strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d={`M 90 ${top - 326} L 90 ${top - 304}`} stroke="#1A1A22" strokeWidth={3} />
        <circle cx={90} cy={top - 292} r={13} fill="#FFE9A8" />
        <Glow x={90} y={top - 292} r={190 + 10 * Math.sin(t / 6)} kind="warm" o={0.85} />
        {sign ? (
          <g transform={`translate(122 ${top - 222}) rotate(-3)`} opacity={clamp(built * 2 - 0.4)}>
            <path d="M -50 -34 L -50 -48 M 50 -34 L 50 -48" stroke="#2A2630" strokeWidth={2.5} />
            <path d="M -50 -48 Q 0 -60 50 -48" stroke="#2A2630" strokeWidth={2.5} fill="none" />
            <rect x={-86} y={-34} width={172} height={58} rx={4} fill="#C9A06A" stroke="#6A4A2A" strokeWidth={3} />
            <text y={-9} textAnchor="middle" fontFamily="'Itim', cursive" fontSize={22} fill="#3A2412">SẠC ĐIỆN THOẠI</text>
            <text y={14} textAnchor="middle" fontFamily="'Itim', cursive" fontSize={19} fill="#7A3A22">MIỄN PHÍ</text>
          </g>
        ) : null}
      </g>
    </g>
  );
};

/** Little warm bokeh for the night insets. */
export const WarmBokeh: React.FC<{ t: number; seed?: number }> = ({ t, seed = 4 }) => (
  <g filter="url(#blur16)">
    {Array.from({ length: 14 }).map((_, i) => (
      <circle key={i} cx={rnd(seed, i) * 2000 - 40} cy={rnd(seed + 1, i) * 1100} r={50 + rnd(seed + 2, i) * 90} fill={i % 3 === 0 ? '#FFB347' : i % 3 === 1 ? '#E8743A' : '#FFD98A'} opacity={0.22 + 0.1 * Math.sin(t / 20 + i)} />
    ))}
  </g>
);
