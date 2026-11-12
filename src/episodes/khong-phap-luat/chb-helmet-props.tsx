import React from 'react';
import { clamp, easeOut, backOut, rnd, Motorbike, DuskSky, Skyline, Glow, SCH, FONT } from '../../engine';

// Chapter B props (1/4): the helmet beat. A side-on dusk road with a stream of motorbike riders (helmets pop on one by
// one), the helmet icon, the round "mandatory helmet" sign, the glowing law document. Pure functions of the clock.

const INK = '#12101C';
const JACKETS = ['#3E6A8A', '#B5523B', '#5E6E46', '#7A5A8A', '#D9A441', '#2FA595'];
const BIKES = ['#B8483E', '#3E6A8A', '#D9A441', '#2E2B3D', '#EDE6D6', '#2FA595'];
const HELMETS = ['#E9C46A', '#EDE6D6', '#E8453C', '#7EC8E3'];

/** A helmet in side view facing right, about 180 wide, centred on the middle. */
export const HelmetIcon: React.FC<{ x: number; y: number; s?: number; color?: string; rot?: number }> = ({ x, y, s = 1, color = '#E9C46A', rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={62} rx={96} ry={10} fill="#000" opacity={0.3} />
    <path d="M -90 34 Q -96 -62 0 -78 Q 94 -62 92 22 L 92 38 Q 10 50 -90 34 Z" fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 20 -4 Q 92 -8 92 22 L 92 38 Q 60 40 30 36 Z" fill="#2A2638" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -70 -20 Q -60 -56 -10 -64" stroke="#FFFFFF" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.55} />
    <path d="M -40 40 Q -30 78 6 82" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
    <rect x={-8} y={76} width={22} height={14} rx={4} fill="#D8D8E2" stroke={INK} strokeWidth={3} />
    <path d="M -90 22 L 92 28" stroke={INK} strokeWidth={4} opacity={0.35} />
  </g>
);

/** A rider seated on a Motorbike drawn at the same x, y, s (facing right). `helmet` 0..1 pops a helmet on (overshoot). */
export const HelmetRider: React.FC<{ x: number; y: number; s: number; c: number; helmet: number; bob?: number }> = ({ x, y, s, c, helmet, bob = 0 }) => {
  const jacket = JACKETS[c % JACKETS.length];
  const k = helmet > 0 ? backOut(clamp(helmet)) : 0;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      <path d="M -52 -92 Q -56 -150 -40 -176 Q -22 -184 -14 -168 Q -10 -128 -4 -100 Z" fill={jacket} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -14 -150 Q 30 -146 62 -112" stroke={jacket} strokeWidth={17} fill="none" strokeLinecap="round" />
      <circle cx={64} cy={-110} r={8} fill="#F2C9A0" />
      <path d="M -8 -96 Q 14 -90 20 -64 L 30 -34" stroke="#3A3446" strokeWidth={18} fill="none" strokeLinecap="round" />
      <circle cx={-28} cy={-200} r={21} fill="#F2C9A0" stroke={INK} strokeWidth={3.5} />
      <path d="M -48 -204 Q -44 -222 -28 -222 Q -12 -222 -8 -208 L -12 -204 Q -28 -212 -48 -204 Z" fill="#2A1C18" />
      {k > 0.01 ? (
        <g transform={`translate(-28 ${-204 - 26 * (1 - k)}) scale(${k})`} opacity={clamp(helmet * 4)}>
          <path d="M -26 8 A 26 26 0 0 1 26 8 L 28 14 L -26 14 Z" fill={HELMETS[c % HELMETS.length]} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
          <path d="M -16 -8 Q -4 -20 12 -14" stroke="#FFFFFF" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />
        </g>
      ) : null}
    </g>
  );
};

/** The side-on dusk road the riders pass along: sky, skyline, kerb, road with scrolling lane dashes. Road surface at y 760-1000. */
export const RoadSide: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <DuskSky id={`${id}sky`} horizonY={560} />
    <Glow x={1500} y={540} r={620} o={0.45} />
    <Skyline y={600} seed={23} color="#4C3358" h={190} />
    <rect x={-400} y={598} width={2720} height={160} fill="#6E5560" />
    <rect x={-400} y={740} width={2720} height={30} fill="#9A8A86" />
    <rect x={-400} y={770} width={2720} height={620} fill="#3A3444" />
    <rect x={-400} y={770} width={2720} height={14} fill="#241F2E" />
    {Array.from({ length: 14 }).map((_, i) => (
      <rect key={i} x={((i * 220 - t * 7) % 3080) - 400} y={900} width={110} height={12} rx={4} fill="#E8D9B0" opacity={0.55} />
    ))}
    <rect x={-400} y={1000} width={2720} height={400} fill="#2A2535" />
  </g>
);

const N = 14;
// order in which riders put a helmet on (a stable shuffle) and each rider's lane (0 far .. 2 near), x offset and bike
const RANK = Array.from({ length: N }, (_, i) => i).sort((a, b) => rnd(5, a) - rnd(5, b));
const LANE = (i: number) => i % 3;
const LANE_Y = [830, 905, 990];
const LANE_S = [0.62, 0.8, 1.0];

