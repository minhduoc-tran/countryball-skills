import React from 'react';
import { GiftBox, Teddy, ToyRobot, STUDY, islandTop, joints, toWorld, Pose, Look, clamp, easeOut } from '../../engine';

// Chapter D props for the adaptation and mum shots: a room full of expensive stuff, an opened gift, a hand holding
// something at the head (drawn after the character, because the head hides rig arms), the family meal on the island.

const ShoppingBag: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = '#C44A4A' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={4} cy={4} rx={50} ry={8} fill="#000" opacity={0.35} />
    <path d="M -44 -120 H 44 L 50 0 H -50 Z" fill={c} stroke="#2A1218" strokeWidth={3} />
    <path d="M 44 -120 L 50 0 H 30 L 24 -120 Z" fill="#000" opacity={0.2} />
    <path d="M -22 -120 Q -22 -160 0 -160 Q 22 -160 22 -120" stroke="#2A1218" strokeWidth={5} fill="none" />
    <circle cx={0} cy={-70} r={14} fill="#F6EFE3" opacity={0.85} />
  </g>
);

const Trophy: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={44} ry={8} fill="#000" opacity={0.35} />
    <rect x={-34} y={-24} width={68} height={24} rx={4} fill="#5A3A22" />
    <rect x={-8} y={-70} width={16} height={48} fill="#D9A92E" />
    <path d="M -40 -150 H 40 Q 38 -84 0 -74 Q -38 -84 -40 -150 Z" fill="#E8B93A" stroke="#8A6A12" strokeWidth={3} />
    <path d="M -40 -140 Q -66 -140 -56 -112 Q -50 -98 -34 -100 M 40 -140 Q 66 -140 56 -112 Q 50 -98 34 -100" stroke="#C9972A" strokeWidth={6} fill="none" />
    <path d="M -26 -146 Q -26 -100 -10 -90" stroke="#FFF1B8" strokeWidth={5} fill="none" opacity={0.7} />
  </g>
);

const Console: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={80} ry={9} fill="#000" opacity={0.35} />
    <rect x={-70} y={-30} width={140} height={30} rx={8} fill="#2A2A38" stroke="#12121A" strokeWidth={3} />
    <rect x={-70} y={-30} width={140} height={7} rx={3} fill="#5A5A70" opacity={0.7} />
    <circle cx={50} cy={-14} r={4} fill="#4DFF8A" />
    <rect x={-80} y={-46} width={50} height={16} rx={8} fill="#D94452" /><rect x={-26} y={-46} width={50} height={16} rx={8} fill="#3E9BD6" />
  </g>
);

const SHOES = ['#E9E2D4', '#C9483E', '#3E6A9A'];
const ShoeStack: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={80} ry={9} fill="#000" opacity={0.35} />
    {SHOES.map((c, i) => (
      <g key={i} transform={`translate(${(i % 2) * 8} ${-i * 44})`}>
        <rect x={-72} y={-44} width={144} height={44} rx={4} fill={c} stroke="#2A1A18" strokeWidth={3} />
        <rect x={-72} y={-44} width={144} height={10} rx={3} fill="#000" opacity={0.2} />
        <rect x={-30} y={-30} width={60} height={14} rx={3} fill="#F6EFE3" opacity={0.7} />
      </g>
    ))}
  </g>
);

type Item = { u: number; w: number; kind: 'gift' | 'bag' | 'trophy' | 'console' | 'shoes' | 'teddy' | 'robot'; c?: number };
const ITEMS: Item[] = [
  { u: 0.1, w: 0.3, kind: 'trophy' }, { u: 0.18, w: 0.62, kind: 'gift', c: 0 }, { u: 0.26, w: 0.36, kind: 'bag', c: 0 },
  { u: 0.3, w: 0.8, kind: 'shoes' }, { u: 0.78, w: 0.32, kind: 'console' }, { u: 0.86, w: 0.6, kind: 'bag', c: 1 },
  { u: 0.7, w: 0.76, kind: 'gift', c: 1 }, { u: 0.92, w: 0.3, kind: 'teddy' }, { u: 0.12, w: 0.9, kind: 'robot' },
  { u: 0.9, w: 0.88, kind: 'gift', c: 2 }, { u: 0.22, w: 0.2, kind: 'gift', c: 2 }, { u: 0.84, w: 0.2, kind: 'trophy' },
];
const GIFTS: [string, string][] = [['#C44A4A', '#F2D24A'], ['#3E8C86', '#F6EFE3'], ['#7A4AA8', '#E9C46A']];
const BAGS = ['#C44A4A', '#3E6A9A'];

/** Expensive things scattered over the study floor, depth-sorted far to near. Draw after the Study, before the hero. */
export const RoomStuff: React.FC<{ nearOnly?: boolean }> = ({ nearOnly = false }) => (
  <g>
    {[...ITEMS].filter((it) => !nearOnly || it.w > 0.7).sort((a, b) => a.w - b.w).map((it, i) => {
      const p = STUDY.P(it.u, 1, it.w);
      const k = STUDY.s(it.w) * 0.9;
      const c = it.c ?? 0;
      return (
        <g key={i}>
          {it.kind === 'gift' ? <GiftBox x={p.x - 50 * k} y={p.y - 90 * k} w={100 * k} h={90 * k} c1={GIFTS[c][0]} c2={GIFTS[c][1]} /> : null}
          {it.kind === 'bag' ? <ShoppingBag x={p.x} y={p.y} s={k} c={BAGS[c]} /> : null}
          {it.kind === 'trophy' ? <Trophy x={p.x} y={p.y} s={k * 1.1} /> : null}
          {it.kind === 'console' ? <Console x={p.x} y={p.y} s={k} /> : null}
          {it.kind === 'shoes' ? <ShoeStack x={p.x} y={p.y} s={k} /> : null}
          {it.kind === 'teddy' ? <Teddy x={p.x} y={p.y} h={150 * k} /> : null}
          {it.kind === 'robot' ? <ToyRobot x={p.x} y={p.y} h={130 * k} /> : null}
        </g>
      );
    })}
  </g>
);

