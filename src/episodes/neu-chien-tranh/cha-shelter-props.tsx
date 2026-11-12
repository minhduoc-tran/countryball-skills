import React from 'react';
import { FONT, SCH, clamp, backOut, Glow } from '../../engine';

// Chapter A props, part 3: going underground. The metro entrance, the plain outline of Ukraine for the number card, and
// the subway-platform line icon with sleeping figures. Pure functions of the shot clock.

/** A station entrance seen from the street: a lit sign over a dark opening whose steps run down into the dark. */
export const StationEntrance: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}dark`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2A2236" />
        <stop offset="1" stopColor="#07050C" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-300} width={2720} height={1700} fill="#4A3F5A" />
    {Array.from({ length: 24 }).map((_, i) => (
      <rect key={i} x={-400 + i * 120} y={-300} width={6} height={1700} fill="#3A3048" opacity={0.6} />
    ))}
    <rect x={-400} y={900} width={2720} height={500} fill="#2C2638" />
    <rect x={-400} y={896} width={2720} height={10} fill="#FFB46A" opacity={0.25} />
    {/* the opening and its steps going down */}
    <path d="M 560 900 L 640 240 L 1280 240 L 1360 900 Z" fill={`url(#${id}dark)`} stroke="#6A5E78" strokeWidth={14} strokeLinejoin="round" />
    {Array.from({ length: 9 }).map((_, i) => {
      const k = i / 9;
      const y = 900 - k * 560 * (1 - k * 0.35);
      const half = 400 - k * 190 - 8;
      return <path key={i} d={`M ${960 - half} ${y} H ${960 + half}`} stroke="#8A7E98" strokeWidth={6 - k * 3} opacity={0.75 - k * 0.45} />;
    })}
    <path d="M 600 900 L 700 270 M 1320 900 L 1220 270" stroke="#5A4E68" strokeWidth={8} />
    {/* rails down the middle and sides */}
    <path d="M 560 880 L 700 300 M 1360 880 L 1220 300" stroke="#C9CDD6" strokeWidth={9} strokeLinecap="round" opacity={0.8} />
    {/* the sign */}
    <rect x={640} y={110} width={640} height={110} rx={18} fill="#16212E" stroke="#8AB4E0" strokeWidth={6} />
    <text x={960} y={186} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={50} fill="#EAF4FF" letterSpacing={4}>GA NGẦM</text>
    <path d="M 700 176 L 740 176 M 720 156 L 740 176 L 720 196" stroke="#5BE08A" strokeWidth={8} fill="none" strokeLinecap="round" transform={`rotate(90 720 176)`} />
    <Glow x={960} y={165} r={420} kind="cool" o={0.4 + 0.05 * Math.sin(t / 8)} />
    <Glow x={960} y={760} r={260} o={0.2} />
  </g>
);

// Ukraine's outline as plain geometry: (lon, lat) corners, drawn on a card; only a label on a map, nothing else.
const UA: [number, number][] = [
  [22.1, 48.4], [22.6, 49.1], [24.1, 50.6], [23.5, 51.6], [26, 51.9], [28, 51.6], [30.2, 51.4], [31.8, 52.1], [33.5, 52.35],
  [34.4, 51.7], [35.9, 50.4], [38, 49.9], [40.1, 49.6], [39.7, 48.8], [39.8, 47.9], [38.2, 47.1], [37.5, 47.0], [35.2, 46.4],
  [35.0, 45.7], [36.6, 45.3], [36.5, 45.0], [35.4, 44.6], [33.6, 44.4], [32.5, 45.3], [33.6, 46.0], [32.5, 46.1], [31.5, 46.6],
  [30.7, 46.5], [29.8, 45.4], [28.9, 45.3], [28.2, 45.5], [28.5, 46.6], [29.2, 47.5], [29.7, 47.3], [30.1, 48.2], [28.9, 48.1],
  [26.6, 48.3], [26.1, 48.2], [24.9, 47.7], [24.0, 47.9], [22.9, 48.4],
];
/** Outline path scaled to `w` wide, top-left at (0,0). */
export const ukrainePath = (w: number) => {
  const k = w / ((40.1 - 22.1) * 50);
  const pts = UA.map(([lo, la]) => [(lo - 22.1) * 50 * k, (52.35 - la) * 75 * k]);
  return `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z`;
};
export const UKRAINE_H = (w: number) => ((52.35 - 44.4) * 75 * w) / ((40.1 - 22.1) * 50);

