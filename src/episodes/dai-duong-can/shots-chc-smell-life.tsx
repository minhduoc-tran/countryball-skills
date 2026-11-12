import React from 'react';
import { Hero, Pose, basePose, faceAt, kf, clamp, easeOut, camT, LOOKS, Foreground, ShotProps, joints, toWorld, rnd } from '../../engine';
import { DanangBeach } from './kit-danang-beach';
import { DrySeabed } from './kit-dry-seabed';
import { BigNum } from './kit-hud';
import { Fish } from '../sun-disappeared/chd-ocean-props';
import { StinkLines, StinkCloud, Whale, Plankton } from './chc-life-props';
import { FaceHand } from './chc-cast-gestures';

// Chapter C, beat "5 smell" (117.5-129.0 s): C1 Pip and Mo smell it and pinch their noses, C2 "200.000+ LOÀI", C3 the blue whale
// greying on the dry seabed, C4 plankton under a lens greying, C5 all life greys at once, C6 the stinking coast with dead fish and
// flies, C7 months pass (day/night pulses, look "months").

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const GREY = '#9AA0A6';

/** Flies circling a point. */
const Flies: React.FC<{ t: number; x: number; y: number; n?: number; r?: number; o?: number }> = ({ t, x, y, n = 6, r = 90, o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const a = t * (0.22 + rnd(1, i) * 0.2) + i * 2.1;
      return <circle key={i} cx={x + Math.cos(a) * r * (0.5 + rnd(2, i)) + Math.sin(a * 2.3) * 14} cy={y + Math.sin(a * 1.3) * r * 0.5} r={4.5} fill="#1D1B22" />;
    })}
  </g>
);

// ---------- C1: Pip and Mo on the drained beach, they sniff, the green smell rises, both pinch their noses ----------
export const C1: React.FC<ShotProps> = ({ t, len }) => {
  const S = 1.5;
  const pinch = easeOut(clamp((t - 30) / 8));
  const pinchMo = easeOut(clamp((t - 36) / 8));
  const sniff = Math.sin(t * 0.7) * (t < 26 ? 1 : 0);
  const pip: Pose = { ...basePose, x: 700, y: 905 - 138 * S, scale: S, yaw: 0.55, facing: 1, look: 0.8, headTilt: -6 - sniff * 3 + pinch * 6, armL: { a: 8, b: 4 }, armR: { a: 12, b: -4 }, ...faceAt(t, [[0, 'neutral'], [26, 'worried'], [44, 'shock']]) };
  const mo: Pose = { ...basePose, x: 1060, y: 925 - 138 * S, scale: S, yaw: 0.5, facing: 1, look: 0.7, headTilt: -4 + pinchMo * 5, armL: { a: 10, b: 4 }, armR: { a: 38, b: -6 }, ...faceAt(t, [[0, 'neutral'], [32, 'worried'], [48, 'shock']]) };
  const hand = toWorld(mo, joints(mo).armR.end);
  const o = clamp(t / 30);
  return (
    <g transform={camT(kf(t, [[0, 840], [len, 880]]), 650, kf(t, [[0, 1.4], [len, 1.55]]))}>
      <DanangBeach id="c1b" t={t + 40} drain={1} people={[]} />
      <rect x={0} y={400} width={1920} height={700} fill="#9CCB4A" opacity={0.12 * o} />
      <StinkLines t={t + 20} x0={150} w={1650} y={880} h={520} n={14} seed={3} o={0.9 * o} />
      <Hero look={MO} pose={mo} rimId="rimR" shadow={0} />
      <path d={`M ${hand.x - 40} ${hand.y + 30} L ${hand.x + 330} ${hand.y - 250}`} stroke="#6B4A2A" strokeWidth={8} strokeLinecap="round" />
      <Hero look={PIP} pose={pip} rimId="rimR" shadow={0} />
      <FaceHand pose={pip} look={PIP} k={pinch} />
      <FaceHand pose={mo} look={MO} k={pinchMo} />
      <Foreground blur={10}><StinkCloud x={260} y={1020} s={1.6} t={t} o={0.5 * o} /></Foreground>
    </g>
  );
};

