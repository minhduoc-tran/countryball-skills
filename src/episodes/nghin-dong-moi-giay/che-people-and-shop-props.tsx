import React from 'react';
import { FONT, rnd } from '../../engine';

// Chapter E, "nobody can do it for you": drawn-for-this-chapter props in the engine's style (flat fills, a darker
// shade on the far side, a warm rim line on the lit edge, a contact shadow). Generic hired helpers (not the cast), a
// frying pan, a car's windscreen view, a door frame with height marks, and the shop-window goods.

const INK = '#14121C';
const RIM = '#FFB46A';

/** A generic bystander standing on y (feet), facing `dir` (1 right, -1 left): round head, block body, legs. */
export const Bystander: React.FC<{ x: number; y: number; s?: number; body: string; skin?: string; hair?: string; dir?: 1 | -1; hat?: 'chef' | 'cap' | 'none'; bob?: number; arm?: number }> = ({
  x, y, s = 1, body, skin = '#E8B98F', hair = '#2A1E1C', dir = 1, hat = 'none', bob = 0, arm = 0,
}) => (
  <g transform={`translate(${x} ${y + bob}) scale(${s * dir} ${s})`}>
    <ellipse cx={0} cy={4} rx={70} ry={11} fill="#000" opacity={0.4} />
    <path d="M -22 -150 L -24 -4 M 22 -150 L 24 -4" stroke="#3A3446" strokeWidth={22} strokeLinecap="round" />
    <path d="M -34 -4 L -10 -4 M 10 -4 L 40 -4" stroke={INK} strokeWidth={14} strokeLinecap="round" />
    <path d="M -46 -300 Q -54 -200 -42 -140 L 42 -140 Q 54 -200 46 -300 Q 0 -318 -46 -300 Z" fill={body} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 14 -296 Q 46 -300 46 -300 Q 54 -200 42 -140 L 18 -140 Q 30 -210 14 -296 Z" fill="#000" opacity={0.18} />
    <path d="M -46 -290 Q -50 -220 -44 -170" stroke={RIM} strokeWidth={3} fill="none" opacity={0.6} />
    <g transform={`rotate(${arm} 40 -290)`}>
      <path d="M 40 -290 Q 70 -240 64 -190" stroke={body} strokeWidth={22} fill="none" strokeLinecap="round" />
      <circle cx={64} cy={-186} r={13} fill={skin} stroke={INK} strokeWidth={4} />
    </g>
    <rect x={-12} y={-326} width={24} height={30} fill={skin} />
    <circle cx={0} cy={-366} r={46} fill={skin} stroke={INK} strokeWidth={5} />
    <path d="M -46 -372 Q -44 -420 0 -418 Q 44 -420 46 -372 Q 20 -394 -46 -372 Z" fill={hair} />
    <circle cx={16} cy={-362} r={4.5} fill={INK} />
    <circle cx={-14} cy={-362} r={4.5} fill={INK} />
    <path d="M -10 -346 Q 2 -338 14 -346" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
    {hat === 'chef' ? (
      <g>
        <rect x={-38} y={-424} width={76} height={26} rx={6} fill="#F4EEE2" stroke={INK} strokeWidth={4} />
        <path d="M -42 -420 Q -60 -470 -20 -468 Q 0 -500 24 -468 Q 62 -470 42 -420 Z" fill="#F4EEE2" stroke={INK} strokeWidth={4} />
      </g>
    ) : null}
    {hat === 'cap' ? (
      <g>
        <path d="M -46 -384 Q -44 -428 0 -426 Q 44 -428 46 -384 Z" fill="#3E5C8A" stroke={INK} strokeWidth={4} />
        <path d="M 10 -386 L 70 -380 Q 72 -372 60 -372 L 8 -376 Z" fill="#2E466A" stroke={INK} strokeWidth={4} />
      </g>
    ) : null}
  </g>
);

