import React from 'react';
import { FONT } from '../../engine/fonts';
import { AircraftTop } from '../../countryball/aircraft-top-view';

// Chapter B flat icons (ink outline, muted fills), each centred on (0, 0) inside roughly a 260 x 220 box.
const INK = '#151515';
const o = { stroke: INK, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** Railway station: low hall with pediment, clock, door, and rails in front. */
export const StationIcon: React.FC = () => (
  <g>
    <rect x={-112} y={-24} width={224} height={92} fill="#C9B98A" {...o} />
    <polygon points="-124,-24 0,-82 124,-24" fill="#9C5B45" {...o} />
    <circle cx={0} cy={-38} r={17} fill="#F6F0DC" {...o} />
    <path d="M0,-38 L0,-48 M0,-38 L8,-34" stroke={INK} strokeWidth={4} strokeLinecap="round" />
    <rect x={-22} y={8} width={44} height={60} fill="#4A3B2E" {...o} />
    {[-80, -56, 56, 80].map((x) => <rect key={x} x={x - 9} y={4} width={18} height={26} fill="#3B5878" {...o} strokeWidth={4} />)}
    <path d="M-130,92 L130,92 M-130,108 L130,108" stroke="#8D949B" strokeWidth={6} strokeLinecap="round" />
    {Array.from({ length: 11 }, (_, i) => <line key={i} x1={-120 + i * 24} y1={86} x2={-120 + i * 24} y2={114} stroke="#5B4A3A" strokeWidth={6} strokeLinecap="round" />)}
  </g>
);

/** Warehouse: shed with a big double door, crates beside it. */
export const WarehouseIcon: React.FC = () => (
  <g>
    <polygon points="-116,72 -116,-18 0,-84 116,-18 116,72" fill="#B9A87F" {...o} />
    <rect x={-52} y={-6} width={104} height={78} fill="#6B4C36" {...o} />
    <path d="M0,-6 L0,72 M-52,-6 L52,72 M52,-6 L-52,72" stroke="#3A281B" strokeWidth={5} />
    <rect x={-150} y={32} width={40} height={40} fill="#D9B26A" {...o} /><rect x={110} y={44} width={34} height={28} fill="#D9B26A" {...o} />
    <rect x={118} y={20} width={30} height={26} fill="#C39A52" {...o} />
  </g>
);

/** Airfield: runway with dashes and a small jet parked at its end. */
export const AirfieldIcon: React.FC = () => (
  <g>
    <rect x={-130} y={-30} width={260} height={90} rx={8} fill="#4A4F58" {...o} />
    <path d="M-110,15 L110,15" stroke="#F4F4F4" strokeWidth={6} strokeDasharray="28 18" />
    <rect x={-130} y={-70} width={60} height={34} fill="#9AA09A" {...o} /><path d="M-100,-70 L-100,-96" stroke={INK} strokeWidth={5} />
    <AircraftTop id="icoaf" kind="f4" x={40} y={-6} size={120} heading={0} shadow={false} />
  </g>
);

/** Power plant: two cooling towers, a chimney and a lightning bolt. */
export const PowerPlantIcon: React.FC = () => (
  <g>
    <path d="M-120,76 Q-96,10 -104,-50 L-40,-50 Q-48,10 -24,76 Z" fill="#B5B8B9" {...o} />
    <path d="M-10,76 Q14,24 6,-30 L66,-30 Q58,24 82,76 Z" fill="#A4A8AA" {...o} />
    <rect x={96} y={-70} width={28} height={146} fill="#8C5A48" {...o} />
    <rect x={96} y={-50} width={28} height={14} fill="#E8E2D2" stroke="none" />
    <path d="M-76,-58 Q-90,-84 -70,-96 M36,-38 Q24,-70 44,-82" fill="none" stroke="#E8EEF4" strokeWidth={10} strokeLinecap="round" opacity={0.75} />
    <polygon points="-6,-8 22,-8 8,22 30,22 -18,70 -4,34 -24,34" fill="#FFCD00" {...o} strokeWidth={4} />
  </g>
);

/** Calendar page: red header, big number, small month line. */
export const CalendarPage: React.FC<{ day: string; month: string; w?: number; sx?: number }> = ({ day, month, w = 420, sx = 1 }) => (
  <g transform={`scale(${sx},1)`}>
    <rect x={-w / 2 + 12} y={-w * 0.5 + 18} width={w} height={w * 1.02} rx={20} fill="#000" opacity={0.35} />
    <rect x={-w / 2} y={-w * 0.5} width={w} height={w * 1.02} rx={20} fill="#F6F2E7" stroke={INK} strokeWidth={6} />
    <path d={`M${-w / 2},${-w * 0.5 + 100} L${-w / 2},${-w * 0.5 + 20} Q${-w / 2},${-w * 0.5} ${-w / 2 + 20},${-w * 0.5} L${w / 2 - 20},${-w * 0.5} Q${w / 2},${-w * 0.5} ${w / 2},${-w * 0.5 + 20} L${w / 2},${-w * 0.5 + 100} Z`} fill="#C9343A" stroke={INK} strokeWidth={6} />
    <text y={-w * 0.5 + 72} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#FFF">{month}</text>
    <text y={w * 0.18} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.46} fill="#1E1E24">{day}</text>
    {[-1, 1].map((k) => <rect key={k} x={k * w * 0.28 - 8} y={-w * 0.5 - 22} width={16} height={44} rx={8} fill="#8D949B" stroke={INK} strokeWidth={4} />)}
  </g>
);

