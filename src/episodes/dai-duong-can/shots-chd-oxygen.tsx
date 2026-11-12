import React from 'react';
import { Hero, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, ShotProps, Schematic, Tag, Sparkle, Glow, FONT } from '../../engine';
import { DrySeabed } from './kit-dry-seabed';
import { BigNum } from './kit-hud';
import { Pill } from './chd-sky-props';
import { Plankton, O2Bubbles, AirTank, AirSwirl, ThreatIcon } from './chd-icon-props';

// Chapter D, "7 oxygen" (214.28-229.87 s): D18 Pip breathes, D19 plankton under the lens, D20 "≈ 1/2", D21 the atmosphere tank,
// D22 "not lack of air" crossed out, D23 the three threats NƯỚC / MƯA / CÁI ĂN.

// ---------- D18: Pip takes a deep breath on the dry seabed; a green tick pops at "không ngạt thở" ----------
export const D18: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 730, scale: 1.4, yaw: 0.3, expr: 'worried', tilt: 0, armL: { a: 8, b: -8 }, armR: { a: 8, b: -8 } } },
    { f: 26, p: { tilt: -4, armL: { a: 38, b: -10 }, armR: { a: 38, b: -10 }, squash: -0.03 } },
    { f: 40, p: { tilt: 0, armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 }, squash: 0.02 } },
    { f: 48, p: { squash: 0 } },
  ]);
  const face = faceAt(t, [[0, 'worried'], [10, 'neutral'], [40, 'happy']]);
  const blink = t >= 10 && t < 32 ? 1 : face.blink;
  const pop = backOut(clamp((t - 40) / 8));
  return (
    <g transform={camT(960, 620, kf(t, [[0, 1.55], [len, 1.7]]))}>
      <DrySeabed id="d18s" t={t} haze={0.3} />
      <Hero look={LOOKS.pipHood} pose={{ ...pose, ...face, blink }} rimId="rimL" shadow={0.8} />
      <g opacity={clamp(1 - Math.abs(t - 18) / 18)}><AirSwirl x={640} y={470} s={0.62} t={t} /></g>
      <g transform={`translate(1260 430) scale(${pop})`}>
        <circle r={78} fill="#2FBF71" stroke="#14121A" strokeWidth={8} style={{ filter: 'drop-shadow(0 0 22px #2FBF71AA)' }} />
        <path d="M -34 4 L -10 30 L 38 -26" stroke="#E9FFF2" strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Sparkle x={1360} y={340} t={t - 42} s={1.1} />
    </g>
  );
};

// ---------- D19: through a lens: plankton drifting in the sea, bubbles of oxygen rising ----------
export const D19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.1]]))}>
    <defs>
      <linearGradient id="d19bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3AA0E0" /><stop offset="1" stopColor="#0F3F6B" /></linearGradient>
      <radialGradient id="d19lens" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stopColor="#7FD8E8" /><stop offset="1" stopColor="#1B6F9E" /></radialGradient>
      <clipPath id="d19clip"><circle cx={960} cy={500} r={380} /></clipPath>
    </defs>
    <rect x={-100} y={-100} width={2120} height={1280} fill="url(#d19bg)" />
    {[300, 640, 1280, 1620].map((x, i) => <path key={x} d={`M ${x} -20 L ${x + 160} 1100`} stroke="#BFE6FA" strokeWidth={50 + i * 10} opacity={0.08} />)}
    <circle cx={960} cy={500} r={380} fill="url(#d19lens)" />
    <g clipPath="url(#d19clip)">
      <Plankton x={800} y={420} s={1.7} kind={0} t={t} />
      <Plankton x={1130} y={560} s={1.5} kind={1} t={t + 9} />
      <Plankton x={900} y={680} s={1.3} kind={2} t={t + 4} />
      <Plankton x={1180} y={360} s={1.0} kind={0} t={t + 14} />
      <Plankton x={720} y={600} s={0.9} kind={1} t={t + 20} />
      <O2Bubbles x={820} y={600} t={t} n={6} h={460} spread={220} />
      <O2Bubbles x={1150} y={700} t={t + 30} n={5} h={460} spread={200} />
    </g>
    <circle cx={960} cy={500} r={380} fill="none" stroke="#F6EFE3" strokeWidth={18} />
    <path d="M 700 270 A 330 330 0 0 1 900 190" stroke="#FFFFFF" strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.6} />
    <Pill x={960} y={960} t={t - 4} text="SINH VẬT PHÙ DU" size={54} col="#BFF0D4" />
  </g>
);

