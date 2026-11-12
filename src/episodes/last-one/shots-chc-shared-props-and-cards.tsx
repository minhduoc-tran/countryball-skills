import React from 'react';
import { Glow, Schematic, SchLabel, SCH, FONT, Kitchen, CanFood, clamp, easeOut, backOut, kf, rnd } from '../../engine';

// Chapter C ("the costs") pieces shared by its shot files: the numbered chapter card on the schematic, a dim-the-room
// overlay, a candle, cans, a fly, stink lines and grass. All pure functions of the shot clock `t`.

/** Mixes two #rrggbb colours: k 0 gives a, 1 gives b. */
export const mixHex = (a: string, b: string, k: number) => {
  const p = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  const c = [0, 1, 2].map((i) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * clamp(k)));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};

/** A night-blue dim laid over a whole set (power is failing): draw the lights, then the character, after it. */
export const Dim: React.FC<{ o: number; color?: string }> = ({ o, color = '#050818' }) => (
  <rect x={-1500} y={-1500} width={5000} height={4500} fill={color} opacity={o} />
);

/** A candle on a dish: x, y the dish's foot. The flame flickers with t and throws a warm glow. */
export const Candle: React.FC<{ x: number; y: number; t: number; s?: number; glow?: number }> = ({ x, y, t, s = 1, glow = 1 }) => {
  const fl = 1 + 0.1 * Math.sin(t * 0.83) + 0.07 * Math.sin(t * 1.9 + 2);
  const lean = Math.sin(t * 0.37) * 3 * s;
  const top = y - 92 * s;
  return (
    <g>
      <ellipse cx={x + 6 * s} cy={y + 2} rx={44 * s} ry={9 * s} fill="#000" opacity={0.4} />
      <ellipse cx={x} cy={y - 4 * s} rx={34 * s} ry={9 * s} fill="#5A4A6A" />
      <rect x={x - 15 * s} y={top} width={30 * s} height={86 * s} rx={4 * s} fill="#E8DCC0" />
      <rect x={x - 15 * s} y={top} width={11 * s} height={86 * s} rx={4 * s} fill="#B9AA8A" opacity={0.6} />
      <rect x={x + 11 * s} y={top} width={3 * s} height={86 * s} fill="#FFC27A" opacity={0.8} />
      <ellipse cx={x} cy={top} rx={15 * s} ry={4 * s} fill="#F6EEDA" />
      <path d={`M ${x} ${top} L ${x + lean * 0.3} ${top - 12 * s}`} stroke="#2A2026" strokeWidth={2.5 * s} />
      <path d={`M ${x} ${top - 6 * s} Q ${x - 12 * s * fl} ${top - 26 * s} ${x + lean} ${top - 52 * s * fl} Q ${x + 12 * s * fl} ${top - 26 * s} ${x} ${top - 6 * s} Z`} fill="#FFB347" />
      <path d={`M ${x} ${top - 6 * s} Q ${x - 6 * s} ${top - 20 * s} ${x + lean * 0.7} ${top - 34 * s * fl} Q ${x + 6 * s} ${top - 20 * s} ${x} ${top - 6 * s} Z`} fill="#FFF2C4" />
      {glow > 0 ? <Glow x={x} y={top - 26 * s} r={380 * s * fl} o={0.75 * glow} /> : null}
    </g>
  );
};

const CAN_LABELS = ['#D94452', '#58B368', '#E8B84A', '#4A7FC0', '#C0703A'];
/** A tin of food (the engine's CanFood), x, y the middle of its base; `c` picks the label colour. About 70 wide at s 1. */
export const Can: React.FC<{ x: number; y: number; s?: number; c?: number; rot?: number; shadow?: boolean }> = ({ x, y, s = 1, c = 0, rot = 0 }) => (
  <CanFood x={x} y={y} s={s * 1.45} rot={rot} label={CAN_LABELS[c % CAN_LABELS.length]} pic={CAN_LABELS[(c + 2) % CAN_LABELS.length]} />
);