/** Capitol-style domed building (generic parliament), about 300 x 220. */
export const CapitolIcon: React.FC = () => (
  <g>
    <rect x={-150} y={20} width={300} height={56} fill="#E8E4D6" {...o} />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-130 + i * 32} y={26} width={14} height={44} fill="#C9C4B0" stroke={INK} strokeWidth={3} />)}
    <rect x={-84} y={-16} width={168} height={36} fill="#EFEBDD" {...o} />
    <rect x={-54} y={-50} width={108} height={34} fill="#E8E4D6" {...o} />
    <path d="M-48,-50 Q-48,-130 0,-132 Q48,-130 48,-50 Z" fill="#F4F1E6" {...o} />
    <path d="M0,-132 L0,-168" stroke={INK} strokeWidth={5} /><polygon points="0,-168 30,-158 0,-148" fill="#3C3B6E" {...o} strokeWidth={3} />
    {[-24, 0, 24].map((x) => <path key={x} d={`M${x},-50 L${x * 0.6},-120`} stroke="#B9B49E" strokeWidth={4} />)}
  </g>
);

/** Rubber-stamp style label, rotated, with a double border. */
export const Stamp: React.FC<{ text: string; color?: string; size?: number; rot?: number }> = ({ text, color = '#D83A3A', size = 80, rot = -10 }) => {
  const w = text.length * size * 0.62 + 60, h = size * 1.5;
  return (
    <g transform={`rotate(${rot})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill="none" stroke={color} strokeWidth={8} />
      <rect x={-w / 2 + 12} y={-h / 2 + 12} width={w - 24} height={h - 24} rx={8} fill="none" stroke={color} strokeWidth={3} />
      <text y={size * 0.34} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} letterSpacing={3}>{text}</text>
    </g>
  );
};

/** Plain silhouette bust (head + shoulders) for name cards of real people: respectful, no face. */
export const Silhouette: React.FC<{ r?: number; fill?: string }> = ({ r = 60, fill = '#2C3A4C' }) => (
  <g>
    <circle r={r} fill="#C6D0DB" />
    <circle cy={-r * 0.18} r={r * 0.3} fill={fill} />
    <path d={`M${-r * 0.62},${r * 0.9} Q${-r * 0.62},${r * 0.28} 0,${r * 0.22} Q${r * 0.62},${r * 0.28} ${r * 0.62},${r * 0.9} Z`} fill={fill} />
    <circle r={r} fill="none" stroke={INK} strokeWidth={5} />
  </g>
);
