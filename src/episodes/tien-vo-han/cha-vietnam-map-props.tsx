import React from 'react';
import { SCH, PlantIcon, clamp, easeOut, backOut } from '../../engine';

// Chapter A, the scale beat's schematic parts: a stylised Vietnam outline (400 x 880 box, origin top-left) that draws
// on, with line icons (factories, rice fields, a container ship) that light up in orange. Pure functions of t.

export const VN_PATH =
  'M 360 60 L 345 90 L 320 120 L 310 150 L 290 185 L 272 225 L 275 260 L 258 300 L 250 335 L 235 370 L 245 410 L 255 450 L 268 484 L 280 522 L 302 570 L 326 620 L 346 660 L 336 700 L 312 740 L 276 770 L 250 792 L 226 820 L 200 845 L 176 865 L 140 880 L 110 872 L 100 845 L 112 815 L 135 790 L 160 770 L 180 740 L 185 700 L 205 660 L 190 620 L 180 570 L 165 530 L 170 490 L 175 450 L 185 410 L 170 380 L 150 340 L 120 320 L 110 280 L 85 250 L 60 210 L 40 170 L 55 130 L 95 110 L 125 70 L 170 50 L 225 30 L 265 25 L 300 35 L 340 55 Z';

/** The outline: stroke draws on over `dur` frames from `t0`, then the fill fades in. */
export const VnOutline: React.FC<{ id: string; t: number; t0?: number; dur?: number; fillT?: number; o?: number }> = ({ id, t, t0 = 0, dur = 22, fillT = 20, o = 1 }) => {
  const p = clamp((t - t0) / dur);
  const f = clamp((t - t0 - fillT) / 10);
  return (
    <g opacity={o}>
      <defs>
        <linearGradient id={`${id}fill`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1F4466" /><stop offset="1" stopColor="#16304A" /></linearGradient>
      </defs>
      <path d={VN_PATH} fill={`url(#${id}fill)`} opacity={f} stroke="none" />
      <path d={VN_PATH} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - easeOut(p)} fill="none" stroke={SCH.line} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
};

/** Three rice stalks over a paddy line, about 80 wide. */
export const RiceIcon: React.FC<{ x: number; y: number; on: number; t: number; s?: number }> = ({ x, y, on, t, s = 1 }) => {
  const c = on > 0.5 ? SCH.live : SCH.dim;
  const k = on > 0 ? backOut(clamp(on * 2)) : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (0.85 + 0.15 * k)})`} stroke={c} strokeWidth={4} fill="none" strokeLinecap="round" style={on > 0.5 ? { filter: `drop-shadow(0 0 8px ${SCH.glow})` } : undefined}>
      {[-22, 0, 22].map((dx, i) => (
        <g key={i} transform={`rotate(${Math.sin(t / 14 + i) * 3} ${dx} 20)`}>
          <path d={`M ${dx} 20 Q ${dx + 4} -6 ${dx + 10} -30`} />
          {[0, 1, 2, 3].map((j) => <path key={j} d={`M ${dx + 6 + j * 1.2} ${-6 - j * 8} l 10 -5`} />)}
        </g>
      ))}
      <path d="M -40 30 H 40 M -34 40 H 34" />
    </g>
  );
};

/** A container ship in profile, about 110 wide. */
export const ShipIcon: React.FC<{ x: number; y: number; on: number; t: number; s?: number }> = ({ x, y, on, t, s = 1 }) => {
  const c = on > 0.5 ? SCH.live : SCH.dim;
  return (
    <g transform={`translate(${x} ${y + Math.sin(t / 12) * 2}) scale(${s})`} stroke={c} strokeWidth={4} fill="none" strokeLinejoin="round" style={on > 0.5 ? { filter: `drop-shadow(0 0 8px ${SCH.glow})` } : undefined}>
      <path d="M -56 4 H 56 L 42 28 H -42 Z" />
      <rect x={-40} y={-18} width={26} height={22} /><rect x={-12} y={-18} width={26} height={22} /><rect x={-26} y={-40} width={26} height={22} />
      <rect x={30} y={-26} width={16} height={30} />
    </g>
  );
};

/** Where the icons sit in the map's own box, and the frame (relative to the shot) each lights up. */
export const VN_ICONS: { kind: 'factory' | 'rice' | 'ship'; x: number; y: number; at: number }[] = [
  { kind: 'factory', x: 250, y: 120, at: 0 },
  { kind: 'rice', x: 180, y: 180, at: 6 },
  { kind: 'ship', x: 342, y: 250, at: 12 },
  { kind: 'factory', x: 250, y: 420, at: 18 },
  { kind: 'ship', x: 340, y: 560, at: 24 },
  { kind: 'rice', x: 200, y: 720, at: 30 },
  { kind: 'factory', x: 290, y: 680, at: 36 },
  { kind: 'rice', x: 230, y: 800, at: 42 },
];

export const VnIcons: React.FC<{ t: number; t0: number; litAll?: boolean }> = ({ t, t0, litAll = false }) => (
  <g>
    {VN_ICONS.map((ic, i) => {
      const on = litAll ? 1 : clamp((t - t0 - ic.at) / 8);
      if (ic.kind === 'factory') return <PlantIcon key={i} x={ic.x} y={ic.y} kind="factory" on={on} t={t} s={0.62} />;
      if (ic.kind === 'rice') return <RiceIcon key={i} x={ic.x} y={ic.y} on={on} t={t} s={0.8} />;
      return <ShipIcon key={i} x={ic.x} y={ic.y} on={on} t={t} s={0.62} />;
    })}
  </g>
);
