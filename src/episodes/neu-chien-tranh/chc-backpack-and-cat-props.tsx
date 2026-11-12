import React from 'react';
import { Pose, clamp, easeOut } from '../../engine';

// Chapter C: the evacuation backpacks, sis's grey-white cat, and the top-down things that go into Pip's backpack.
// Pip's backpack is ORANGE (PACK.pip) in every shot, on his back and on the table: others are other colours.

export const PACK = { pip: '#D2693A', mum: '#7A3E55', sis: '#E58BA3', crowd: ['#D2693A', '#D2693A', '#4C7A9A', '#D2693A', '#6C8A4A', '#D2693A'] };
const darken = (hex: string, k: number) => {
  const c = [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - k)));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};

/** A backpack standing, seen from the front. x = centre, y = base, ~110 wide x 150 tall at s 1. layer: back (mouth) / front (body). */
export const BackpackFront: React.FC<{ x: number; y: number; s?: number; color?: string; layer?: 'back' | 'front' | 'all'; open?: number }> = ({ x, y, s = 1, color = PACK.pip, layer = 'all', open = 0 }) => {
  const dk = darken(color, 0.28);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {layer !== 'front' ? (
        <g>
          <ellipse cx={4} cy={4} rx={64} ry={10} fill="#000" opacity={0.3} />
          <ellipse cx={0} cy={-148} rx={42} ry={10 + 6 * open} fill="#1A1016" />
          <path d="M -24 -150 Q -24 -176 0 -176 Q 24 -176 24 -150" stroke={dk} strokeWidth={9} fill="none" strokeLinecap="round" />
        </g>
      ) : null}
      {layer !== 'back' ? (
        <g>
          <path d="M -54 0 L -58 -112 Q -58 -150 -26 -150 Q 0 -140 26 -150 Q 58 -150 58 -112 L 54 0 Q 0 8 -54 0 Z" fill={color} stroke="#2A1218" strokeWidth={4} strokeLinejoin="round" />
          <path d="M 20 -146 Q 58 -146 58 -112 L 54 0 Q 30 4 16 4 Z" fill={dk} opacity={0.55} />
          <path d="M -50 -108 Q 0 -86 50 -108" stroke={dk} strokeWidth={5} fill="none" />
          <rect x={-36} y={-72} width={72} height={52} rx={12} fill={dk} stroke="#2A1218" strokeWidth={3.5} />
          <path d="M -28 -62 Q 0 -54 28 -62" stroke="#E8B84A" strokeWidth={4} fill="none" strokeLinecap="round" />
          <circle cx={28} cy={-58} r={5} fill="#E8B84A" />
          <rect x={-72} y={-62} width={18} height={46} rx={8} fill={dk} stroke="#2A1218" strokeWidth={3} />
          <rect x={54} y={-62} width={18} height={46} rx={8} fill={dk} stroke="#2A1218" strokeWidth={3} />
          <path d="M -40 -138 Q -46 -80 -42 -30" stroke="#FFFFFF" strokeWidth={4} opacity={0.18} fill="none" strokeLinecap="round" />
        </g>
      ) : null}
    </g>
  );
};

/**
 * A backpack on a standing character's back, in hero-local space. layer "back" draws the bag (draw it BEFORE the
 * Hero, so the body overlaps it) and layer "strap" the shoulder strap (draw it AFTER the Hero).
 */