// ---------- D20: "≈ 1/2" of the planet's oxygen, bubbles and plankton around it ----------
export const D20: React.FC<ShotProps> = ({ t, len }) => (
  <BigNum t={t} len={len} id="d20s" text="≈ 1/2" caption="Ô XY CỦA TRÁI ĐẤT">
    <O2Bubbles x={260} y={1000} t={t} n={7} h={760} spread={260} />
    <O2Bubbles x={1660} y={1000} t={t + 40} n={7} h={760} spread={260} />
    <Plankton x={180} y={900} s={1.1} kind={0} t={t} />
    <Plankton x={1740} y={880} s={1.0} kind={1} t={t + 6} />
    <Plankton x={560} y={960} s={0.7} kind={2} t={t + 12} />
    <Plankton x={1380} y={970} s={0.7} kind={0} t={t + 3} />
  </BigNum>
);

// ---------- D21: the atmosphere as a big tank holding the Earth; its gauge stays full ----------
export const D21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 540, kf(t, [[0, 1], [len, 1.08]]))}>
    <defs><linearGradient id="d21bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1C4268" /><stop offset="1" stopColor="#0B1628" /></linearGradient></defs>
    <rect x={-100} y={-100} width={2120} height={1280} fill="url(#d21bg)" />
    <Glow x={700} y={500} r={600} kind="cool" o={0.5} />
    <AirTank id="d21t" x={760} y={560} t={t} />
    <O2Bubbles x={760} y={800} t={t} n={6} h={500} spread={300} text={false} />
    <Pill x={1380} y={720} t={t - 41} text="ĐỦ CHO" size={64} col="#BFF0D4" />
    <Pill x={1380} y={850} t={t - 46} text="HÀNG NGHÌN NĂM" size={64} col="#BFF0D4" />
  </g>
);

// ---------- D22: the danger is NOT lack of air: a big red cross stamps over the air swirls ----------
export const D22: React.FC<ShotProps> = ({ t, len }) => {
  const x = easeOut(clamp((t - 44) / 7));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
      <Schematic t={t} id="d22s" />
      <g opacity={1 - 0.45 * x}><AirSwirl x={960} y={400} s={1.5} t={t} /></g>
      <path d="M 640 170 L 1280 630 M 1280 170 L 640 630" stroke="#FF5A4A" strokeWidth={36} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - x} opacity={0.95} />
      <Tag x={960} y={820} t={t - 4} text="KHÔNG KHÍ" w={560} />
    </g>
  );
};

// ---------- D23: three threat cards pop on their words: NƯỚC (t5), MƯA (t22), CÁI ĂN (t45) ----------
const Card: React.FC<{ x: number; t: number; kind: 'water' | 'rain' | 'food'; label: string; col: string; tt: number }> = ({ x, t, kind, label, col, tt }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 8));
  const pulse = 1 + 0.03 * Math.sin(tt / 4);
  return (
    <g transform={`translate(${x} 540) scale(${s * pulse})`}>
      <rect x={-230} y={-290} width={460} height={580} rx={44} fill="#0E1A30" stroke={col} strokeWidth={10} style={{ filter: 'drop-shadow(0 10px 0 rgba(0,0,0,0.4))' }} />
      <g transform="translate(0 -70) scale(1.45)"><ThreatIcon kind={kind} t={tt} /></g>
      <text y={215} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={label.length > 5 ? 70 : 86} fill="#F6EFE3" letterSpacing={3}>{label}</text>
      <g transform="translate(176 -246)"><circle r={42} fill="#FF5A4A" stroke="#14121A" strokeWidth={6} /><text y={20} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={58} fill="#FFFFFF">!</text></g>
    </g>
  );
};

export const D23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
    <Schematic t={t} id="d23s" />
    <Card x={400} t={t - 6} tt={t} kind="water" label="NƯỚC" col="#4FB4F0" />
    <Card x={960} t={t - 28} tt={t} kind="rain" label="MƯA" col="#B8C8D6" />
    <Card x={1520} t={t - 57} tt={t} kind="food" label="CÁI ĂN" col="#FF9A4A" />
  </g>
);