/** One person lying asleep on the floor, in schematic line style (head on a pillow, a blanket over the body); a "z" floats up. */
export const SleeperIcon: React.FC<{ x: number; y: number; s?: number; t: number; on?: number; flip?: boolean; kid?: boolean }> = ({ x, y, s = 1, t, on = 1, flip = false, kid = false }) => {
  const p = backOut(clamp(on));
  const k = (kid ? 0.7 : 1) * s * p;
  const breathe = Math.sin(t / 12 + x) * 2.5;
  const zy = ((t / 3) % 30);
  return (
    <g opacity={clamp(on * 3)}>
      <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * k} ${k})`} stroke={SCH.line} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx={-6} cy={14} rx={92} ry={9} stroke="none" fill="#000" opacity={0.25} />
        <rect x={-96} y={-6} width={46} height={14} rx={7} fill="#1C2C44" />
        <circle cx={-72} cy={-22} r={17} fill="#1C2C44" />
        <path d={`M -44 4 L -44 ${-20 + breathe * 0.3} Q 10 ${-34 + breathe} 84 -8 L 84 4 Z`} fill={`${SCH.live}40`} stroke={SCH.live} />
        <path d="M -20 -4 Q 20 -12 60 -4" stroke={SCH.live} opacity={0.5} />
      </g>
      <text x={x + (flip ? 40 : -40) * k} y={y - 50 * k - zy} fontFamily={FONT.ui} fontSize={30 * Math.max(0.8, k)} fill={SCH.dim} opacity={0.9 - zy / 34}>z</text>
    </g>
  );
};

/** A subway platform in line style: an arched tunnel ceiling, the platform edge and rails, rows of sleeping figures. */
export const PlatformIcon: React.FC<{ x: number; y: number; t: number; t0?: number; id: string; s?: number }> = ({ x, y, t, t0 = 8, id, s = 1 }) => {
  const rows: [number, number, number, boolean, boolean][] = [
    [-360, 80, 0, false, false], [-180, 80, 1, true, false], [0, 80, 2, false, true], [180, 80, 3, false, false], [360, 80, 4, true, false],
    [-270, 155, 5, false, false], [-90, 155, 6, true, true], [90, 155, 7, false, false], [270, 155, 8, false, true],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id={`${id}cp`}><rect x={-480} y={-250} width={960} height={460} /></clipPath>
      </defs>
      <g stroke={SCH.line} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" clipPath={`url(#${id}cp)`}>
        <path d="M -460 -20 L -460 -150 Q -460 -240 0 -240 Q 460 -240 460 -150 L 460 -20" />
        {[-360, -240, -120, 0, 120, 240, 360].map((cx) => (
          <path key={cx} d={`M ${cx} -238 L ${cx * 1.02} -20`} stroke={SCH.dim} strokeWidth={3} opacity={0.6} />
        ))}
        <path d="M -480 -20 H 480" stroke={SCH.dim} />
        {[-380, -190, 0, 190, 380].map((lx) => <circle key={lx} cx={lx} cy={-190} r={8} fill={SCH.glow} stroke="none" opacity={0.85} />)}
        <path d="M -480 20 H 480 M -480 28 H 480" stroke={SCH.dim} strokeWidth={4} />
        <path d="M -480 190 H 480" stroke={SCH.live} strokeWidth={5} opacity={0.7} />
        <path d="M -480 205 H 480" stroke={SCH.dim} strokeWidth={3} />
      </g>
      {rows.map(([sx, sy, i, flip, kid]) => (
        <SleeperIcon key={i} x={sx} y={sy} s={0.9} t={t} on={(t - t0 - i * 3) / 8} flip={flip} kid={kid} />
      ))}
    </g>
  );
};