export const BackpackWorn: React.FC<{ pose: Pose; color?: string; layer: 'back' | 'strap'; big?: number }> = ({ pose, color = PACK.pip, layer, big = 1 }) => {
  const dk = darken(color, 0.28);
  const sg = pose.yaw === 0 ? 1 : Math.sign(pose.yaw);
  const ay = Math.min(1, Math.abs(pose.yaw));
  const cx = -sg * (24 + 18 * ay) * (ay < 0.15 ? 0 : 1);
  const hw = 20 + (1 - ay) * 26;
  return (
    <g transform={`translate(${pose.x} ${pose.y}) scale(${pose.scale * big}) rotate(${pose.tilt})`}>
      {layer === 'back' ? (
        <g>
          <path d={`M ${cx - hw} -118 Q ${cx} -134 ${cx + hw} -118 L ${cx + hw - 3} -20 Q ${cx} -10 ${cx - hw + 3} -20 Z`} fill={color} stroke="#2A1218" strokeWidth={4} strokeLinejoin="round" />
          <rect x={cx - hw * 0.62} y={-78} width={hw * 1.24} height={44} rx={9} fill={dk} stroke="#2A1218" strokeWidth={3} />
          <path d={`M ${cx - hw * 0.5} -68 Q ${cx} -62 ${cx + hw * 0.5} -68`} stroke="#E8B84A" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        </g>
      ) : ay > 0.15 ? (
        <path d={`M ${pose.yaw * 6 + sg * 4} -112 Q ${pose.yaw * 6 + sg * 14} -70 ${cx + sg * hw * -0.4} -26`} stroke={dk} strokeWidth={7} fill="none" strokeLinecap="round" />
      ) : (
        <path d="M -30 -114 Q -34 -60 -26 -22 M 30 -114 Q 34 -60 26 -22" stroke={dk} strokeWidth={7} fill="none" strokeLinecap="round" />
      )}
    </g>
  );
};

// ---------- sis's cat: grey and white ----------
const CAT = { fur: '#D4D6DD', patch: '#8F92A0', line: '#3E4052', pink: '#E8A5B0', eye: '#B9D45A' };

/** The cat's head, centred (x, y), radius 34 at s 1. blink 0..1; look -1..1 turns the eyes. */
export const CatHead: React.FC<{ x: number; y: number; s?: number; blink?: number; look?: number; rot?: number; sleep?: boolean }> = ({ x, y, s = 1, blink = 0, look = 0, rot = 0, sleep = false }) => {
  const shut = sleep || blink > 0.6;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M -30 -14 L -26 -52 L -6 -30 Z M 30 -14 L 26 -52 L 6 -30 Z" fill={CAT.fur} stroke={CAT.line} strokeWidth={3} strokeLinejoin="round" />
      <path d="M -25 -20 L -23 -42 L -12 -30 Z M 25 -20 L 23 -42 L 12 -30 Z" fill={CAT.pink} />
      <circle r={36} fill={CAT.fur} stroke={CAT.line} strokeWidth={3.5} />
      <path d="M -24 -22 Q 0 -44 24 -22 Q 8 -30 0 -22 Q -8 -30 -24 -22 Z" fill={CAT.patch} />
      <path d="M -36 6 Q -22 14 -10 12 M 36 6 Q 22 14 10 12" stroke={CAT.patch} strokeWidth={0} fill="none" />
      {[-14, 14].map((ex) =>
        shut ? (
          <path key={ex} d={`M ${ex - 8} -2 Q ${ex} 4 ${ex + 8} -2`} stroke={CAT.line} strokeWidth={3} fill="none" strokeLinecap="round" />
        ) : (
          <g key={ex}>
            <ellipse cx={ex + look * 3} cy={-2} rx={8} ry={9} fill={CAT.eye} stroke={CAT.line} strokeWidth={2} />
            <ellipse cx={ex + look * 4} cy={-2} rx={2.6} ry={7} fill="#1A1A24" />
            <circle cx={ex + look * 3 + 3} cy={-5} r={2} fill="#fff" />
          </g>
        ),
      )}
      <path d="M -4 10 L 4 10 L 0 15 Z" fill={CAT.pink} stroke={CAT.line} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M 0 15 L 0 19 M 0 19 Q -6 24 -11 20 M 0 19 Q 6 24 11 20" stroke={CAT.line} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <path d="M -26 12 L -50 8 M -26 18 L -48 22 M 26 12 L 50 8 M 26 18 L 48 22" stroke={CAT.line} strokeWidth={1.8} opacity={0.7} strokeLinecap="round" />
    </g>
  );
};

