import React from 'react';
import { Glow } from '../light';

// A pillow fort: stacks of pillows for the walls, a striped blanket thrown over the top, an arched opening a
// character can sit in, a quilt on the floor inside and fairy lights strung round the arch and along the ridge.
// Placed on the floor at (x, y) = the middle of the front of the fort, `s` the scale (about 600 wide and 330 tall at s = 1;
// the opening is 300 wide and 205 tall, so a seated Pip at scale 0.75 fits: hips at about (x - 20 s, y - 20 s)).
// Draw order for a seated character: <PillowFort layer="back" />, the character, <PillowFort layer="front" />.

const PASTELS = ['#E8A0B4', '#9FC6E8', '#F2D58A', '#A8D8B8', '#C4A8E0', '#F2B48A'];

/** A plump cushion: a rounded rectangle with pinched corners, a seam and a shaded left side. */
const Pillow: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; c: string; stripe?: boolean }> = ({ x, y, w, h, rot = 0, c, stripe = false }) => {
  const r = Math.min(w, h) * 0.32;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={r} fill={c} />
      {stripe ? [-0.25, 0.05, 0.35].map((k, i) => <rect key={i} x={-w / 2 + w * (0.5 + k) - 5} y={-h / 2 + 4} width={10} height={h - 8} fill="#fff" opacity={0.28} />) : null}
      <rect x={-w / 2} y={-h / 2} width={w * 0.32} height={h} rx={r} fill="#1B1030" opacity={0.2} />
      <path d={`M ${-w / 2 + 6} ${-h / 2 + 6} Q ${-w * 0.2} ${-h * 0.18} ${-w / 2 + 6} ${h / 2 - 6} M ${w / 2 - 6} ${-h / 2 + 6} Q ${w * 0.2} ${-h * 0.18} ${w / 2 - 6} ${h / 2 - 6}`} stroke="#1B1030" strokeWidth={2.4} opacity={0.35} fill="none" strokeLinecap="round" />
      <ellipse cx={w * 0.12} cy={-h * 0.18} rx={w * 0.22} ry={h * 0.1} fill="#fff" opacity={0.22} />
      <path d={`M ${w / 2 - 3} ${-h / 2 + r} L ${w / 2 - 3} ${h / 2 - r}`} stroke="#FFD39A" strokeWidth={2.4} opacity={0.5} />
    </g>
  );
};

/** Fairy lights along a quadratic curve from a to b with a control point: dark wire, twinkling warm and pink bulbs with glows. */
const Fairy: React.FC<{ from: [number, number]; ctrl: [number, number]; to: [number, number]; n: number; t: number; o: number; seed: number }> = ({ from, ctrl, to, n, t, o, seed }) => (
  <g>
    <path d={`M ${from[0]} ${from[1]} Q ${ctrl[0]} ${ctrl[1]} ${to[0]} ${to[1]}`} stroke="#120C1E" strokeWidth={2.4} fill="none" />
    {Array.from({ length: n }).map((_, i) => {
      const k = (i + 0.5) / n;
      const px = (1 - k) * (1 - k) * from[0] + 2 * (1 - k) * k * ctrl[0] + k * k * to[0];
      const py = (1 - k) * (1 - k) * from[1] + 2 * (1 - k) * k * ctrl[1] + k * k * to[1] + 4;
      const tw = o * (0.7 + 0.3 * Math.sin(t / 5 + i * 1.9 + seed));
      const c = i % 3 === 1 ? '#FFB4C8' : i % 3 === 2 ? '#BFE6FF' : '#FFE2B0';
      return (
        <g key={i}>
          <circle cx={px} cy={py + 5} r={5} fill={c} opacity={0.35 + 0.65 * tw} />
          <circle cx={px} cy={py + 5} r={22} fill="url(#g3warm)" opacity={0.5 * tw} style={{ mixBlendMode: 'screen' }} />
        </g>
      );
    })}
  </g>
);