/**
 * 14 riders cruising right in three lanes. Riders ranked < `have` already wear a helmet; from `popAt` the others put one
 * on, one every `gap` frames, until `until` riders in total wear one. Returns the number wearing at clock t via `count`.
 */
export const helmetCount = (t: number, have: number, popAt: number, gap: number, until: number) =>
  have + (popAt >= 0 ? Math.max(0, Math.min(until - have, Math.floor((t - popAt) / gap) + 1)) : 0);

export const RiderStream: React.FC<{ t: number; have: number; popAt?: number; gap?: number; until?: number; speed?: number }> = ({ t, have, popAt = -1, gap = 4, until = have, speed = 1 }) => {
  const order = Array.from({ length: N }, (_, i) => i).sort((a, b) => LANE(a) - LANE(b) || a - b);
  return (
    <g>
      {order.map((i) => {
        const lane = LANE(i);
        const s = LANE_S[lane];
        const base = (Math.floor(i / 3) * 520 + rnd(9, i) * 260 + t * (3.2 + lane * 1.6) * speed) % 2900;
        const x = base - 400;
        const rank = RANK.indexOf(i);
        const popF = rank < have ? 99 : popAt >= 0 && rank < until ? clamp((t - (popAt + (rank - have) * gap)) / 6) : 0;
        const bob = Math.sin(t / 5 + i * 2) * 2 * s;
        return (
          <g key={i}>
            <Motorbike x={x} y={LANE_Y[lane] + bob} s={s} facing={1} color={BIKES[i % BIKES.length]} spin={t * 22} lamp={0.4} />
            <HelmetRider x={x} y={LANE_Y[lane] + bob} s={s} c={i} helmet={popF} />
          </g>
        );
      })}
    </g>
  );
};

/** The round blue "mandatory" sign (a helmet on a disc) on a post; `t` pops it in from 0. Origin at the foot of the post. */
export const HelmetSign: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 8));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={60} ry={9} fill="#000" opacity={0.4} />
      <rect x={-8} y={-300} width={16} height={300} fill="#8A8794" stroke={INK} strokeWidth={4} />
      <g transform={`translate(0 -380) scale(${k})`}>
        <circle r={110} fill="#1F63B8" stroke="#FFFFFF" strokeWidth={10} />
        <circle r={110} fill="none" stroke={INK} strokeWidth={4} />
        <HelmetIcon x={0} y={2} s={0.78} color="#FFFFFF" />
      </g>
    </g>
  );
};

/** A law document that glows: a page with lines, a ribbon seal and a gavel-free "LUẬT" header, floating. Centre origin, ~380 x 500. */
export const LawDoc: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const k = backOut(clamp((t + 1) / 9));
  const float = Math.sin(t / 9) * 10;
  return (
    <g transform={`translate(${x} ${y + float}) scale(${s * k}) rotate(${-3 + Math.sin(t / 14) * 1.5})`}>
      <circle r={380} fill="url(#lawDocGlow)" />
      <defs>
        <radialGradient id="lawDocGlow"><stop offset="0" stopColor="#FFD27A" stopOpacity={0.7} /><stop offset="1" stopColor="#FFD27A" stopOpacity={0} /></radialGradient>
      </defs>
      <rect x={-190} y={-250} width={380} height={500} rx={14} fill="#F8EFD6" stroke="#7A5A30" strokeWidth={6} style={{ filter: 'drop-shadow(0 0 34px #FFC25A)' }} />
      <text x={0} y={-170} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={74} fill="#5A3A1E" letterSpacing={6}>LUẬT</text>
      <path d="M -130 -130 H 130" stroke="#B8902A" strokeWidth={5} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M -130 ${-90 + i * 36} H ${i === 5 ? 20 : 130}`} stroke="#A89878" strokeWidth={9} strokeLinecap="round" opacity={0.75} />
      ))}
      <path d="M 80 170 L 60 250 L 100 226 L 140 250 L 120 170" fill="#C8202F" stroke="#7A1420" strokeWidth={3} />
      <circle cx={100} cy={160} r={40} fill="#D8402E" stroke="#7A1420" strokeWidth={4} />
      <path d="M 82 160 L 96 174 L 122 146" stroke="#FFF1D0" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

/** A bar for "the risk": full width W, the share `cut` (0..1) of it eaten away in green from the right. */
export const RiskBar: React.FC<{ x: number; y: number; w: number; h: number; cut: number }> = ({ x, y, w, h, cut }) => {
  const c = easeOut(clamp(cut)) * 0.42;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={0} width={w} height={h} rx={12} fill="none" stroke={SCH.dim} strokeWidth={5} />
      <rect x={0} y={0} width={w * (1 - c)} height={h} rx={12} fill="#E8453C" />
      <rect x={w * (1 - c)} y={0} width={w * c} height={h} rx={12} fill="#2FBF71" opacity={0.85} />
      <path d={`M ${w * 0.58} -14 V ${h + 14}`} stroke={SCH.line} strokeWidth={4} strokeDasharray="8 8" opacity={clamp(cut * 3)} />
    </g>
  );
};
