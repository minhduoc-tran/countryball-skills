import React from 'react';
import { Glow, rnd } from '../../engine';

// A sunny residential sidewalk seen side-on, scrolling past walkers who stay put on screen (no signs, no text).
// Everything is a function of `t`; `v` = px per frame at the ground layer.

const wrap = (base: number, off: number, period: number, margin = 300) => ((((base - off) % period) + period) % period) - margin;

export const SunnySidewalk: React.FC<{ t: number; v?: number; ground?: number }> = ({ t, v = 5, ground = 860 }) => {
  const o = t * v;
  return (
    <g>
      <defs>
        <linearGradient id="ssky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4F9BE6" />
          <stop offset="0.7" stopColor="#B7DDF5" />
          <stop offset="1" stopColor="#FFE9B8" />
        </linearGradient>
      </defs>
      <rect x={-400} y={-400} width={2720} height={ground + 400} fill="url(#ssky)" />
      <Glow x={1500} y={300} r={900} o={0.55} />
      <circle cx={1500} cy={300} r={70} fill="#FFF6D6" />
      {/* far row of houses, pastel */}
      {Array.from({ length: 7 }).map((_, i) => {
        const x = wrap(i * 460, o * 0.2, 3220);
        const h = 230 + rnd(3, i) * 120;
        const col = ['#F2C9A0', '#E8B8A8', '#F4DDA8', '#C8D8B8'][i % 4];
        return (
          <g key={i}>
            <rect x={x} y={ground - 110 - h} width={380} height={h} fill={col} />
            <path d={`M ${x - 16} ${ground - 110 - h} L ${x + 190} ${ground - 110 - h - 90} L ${x + 396} ${ground - 110 - h} Z`} fill="#B8604A" />
            {[0, 1].map((k) => (
              <rect key={k} x={x + 60 + k * 170} y={ground - 110 - h + 60} width={90} height={100} fill="#FFF0C8" stroke="#8A6A4A" strokeWidth={6} />
            ))}
            <rect x={x} y={ground - 130} width={380} height={20} fill="#000" opacity={0.08} />
          </g>
        );
      })}
      <rect x={-400} y={ground - 110} width={2720} height={110} fill="#9CBF7A" />
      {/* trees and lamp posts */}
      {Array.from({ length: 5 }).map((_, i) => {
        const x = wrap(i * 640 + 140, o * 0.55, 3200);
        return (
          <g key={i}>
            <rect x={x - 14} y={ground - 330} width={28} height={250} fill="#6A4A34" />
            <circle cx={x} cy={ground - 400} r={110} fill="#4E9A5A" />
            <circle cx={x - 70} cy={ground - 350} r={76} fill="#5AAA64" />
            <circle cx={x + 74} cy={ground - 356} r={80} fill="#43884E" />
            <circle cx={x - 30} cy={ground - 450} r={44} fill="#7CC37E" opacity={0.7} />
          </g>
        );
      })}
      {Array.from({ length: 4 }).map((_, i) => {
        const x = wrap(i * 800 + 420, o * 0.8, 3200);
        return <path key={i} d={`M ${x} ${ground - 70} L ${x} ${ground - 380} Q ${x} ${ground - 400} ${x + 30} ${ground - 400} L ${x + 60} ${ground - 400}`} stroke="#3A3444" strokeWidth={10} fill="none" />;
      })}
      {/* picket fence */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = wrap(i * 110, o * 0.9, 3300);
        return <path key={i} d={`M ${x} ${ground - 40} L ${x} ${ground - 130} L ${x + 18} ${ground - 150} L ${x + 36} ${ground - 130} L ${x + 36} ${ground - 40} Z`} fill="#FFF6E8" stroke="#C8B89A" strokeWidth={3} />;
      })}
      <rect x={-400} y={ground - 100} width={2720} height={12} fill="#FFF6E8" />
      {/* the sidewalk, its joints scrolling at walking speed, then the kerb and road */}
      <rect x={-400} y={ground} width={2720} height={150} fill="#D8CDBE" />
      {Array.from({ length: 16 }).map((_, i) => {
        const x = wrap(i * 200, o, 3200);
        return <rect key={i} x={x} y={ground} width={4} height={150} fill="#B8AB98" />;
      })}
      <rect x={-400} y={ground + 150} width={2720} height={18} fill="#BFB3A0" />
      <rect x={-400} y={ground + 168} width={2720} height={700} fill="#5A5864" />
      <rect x={-400} y={ground} width={2720} height={6} fill="#FFF3D0" opacity={0.7} />
    </g>
  );
};
