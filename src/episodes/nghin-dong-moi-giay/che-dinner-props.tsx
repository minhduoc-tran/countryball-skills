import React from 'react';
import {
  Hero, Pose, basePose, faceAt, kf, LOOKS, Glow, Dust, Kitchen, KitchenIsland, KITCHEN, islandTop, LEG_LEN, stand, FONT, Expr,
} from '../../engine';

// Chapter E, the dinner: the family meal on the kitchen island (rice, braised fish, soup, chopsticks, steam), the
// three people round it, and Pip's phone, front and back. All drawn for this chapter in the engine's style.

const RIM = '#FFB46A';
const INK = '#14121C';

/** Rising steam: `n` wisps from (x, y) on a 44-frame loop. */
export const Steam: React.FC<{ x: number; y: number; t: number; n?: number; s?: number; o?: number }> = ({ x, y, t, n = 3, s = 1, o = 0.5 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeLinecap="round" stroke="#F4EEE2">
    {Array.from({ length: n }).map((_, i) => {
      const p = ((t + i * (44 / n)) % 44) / 44;
      return <path key={i} d={`M ${(i - (n - 1) / 2) * 22 + Math.sin(p * 6 + i) * 8} ${-p * 110} q 12 -16 0 -30 q -12 -16 0 -30`} strokeWidth={7 - p * 3} opacity={o * Math.sin(Math.PI * p)} />;
    })}
  </g>
);

/** A bowl of rice, slightly from above, base centre (x, y). */
export const RiceBowl: React.FC<{ x: number; y: number; s?: number; t: number; steam?: boolean }> = ({ x, y, s = 1, t, steam = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={4} cy={4} rx={80} ry={12} fill="#000" opacity={0.4} />
    <path d="M -74 -52 Q -70 6 -34 6 L 34 6 Q 70 6 74 -52 Z" fill="#E6DCC6" />
    <path d="M 16 6 L 34 6 Q 70 6 74 -52 L 56 -52 Q 50 -6 16 0 Z" fill="#BFB398" />
    <path d="M -66 -36 Q -60 -2 -36 2" stroke="#2F6E8A" strokeWidth={4} fill="none" opacity={0.7} />
    <ellipse cx={0} cy={-52} rx={76} ry={20} fill="#F1E9D6" />
    <path d="M -60 -54 Q -30 -96 0 -92 Q 36 -96 60 -54 Q 0 -40 -60 -54 Z" fill="#FBF7EC" />
    <path d="M -34 -66 Q -14 -86 6 -84" stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.7} strokeLinecap="round" />
    <path d="M -60 -50 Q 0 -34 60 -50" stroke={RIM} strokeWidth={2.5} fill="none" opacity={0.6} />
    {steam ? <Steam x={0} y={-90} t={t} n={2} s={0.9} o={0.4} /> : null}
  </g>
);

/** A plate of braised fish (cá kho): two glazed pieces, a spring onion, a lit rim. */
export const FishPlate: React.FC<{ x: number; y: number; s?: number; t: number; pieces?: number }> = ({ x, y, s = 1, t, pieces = 2 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={4} cy={4} rx={116} ry={16} fill="#000" opacity={0.4} />
    <ellipse cx={0} cy={-6} rx={110} ry={22} fill="#E9E2D2" />
    <ellipse cx={0} cy={-10} rx={90} ry={16} fill="#6B3A22" />
    {[[-34, -14, -8], [34, -12, 6]].slice(0, pieces).map(([dx, dy, r], i) => (
      <g key={i} transform={`translate(${dx} ${dy}) rotate(${r})`}>
        <path d="M -44 0 Q -40 -26 0 -28 Q 40 -26 46 0 Q 20 12 -44 0 Z" fill="#9A5A2E" stroke="#4A2412" strokeWidth={3} />
        <path d="M -30 -8 Q 0 -22 30 -8" stroke="#E0A060" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M 38 -14 L 54 -20 L 52 -4 Z" fill="#7A4624" />
      </g>
    ))}
    <path d="M -50 -16 q 10 -8 20 0 M 20 -20 q 10 -8 24 0" stroke="#7BB26A" strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M -100 -8 Q -60 8 0 10" stroke={RIM} strokeWidth={2.5} fill="none" opacity={0.6} />
    <Steam x={0} y={-30} t={t + 14} n={2} s={0.8} o={0.35} />
  </g>
);

/** A bowl of green soup (canh) with herbs and steam. */
export const SoupBowl: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={4} cy={4} rx={92} ry={13} fill="#000" opacity={0.4} />
    <path d="M -86 -60 Q -82 6 -40 6 L 40 6 Q 82 6 86 -60 Z" fill="#D9CDB6" />
    <path d="M 20 6 L 40 6 Q 82 6 86 -60 L 66 -60 Q 60 -8 20 0 Z" fill="#B3A68C" />
    <ellipse cx={0} cy={-60} rx={88} ry={22} fill="#EDE4D0" />
    <ellipse cx={0} cy={-58} rx={76} ry={16} fill="#B7A25A" />
    {[[-30, -60], [20, -56], [44, -62]].map(([dx, dy], i) => <ellipse key={i} cx={dx} cy={dy} rx={16} ry={5} fill="#5E8E48" transform={`rotate(${i * 30 - 20} ${dx} ${dy})`} />)}
    <Steam x={0} y={-72} t={t + 28} n={3} s={1} o={0.45} />
  </g>
);

/** A pair of chopsticks from (x0, y0) to (x1, y1). */
export const Chopsticks: React.FC<{ x0: number; y0: number; x1: number; y1: number; gap?: number }> = ({ x0, y0, x1, y1, gap = 8 }) => (
  <g strokeLinecap="round">
    <path d={`M ${x0} ${y0} L ${x1} ${y1}`} stroke="#A8703A" strokeWidth={8} />
    <path d={`M ${x0 + gap} ${y0 + gap * 0.6} L ${x1} ${y1 + 2}`} stroke="#C98A4A" strokeWidth={8} />
  </g>
);

/** Pip's phone from above. `flip` 0 (screen up, glowing, +1.000 đ) to 1 (face down, dark back); `pulse` 0..1 leaks light at its edge. */
export const BankPhone: React.FC<{ x: number; y: number; w?: number; rot?: number; flip: number; pulse?: number }> = ({ x, y, w = 240, rot = 0, flip, pulse = 0 }) => {
  const h = w * 2.0;
  const ang = flip * Math.PI;
  const sx = Math.abs(Math.cos(ang));
  const front = Math.cos(ang) >= 0;
  const k = w / 240;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2 + 10 * k} y={-h / 2 + 14 * k} width={w} height={h} rx={w * 0.16} fill="#000" opacity={0.4} />
      {front ? <circle r={w * 1.5} fill="url(#g3cool)" opacity={0.5 * (1 - flip) * 2} style={{ mixBlendMode: 'screen' }} /> : null}
      {!front && pulse > 0 ? <rect x={-w / 2 - 6} y={-h / 2 - 6} width={w + 12} height={h + 12} rx={w * 0.18} fill="none" stroke="#7CF0A8" strokeWidth={5 * k} opacity={0.35 * pulse} /> : null}
      <g transform={`scale(${Math.max(0.02, sx)} 1)`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.16} fill={front ? '#16151C' : '#23212B'} stroke="#3A3846" strokeWidth={4 * k} />
        {front ? (
          <g>
            <rect x={-w * 0.44} y={-h / 2 + w * 0.06} width={w * 0.88} height={h - w * 0.12} rx={w * 0.11} fill="#1B2A44" />
            <rect x={-w * 0.44} y={-h / 2 + w * 0.06} width={w * 0.88} height={(h - w * 0.12) * 0.5} rx={w * 0.11} fill="#2C4A74" opacity={0.6} />
            <text x={0} y={-h * 0.3} textAnchor="middle" fontFamily={FONT.ui} fontSize={w * 0.12} fill="#BFD0FF" letterSpacing={w * 0.01}>NGÂN HÀNG</text>
            <circle cx={0} cy={-h * 0.14} r={w * 0.14} fill="#2FBF71" opacity={0.9} />
            <path d={`M ${-w * 0.07} ${-h * 0.14} l ${w * 0.05} ${w * 0.06} l ${w * 0.1} ${-w * 0.12}`} stroke="#E9FFF2" strokeWidth={w * 0.035} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x={0} y={h * 0.05} textAnchor="middle" fontFamily={FONT.ui} fontSize={w * 0.17} fill="#7CF0A8">+1.000 đ</text>
          </g>
        ) : (
          <g>
            <circle cx={-w * 0.22} cy={-h * 0.4} r={w * 0.13} fill="#14121C" stroke="#3A3846" strokeWidth={3 * k} />
            <circle cx={-w * 0.22} cy={-h * 0.4} r={w * 0.06} fill="#2A3A5A" />
            <path d={`M ${-w * 0.4} ${-h * 0.46} L ${-w * 0.05} ${-h * 0.46} L ${-w * 0.4} ${-h * 0.1} Z`} fill="#FFFFFF" opacity={0.05} />
          </g>
        )}
      </g>
    </g>
  );
};