/** The cat popping its head out of a standing backpack: draw between BackpackFront layer "back" and "front". */
export const CatPeek: React.FC<{ x: number; y: number; s?: number; rise: number; t: number }> = ({ x, y, s = 1, rise, t }) => {
  const r = easeOut(clamp(rise));
  const blink = Math.floor(t / 36) % 3 === 1 && t % 36 < 4 ? 1 : 0;
  const look = Math.sin(t / 18);
  return (
    <g>
      <CatHead x={x} y={y + (1 - r) * 90 * s} s={s} blink={blink} look={look} rot={Math.sin(t / 14) * 4} />
      {r > 0.6 ? (
        <g transform={`translate(${x} ${y + 36 * s}) scale(${s})`}>
          <ellipse cx={-28} cy={0} rx={13} ry={9} fill={CAT.fur} stroke={CAT.line} strokeWidth={3} />
          <ellipse cx={28} cy={0} rx={13} ry={9} fill={CAT.fur} stroke={CAT.line} strokeWidth={3} />
        </g>
      ) : null}
    </g>
  );
};

/** The cat held against a chest / lap: a body, a tail, the head tucked in. x, y = body centre, ~150 wide at s 1. */
export const CatHeld: React.FC<{ x: number; y: number; s?: number; t: number; sleep?: boolean; flip?: boolean }> = ({ x, y, s = 1, t, sleep = false, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d={`M 56 6 Q ${96 + Math.sin(t / 12) * 6} ${-4} ${84 + Math.sin(t / 12) * 8} -44`} stroke={CAT.patch} strokeWidth={13} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={0} rx={70} ry={42 + (sleep ? Math.sin(t / 14) * 2 : 0)} fill={CAT.fur} stroke={CAT.line} strokeWidth={3.5} />
    <path d="M -20 -36 Q -6 -14 -16 8 M 8 -40 Q 22 -16 12 10 M 34 -30 Q 44 -12 36 6" stroke={CAT.patch} strokeWidth={6} fill="none" strokeLinecap="round" />
    <CatHead x={-52} y={-18} s={0.95} sleep={sleep} rot={-8} look={0.5} />
  </g>
);

// ---------- the top-down things (C20): each about its real shape, centred on x, y ----------
export const PowerBankTop: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-76} y={-44} width={160} height={92} rx={16} fill="#000" opacity={0.3} />
    <rect x={-80} y={-48} width={160} height={92} rx={16} fill="#3C4254" stroke="#171A24" strokeWidth={4} />
    <rect x={-80} y={-48} width={160} height={30} rx={14} fill="#4E566C" />
    {[0, 1, 2, 3].map((i) => <circle key={i} cx={-42 + i * 22} cy={14} r={6} fill={i < 3 ? '#6BE08A' : '#2C3A34'} />)}
    <rect x={44} y={-4} width={24} height={14} rx={3} fill="#15171F" />
    <path d="M -64 -34 L 40 -34" stroke="#FFFFFF" strokeWidth={3} opacity={0.2} strokeLinecap="round" />
  </g>
);

