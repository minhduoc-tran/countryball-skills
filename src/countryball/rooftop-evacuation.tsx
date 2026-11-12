import React from 'react';
import { clamp, easeInOut, easeOut, hash, lerp } from './fx-math';
import { HeliSide } from './ground-helicopters';
import { pathAtDist, samplePath } from './fx-flight-path';
import { mix } from './map-context';

// <RooftopEvacuation>: the image of 29-30.4.1975 (Operation Frequent Wind) as a calm side view: the roof of an apartment block in Sài Gòn with
// a small helipad on top of the stair-box, a steel ladder up to it, a UH-1 Huey landing on the pad and a queue of tiny silhouettes (no faces)
// that walks along the roof, climbs the ladder one by one and boards.
//   <RooftopEvacuation id x? y? s? land? queue? n? t? tone? backdrop? />
//   x = centre of the building, y = the ROOF slab line (px; the building hangs below it, the pad is ~220 px above), s = scale
//   land 0..1   the Huey flies in from the right (0-0.7), flares and sets down (0.7-1); the rotor keeps turning with t
//   queue 0..1  the queue boards (n figures, default 8): 0 = all waiting on the roof, 1 = all gone aboard
//   t frames (rotor, flutter)     tone 'day' | 'dusk'      backdrop: sky + neighbouring roofs (default true)
// Pure function of its props.

const INK = '#1B1B1E';
const PAD = { x: 170, top: -232 };                                  // helipad deck centre + deck level (relative to the roof line)
const LADDER: [number, number] = [-36, 0];                          // foot of the ladder