export const PillowFort: React.FC<{ x: number; y: number; s?: number; t?: number; layer?: 'all' | 'back' | 'front'; lights?: number }> = ({ x, y, s = 1, t = 0, layer = 'all', lights = 1 }) => {
  const back = layer !== 'front';
  const front = layer !== 'back';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {back ? (
        <g>
          <ellipse cx={0} cy={4} rx={360} ry={34} fill="#000" opacity={0.42} />
          {/* the walls: two stacks of pillows either side of the opening, a back row above */}
          {[[-215, -60, 130, 120, -4], [-232, -170, 120, 112, 6], [-205, -262, 112, 84, -9], [215, -60, 130, 120, 5], [232, -170, 120, 112, -5], [205, -262, 112, 84, 8], [-90, -250, 150, 90, -5], [92, -252, 150, 90, 4], [0, -270, 130, 70, 0]].map(([px, py, pw, ph, pr], i) => (
            <Pillow key={i} x={px} y={py} w={pw} h={ph} rot={pr} c={PASTELS[(i * 2 + 1) % PASTELS.length]} stripe={i % 4 === 1} />
          ))}
          {/* the inside: a dark arch, warm and soft */}
          <path d="M -150 0 L -150 -118 Q -150 -208 0 -212 Q 150 -208 150 -118 L 150 0 Z" fill="#2A1E3E" />
          <path d="M -150 0 L -150 -118 Q -150 -200 -40 -210 L -40 0 Z" fill="#150C26" opacity={0.5} />
          <Glow x={0} y={-90} r={230} o={0.5 * lights} />
          {/* the quilt on the floor inside */}
          <ellipse cx={0} cy={-6} rx={190} ry={22} fill="#B5566A" />
          <ellipse cx={0} cy={-9} rx={170} ry={17} fill="#D9788A" />
          {[-90, -30, 30, 90].map((qx) => (
            <path key={qx} d={`M ${qx} ${-24} L ${qx + 6} 5`} stroke="#FFD0D8" strokeWidth={2.4} opacity={0.5} />
          ))}
          {/* the blanket thrown over the ridge: stripes, a scalloped lip over the arch */}
          <path d="M -300 -200 Q -270 -330 0 -336 Q 270 -330 300 -200 L 262 -176 Q 240 -224 166 -214 Q 130 -246 0 -250 Q -130 -246 -166 -214 Q -240 -224 -262 -176 Z" fill="#5E7CC0" />
          {[-240, -190, -140, -90, -40, 10, 60, 110, 160, 210].map((bx, i) => (
            <path key={bx} d={`M ${bx} ${-326 + Math.abs(bx) * 0.12} L ${bx * 1.08} ${-190 - Math.abs(bx) * 0.05}`} stroke={i % 2 ? '#F2D58A' : '#E8A0B4'} strokeWidth={14} opacity={0.85} />
          ))}
          <path d="M 300 -200 Q 270 -330 0 -336" stroke="#FFD39A" strokeWidth={3} fill="none" opacity={0.45} />
          <Fairy from={[-262, -178]} ctrl={[0, -310]} to={[262, -178]} n={13} t={t} o={lights} seed={1} />
          <Fairy from={[-148, -6]} ctrl={[0, -250]} to={[148, -6]} n={11} t={t} o={lights} seed={4} />
        </g>
      ) : null}
      {front ? (
        <g>
          {/* low cushions at the foot of the walls, a floor pillow and a spilled blanket corner */}
          <Pillow x={-205} y={-34} w={130} h={64} rot={-3} c="#F2B48A" stripe />
          <Pillow x={212} y={-30} w={120} h={60} rot={4} c="#9FC6E8" />
          <Pillow x={-300} y={-28} w={96} h={52} rot={-9} c="#A8D8B8" />
          <path d="M 120 6 Q 180 18 260 8 Q 300 4 330 12 L 320 -6 Q 240 -14 150 -4 Z" fill="#E8A0B4" />
        </g>
      ) : null}
    </g>
  );
};
