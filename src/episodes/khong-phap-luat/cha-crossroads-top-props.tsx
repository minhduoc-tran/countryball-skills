import React from 'react';
import { Glow, FONT } from '../../engine';

// Chapter A local props for the crossroads seen from above (1920 x 1080 frame, the junction centre at 960, 540, the
// roads 540 wide: the vertical arm x 690-1230, the horizontal arm y 270-810): scooters, a taxi, the ambulance, and
// horn marks. A vehicle points along its own +y when rot = 0 (nose up the screen = rot 0, rot is clockwise degrees).

const INK = '#14101C';

/** A scooter and rider from above: body, handlebar, a head with hair, shoulders. `lean` leans it over; `down` lays it flat. */
export const TopBike: React.FC<{ x: number; y: number; rot?: number; color?: string; shirt?: string; s?: number; wobble?: number; dent?: boolean; helmet?: boolean; rider?: boolean }> = ({
  x, y, rot = 0, color = '#B8483E', shirt = '#3E6A8A', s = 1, wobble = 0, dent = false, helmet = false, rider = true,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot + wobble}) scale(${s})`}>
    <ellipse cx={4} cy={6} rx={30} ry={74} fill="#000" opacity={0.28} />
    <rect x={-15} y={-70} width={30} height={26} rx={9} fill="#2A2833" stroke={INK} strokeWidth={3} />
    <rect x={-20} y={-48} width={40} height={96} rx={18} fill={color} stroke={INK} strokeWidth={3.5} />
    <rect x={-12} y={-6} width={24} height={46} rx={10} fill="#1A1820" />
    <rect x={-46} y={-54} width={92} height={9} rx={4.5} fill={INK} />
    <circle cx={-42} cy={-50} r={6} fill="#6E6C7C" /><circle cx={42} cy={-50} r={6} fill="#6E6C7C" />
    <rect x={-10} y={46} width={20} height={20} rx={6} fill="#2A2833" stroke={INK} strokeWidth={3} />
    {dent ? <path d="M -20 -30 L -8 -22 L -16 -12 L -6 -4" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" /> : null}
    {rider ? (
      <g>
        <ellipse cx={0} cy={2} rx={27} ry={17} fill={shirt} stroke={INK} strokeWidth={3} />
        <path d="M -24 -4 L -40 -48 M 24 -4 L 40 -48" stroke={shirt} strokeWidth={13} strokeLinecap="round" />
        <circle cx={0} cy={-6} r={15} fill={helmet ? '#E9C46A' : '#2A1C18'} stroke={INK} strokeWidth={3} />
        {helmet ? <path d="M -9 -12 Q 0 -20 9 -12" stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.6} /> : <path d="M -7 -12 Q 0 -17 7 -12" stroke="#5A4034" strokeWidth={3} fill="none" />}
      </g>
    ) : null}
  </g>
);

/** A small taxi from above (green body, a roof light), 100 x 200 at s = 1. */
export const TopCar: React.FC<{ x: number; y: number; rot?: number; color?: string; s?: number; roofLight?: boolean }> = ({ x, y, rot = 0, color = '#3FA66A', s = 1, roofLight = true }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={6} cy={8} rx={58} ry={112} fill="#000" opacity={0.28} />
    <rect x={-50} y={-100} width={100} height={200} rx={26} fill={color} stroke={INK} strokeWidth={4} />
    <rect x={-40} y={-66} width={80} height={32} rx={8} fill="#2A3A52" stroke={INK} strokeWidth={3} />
    <rect x={-40} y={46} width={80} height={26} rx={8} fill="#2A3A52" stroke={INK} strokeWidth={3} />
    <rect x={-42} y={-30} width={84} height={72} rx={10} fill={color} stroke={INK} strokeWidth={3} />
    <path d="M -34 -22 L -34 34 M 34 -22 L 34 34" stroke="#FFFFFF" strokeWidth={3} opacity={0.3} />
    <circle cx={-34} cy={-96} r={7} fill="#FFE7B0" /><circle cx={34} cy={-96} r={7} fill="#FFE7B0" />
    <circle cx={-34} cy={96} r={6} fill="#D8323C" /><circle cx={34} cy={96} r={6} fill="#D8323C" />
    {roofLight ? <rect x={-20} y={0} width={40} height={14} rx={4} fill="#F6C23B" stroke={INK} strokeWidth={2.5} /> : null}
  </g>
);

/** An ambulance from above (white, red cross, flashing lights): `f` the frame, drives the light flash. 110 x 250. */
export const TopAmbulance: React.FC<{ x: number; y: number; rot?: number; s?: number; f: number }> = ({ x, y, rot = 0, s = 1, f }) => {
  const a = Math.floor(f / 4) % 2 === 0;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <Glow x={-30} y={-110} r={150} kind="red" o={a ? 0.8 : 0.1} />
      <Glow x={30} y={-110} r={150} kind="cool" o={a ? 0.1 : 0.8} />
      <ellipse cx={6} cy={10} rx={64} ry={136} fill="#000" opacity={0.28} />
      <rect x={-55} y={-125} width={110} height={250} rx={22} fill="#F4F4F4" stroke={INK} strokeWidth={4} />
      <rect x={-44} y={-100} width={88} height={34} rx={8} fill="#2A3A52" stroke={INK} strokeWidth={3} />
      <rect x={-55} y={-4} width={110} height={12} fill="#D8323C" opacity={0.9} />
      <path d="M -14 34 L 14 34 M 0 20 L 0 48" stroke="#D8323C" strokeWidth={14} strokeLinecap="butt" />
      <rect x={-46} y={-112} width={34} height={14} rx={4} fill={a ? '#FF4538' : '#7A2A2A'} stroke={INK} strokeWidth={2.5} />
      <rect x={12} y={-112} width={34} height={14} rx={4} fill={a ? '#2A3A7A' : '#4A7CFF'} stroke={INK} strokeWidth={2.5} />
      <circle cx={-38} cy={-122} r={6} fill="#FFE7B0" /><circle cx={38} cy={-122} r={6} fill="#FFE7B0" />
    </g>
  );
};

/** Concentric horn marks ( )) ) from a point, pulsing with f. */
export const HornMarks: React.FC<{ x: number; y: number; f: number; rot?: number; color?: string; s?: number }> = ({ x, y, f, rot = 0, color = '#FFE27A', s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} fill="none" stroke={color} strokeLinecap="round">
    {[0, 1, 2].map((i) => {
      const k = ((f / 14 + i / 3) % 1 + 1) % 1;
      const r = 40 + k * 70;
      return <path key={i} d={`M ${-r * 0.8} ${-r * 0.7} A ${r} ${r} 0 0 1 ${r * 0.8} ${-r * 0.7}`} strokeWidth={9 * (1 - k)} opacity={0.9 * (1 - k)} />;
    })}
  </g>
);

/** A floating question mark over a head ("who goes first?"), bobbing. */
export const QMark: React.FC<{ x: number; y: number; f: number; s?: number }> = ({ x, y, f, s = 1 }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 5) * 5}) scale(${s})`}>
    <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={74} fill="#FFE27A" stroke={INK} strokeWidth={9} paintOrder="stroke">?</text>
  </g>
);