// ---------- C2: 200.000+ LOÀI ----------
export const C2: React.FC<ShotProps> = ({ t, len }) => (
  <BigNum t={t} len={len} id="c2n" text="200.000+" unit="LOÀI" caption="SINH VẬT BIỂN" size={300} />
);

// ---------- C3: the blue whale lies on the dry seabed and fades to grey; flies and green lines ----------
export const C3: React.FC<ShotProps> = ({ t, len }) => {
  const grey = easeOut(clamp((t - 5) / 22));
  return (
    <g transform={camT(kf(t, [[0, 860], [len, 900]]), 720, kf(t, [[0, 1.15], [len, 1.35]]))}>
      <DrySeabed id="c3s" t={t} haze={0.35} />
      <ellipse cx={900} cy={846} rx={520} ry={34} fill="#000" opacity={0.3} />
      <Whale x={900} y={744} s={0.95} grey={grey} t={t} rot={-3} />
      <StinkLines t={t} x0={420} w={1000} y={760} h={380} n={9} seed={7} o={0.9 * grey} />
      <Flies t={t} x={900} y={560} n={8} r={160} o={grey} />
    </g>
  );
};

// ---------- C4: plankton under a round lens drain of colour, one after another ----------
const PLANK: [number, number, number, number][] = [[-250, -210, 0, 1.3], [90, -280, 1, 1.2], [300, -120, 2, 1.35], [-330, 40, 1, 1.2], [-40, -40, 0, 1.6], [220, 110, 2, 1.2], [-200, 230, 2, 1.3], [100, 270, 0, 1.2], [350, 260, 1, 1.0]];
export const C4: React.FC<ShotProps> = ({ t, len }) => {
  const z = kf(t, [[0, 1], [len, 1.1]]);
  return (
    <g>
      <rect width={1920} height={1080} fill="#07161E" />
      <g transform={camT(960, 540, z)}>
        <defs>
          <radialGradient id="c4g" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stopColor="#1E7A8C" /><stop offset="1" stopColor="#0B3340" /></radialGradient>
          <clipPath id="c4c"><circle cx={960} cy={540} r={440} /></clipPath>
        </defs>
        <circle cx={960} cy={540} r={440} fill="url(#c4g)" />
        <g clipPath="url(#c4c)">
          {Array.from({ length: 18 }).map((_, i) => <circle key={i} cx={560 + rnd(3, i) * 800} cy={160 + rnd(4, i) * 760 + Math.sin(t / 16 + i) * 8} r={3 + rnd(5, i) * 4} fill="#BFF3FF" opacity={0.25} />)}
          {PLANK.map(([dx, dy, k, s], i) => <Plankton key={i} x={960 + dx + Math.sin(t / 18 + i) * 10} y={540 + dy} s={s} kind={k} t={t + i * 9} grey={easeOut(clamp((t - 6 - i * 3.2) / 14))} />)}
          <ellipse cx={780} cy={330} rx={150} ry={60} fill="#FFFFFF" opacity={0.08} transform="rotate(-30 780 330)" />
        </g>
        <circle cx={960} cy={540} r={440} fill="none" stroke="#F6EFE3" strokeWidth={16} />
        <circle cx={960} cy={540} r={452} fill="none" stroke="#0B0816" strokeWidth={8} opacity={0.6} />
      </g>
    </g>
  );
};

