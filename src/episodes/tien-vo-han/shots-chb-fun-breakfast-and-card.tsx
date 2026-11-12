import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, Street, streetStand, KIDS, Sparkle, Glow, Foreground,
  ShotProps,
} from '../../engine';
import { Loaf, Bowl, Stool, LowTable, Cheerer, BanhMiCart } from '../nghin-dong-moi-giay/chb-street-food-props';
import { Backdrop } from '../nghin-dong-moi-giay/chb-park-and-face-props';
import { XoiPlate, CaPheGlass } from './chb-food-and-family-props';
import { CardTerminal } from './chb-card-terminal-and-confetti';

// Chapter B, the fun part (1/5): day one, Pip pays for breakfast for the whole alley. The pavement quán wakes up,
// four quick food inserts (bánh mì, phở, xôi, cà phê) and the first swipe: tap, beep, green tick.

const PIP = LOOKS.pipHood;

const MorningWash: React.FC<{ o?: number }> = ({ o = 0.22 }) => (
  <rect x={-400} y={-400} width={2720} height={1880} fill="#FFD9A0" opacity={o} style={{ mixBlendMode: 'screen' }} />
);

type Neighbour = { dx: number; k: number; flip: boolean; row?: number; big?: number };
const Quan: React.FC<{ x: number; y: number; s: number; t: number; up: number; seed: number; c: number; who: Neighbour[] }> = ({ x, y, s, t, up, seed, c, who }) => (
  <g>
    {who.map((n, i) => <Stool key={`s${i}`} x={x + n.dx * s} y={y - (n.row ?? 0) * 30 * s} s={s} c={c + i} />)}
    {who.map((n, i) => (
      <Cheerer key={`k${i}`} x={x + n.dx * s} y={y - (n.row ?? 0) * 30 * s - 62 * s} s={s * 0.72 * (n.big ?? 1)} look={KIDS[n.k % 5]} t={t} up={up} flip={n.flip} seed={seed + i} />
    ))}
    <LowTable x={x} y={y + 10 * s} s={s}>
      <Bowl x={-120} y={2} s={0.9} t={t} />
      <Bowl x={0} y={4} s={0.9} t={t + 8} />
      <Bowl x={125} y={2} s={0.9} t={t + 16} />
    </LowTable>
  </g>
);

// ---------- B1: wide, the alley mouth at dawn: Pip strides in with open arms and the stools erupt ----------
export const B1: React.FC<ShotProps> = ({ t, len }) => {
  const s = streetStand(kf(t, [[0, -2.2], [26, -0.2]], easeOut), 4.9);
  const pose = poseAt(t, [
    { f: 0, p: { x: s.x, y: s.y, scale: s.scale, yaw: 0.6, look: 0.4, armL: { a: 14, b: -6 }, armR: { a: 18, b: -6 } } },
    { f: 20, p: { yaw: 0.2, armL: { a: 20, b: 8 }, armR: { a: 22, b: 8 } } },
    { f: 28, p: { armL: { a: 105, b: 10 }, armR: { a: 105, b: 10 }, squash: -0.04 }, ease: easeOut },
    { f: 38, p: { squash: 0 } },
  ]);
  const walkBob = t < 26 ? Math.abs(Math.sin(t * 0.55)) * -10 * s.scale : 0;
  const up = clamp((t - 24) / 8);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 980]]), 660, kf(t, [[0, 1.0], [len, 1.18]]))}>
      <Street t={t + 40} id="b1" market={0.6} />
      <MorningWash o={0.28} />
      <Quan x={420} y={955} s={1.25} t={t} up={up} seed={1} c={0} who={[{ dx: -250, k: 0, flip: false }, { dx: 250, k: 1, flip: true }, { dx: -140, k: 2, flip: false, row: 1.6 }]} />
      <Quan x={1500} y={955} s={1.25} t={t + 30} up={clamp((t - 30) / 8)} seed={7} c={1} who={[{ dx: -250, k: 3, flip: false }, { dx: 250, k: 4, flip: true }, { dx: 140, k: 1, flip: true, row: 1.6 }]} />
      <Hero look={PIP} pose={{ ...pose, y: pose.y + walkBob, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Glow x={1180} y={470} r={620} o={0.3} />
      {t > 28 ? <Sparkle x={s.x + 30} y={s.y - 330 * s.scale} t={t - 28} s={0.8} /> : null}
    </g>
  );
};

