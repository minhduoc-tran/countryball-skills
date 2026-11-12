import React from 'react';
import { clamp, easeIn, easeOut, rnd, FONT } from '../../engine';
import { PAL } from './kit-palette';

export { IceCreamStack, MegaTicket, Wallet50k, Dumbbell } from './kit-props-money';

// Props for the loop episode. Flat fills, a darker shade away from the light, a warm rim on the lit edge, contact
// shadows. Pure functions of t. x, y = CENTRE unless said.
//   <Notebook x y s t id fade? lines? flat? />  open notebook from above, ~460 x 300 at s 1: Pip's loop notes in
//       handwriting (Itim). fade 0..1 dissolves the writing line by line (cyan motes lift off) = it resets at 06:00.
//       lines: up to 6 strings, <= 13 characters each (default: his day's timetable). flat: squashed for lying on a desk.
//   <FlowerPot x y s t fall ground? ledge? />  terracotta pot + plant on a balcony ledge at (x, y = the ledge top).
//       fall 0 = sitting, 0-0.2 tips over the edge, 0.2-0.8 drops (spinning) to `ground` (default y + 520 s),
//       0.8-1 smash: shards, soil and the plant on the ground at 1. ledge: draws the concrete ledge slab (default true).
//   <PianoKeys x y w t press? />  keyboard close-up, x y = the front edge's centre, w wide (14 white keys); press =
//       indices of white keys held down (0..13), e.g. [2, 4, 6] for a chord.
//   <Butterfly x y s t />  wings flapping (~180 wide at s 1), body slightly bobbing.

const NOTE_LINES = ['06:00 chuông', 'mẹ: ăn sáng', 'Mo: kể chuyện', 'mèo, chậu hoa', '16:00 mưa', 'bà cụ, ngã tư'];

