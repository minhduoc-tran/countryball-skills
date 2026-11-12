import React from 'react';
import { FONT } from '../../engine';

// The solar-system slide: "HỆ MẶT TRỜI" with the Sun and eight planets in a row, drawn in a 1000 x 562 box (a white
// slide). Used small on the classroom's projector screen and full frame as the close-up.

const PLANETS: { r: number; c: string; ring?: boolean; band?: boolean }[] = [
  { r: 11, c: '#B7B2AA' },
  { r: 18, c: '#E5B77A' },
  { r: 20, c: '#4C8FD9' },
  { r: 15, c: '#D9674A' },
  { r: 46, c: '#D9A56A', band: true },
  { r: 38, c: '#E3C98A', ring: true },
  { r: 27, c: '#8ED6D9' },
  { r: 26, c: '#4A63C9' },
];

export const SolarSlide: React.FC<{ t: number; title?: boolean }> = ({ t, title = true }) => (
  <g>
    <rect width={1000} height={562} fill="#FBFAF4" />
    <rect width={1000} height={562} fill="#1C2250" opacity={0.0} />
    {title ? <text x={500} y={104} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={84} fill="#1C2250">HỆ MẶT TRỜI</text> : null}
    {/* the Sun, half off the left edge, with a slow pulse */}
    <circle cx={-20} cy={380} r={170 + Math.sin(t / 10) * 4} fill="#FFB347" />
    <circle cx={-20} cy={380} r={130} fill="#FFD36E" />
    {/* the orbits and the planets, each bobbing on its own beat */}
    {PLANETS.map((p, i) => {
      const x = 230 + i * 98;
      const y = 400 + Math.sin(t / 14 + i * 1.3) * 10;
      return (
        <g key={i}>
          <ellipse cx={-20} cy={380} rx={x + 20} ry={x * 0.22} fill="none" stroke="#C9CCDA" strokeWidth={2} opacity={0.5} transform={`translate(0 ${-10 + i * 2})`} />
          <circle cx={x} cy={y} r={p.r} fill={p.c} />
          {p.band ? <path d={`M ${x - p.r} ${y - 8} h ${p.r * 2} M ${x - p.r + 4} ${y + 10} h ${p.r * 2 - 8}`} stroke="#B07A44" strokeWidth={4} opacity={0.6} /> : null}
          {p.ring ? <ellipse cx={x} cy={y} rx={p.r * 1.9} ry={p.r * 0.45} fill="none" stroke="#C9A860" strokeWidth={5} transform={`rotate(-16 ${x} ${y})`} /> : null}
          <circle cx={x - p.r * 0.3} cy={y - p.r * 0.3} r={p.r * 0.25} fill="#fff" opacity={0.3} />
        </g>
      );
    })}
  </g>
);