// ---------- B2: medium, the neighbours' table, close: the whole street cheering, bowls steaming ----------
export const B2: React.FC<ShotProps> = ({ t, len }) => {
  const sx = 1.0 + 0.06 * Math.sin(t / 5);
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 800]]), 760, kf(t, [[0, 1.9], [len, 2.15]]))}>
      <Street t={t + 90} id="b2" market={0.8} />
      <MorningWash o={0.3} />
      <Quan x={760} y={940} s={1.6} t={t} up={1} seed={3} c={2} who={[{ dx: -240, k: 2, flip: false }, { dx: 240, k: 3, flip: true }, { dx: 0, k: 0, flip: false, row: 1.4, big: 0.9 }]} />
      <Foreground blur={10}>
        <g transform={`translate(1500 1080) scale(${sx})`}>
          <ellipse cx={0} cy={0} rx={260} ry={310} fill="#1B1420" />
        </g>
      </Foreground>
    </g>
  );
};

// ---------- table inserts: a wooden table, a window of morning behind it ----------
const TableTop: React.FC<{ id: string; t: number }> = ({ id, t }) => (
  <g>
    <Backdrop id={id} t={t} top="#6A4A3A" bottom="#E8B077" />
    <rect x={-300} y={740} width={2600} height={500} fill="#7A4E30" />
    <rect x={-300} y={740} width={2600} height={14} fill="#B98458" />
    <path d="M -300 840 H 2300 M -300 930 H 2300" stroke="#5E3A22" strokeWidth={3} opacity={0.6} />
  </g>
);
const pop = (k: number) => (k <= 0 ? 0 : backOut(clamp(k / 7)));

// ---------- B3: insert: bánh mì and phở pop onto the table, one per word ----------
export const B3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 940], [len, 960]]), 600, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <TableTop id="b3" t={t} />
    <g transform={`translate(560 760) scale(${pop(t - 2)})`}><Loaf x={0} y={0} s={1.7} rot={-6} fill={1} /></g>
    <g transform={`translate(1290 770) scale(${pop(t - 14)})`}><Bowl x={0} y={0} s={2.6} t={t} /></g>
    <Sparkle x={560} y={560} t={t - 3} s={1.1} />
    <Sparkle x={1290} y={520} t={t - 15} s={1.1} />
    <Glow x={1000} y={300} r={700} o={0.25} />
  </g>
);

// ---------- B4: insert: xôi and the phin coffee pop in; the coffee drips ----------
export const B4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 940]]), 580, kf(t, [[0, 1.12], [len, 1.0]]))}>
    <TableTop id="b4" t={t + 30} />
    <g transform={`translate(560 770) scale(${pop(t - 2)})`}><XoiPlate x={0} y={0} s={1.5} t={t} /></g>
    <g transform={`translate(1300 770) scale(${pop(t - 20)})`}><CaPheGlass x={0} y={0} s={1.75} t={t} /></g>
    <Sparkle x={560} y={480} t={t - 3} s={1.1} />
    <Sparkle x={1300} y={300} t={t - 21} s={1.1} />
    <Glow x={1000} y={300} r={700} o={0.25} />
  </g>
);

// ---------- B5: close: the card taps the terminal at the cart: beep, green tick, balance ∞ ----------
export const B5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 980]]), 520, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Backdrop id="b5" t={t} top="#3A2A3A" bottom="#C58A5A" />
    <Foreground blur={16}>
      <BanhMiCart x={380} y={1000} s={1.9} t={t} />
    </Foreground>
    <rect x={-300} y={930} width={2600} height={400} fill="#4A3228" />
    <rect x={-300} y={930} width={2600} height={10} fill="#8A5E3E" />
    <CardTerminal x={1010} y={960} s={1.7} k={t - 6} />
  </g>
);