// ---------- the dinner scene (E21, E22, E24): kitchen island as the table, three people behind it ----------
type Mode = 'eat' | 'tell' | 'laugh';
const ISLAND_U = [0.3, 0.7] as const;

/** Hip pose for a person seated behind the island at u: a body scaled by k, dropped so the island hides the legs. */
const seat = (u: number, k: number, drop: number) => {
  const base = stand(KITCHEN, u, 0.4);
  const sc = base.scale * k;
  const p = KITCHEN.P(u, 1, 0.4);
  return { sc, x: p.x, y: p.y - LEG_LEN * sc + drop * sc };
};

export const dinnerSeats = { sis: seat(0.38, 0.72, -10), mum: seat(0.52, 1.04, -10), pip: seat(0.66, 0.98, -10) };

export const DinnerScene: React.FC<{ t: number; id: string; mode: Mode; pipFaces?: [number, Expr][] }> = ({ t, id, mode, pipFaces }) => {
  const S = dinnerSeats;
  const laugh = mode === 'laugh';
  const tell = mode === 'tell';
  const bounce = (ph: number, a: number) => (laugh ? Math.sin(t / 2.4 + ph) * a : Math.sin(t / 14 + ph) * a * 0.3);
  const eat = (ph: number) => {
    const c = Math.max(0, Math.sin(t / 10 + ph));
    return { a: 24 + 80 * c, b: -20 - 30 * c };
  };
  const common = { ...basePose, facing: 1 as const, sway: 3 };
  const sis: Pose = {
    ...common, x: S.sis.x, y: S.sis.y + bounce(1, 5), scale: S.sis.sc, yaw: 0.35,
    armL: tell || laugh ? { a: 100 + 45 * Math.sin(t / 3), b: -10 } : eat(0.5),
    armR: tell || laugh ? { a: 105 + 45 * Math.sin(t / 3 + 2), b: -10 } : { a: 20, b: -10 },
    headTilt: tell || laugh ? Math.sin(t / 5) * 6 : 0, ...faceAt(t, [[0, 'happy']]),
  };
  const mum: Pose = {
    ...common, x: S.mum.x, y: S.mum.y + bounce(2, 4), scale: S.mum.sc, yaw: 0.0, look: tell ? -0.7 : 0.2,
    armL: { a: 20, b: -10 }, armR: eat(2), headTilt: laugh ? Math.sin(t / 3 + 1) * 7 : Math.sin(t / 22) * 2,
    ...faceAt(t, [[0, laugh || tell ? 'happy' : 'neutral']]),
  };
  const pip: Pose = {
    ...common, x: S.pip.x, y: S.pip.y + bounce(0, 5), scale: S.pip.sc, yaw: -0.3, look: tell ? 0.6 : 0.0,
    armL: eat(4), armR: { a: 20, b: -10 }, headTilt: laugh ? Math.sin(t / 3 + 4) * 7 : Math.sin(t / 20) * 2,
    ...faceAt(t, pipFaces ?? [[0, laugh ? 'happy' : 'neutral']]),
  };
  const ib = (u: number, d: number, dy = 6) => {
    const p = islandTop(u, d);
    return { x: p.x, y: p.y + dy };
  };
  return (
    <g>
      <Kitchen t={t + 150} id={id} veil={0.42} />
      <Hero look={LOOKS.sis} pose={sis} rimId="rimR" shadow={0} />
      <Hero look={LOOKS.mom} pose={mum} rimId="rimR" shadow={0} />
      <Hero look={LOOKS.pipHood} pose={pip} rimId="rimL" shadow={0} />
      <KitchenIsland u={[ISLAND_U[0], ISLAND_U[1]]} stools={false} />
      <RiceBowl x={ib(0.37, 0.7).x} y={ib(0.37, 0.7).y} s={0.42} t={t} />
      <RiceBowl x={ib(0.52, 0.72).x} y={ib(0.52, 0.72).y} s={0.46} t={t + 9} />
      <RiceBowl x={ib(0.66, 0.7).x} y={ib(0.66, 0.7).y} s={0.46} t={t + 20} />
      <FishPlate x={ib(0.455, 0.3).x} y={ib(0.455, 0.3).y} s={0.5} t={t} />
      <SoupBowl x={ib(0.585, 0.3).x} y={ib(0.585, 0.3).y} s={0.46} t={t} />
      <Glow x={ib(0.52, 0.4).x} y={ib(0.52, 0.4).y - 120} r={420} o={0.4} />
      <Dust t={t} seed={91} x0={560} y0={300} w={800} h={400} n={20} o={0.35} />
    </g>
  );
};