export const RooftopEvacuation: React.FC<{ id: string; x?: number; y?: number; s?: number; land?: number; queue?: number; n?: number; t?: number; tone?: 'day' | 'dusk'; backdrop?: boolean }> = ({
  id, x = 900, y = 760, s = 1, land = 1, queue = 0, n = 8, t = 0, tone = 'day', backdrop = true,
}) => {
  const dusk = tone === 'dusk', T = (c: string) => (dusk ? mix(c, '#9A6A60', 0.3) : c), L = clamp(land), q = clamp(queue);
  const hk = (200 * 1.9) / 200;                                       // HeliSide size 380 -> k = 1.9
  const fly = easeOut(clamp(L / 0.7)), set = easeInOut(clamp((L - 0.7) / 0.3));
  const hx = x + (PAD.x + 0 * hk) * s + (1 - fly) * 1100 * s, hy = y + (PAD.top - 22 * hk) * s - (1 - set) * 150 * s - (1 - fly) * 230 * s;
  const path = samplePath([[x + (-330) * s, y], [x + LADDER[0] * s, y], [x + (PAD.x - 150) * s, y + (PAD.top + 8) * s], [x + (PAD.x - 40) * s, y + (PAD.top + 8) * s]], 10);
  const waitX = (k: number) => x + (-120 - k * 38) * s;
  return (
    <g>
      {backdrop && (
        <g>
          <defs><linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={dusk ? '#6D6FA6' : '#8EC3E8'} /><stop offset="1" stopColor={dusk ? '#F7B77A' : '#E3F1F7'} /></linearGradient></defs>
          <rect width={1920} height={1080} fill={`url(#${id}-sky)`} />
          {dusk && <circle cx={300} cy={y - 40} r={120} fill="#FFD9A0" opacity={0.7} />}
          {Array.from({ length: 12 }, (_, i) => { const bw = 130 + hash(i, 1) * 90, bx = i * 190 - 60, bh = 160 + hash(i, 2) * 240; return <g key={i}><rect x={bx} y={y + 60 - bh * 0.6 + 140} width={bw} height={bh} fill={T(['#B9B2A2', '#C4BBA6', '#A8A394'][i % 3])} stroke={INK} strokeWidth={2} />{Array.from({ length: 6 }, (_, w) => <rect key={w} x={bx + 14 + (w % 3) * 38} y={y + 80 - bh * 0.6 + 140 + Math.floor(w / 3) * 44} width={22} height={26} fill={T('#4E6672')} />)}</g>; })}
        </g>
      )}
      <g transform={`translate(${x},${y}) scale(${s})`} strokeLinejoin="round">
        {/* building below the roof line */}
        <rect x={-420} y={0} width={840} height={400} fill={T('#D9D0B8')} stroke={INK} strokeWidth={4} />
        {Array.from({ length: 4 }, (_, r) => Array.from({ length: 7 }, (_, c) => <g key={`${r}${c}`}><rect x={-390 + c * 118} y={30 + r * 90} width={74} height={56} fill={T('#3E5864')} stroke={INK} strokeWidth={2.4} /><rect x={-396 + c * 118} y={82 + r * 90} width={86} height={8} fill={T('#BFB59A')} stroke={INK} strokeWidth={1.6} /></g>))}
        <rect x={-436} y={-14} width={872} height={20} fill={T('#EDE6D2')} stroke={INK} strokeWidth={4} />
        {/* stair-box and helipad on top of it */}
        <rect x={PAD.x - 150} y={PAD.top + 14} width={300} height={-PAD.top - 14 - 6} fill={T('#CFC6AE')} stroke={INK} strokeWidth={4} />
        <rect x={PAD.x - 120} y={PAD.top + 40} width={90} height={-PAD.top - 60} fill={T('#7B7F86')} stroke={INK} strokeWidth={3} />
        {[0, 1, 2].map((i) => <line key={i} x1={PAD.x - 100 + i * 40} y1={PAD.top + 14} x2={PAD.x - 100 + i * 40 - 20} y2={-6} stroke={INK} strokeWidth={4} />)}
        <rect x={PAD.x - 170} y={PAD.top} width={340} height={16} fill={T('#BDB8A6')} stroke={INK} strokeWidth={4} />
        <ellipse cx={PAD.x} cy={PAD.top - 1} rx={118} ry={9} fill={T('#7D8288')} stroke={INK} strokeWidth={2.4} />
        <path d={`M${PAD.x - 22},${PAD.top - 6}V${PAD.top + 3}M${PAD.x + 22},${PAD.top - 6}V${PAD.top + 3}M${PAD.x - 22},${PAD.top - 1}H${PAD.x + 22}`} stroke="#F6F3E8" strokeWidth={4} />
        <path d={`M${PAD.x - 170},${PAD.top} h-30 v-40 M${PAD.x + 170},${PAD.top} h30 v-40`} fill="none" stroke={INK} strokeWidth={4} />
        {/* ladder from the roof to the pad */}
        {[0, 1].map((r) => <line key={r} x1={LADDER[0] + r * 22} y1={-6} x2={PAD.x - 150 + r * 22} y2={PAD.top + 6} stroke={INK} strokeWidth={6} strokeLinecap="round" />)}
        {Array.from({ length: 14 }, (_, i) => { const u = (i + 0.5) / 14; return <line key={i} x1={lerp(LADDER[0], PAD.x - 150, u)} y1={lerp(-6, PAD.top + 6, u)} x2={lerp(LADDER[0], PAD.x - 150, u) + 22} y2={lerp(-6, PAD.top + 6, u)} stroke={INK} strokeWidth={4} />; })}
        {/* roof clutter: water tank, antennas */}
        <rect x={-380} y={-96} width={90} height={84} rx={10} fill={T('#8D8F93')} stroke={INK} strokeWidth={3} />
        {[-340, -300].map((ax) => <path key={ax} d={`M${ax},-96 V-170 M${ax - 22},-150 H${ax + 22} M${ax - 14},-130 H${ax + 14}`} stroke={INK} strokeWidth={3} fill="none" />)}
      </g>
      {/* the queue (drawn on top of the building, in screen px) */}
      {Array.from({ length: n }, (_, k) => {
        const total = n + 6, uk = clamp((q * total - k) / 6), wait = { x: waitX(k), y: y - 2 }, along = uk * path.total;
        const p = uk <= 0 ? wait : pathAtDist(path, lerp(0, path.total, uk));
        const px = uk <= 0 ? wait.x : lerp(wait.x, p.x, clamp(uk * 3)) , py = uk <= 0 ? wait.y : lerp(wait.y, p.y, clamp(uk * 3));
        const a = uk >= 0.96 ? 0 : 1, shirt = ['#262A33', '#D9D2C0', '#3B4A2A', '#A8483A'][Math.floor(hash(k, 9) * 4)], bob = uk > 0 && uk < 1 ? Math.sin(along * 0.12 + k) * 1.6 : 0, sc = 1.15 * s;
        void along;
        return a ? <g key={k} transform={`translate(${px},${py + bob}) scale(${sc})`}><ellipse cx={0} cy={0} rx={13} ry={3.4} fill="#000" opacity={0.22} /><rect x={-7} y={-34} width={14} height={25} rx={6} fill={T(shirt)} stroke={INK} strokeWidth={1.6} /><path d="M-4,-10 L-5,0 M4,-10 L5,0" stroke={INK} strokeWidth={4.4} strokeLinecap="round" /><circle cx={0} cy={-42} r={7.4} fill={T(shirt === '#D9D2C0' ? '#8A6A4C' : '#3A2E26')} stroke={INK} strokeWidth={1.6} /></g> : null;
      })}
      <HeliSide x={hx} y={hy} size={380 * s} kind="uh1" t={t} />
      {set > 0.2 && set < 1 && Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${x + (PAD.x - 120 + i * 60) * s},${y + (PAD.top - 4) * s} q18,-6 36,0`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.5 * (1 - set) * (0.5 + hash(i, t % 5))} />)}
    </g>
  );
};