/** A banknote (green) tilted `rot`, `w` wide, with "1.000" on it. */
export const Note: React.FC<{ x: number; y: number; w?: number; rot?: number }> = ({ x, y, w = 120, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${w / 120})`}>
    <rect x={-60} y={-26} width={120} height={52} rx={5} fill="#5FAE72" stroke="#2F6E49" strokeWidth={3} />
    <rect x={-60} y={-26} width={120} height={8} rx={3} fill="#9ADCA8" opacity={0.6} />
    <circle r={14} fill="none" stroke="#2F6E49" strokeWidth={3} />
    <text x={-50} y={18} fontFamily={FONT.ui} fontSize={14} fill="#2F6E49">1.000</text>
  </g>
);

/** A frying pan seen side-on from its handle at (x, y), a flame under it and steam above. `flip` tilts it (a toss). */
export const Pan: React.FC<{ x: number; y: number; t: number; flip?: number }> = ({ x, y, t, flip = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${flip})`}>
    <path d="M -280 -8 L -110 -8" stroke="#2A2830" strokeWidth={22} strokeLinecap="round" />
    <path d="M -110 -30 L 150 -30 Q 140 40 90 48 L -50 48 Q -100 40 -110 -30 Z" fill="#2E2C36" stroke={INK} strokeWidth={5} />
    <ellipse cx={20} cy={-30} rx={130} ry={18} fill="#4A4654" />
    <ellipse cx={20} cy={-30} rx={112} ry={12} fill="#D9A04E" />
    <path d="M -90 -34 Q -30 -26 40 -34" stroke="#F2C77E" strokeWidth={4} fill="none" />
    {[0, 1, 2].map((i) => {
      const p = ((t * 0.9 + i * 14) % 42) / 42;
      return <path key={i} d={`M ${-30 + i * 50} ${-50 - p * 120} q 14 -18 0 -34`} stroke="#F4EEE2" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.6 * Math.sin(Math.PI * p)} />;
    })}
    {[0, 1, 2, 3].map((i) => {
      const fl = 1 + 0.25 * Math.sin(t * 0.9 + i * 1.7);
      return <path key={i} d={`M ${-60 + i * 40} 66 q 8 ${-30 * fl} 14 0 q 8 ${-20 * fl} 12 0 Z`} fill={i % 2 ? '#FFB347' : '#FF7A3D'} />;
    })}
  </g>
);

/** The pole-and-wall post of a door frame, `h` tall at x, with height marks (y from the floor) and pen dates. */
export const DoorPost: React.FC<{ x: number; floor: number; top: number; marks: { y: number; label: string; on: number }[] }> = ({ x, floor, top, marks }) => (
  <g>
    <rect x={x - 46} y={top} width={92} height={floor - top} fill="#E3D2B6" />
    <rect x={x - 46} y={top} width={14} height={floor - top} fill="#FFFFFF" opacity={0.22} />
    <rect x={x + 32} y={top} width={14} height={floor - top} fill="#000" opacity={0.16} />
    <rect x={x - 60} y={floor - 30} width={120} height={30} fill="#CFBE9F" />
    {marks.map((m, i) =>
      m.on > 0 ? (
        <g key={i} opacity={Math.min(1, m.on)}>
          <path d={`M ${x - 40} ${floor - m.y} L ${x - 40 + 70 * Math.min(1, m.on)} ${floor - m.y - 2}`} stroke="#3A5BA8" strokeWidth={5} strokeLinecap="round" />
          <text x={x + 60} y={floor - m.y + 6} fontFamily={FONT.hand} fontSize={30} fill="#F6EFE3" opacity={Math.min(1, m.on)}>{m.label}</text>
        </g>
      ) : null,
    )}
  </g>
);

type Good = { x: number; y: number; kind: 'phone' | 'shoe' | 'laptop' | 'bag' | 'tv' | 'gift' | 'bike'; price: string };