export const DocsTop: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-60} y={-80} width={134} height={170} rx={6} fill="#000" opacity={0.3} />
    <rect x={-70} y={-86} width={134} height={170} rx={6} fill="#F3EBD6" stroke="#8A7C5C" strokeWidth={3} />
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M -52 ${-60 + i * 22} L ${i % 3 === 2 ? 20 : 48} ${-60 + i * 22}`} stroke="#9A8F74" strokeWidth={5} strokeLinecap="round" />)}
    <circle cx={30} cy={58} r={20} fill="none" stroke="#C94A3E" strokeWidth={4} opacity={0.8} />
    <rect x={-20} y={-60} width={96} height={130} rx={6} fill="#2F4E7A" stroke="#14233C" strokeWidth={3} transform="rotate(8)" />
    <circle cx={30} cy={4} r={20} fill="none" stroke="#E8C86A" strokeWidth={3.5} transform="rotate(8)" />
  </g>
);

export const PhotoTop: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-82} y={-62} width={170} height={138} rx={4} fill="#000" opacity={0.3} />
    <rect x={-90} y={-68} width={170} height={138} rx={4} fill="#F8F4EA" stroke="#B8AE98" strokeWidth={2.5} />
    <rect x={-78} y={-56} width={146} height={92} fill="#E9A96A" />
    <rect x={-78} y={6} width={146} height={30} fill="#7DA05A" />
    {/* the family: two tall, two short, round heads */}
    {[[-40, 1], [-6, 0.75], [24, 1], [50, 0.7]].map(([fx, k], i) => (
      <g key={i} transform={`translate(${fx} ${24})`}>
        <path d={`M 0 ${-14 * (k as number)} L 0 ${-40 * (k as number)}`} stroke="#3A2C34" strokeWidth={4} />
        <circle cy={-48 * (k as number)} r={8 * (k as number) + 2} fill="#F6EFE3" stroke="#3A2C34" strokeWidth={2.5} />
        <path d={`M -9 ${-34 * (k as number)} L 9 ${-34 * (k as number)} M 0 ${-14 * (k as number)} L -8 6 M 0 ${-14 * (k as number)} L 8 6`} stroke="#3A2C34" strokeWidth={3.5} strokeLinecap="round" />
      </g>
    ))}
  </g>
);

export const BookTop: React.FC<{ x: number; y: number; s?: number; rot?: number; color?: string }> = ({ x, y, s = 1, rot = 0, color = '#3E6A8A' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-74} y={-92} width={160} height={200} rx={8} fill="#000" opacity={0.3} />
    <rect x={-82} y={-100} width={160} height={200} rx={8} fill={color} stroke="#1A2A3A" strokeWidth={4} />
    <rect x={-82} y={-100} width={20} height={200} rx={8} fill="#000" opacity={0.2} />
    <rect x={-44} y={-70} width={98} height={46} rx={6} fill="#F3EBD6" opacity={0.9} />
  </g>
);

export const ToyCarTop: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-50} y={-86} width={104} height={186} rx={22} fill="#000" opacity={0.3} />
    <rect x={-56} y={-92} width={104} height={186} rx={22} fill="#C94A3E" stroke="#5A1A18" strokeWidth={4} />
    <rect x={-40} y={-50} width={72} height={60} rx={12} fill="#2A3A52" />
    <rect x={-62} y={-72} width={14} height={34} rx={5} fill="#1A1A1E" />
    <rect x={42} y={-72} width={14} height={34} rx={5} fill="#1A1A1E" />
    <rect x={-62} y={30} width={14} height={34} rx={5} fill="#1A1A1E" />
    <rect x={42} y={30} width={14} height={34} rx={5} fill="#1A1A1E" />
  </g>
);

/** Pip's backpack seen from above, open: x, y = centre; the dark mouth is at (x, y - 40 s), ~210 x 310 at s 1. */
export const BackpackTop: React.FC<{ x: number; y: number; s?: number; color?: string; fill?: number }> = ({ x, y, s = 1, color = PACK.pip, fill = 0 }) => {
  const dk = darken(color, 0.3);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-100} y={-140} width={220} height={310} rx={46} fill="#000" opacity={0.32} />
      <rect x={-110} y={-150} width={220} height={310} rx={46} fill={color} stroke="#2A1218" strokeWidth={5} />
      <rect x={-110} y={-150} width={60} height={310} rx={30} fill={dk} opacity={0.5} />
      <rect x={-84} y={70} width={168} height={70} rx={20} fill={dk} stroke="#2A1218" strokeWidth={4} />
      <path d="M -66 92 Q 0 106 66 92" stroke="#E8B84A" strokeWidth={5} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-52} rx={88} ry={68} fill="#1A1016" stroke="#2A1218" strokeWidth={4} />
      <ellipse cx={0} cy={-52} rx={88} ry={68} fill="none" stroke="#E8B84A" strokeWidth={4} strokeDasharray="10 8" opacity={0.7} />
      {fill > 0 ? <ellipse cx={0} cy={-46} rx={62 * clamp(fill)} ry={44 * clamp(fill)} fill="#2A1C26" /> : null}
      <path d="M -50 -150 Q 0 -190 50 -150" stroke={dk} strokeWidth={12} fill="none" strokeLinecap="round" />
    </g>
  );
};