/** An opened gift on the floor: box, lid beside it, limp ribbon, a plain watch inside. x, y the box's foot. */
export const OpenGift: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const open = easeOut(clamp(t / 10));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={130} ry={16} fill="#000" opacity={0.4} />
      <rect x={-100} y={-120} width={200} height={120} rx={6} fill="#3E8C86" stroke="#1C4A47" strokeWidth={4} />
      <rect x={-100} y={-120} width={200} height={16} fill="#2F6E69" />
      <rect x={-16} y={-120} width={32} height={120} fill="#E9C46A" opacity={0.85} />
      <ellipse cx={0} cy={-118} rx={96} ry={12} fill="#14282A" />
      <g transform={`translate(0 ${-112}) rotate(${Math.sin(t / 8) * 2})`}>
        <circle r={24} fill="#C9CBD2" stroke="#4A4C58" strokeWidth={4} /><circle r={17} fill="#F4F6FA" />
        <path d="M 0 0 V -11 M 0 0 L 8 4" stroke="#2A2A38" strokeWidth={3} strokeLinecap="round" />
        <rect x={-10} y={22} width={20} height={20} fill="#2A2A38" /><rect x={-10} y={-42} width={20} height={20} fill="#2A2A38" />
      </g>
      <g transform={`translate(${-150 - 60 * open} ${-30 * open}) rotate(${-24 * open})`}>
        <rect x={-110} y={-52} width={220} height={52} rx={6} fill="#3E8C86" stroke="#1C4A47" strokeWidth={4} />
        <rect x={-18} y={-52} width={36} height={52} fill="#E9C46A" opacity={0.85} />
      </g>
      <path d="M 70 -120 Q 150 -100 150 -40 Q 148 -10 190 -6" stroke="#E9C46A" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.9} />
    </g>
  );
};

/**
 * A hand held up to the head, drawn after the character: a sleeve from his shoulder, a mitten at (hx, hy), and
 * `children` (a phone, a bánh mì) in the hand. `arm` picks the shoulder that is nearer the camera.
 */
export const HeadArm: React.FC<{ pose: Pose; look: Look; arm: 'armL' | 'armR'; hx: number; hy: number; elbow?: number; s?: number; children?: React.ReactNode }> = ({ pose, look, arm, hx, hy, elbow = 60, s = 1, children }) => {
  const sh = toWorld(pose, joints(pose)[arm].root);
  const side = arm === 'armL' ? -1 : 1;
  const ex = sh.x + side * elbow * pose.scale * 1.4;
  const ey = Math.max(sh.y, hy) + 90 * pose.scale;
  const w = 36 * pose.scale * s;
  const d = `M ${sh.x} ${sh.y} Q ${ex} ${ey} ${hx} ${hy}`;
  return (
    <g>
      <path d={d} stroke={look.line} strokeWidth={w + 8} fill="none" strokeLinecap="round" />
      <path d={d} stroke={look.limb} strokeWidth={w} fill="none" strokeLinecap="round" />
      {children}
      <ellipse cx={hx} cy={hy} rx={w * 0.62} ry={w * 0.7} fill={look.hand} stroke={look.line} strokeWidth={3} />
    </g>
  );
};

/** The family meal on the kitchen island: bowls of rice, a dish, chopsticks, steam; the last place is set but empty. */
export const FamilyMeal: React.FC<{ t: number }> = ({ t }) => {
  const places = [0.4, 0.5, 0.6].map((u) => islandTop(u, 0.15));
  const dish = islandTop(0.5, 0.78);
  return (
    <g>
      <ellipse cx={dish.x} cy={dish.y} rx={72} ry={14} fill="#E9E2D4" stroke="#8A8272" strokeWidth={3} />
      <ellipse cx={dish.x} cy={dish.y - 6} rx={52} ry={10} fill="#C9702E" />
      {[-20, 0, 20].map((d, i) => (
        <path key={i} d={`M ${dish.x + d} ${dish.y - 18} q 10 -20 0 -40 q -10 -20 0 -40`} stroke="#F6EFE3" strokeWidth={5} fill="none" opacity={0.42} strokeLinecap="round" transform={`translate(0 ${-((t * 0.8 + i * 11) % 22)})`} />
      ))}
      {places.map((p, i) => (
        <g key={i}>
          <ellipse cx={p.x} cy={p.y + 2} rx={52} ry={11} fill="#F6EFE3" stroke="#8A8272" strokeWidth={3} />
          <ellipse cx={p.x} cy={p.y - 3} rx={34} ry={7} fill={i === 2 ? '#2A2630' : '#F6F1E3'} opacity={i === 2 ? 0.25 : 1} />
          {i < 2 ? <ellipse cx={p.x} cy={p.y - 10} rx={26} ry={9} fill="#FFFBEF" /> : null}
          <path d={`M ${p.x + 56} ${p.y - 6} L ${p.x + 98} ${p.y + 6} M ${p.x + 60} ${p.y - 12} L ${p.x + 102} ${p.y}`} stroke="#B98A52" strokeWidth={4} strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
};