/** One shop-window item standing on the shelf at (x, y), with a price tag hanging from it. */
export const ShopGood: React.FC<{ g: Good; sway: number }> = ({ g, sway }) => (
  <g transform={`translate(${g.x} ${g.y})`}>
    <ellipse cx={0} cy={4} rx={72} ry={9} fill="#000" opacity={0.35} />
    {g.kind === 'phone' ? <g><rect x={-30} y={-110} width={60} height={110} rx={10} fill="#1E1D26" stroke="#5A586A" strokeWidth={4} /><rect x={-24} y={-102} width={48} height={90} rx={6} fill="#4A6A9E" /></g> : null}
    {g.kind === 'shoe' ? <g><path d="M -64 0 L -64 -40 Q -20 -50 0 -80 L 30 -66 Q 40 -30 70 -24 Q 76 0 70 0 Z" fill="#E9E2D2" stroke={INK} strokeWidth={4} /><path d="M -64 -8 L 70 -8" stroke="#D9482E" strokeWidth={7} /></g> : null}
    {g.kind === 'laptop' ? <g><rect x={-62} y={-92} width={124} height={80} rx={6} fill="#2A2830" stroke="#5A586A" strokeWidth={4} /><rect x={-54} y={-84} width={108} height={64} fill="#3E5C8A" /><path d="M -78 -10 L 78 -10 L 64 0 L -64 0 Z" fill="#8E8A98" /></g> : null}
    {g.kind === 'bag' ? <g><path d="M -40 -96 Q 0 -140 40 -96" stroke="#7A4A22" strokeWidth={8} fill="none" /><path d="M -58 -96 L 58 -96 L 66 0 L -66 0 Z" fill="#C9744A" stroke={INK} strokeWidth={4} /><rect x={-14} y={-70} width={28} height={16} rx={3} fill="#E9C46A" /></g> : null}
    {g.kind === 'tv' ? <g><rect x={-84} y={-110} width={168} height={98} rx={6} fill="#14121C" stroke="#5A586A" strokeWidth={4} /><rect x={-76} y={-102} width={152} height={82} fill="#2C5A7A" /><rect x={-20} y={-12} width={40} height={12} fill="#5A586A" /></g> : null}
    {g.kind === 'gift' ? <g><rect x={-52} y={-84} width={104} height={84} fill="#8A4A8A" stroke={INK} strokeWidth={4} /><rect x={-9} y={-84} width={18} height={84} fill="#F2C94C" /><rect x={-52} y={-50} width={104} height={14} fill="#F2C94C" /><path d="M 0 -84 Q -34 -120 -22 -88 M 0 -84 Q 34 -120 22 -88" stroke="#F2C94C" strokeWidth={8} fill="none" /></g> : null}
    {g.kind === 'bike' ? <g stroke="#2A2830" strokeWidth={6} fill="none"><circle cx={-44} cy={-34} r={34} /><circle cx={44} cy={-34} r={34} /><path d="M -44 -34 L -10 -80 L 30 -80 L 44 -34 M -10 -80 L 10 -34 L -44 -34 M 30 -80 L 26 -96" stroke="#D8503C" /></g> : null}
    <g transform={`translate(${34} ${-70}) rotate(${12 + sway})`}>
      <path d="M 0 0 L 0 18" stroke="#CFC8B8" strokeWidth={2} />
      <rect x={-34} y={18} width={68} height={32} rx={4} fill="#F6EFE3" stroke={INK} strokeWidth={3} />
      <text x={0} y={40} textAnchor="middle" fontFamily={FONT.ui} fontSize={12} fill={INK}>{g.price}</text>
    </g>
  </g>
);

/** Glass reflection streaks that slide slowly across a shop window box. */
export const GlassStreaks: React.FC<{ x: number; y: number; w: number; h: number; t: number }> = ({ x, y, w, h, t }) => (
  <g opacity={0.12}>
    {[0, 1].map((i) => (
      <path key={i} d={`M ${x + w * (0.2 + i * 0.35) + t * 0.6} ${y} l 60 0 l -160 ${h} l -60 0 Z`} fill="#FFFFFF" />
    ))}
    <rect x={x} y={y} width={w} height={h} fill="none" />
  </g>
);

export const rndSway = (t: number, i: number) => Math.sin(t / 9 + rnd(3, i) * 6) * 5;
