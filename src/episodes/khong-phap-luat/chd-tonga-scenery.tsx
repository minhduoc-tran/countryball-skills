import React from 'react';
import { rnd, FONT } from '../../engine';

// Chapter D scenery (1/3): the Tonga storybook world. Warm sepia-friendly colours; the "memory" look does the rest.
// Pure functions of the shot clock `t`. Every gradient id takes the caller's `id` so two copies never collide.

export const HORIZON = 520;

/** A wavy line across the frame at height y: sine with phase moving with t. */
const wave = (y: number, amp: number, wl: number, speed: number, t: number, x0 = -100, x1 = 2020) => {
  let d = `M ${x0} ${y}`;
  for (let x = x0; x <= x1; x += 40) d += ` L ${x} ${(y + amp * Math.sin((x + t * speed) / wl)).toFixed(1)}`;
  return d;
};

/** Sky, sun, drifting clouds and a sea with waves. storm 0..1 greys the sky and adds rain, night 0..1 darkens it. */
export const Sea: React.FC<{ t: number; id: string; horizon?: number; storm?: number; night?: number }> = ({ t, id, horizon = HORIZON, storm = 0, night = 0 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F3E3BA" />
        <stop offset="1" stopColor="#F0C58A" />
      </linearGradient>
      <linearGradient id={`${id}sea`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6FA9B2" />
        <stop offset="1" stopColor="#35707F" />
      </linearGradient>
    </defs>
    <rect x={-200} y={-300} width={2320} height={horizon + 300} fill={`url(#${id}sky)`} />
    <circle cx={1450} cy={horizon - 190} r={92} fill="#FFF3CF" opacity={0.95 - storm * 0.8} />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${((i * 700 + t * (0.25 + i * 0.1)) % 2400) - 300} ${horizon - 330 + i * 46})`} opacity={0.85 - storm * 0.3}>
        <ellipse cx={0} cy={0} rx={150} ry={26} fill="#FFF8E6" />
        <ellipse cx={60} cy={-18} rx={90} ry={26} fill="#FFF8E6" />
      </g>
    ))}
    <rect x={-200} y={horizon} width={2320} height={1400} fill={`url(#${id}sea)`} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <path key={i} d={wave(horizon + 18 + i * i * 9 + i * 14, 3 + i * 1.6, 70 + i * 22, 0.9 + i * 0.5, t + i * 30)} stroke="#D8F0F0" strokeWidth={2 + i * 0.7} fill="none" opacity={0.2 + i * 0.05} />
    ))}
    {storm > 0 ? (
      <g>
        <rect x={-200} y={-300} width={2320} height={1700} fill="#3C3A48" opacity={0.55 * storm} />
        {Array.from({ length: 36 }).map((_, i) => {
          const x = (rnd(3, i) * 2300 - 200 - t * 6) % 2300;
          const y = ((rnd(4, i) * 1200 + t * 38) % 1200) - 60;
          return <path key={i} d={`M ${x} ${y} l -14 36`} stroke="#E5EEF0" strokeWidth={2.5} opacity={0.5 * storm} />;
        })}
      </g>
    ) : null}
    {night > 0 ? (
      <g opacity={night}>
        <rect x={-200} y={-300} width={2320} height={1700} fill="#101A38" opacity={0.7} />
        {Array.from({ length: 26 }).map((_, i) => (
          <circle key={i} cx={rnd(8, i) * 1920} cy={rnd(9, i) * (horizon - 40)} r={1.5 + rnd(10, i) * 2} fill="#FFF3CF" opacity={0.5 + 0.4 * Math.sin(t / 9 + i)} />
        ))}
        <circle cx={1450} cy={horizon - 220} r={64} fill="#F6EFD2" />
      </g>
    ) : null}
  </g>
);