export const Notebook: React.FC<{ x: number; y: number; s?: number; t: number; id: string; fade?: number; lines?: string[]; flat?: boolean }> = ({ x, y, s = 1, t, id, fade = 0, lines = NOTE_LINES, flat = false }) => {
  const f = clamp(fade);
  const half = Math.ceil(lines.length / 2);
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * (flat ? 0.3 : 1)})`}>
      <ellipse cx={14} cy={162} rx={250} ry={24} fill="#000" opacity={flat ? 0 : 0.3} />
      <rect x={-238} y={-158} width={476} height={316} rx={10} fill="#2E4A6A" stroke="#14121C" strokeWidth={4} />
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <path d={`M 0 -150 L ${sd * 226} -146 L ${sd * 226} 148 L 0 152 Z`} fill={sd < 0 ? PAL.paperShade : PAL.paper} stroke="#7D705C" strokeWidth={2} />
          {Array.from({ length: 8 }).map((_, k) => <path key={k} d={`M ${sd * 18} ${-112 + k * 34} L ${sd * 212} ${-112 + k * 34}`} stroke="#A9C2D9" strokeWidth={2} opacity={0.7} />)}
        </g>
      ))}
      <path d="M 0 -150 L 0 152" stroke="#B8AE98" strokeWidth={6} />
      {/* the writing: each line dissolves on its own beat as fade runs */}
      {lines.map((ln, i) => {
        const page = i < half ? -1 : 1;
        const row = i < half ? i : i - half;
        const k = clamp((f - i * 0.1) * 2.6);
        const lx = page < 0 ? -210 : 22;
        const ly = -84 + row * 68;
        return (
          <g key={`${id}l${i}`}>
            <text x={lx} y={ly - k * 12} fontFamily={FONT.hand} fontSize={31} fill="#22315A" opacity={1 - k} style={k > 0 ? { filter: `blur(${k * 3}px)` } : undefined}>
              {ln}
            </text>
            {k > 0 && k < 1
              ? Array.from({ length: 5 }).map((_, m) => (
                  <circle key={m} cx={lx + 20 + rnd(i + 3, m) * 160} cy={ly - 10 - k * (30 + rnd(i + 4, m) * 50)} r={3 + rnd(i + 5, m) * 3} fill={PAL.cyan} opacity={(1 - k) * 0.9} />
                ))
              : null}
          </g>
        );
      })}
      {/* a doodle in the corner: the loop arrow */}
      <path d="M 170 120 a 22 22 0 1 1 -10 -30" stroke="#C8382E" strokeWidth={4} fill="none" opacity={1 - clamp((f - 0.6) * 3)} />
      <path d="M 156 82 l 8 10 l -12 4" stroke="#C8382E" strokeWidth={4} fill="none" opacity={1 - clamp((f - 0.6) * 3)} />
      <path d="M -226 -146 L 226 -146" stroke="#FFE2B0" strokeWidth={3} opacity={0.5} />
      <rect x={-8} y={-156} width={16} height={64} fill="#C8382E" opacity={0.9} />
    </g>
  );
};

export const FlowerPot: React.FC<{ x: number; y: number; s?: number; t: number; fall: number; ground?: number; ledge?: boolean }> = ({ x, y, s = 1, t, fall, ground, ledge = true }) => {
  const G = ground ?? y + 520 * s;
  const f = clamp(fall);
  const tip = easeOut(clamp(f / 0.2));
  const drop = easeIn(clamp((f - 0.2) / 0.6));
  const smash = clamp((f - 0.8) / 0.2);
  const px0 = x + 40 * s * tip + 30 * s * drop;
  const py0 = y + (G - y) * drop;
  const rot = 38 * tip + 230 * drop;
  const pot = (
    <g>
      <path d="M -44 -78 L 44 -78 L 34 0 L -34 0 Z" fill={PAL.terracotta} stroke="#5A2A1C" strokeWidth={4} strokeLinejoin="round" />
      <rect x={-50} y={-92} width={100} height={18} rx={4} fill="#A84E32" stroke="#5A2A1C" strokeWidth={4} />
      <path d="M 18 -74 L 12 -4" stroke="#8A3E28" strokeWidth={8} opacity={0.5} />
      <path d="M -40 -70 L -32 -6" stroke="#FFC98A" strokeWidth={3} opacity={0.5} />
      {/* the plant: leaves and two red flowers, swaying a little */}
      <g transform={`rotate(${Math.sin(t / 14) * 3} 0 -92)`}>
        {[[-46, -170], [-14, -200], [24, -186], [52, -140], [-60, -120]].map(([dx, dy], i) => (
          <path key={i} d={`M 0 -92 Q ${dx * 0.3} ${-92 + (dy + 92) * 0.6} ${dx} ${dy} Q ${dx * 0.7} ${-92 + (dy + 92) * 0.4} 0 -92 Z`} fill={i % 2 ? '#3F5E44' : PAL.leaf} stroke="#24361F" strokeWidth={2} />
        ))}
        {[[-14, -196], [26, -180]].map(([fx, fy], i) => (
          <g key={`fl${i}`}>
            {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={fx + Math.cos((a * Math.PI) / 180) * 10} cy={fy + Math.sin((a * Math.PI) / 180) * 10} r={8} fill="#E8553E" />)}
            <circle cx={fx} cy={fy} r={6} fill="#F2C14E" />
          </g>
        ))}
      </g>
    </g>
  );
  return (
    <g>
      {ledge ? (
        <g>
          <rect x={x - 150 * s} y={y} width={300 * s} height={34 * s} fill="#8A8294" stroke="#3A3446" strokeWidth={4} />
          <rect x={x - 150 * s} y={y} width={300 * s} height={6 * s} fill="#FFE2B0" opacity={0.4} />
          <rect x={x - 150 * s} y={y + 34 * s} width={300 * s} height={20 * s} fill="url(#g3aoDown)" />
        </g>
      ) : null}
      {f < 0.8 ? (
        <g>
          {drop > 0 ? <ellipse cx={px0} cy={G + 4} rx={60 * s * (0.4 + 0.6 * drop)} ry={10 * s} fill="#000" opacity={0.3 * drop} /> : null}
          {/* motion lines while it falls */}
          {drop > 0.1 ? [-30, 0, 30].map((dx) => <path key={dx} d={`M ${px0 + dx * s} ${py0 - 160 * s} l 0 ${-90 * s * drop}`} stroke="#F6EFE3" strokeWidth={4 * s} opacity={0.4} strokeLinecap="round" />) : null}
          <g transform={`translate(${px0} ${py0}) rotate(${rot} ${0} ${-40 * s}) scale(${s})`}>{pot}</g>
        </g>
      ) : (
        <g transform={`translate(${x + 70 * s} ${G}) scale(${s})`}>
          <ellipse cx={0} cy={4} rx={150} ry={22} fill="#000" opacity={0.3} />
          <ellipse cx={0} cy={0} rx={70 + 60 * smash} ry={14 + 8 * smash} fill="#4A3020" />
          {/* shards fly out and settle */}
          {Array.from({ length: 9 }).map((_, i) => {
            const a = (i / 9) * Math.PI + Math.PI;
            const d = (60 + rnd(61, i) * 110) * easeOut(smash);
            const sx = Math.cos(a) * d * 1.3;
            const sy = Math.sin(a) * d * 0.3 - Math.sin(smash * Math.PI) * 40 * rnd(62, i);
            return <path key={i} d="M -18 -8 L 14 -12 L 20 6 L -12 10 Z" transform={`translate(${sx} ${sy}) rotate(${rnd(63, i) * 360 + smash * 90})`} fill={i % 2 ? PAL.terracotta : '#A84E32'} stroke="#5A2A1C" strokeWidth={3} />;
          })}
          {/* the plant on its side */}
          <g transform="translate(-10 -6) rotate(-80)">
            {[[-30, -80], [0, -100], [26, -84]].map(([dx, dy], i) => <path key={i} d={`M 0 0 Q ${dx * 0.3} ${dy * 0.6} ${dx} ${dy} Q ${dx * 0.7} ${dy * 0.4} 0 0 Z`} fill={i % 2 ? '#3F5E44' : PAL.leaf} stroke="#24361F" strokeWidth={2} />)}
            <circle cx={0} cy={-100} r={10} fill="#E8553E" />
          </g>
        </g>
      )}
    </g>
  );
};

export const PianoKeys: React.FC<{ x: number; y: number; w: number; t: number; press?: number[] }> = ({ x, y, w, t, press = [] }) => {
  const n = 14;
  const kw = w / n;
  const kh = kw * 4.2;
  const black = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12];
  return (
    <g transform={`translate(${x - w / 2} ${y})`}>
      <rect x={-30} y={-kh - 90} width={w + 60} height={kh + 130} rx={14} fill="#1A1820" />
      <rect x={-30} y={-kh - 90} width={w + 60} height={70} rx={14} fill="#26222E" />
      <path d={`M -20 ${-kh - 24} L ${w + 20} ${-kh - 24}`} stroke="#C8382E" strokeWidth={4} opacity={0.8} />
      {Array.from({ length: n }).map((_, i) => {
        const dn = press.includes(i);
        return (
          <g key={i} transform={`translate(0 ${dn ? 10 : 0})`}>
            <rect x={i * kw + 2} y={-kh} width={kw - 4} height={kh} rx={6} fill={dn ? '#C9C0AE' : '#F4EFE4'} stroke="#2A2630" strokeWidth={3} />
            <rect x={i * kw + 2} y={-12} width={kw - 4} height={12 + (dn ? 0 : 8)} rx={4} fill={dn ? '#B8B0A0' : '#CFC8B8'} />
            {dn ? <rect x={i * kw + 2} y={-kh} width={kw - 4} height={kh * 0.45} fill="url(#g3aoDown)" /> : null}
            {dn ? <rect x={i * kw + 6} y={-kh * 0.35} width={kw - 12} height={8} rx={4} fill={PAL.cyan} opacity={0.5} /> : null}
          </g>
        );
      })}
      {black.map((i) => <rect key={`b${i}`} x={(i + 1) * kw - kw * 0.3} y={-kh} width={kw * 0.6} height={kh * 0.6} rx={4} fill="#14121A" stroke="#000" strokeWidth={2} />)}
      {black.map((i) => <rect key={`bh${i}`} x={(i + 1) * kw - kw * 0.22} y={-kh + 4} width={kw * 0.12} height={kh * 0.5} rx={2} fill="#4A4656" opacity={0.6} />)}
      <path d={`M 0 ${-kh} L ${w} ${-kh}`} stroke="#FFE2B0" strokeWidth={3} opacity={0.3 + 0.1 * Math.sin(t / 10)} />
    </g>
  );
};

export const Butterfly: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const k = 0.25 + 0.75 * Math.abs(Math.cos(t * 0.55));
  const bob = Math.sin(t * 0.55) * 6;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`scale(${sd * k} 1)`}>
          <path d="M 0 -6 Q 40 -78 92 -60 Q 104 -20 60 2 Q 30 8 0 0 Z" fill="#F29A3A" stroke="#2A1A14" strokeWidth={4} strokeLinejoin="round" />
          <path d="M 0 2 Q 46 10 64 42 Q 44 70 14 40 Q 4 22 0 6 Z" fill="#E86A2E" stroke="#2A1A14" strokeWidth={4} strokeLinejoin="round" />
          <path d="M 12 -12 Q 46 -50 80 -50" stroke="#2A1A14" strokeWidth={3} fill="none" />
          {[[78, -52], [88, -36], [52, 40]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={5} fill="#FFF3DC" />)}
        </g>
      ))}
      <ellipse cx={0} cy={0} rx={7} ry={32} fill="#2A1A14" />
      <path d="M -2 -30 Q -12 -56 -22 -62 M 2 -30 Q 12 -56 22 -62" stroke="#2A1A14" strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  );
};
