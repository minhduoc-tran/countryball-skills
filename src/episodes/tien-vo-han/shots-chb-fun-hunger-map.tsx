import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, Schematic, SchLabel, CountUp, DrawOn, SCH, FONT, Sparkle, Glow,
  ShotProps,
} from '../../engine';
import { WorldMap, BowlIcon, ReportCard, MAP_BOWLS } from './chb-hunger-map-props';
import { BlackCard, InfinitySign } from './chb-card-terminal-and-confetti';

// Chapter B, the fun part (5/5, hunger): Pip faces the world map; the Ceres2030 report; the number on a rice bowl; the
// 2030 deadline as bowls filling along a timeline; "for you, one swipe"; the card sweeps the map and bowls light up.

const PIP = LOOKS.pipHood;
const TY = 'TỶ';

// ---------- B21: medium: Pip stands before a huge world map on the wall, hand on his chin, thinking big ----------
export const B21: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 520, y: 760, scale: 1.3, yaw: 0.8, look: 0.9, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 12, p: { armR: { a: 120, b: 60 }, headTilt: -6 }, ease: easeOut },
    { f: 30, p: { armR: { a: 140, b: 30 }, headTilt: -10, look: 1 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 980]]), 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <rect x={-300} y={-300} width={2600} height={1700} fill="#1B2438" />
      <rect x={-300} y={880} width={2600} height={500} fill="#141A2A" />
      <rect x={760} y={140} width={1080} height={600} rx={14} fill="#0F1626" stroke="#46557A" strokeWidth={8} />
      <WorldMap x={700} y={200} s={0.95} />
      {MAP_BOWLS.map(([bx, by], i) => <circle key={i} cx={700 + bx * 0.95} cy={200 + by * 0.95} r={8} fill={SCH.live} opacity={0.5 + 0.5 * Math.sin(t / 5 + i)} />)}
      <Glow x={1300} y={440} r={800} o={0.18} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [26, 'smug']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- B22: schematic: the Ceres2030 report pops up on the grid ----------
export const B22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Schematic t={t} id="b22" />
    <ReportCard x={960} y={540} s={1.15} t={t - 4} />
    <Glow x={960} y={540} r={700} o={0.15} />
    <Sparkle x={1260} y={250} t={t - 22} s={1.1} />
  </g>
);

// ---------- B23: schematic: a bowl of rice, the number counts up: 33 TỶ USD / NĂM ----------
export const B23: React.FC<ShotProps> = ({ t, len }) => {
  const on = clamp((t - 6) / 16);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Schematic t={t} id="b23" />
      <BowlIcon x={640} y={700} s={2.8} on={on} t={t} />
      <CountUp x={1010} y={600} t={t - 20} to={33} dur={26} size={260} color={SCH.live} />
      <SchLabel x={1330} y={500} t={t - 22} text={`${TY} USD`} size={90} color={SCH.line} anchor="start" />
      <SchLabel x={1330} y={600} t={t - 28} text="/ NĂM" size={76} color={SCH.dim} anchor="start" />
      <SchLabel x={1330} y={700} t={t - 44} text="CERES2030" size={34} color={SCH.dim} anchor="start" />
    </g>
  );
};

// ---------- B24: schematic: a timeline 2025 -> 2030; the empty bowls fill one by one as it sweeps ----------
export const B24: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp((t - 8) / 80);
  const n = 10;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t} id="b24" />
      {Array.from({ length: n }).map((_, i) => {
        const on = clamp((p * (n + 1) - i - 0.2) / 0.8);
        return <BowlIcon key={i} x={260 + i * 155} y={500} s={0.95} on={on} t={t + i * 9} />;
      })}
      <DrawOn d="M 200 760 H 1720" t={t - 2} dur={16} color={SCH.dim} width={8} />
      <circle cx={200 + p * 1520} cy={760} r={20} fill={SCH.live} />
      <rect x={200} y={752} width={p * 1520} height={16} rx={8} fill={SCH.live} opacity={0.9} />
      <SchLabel x={200} y={850} t={t - 6} text="2025" size={52} color={SCH.dim} anchor="start" />
      <SchLabel x={1720} y={850} t={t - 12} text="2030" size={68} color={SCH.live} anchor="end" />
      <SchLabel x={960} y={200} t={t - 4} text="CHẤM DỨT NẠN ĐÓI" size={56} color={SCH.line} />
    </g>
  );
};

// ---------- B25: medium: Pip shrugs with the card; the 33 TỶ bar beside an ∞ bar that never ends ----------
export const B25: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 560, y: 740, scale: 1.3, yaw: 0.3, look: 0.4, armL: { a: 14, b: -6 }, armR: { a: 40, b: 70 } } },
    { f: 10, p: { armL: { a: 70, b: 70 }, armR: { a: 70, b: 70 }, headTilt: 6, squash: -0.03 }, ease: easeOut },
    { f: 24, p: { headTilt: -4 } },
  ]);
  const small = easeOut(clamp((t - 4) / 12));
  const big = clamp((t - 8) / 24);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t} id="b25" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0} />
      <BlackCard x={400} y={420} s={0.45} rot={-10} />
      <g transform="translate(1000 0)">
        <rect x={0} y={330} width={620 * small * 0.06} height={60} rx={8} fill={SCH.line} />
        <SchLabel x={0} y={310} t={t - 6} text={`33 ${TY} USD/NĂM`} size={36} color={SCH.line} anchor="start" />
        <rect x={0} y={560} width={900 * big} height={60} rx={8} fill={SCH.live} />
        <InfinitySign x={460} y={780} s={3.4} color={SCH.live} w={8} o={clamp((t - 14) / 8)} />
        <SchLabel x={0} y={540} t={t - 12} text="SỐ DƯ: ∞" size={36} color={SCH.live} anchor="start" />
      </g>
    </g>
  );
};

// ---------- B26: the map; the card sweeps across it and every region lights up with a bowl of rice ----------
export const B26: React.FC<ShotProps> = ({ t, len }) => {
  const cx = kf(t, [[2, -200], [20, 1500]], easeOut);
  const sweep = (cx - 130) / 1.0;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t} id="b26" />
      <WorldMap x={460} y={260} s={1.0} glow={t > 6 ? 1 : 0} />
      {MAP_BOWLS.map(([bx, by], i) => {
        const wx = 460 + bx;
        const on = clamp((sweep - wx) / 60 + 0.1);
        return on > 0 ? <BowlIcon key={i} x={wx} y={260 + by + 20} s={0.62} on={on} t={t + i * 7} /> : null;
      })}
      <g opacity={clamp(1 - (t - 22) / 8)}>
        <path d={`M ${cx - 420} 190 H ${cx - 160}`} stroke="#FFE7A0" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
        <BlackCard x={cx} y={190} s={0.55} rot={-8} shine={clamp((t - 2) / 16)} />
      </g>
      {t > 22 ? <rect x={0} y={0} width={1920} height={1080} fill="#FFF3DC" opacity={0.08} /> : null}
      <SchLabel x={960} y={900} t={t - 16} text="CERES2030 · 33 TỶ USD/NĂM" size={34} color={SCH.dim} />
    </g>
  );
};