// ---------- C5: every kind of sea life greys at the same instant (white pulse ring) ----------
export const C5: React.FC<ShotProps> = ({ t, len }) => {
  const g = easeOut(clamp((t - 22) / 7));
  const ring = clamp((t - 22) / 18);
  const sink = g * 24;
  const filt = { filter: `grayscale(${g})` };
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <defs><linearGradient id="c5g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2E86C1" /><stop offset="1" stopColor="#154869" /></linearGradient></defs>
      <rect x={-200} y={-200} width={2320} height={1480} fill="url(#c5g)" />
      <rect x={-200} y={-200} width={2320} height={1480} fill="#6B7076" opacity={g * 0.5} />
      <g style={filt}>
        <Whale x={470} y={330 + sink} s={0.36} t={t} grey={g} />
        <Fish x={1000} y={290 + sink} s={1.9} t={t} dir={-1} />
        <Fish x={1500} y={420 + sink} s={1.4} t={t + 5} color="#7FB6D9" />
        <Plankton x={1700} y={210 + sink} s={1.6} kind={0} t={t} grey={g} />
        <Plankton x={360} y={730 + sink} s={1.8} kind={1} t={t} grey={g} />
        <Fish x={800} y={780 + sink} s={2.0} t={t + 3} color="#E86A6A" />
        <Plankton x={1180} y={720 + sink} s={1.8} kind={2} t={t} grey={g} />
        <Whale x={1560} y={800 + sink} s={0.32} t={t + 9} grey={g} />
      </g>
      {ring > 0 && ring < 1 ? <circle cx={960} cy={540} r={ring * 1300} fill="none" stroke="#FFFFFF" strokeWidth={22 * (1 - ring)} opacity={1 - ring} /> : null}
    </g>
  );
};

// ---------- C6: the coast stinks: green clouds, dead fish belly-up, flies ----------
export const C6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 820], [len, 1060]]), 680, kf(t, [[0, 1.25], [len, 1.3]]))}>
    <DanangBeach id="c6b" t={t + 80} drain={1} people={[]} />
    <rect x={0} y={380} width={1920} height={720} fill="#9CCB4A" opacity={0.2} />
    {[[330, 910, 1.3, 0], [640, 960, 1.0, 1], [980, 900, 1.2, 2], [1320, 975, 1.4, 3], [1620, 925, 1.0, 4]].map(([x, y, s, i]) => (
      <g key={i} style={{ filter: 'grayscale(1) brightness(0.85)' }}>
        <ellipse cx={x} cy={y + 24} rx={90 * s} ry={11 * s} fill="#000" opacity={0.3} />
        <g transform={`translate(${x} ${y - 10}) rotate(180) scale(-1 1)`}><Fish x={0} y={0} s={s} t={0} /></g>
      </g>
    ))}
    {[330, 980, 1320].map((x, i) => <Flies key={i} t={t + i * 11} x={x} y={820} n={5} r={90} />)}
    <StinkLines t={t} x0={120} w={1700} y={940} h={560} n={16} seed={9} o={0.9} width={12} />
    <Foreground blur={10}>
      <StinkCloud x={300} y={1010} s={2.2} t={t} o={0.55} />
      <StinkCloud x={1640} y={1000} s={2.0} t={t + 20} o={0.5} />
    </Foreground>
  </g>
);

// ---------- C7: months pass over the stinking coast: three quick day/night pulses (look "months") ----------
export const C7: React.FC<ShotProps> = ({ t, len }) => {
  const night = 0.5 * (1 - Math.cos((t / 12) * Math.PI * 2 - 0.4));
  return (
    <g transform={camT(960, 640, kf(t, [[0, 1.05], [len, 1.2]]))}>
      <DanangBeach id="c7b" t={t + 200} drain={1} people={[]} />
      <rect x={0} y={380} width={1920} height={720} fill="#9CCB4A" opacity={0.25} />
      <StinkLines t={t * 2} x0={80} w={1760} y={900} h={600} n={22} seed={13} o={0.95} width={12} />
      <rect x={-100} y={-100} width={2120} height={1300} fill="#0B1236" opacity={night * 0.6} />
      <Foreground blur={10}><StinkCloud x={960} y={1030} s={3} t={t} o={0.5} /></Foreground>
    </g>
  );
};