/** A palm: curved trunk and swaying fronds. (x, y) = foot. */
export const Palm: React.FC<{ x: number; y: number; s?: number; t: number; lean?: number }> = ({ x, y, s = 1, t, lean = 1 }) => {
  const sw = Math.sin(t / 22 + x) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * lean} ${s})`}>
      <path d="M 0 0 Q 18 -110 -6 -230" stroke="#4A3220" strokeWidth={20} fill="none" strokeLinecap="round" />
      <path d="M 0 0 Q 18 -110 -6 -230" stroke="#8A6440" strokeWidth={13} fill="none" strokeLinecap="round" />
      <g transform={`translate(-6 -230)`}>
        {[-70, -38, -8, 24, 56, 88, 120].map((a, i) => (
          <path key={i} transform={`rotate(${a + sw * (i % 2 ? 1 : -1)})`} d="M 0 0 Q 50 -64 130 -38 Q 60 -34 0 6 Z" fill={i % 2 ? '#5E8A48' : '#6E9A52'} stroke="#2F4A26" strokeWidth={3} />
        ))}
        <circle cx={4} cy={6} r={9} fill="#6A4A2A" />
      </g>
    </g>
  );
};

/** The rocky island: grey crags, a grass cap, a sand skirt and two palms. (x, y) = waterline centre. */
export const Island: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={470} ry={34} fill="#E4F4F0" opacity={0.55 + 0.15 * Math.sin(t / 14)} />
    <ellipse cx={0} cy={4} rx={440} ry={26} fill="#E8D3A0" stroke="#A8895A" strokeWidth={4} />
    <path d="M -380 2 L -330 -60 L -250 -112 L -170 -150 L -80 -192 L 20 -214 L 110 -182 L 200 -150 L 270 -100 L 340 -50 L 400 2 Z" fill="#8C7B66" stroke="#4A3A2A" strokeWidth={5} strokeLinejoin="round" />
    <path d="M 20 -214 L 110 -182 L 200 -150 L 270 -100 L 340 -50 L 400 2 L 60 2 L 40 -90 Z" fill="#6E5E4C" opacity={0.6} />
    <path d="M -250 -112 L -170 -150 L -80 -192 L 20 -214 L 60 -200 Q -20 -170 -100 -150 Q -180 -128 -250 -112 Z" fill="#6E8F4E" stroke="#3E5A2E" strokeWidth={4} strokeLinejoin="round" />
    <path d="M -300 -30 L -240 -50 M -120 -60 L -60 -90 M 100 -60 L 170 -40 M 230 -30 L 290 -10" stroke="#4A3A2A" strokeWidth={4} opacity={0.5} strokeLinecap="round" />
    <Palm x={-130} y={-150} s={0.62} t={t} />
    <Palm x={150} y={-150} s={0.5} t={t + 20} lean={-1} />
  </g>
);

/** A rough parchment map of the Pacific, drawn in a 1000 x 600 box: the dot near TONGA pulses. `mini` = no sea lines. */
export const PacificMap: React.FC<{ t: number; x?: number; y?: number; s?: number; mini?: boolean; ping?: number }> = ({ t, x = 0, y = 0, s = 1, mini = false, ping = 1 }) => {
  const r = (t % 36) / 36;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={0} y={0} width={1000} height={600} rx={14} fill="#EBD9AE" stroke="#6E5230" strokeWidth={8} />
      <rect x={18} y={18} width={964} height={564} rx={8} fill="#A9C9C6" opacity={0.85} />
      {/* Australia, New Zealand, Asia's edge and the Americas as simple blobs */}
      <path d="M 70 360 Q 130 300 250 320 Q 330 340 360 410 Q 340 500 240 520 Q 130 530 80 450 Z" fill="#DCC48F" stroke="#7A5A34" strokeWidth={5} />
      <path d="M 430 520 L 470 470 L 490 520 L 450 570 Z" fill="#DCC48F" stroke="#7A5A34" strokeWidth={4} />
      <path d="M 18 40 L 330 40 Q 360 100 300 150 Q 200 190 120 170 Q 60 130 18 140 Z" fill="#DCC48F" stroke="#7A5A34" strokeWidth={5} />
      <path d="M 982 60 L 880 70 Q 840 180 900 280 Q 880 400 930 480 L 982 500 Z" fill="#DCC48F" stroke="#7A5A34" strokeWidth={5} />
      {mini ? null : <path d="M 120 250 Q 300 200 500 330 Q 600 380 640 420" stroke="#7A5A34" strokeWidth={5} strokeDasharray="4 14" strokeLinecap="round" fill="none" opacity={0.7} />}
      {[0, 1, 2].map((i) => <circle key={i} cx={640 + i * 36} cy={430 + (i % 2) * 24} r={5 + (i % 2) * 3} fill="#DCC48F" stroke="#7A5A34" strokeWidth={3} />)}
      <g opacity={ping}>
        <circle cx={640} cy={430} r={14 + r * 70} fill="none" stroke="#C8202F" strokeWidth={7 * (1 - r)} opacity={1 - r} />
        <circle cx={640} cy={430} r={15} fill="#C8202F" stroke="#FFF3CF" strokeWidth={5} />
        <text x={640} y={mini ? 395 : 378} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={mini ? 70 : 62} fill="#3A2412" stroke="#EBD9AE" strokeWidth={8} paintOrder="stroke" letterSpacing={4}>TONGA</text>
      </g>
    </g>
  );
};

/** A small wooden boat with a mast and a torn sail. (x, y) = waterline; rot tilts it about the keel. */
export const Boat: React.FC<{ x: number; y: number; s?: number; rot?: number; sail?: boolean }> = ({ x, y, s = 1, rot = 0, sail = true }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 -30 L 0 -250" stroke="#4A3220" strokeWidth={9} strokeLinecap="round" />
    {sail ? <path d="M 6 -246 L 120 -80 L 90 -70 L 70 -88 L 50 -66 L 6 -62 Z" fill="#EAD9B0" stroke="#8A7050" strokeWidth={4} strokeLinejoin="round" /> : null}
    <path d="M -130 -30 L 130 -30 Q 110 36 44 48 L -64 48 Q -118 36 -130 -30 Z" fill="#8A5A32" stroke="#3E2814" strokeWidth={6} strokeLinejoin="round" />
    <path d="M -118 -6 L 118 -6 M -100 18 L 96 18" stroke="#3E2814" strokeWidth={3} opacity={0.6} />
    <path d="M -130 -30 L 130 -30" stroke="#C99A62" strokeWidth={7} />
  </g>
);

/** Foam arcs that lap round the foot of anything standing in the sea. */
export const Foam: React.FC<{ x: number; y: number; w: number; t: number }> = ({ x, y, w, t }) => (
  <g opacity={0.8}>
    {[0, 1, 2].map((i) => {
      const p = ((t / 50 + i / 3) % 1);
      return <ellipse key={i} cx={x} cy={y + 6 + p * 16} rx={w * (0.8 + p * 0.25)} ry={10 + p * 8} fill="none" stroke="#F4FBF8" strokeWidth={4 * (1 - p)} opacity={1 - p} />;
    })}
  </g>
);

/** The beach: a sand slope from y down, wet edge and lapping foam on top. */
export const Beach: React.FC<{ y: number; t: number; id: string }> = ({ y, t, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sand`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#C9AE78" />
        <stop offset="0.25" stopColor="#E8D3A0" />
        <stop offset="1" stopColor="#D2B57E" />
      </linearGradient>
    </defs>
    <path d={`${wave(y, 6, 90, 0.6, t, -100, 2020)} L 2020 1200 L -100 1200 Z`} fill={`url(#${id}sand)`} />
    <path d={wave(y - 8, 8, 80, 0.8, t + 40, -100, 2020)} stroke="#F4FBF8" strokeWidth={7} fill="none" opacity={0.7} />
    {Array.from({ length: 14 }).map((_, i) => (
      <circle key={i} cx={rnd(21, i) * 1920} cy={y + 50 + rnd(22, i) * 220} r={2 + rnd(23, i) * 3} fill="#A8895A" opacity={0.5} />
    ))}
  </g>
);