/** A can as a schematic line icon, centred, about 110 tall; `on` lights it orange. */
export const CanIcon: React.FC<{ x: number; y: number; s?: number; on?: boolean; o?: number }> = ({ x, y, s = 1, on = false, o = 1 }) => {
  const col = on ? SCH.live : SCH.line;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} stroke={col} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" style={on ? { filter: `drop-shadow(0 0 10px ${SCH.glow})` } : undefined}>
      <path d="M -36 -48 L -36 48 Q 0 66 36 48 L 36 -48" />
      <ellipse cx={0} cy={-48} rx={36} ry={12} />
      <path d="M -36 -16 Q 0 2 36 -16 M -36 18 Q 0 36 36 18" />
    </g>
  );
};

/** A fly circling (cx, cy) with radius r: a dark body and two blurred wings. */
export const Fly: React.FC<{ cx: number; cy: number; t: number; r?: number; s?: number }> = ({ cx, cy, t, r = 120, s = 1 }) => {
  const a = t * 0.42;
  const x = cx + Math.cos(a) * r + Math.sin(a * 2.3) * r * 0.3;
  const y = cy + Math.sin(a * 1.3) * r * 0.6 + Math.sin(a * 3.1) * r * 0.15;
  const flap = 0.4 + 0.6 * Math.abs(Math.sin(t * 2.6));
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.cos(a) * 25})`}>
      <ellipse cx={-6} cy={-8} rx={14} ry={7 * flap} fill="#DDE8FF" opacity={0.55} transform="rotate(-25)" />
      <ellipse cx={6} cy={-8} rx={14} ry={7 * flap} fill="#DDE8FF" opacity={0.55} transform="rotate(25)" />
      <ellipse cx={0} cy={0} rx={8} ry={11} fill="#14161C" />
      <circle cx={0} cy={-9} r={6} fill="#14161C" />
      <circle cx={-3} cy={-11} r={2.2} fill="#B8453A" />
      <circle cx={3} cy={-11} r={2.2} fill="#B8453A" />
    </g>
  );
};

/** Wavy stink lines rising from (x, y), greenish; `o` fades them. */
export const StinkLines: React.FC<{ x: number; y: number; t: number; w?: number; o?: number; s?: number }> = ({ x, y, t, w = 200, o = 1, s = 1 }) => (
  <g opacity={o} stroke="#9BC050" strokeWidth={9 * s} strokeLinecap="round" fill="none">
    {[-1, 0, 1].map((k) => {
      const ph = (t * 1.4 + k * 17 + 40) % 60;
      const yy = y - ph * 3.2 * s;
      const fade = ph < 8 ? ph / 8 : ph > 42 ? clamp((60 - ph) / 18) : 1;
      return (
        <path key={k} opacity={fade} d={`M ${x + k * w * 0.4} ${yy} q ${22 * s} ${-26 * s} 0 ${-52 * s} q ${-22 * s} ${-26 * s} 0 ${-52 * s} q ${22 * s} ${-24 * s} 0 ${-46 * s}`} />
      );
    })}
  </g>
);

/**
 * A tuft of grass: x, y the root, `h` blade height at full growth, `grow` 0..1, `w` how wide it spreads. Blades sway
 * with t. The darker side faces away from the (right-hand) light, which rims each blade.
 */
export const Grass: React.FC<{ x: number; y: number; t: number; h?: number; grow?: number; w?: number; n?: number; seed?: number }> = ({ x, y, t, h = 90, grow = 1, w = 60, n = 9, seed = 1 }) => {
  if (grow <= 0) return null;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const r1 = rnd(seed, i);
        const r2 = rnd(seed + 5, i);
        const bx = x + (r1 - 0.5) * w;
        const bh = h * grow * (0.55 + r2 * 0.6);
        const lean = (r1 - 0.5) * bh * 0.9 + Math.sin(t / 15 + i * 1.7) * 7 * grow;
        const base = i % 3 === 0 ? '#3F6A32' : i % 3 === 1 ? '#4E7B3A' : '#5E8E42';
        return (
          <g key={i}>
            <path d={`M ${bx - 4} ${y} Q ${bx + lean * 0.25} ${y - bh * 0.6} ${bx + lean} ${y - bh} Q ${bx + lean * 0.3 + 4} ${y - bh * 0.55} ${bx + 4} ${y} Z`} fill={base} />
            <path d={`M ${bx + 2} ${y} Q ${bx + lean * 0.3 + 3} ${y - bh * 0.55} ${bx + lean} ${y - bh}`} stroke="#B8D87A" strokeWidth={1.8} fill="none" opacity={0.7} />
          </g>
        );
      })}
    </g>
  );
};

// ---------- the numbered chapter card on the schematic: ring with the number, a word, a line icon ----------
type CardIconKind = 'bolt' | 'fridge' | 'drop' | 'cross' | 'wifi';
const CardIcon: React.FC<{ kind: CardIconKind; t: number }> = ({ kind, t }) => {
  const body: Record<CardIconKind, React.ReactNode> = {
    bolt: <path d="M 14 -64 L -34 8 L -4 8 L -18 64 L 38 -16 L 6 -16 Z" />,
    fridge: (
      <g>
        <rect x={-36} y={-64} width={72} height={128} rx={8} />
        <path d="M -36 -10 L 36 -10 M -22 -42 L -22 -26 M -22 6 L -22 28" />
      </g>
    ),
    drop: <path d="M 0 -66 Q 46 0 42 26 A 42 42 0 0 1 -42 26 Q -46 0 0 -66 Z" />,
    cross: <path d="M -16 -50 H 16 V -16 H 50 V 16 H 16 V 50 H -16 V 16 H -50 V -16 H -16 Z" />,
    wifi: (
      <g>
        <path d="M -56 -12 Q 0 -66 56 -12 M -36 10 Q 0 -24 36 10 M -16 30 Q 0 18 16 30" />
        <circle cx={0} cy={48} r={5} fill={SCH.live} />
      </g>
    ),
  };
  return (
    <g stroke={SCH.live} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }}>
      <g transform={`translate(0 ${Math.sin(t / 8) * 4})`}>{body[kind]}</g>
    </g>
  );
};

/** "1 · ĐIỆN": the ring with the big number, the word, the icon, popping on one after another. */
export const CostCard: React.FC<{ t: number; len: number; n: number; word: string; icon: CardIconKind; id: string }> = ({ t, len, n, word, icon, id }) => {
  const ring = backOut(clamp((t + 2) / 7));
  const wordIn = backOut(clamp((t - 3) / 7));
  const iconIn = backOut(clamp((t - 7) / 7));
  const underline = easeOut(clamp((t - 8) / 10));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.07]])}) translate(-960 -540)`}>
      <Schematic t={t} id={id} />
      <g transform={`translate(400 520) scale(${ring})`}>
        <circle r={190} fill={`${SCH.live}1A`} stroke={SCH.live} strokeWidth={8} style={{ filter: `drop-shadow(0 0 16px ${SCH.glow}88)` }} />
        <text y={104} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={290} fill={SCH.live}>
          {n}
        </text>
      </g>
      <g transform={`translate(700 585) scale(${wordIn})`}>
        <text fontFamily={FONT.ui} fontWeight={700} fontSize={word.length > 7 ? 118 : 140} fill={SCH.line} letterSpacing={3}>
          {word}
        </text>
      </g>
      <path d="M 704 640 L 1560 640" stroke={SCH.live} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - underline} />
      <g transform={`translate(1600 400) scale(${2.1 * iconIn})`}>
        <CardIcon kind={icon} t={t} />
      </g>
      <SchLabel x={400} y={800} t={t - 6} text="CÁI GIÁ" size={34} color={SCH.dim} />
    </g>
  );
};

/** The kitchen with the power gone: dimmed to night blue, only the moon in the window is left. */
export const DarkKitchen: React.FC<{ t: number; id: string; dim?: number }> = ({ t, id, dim = 0.55 }) => (
  <g>
    <Kitchen t={t} id={id} veil={0.6} />
    <Dim o={dim} />
    <Glow x={790} y={457} r={320} kind="cool" o={0.4} />
  </g>
);
