import React from 'react';
import { Hero, poseAt, LOOKS, FONT, SCH, Glow, rnd, joints, toWorld, Pose } from '../../engine';

// Chapter D local props, part 3: the world map with alert dots, TVs showing the man in the suit, a suitcase.

/** Crude, original continent blobs in a 1200 x 620 box. */
const LAND = [
  'M 90 120 Q 160 60 280 80 L 340 110 Q 330 170 290 210 Q 270 260 230 300 L 210 340 Q 170 300 150 250 Q 100 200 90 120 Z',
  'M 250 360 Q 320 350 350 400 Q 340 480 300 560 Q 270 520 260 450 Q 240 400 250 360 Z',
  'M 520 110 Q 580 80 640 100 L 660 150 Q 600 180 540 170 Z',
  'M 540 200 Q 640 180 700 230 Q 720 320 670 420 Q 620 470 590 400 Q 560 300 540 200 Z',
  'M 660 90 Q 800 50 960 80 Q 1060 120 1040 200 Q 980 270 900 270 Q 820 250 780 230 Q 720 190 660 150 Z',
  'M 940 380 Q 1020 360 1070 400 Q 1060 460 990 460 Q 940 440 940 380 Z',
  'M 360 40 Q 420 20 460 50 Q 440 90 390 80 Z',
];
export const MAP_DOTS: [number, number][] = [[210, 170], [590, 140], [800, 150], [620, 300], [300, 430], [1000, 420], [900, 220], [150, 260], [700, 110], [420, 60]];

/** The world as flat land masses on the blueprint, with alert dots blinking red one after another from `t0`. */
export const AlertMap: React.FC<{ t: number; x?: number; y?: number; s?: number; t0?: number }> = ({ t, x = 120, y = 160, s = 1.4, t0 = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {LAND.map((d, i) => <path key={i} d={d} fill="#1E3350" stroke={SCH.dim} strokeWidth={3} strokeLinejoin="round" />)}
    {MAP_DOTS.map(([dx, dy], i) => {
      const k = t - t0 - i * 4;
      if (k < 0) return null;
      const blink = Math.floor((k + i * 3) / 5) % 2 === 0;
      const ring = ((k + i * 5) % 30) / 30;
      return (
        <g key={i}>
          <circle cx={dx} cy={dy} r={8 + ring * 34} fill="none" stroke="#FF4A4A" strokeWidth={3} opacity={(1 - ring) * 0.8} />
          <circle cx={dx} cy={dy} r={9} fill={blink ? '#FF4A4A' : '#7A2A2E'} />
        </g>
      );
    })}
  </g>
);

/** What a TV shows: the man in the suit at a desk (base size 400 x 300, centred), a red ticker. `calm` offsets his gestures. */
export const SuitScreen: React.FC<{ id: string; t: number; calm?: number; ticker?: boolean; glitch?: number }> = ({ id, t, calm = 0, ticker = true, glitch = 0 }) => {
  const g = Math.sin((t + calm) / 7);
  const pose: Pose = poseAt(0, [{ f: 0, p: { x: 0, y: 70, scale: 0.55, yaw: 0.15, look: 0, armL: { a: 70 + g * 12, b: 30 }, armR: { a: 10, b: 20 }, expr: 'neutral', headTilt: g * 2 } }]);
  const tx = -((t * 3 + calm * 9) % 520);
  return (
    <g>
      <defs><pattern id={`${id}scan`} width={4} height={4} patternUnits="userSpaceOnUse"><rect width={4} height={2} fill="#000" /></pattern></defs>
      <rect x={-200} y={-150} width={400} height={300} fill="#24456E" />
      <rect x={-200} y={-150} width={400} height={150} fill="#2F5A8C" />
      <rect x={-120} y={-120} width={90} height={60} rx={6} fill="#183252" />
      <circle cx={-76} cy={-90} r={20} fill="#3E6EA6" opacity={0.7} />
      <Hero look={LOOKS.suit} pose={pose} rimId="rimBlue" shadow={0} />
      <rect x={-200} y={46} width={400} height={104} fill="#5A3A28" />
      <rect x={-200} y={46} width={400} height={6} fill="#8A6040" />
      {ticker ? (
        <g>
          <rect x={-200} y={106} width={400} height={44} fill="#C8323C" />
          <g clipPath={`url(#${id}tk)`}>
            <text x={tx + 190} y={140} fontFamily={FONT.ui} fontSize={30} fill="#FFFFFF" letterSpacing={3}>{'STAY CALM  •  STAY CALM  •  STAY CALM  •  STAY CALM'}</text>
          </g>
          <clipPath id={`${id}tk`}><rect x={-200} y={106} width={400} height={44} /></clipPath>
        </g>
      ) : null}
      {glitch > 0 && Math.floor(t / 3) % 5 === 0 ? <rect x={-200} y={-20 + rnd(4, Math.floor(t / 3)) * 120} width={400} height={10} fill="#FFFFFF" opacity={0.25 * glitch} /> : null}
      <rect x={-200} y={-150} width={400} height={300} fill={`url(#${id}scan)`} opacity={0.35} />
    </g>
  );
};

/** A TV: a dark body of `w` x `h` (screen inset), its screen drawn from SuitScreen scaled to fit, with a glow on the room. */
export const Tv: React.FC<{ x: number; y: number; w: number; id: string; t: number; calm?: number; on?: number; ticker?: boolean }> = ({ x, y, w, id, t, calm = 0, on = 1, ticker = true }) => {
  const h = w * 0.75, k = (w - 24) / 400;
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={`${id}scr`}><rect x={-(w - 24) / 2} y={-(h - 24) / 2} width={w - 24} height={h - 24} rx={4} /></clipPath>
      </defs>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill="#14151C" stroke="#3A3C4C" strokeWidth={3} />
      <rect x={-(w - 24) / 2} y={-(h - 24) / 2} width={w - 24} height={h - 24} fill="#05070C" />
      {on > 0 ? (
        <g clipPath={`url(#${id}scr)`} opacity={on}><g transform={`scale(${k})`}><SuitScreen id={`${id}s`} t={t} calm={calm} ticker={ticker} glitch={1} /></g></g>
      ) : null}
      <rect x={-w * 0.12} y={h / 2} width={w * 0.24} height={10} fill="#14151C" />
      {on > 0 ? <Glow x={0} y={0} r={w * 0.9} kind="cool" o={0.32 * on} /> : null}
    </g>
  );
};

/** A suitcase hanging from the hand that carries it (the pose's near hand, via the rig's joints). */
export const Suitcase: React.FC<{ pose: Pose; color?: string; side?: 'armL' | 'armR' }> = ({ pose, color = '#B5543E', side = 'armR' }) => {
  const h = toWorld(pose, joints(pose)[side].end);
  const k = pose.scale;
  return (
    <g transform={`translate(${h.x} ${h.y + 4 * k}) scale(${k})`}>
      <path d="M -10 0 L -10 -12 Q 0 -22 10 -12 L 10 0" stroke="#1A1218" strokeWidth={4} fill="none" />
      <rect x={-30} y={0} width={60} height={46} rx={6} fill={color} stroke="#1A1218" strokeWidth={3} />
      <path d="M -30 22 L 30 22" stroke="#1A1218" strokeWidth={3} opacity={0.5} />
    </g>
  );
};
