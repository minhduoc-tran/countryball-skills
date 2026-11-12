import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, backOut, LOOKS, Glow, Dust, FONT, Sparkle, PasteIn,
  Schematic, SCH, DrawOn, Arrow, SchLabel, PlantIcon, joints, toWorld, rnd, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { BlackCard, Terminal } from './che-xoi-cart-and-money-props';
import { DayHills, School, Clinic, Well, COAT, TEACHER } from './che-world-icons-and-people';

// Chapter E, "smart more" and "slower" (222.7-236.5 s): E12 a teacher and a doctor far away, E13 a lab, E14 cheaper
// power and cleaner water (schematic), E15 the card tapping a terminal slowly, E16 a school pops up, E17 a well and a clinic.

const PIP = LOOKS.pipHood;

/** A gold coin that falls from above onto (x, y) between t0 and t0 + 14, then sparkles. */
const Coin: React.FC<{ x: number; y: number; t: number; t0: number }> = ({ x, y, t, t0 }) => {
  const p = clamp((t - t0) / 14);
  if (p <= 0 || p >= 1) return null;
  return (
    <g transform={`translate(${x} ${y - 380 * (1 - p) * (1 - p)}) rotate(${p * 300})`}>
      <circle r={26} fill="#F2C94C" stroke="#8A6E2A" strokeWidth={5} /><circle r={17} fill="none" stroke="#B8902A" strokeWidth={3} />
      <text y={9} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill="#8A6E2A">₫</text>
    </g>
  );
};

// ---------- E12: wide pan across the mountains: a teacher at the hill school, then a doctor at the village clinic ----------
export const E12: React.FC<ShotProps> = ({ t, len }) => {
  const gy = 820;
  const sc = 0.9;
  const wave = Math.sin(t / 5);
  const teacher: Pose = { ...basePose, x: 760, y: gy - 140 * sc, scale: sc, yaw: 0.3, facing: 1, headTilt: 3, armL: { a: 12, b: -6 }, armR: { a: 150 + 12 * wave, b: 10 } };
  const doctor: Pose = { ...basePose, x: 1420, y: gy - 140 * sc, scale: sc, yaw: -0.3, facing: -1, headTilt: -3, armL: { a: 12, b: -6 }, armR: { a: 14, b: -6 } };
  return (
    <g transform={camT(kf(t, [[0, 620], [46, 720], [84, 1340], [len, 1360]]), 600, kf(t, [[0, 1.25], [len, 1.3]]))}>
      <DayHills id="e12" t={t} y0={600} sunX={1050} peaks />
      <rect x={-400} y={gy - 10} width={3200} height={500} fill="#C9A878" />
      <School x={420} y={gy} s={1.3} t={t} />
      <Clinic x={1700} y={gy} s={1.5} />
      <Hero look={TEACHER} pose={{ ...teacher, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Hero look={COAT} pose={{ ...doctor, ...faceAt(t, [[0, 'neutral'], [66, 'happy']]) }} rimId="rimL" shadow={0.5} />
      <Coin x={760} y={gy - 300} t={t} t0={22} />
      <Coin x={1420} y={gy - 300} t={t} t0={58} />
      <Sparkle x={820} y={gy - 380} t={t - 36} s={1.5} />
      <Sparkle x={1360} y={gy - 380} t={t - 72} s={1.5} />
      <Dust t={t} seed={121} x0={400} y0={400} w={1600} h={400} n={20} o={0.35} />
    </g>
  );
};

/** A lab flask: round bottom, a neck, glowing liquid up to `fill`; bubbles rise. */
const Flask: React.FC<{ x: number; y: number; s?: number; col: string; fill?: number; t: number }> = ({ x, y, s = 1, col, fill = 0.55, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Glow x={0} y={-30} r={110} o={0.35} />
    <path d="M -16 -110 V -60 L -56 -6 Q -66 24 -40 30 H 40 Q 66 24 56 -6 L 16 -60 V -110 Z" fill="#DFF3F6" opacity={0.45} stroke="#F6FFFF" strokeWidth={4} />
    <path d={`M -46 ${30 - 70 * fill} L 46 ${30 - 70 * fill} L 56 -6 Q 66 24 40 30 H -40 Q -66 24 -56 -6 Z`} fill={col} opacity={0.9} />
    {[0, 1, 2, 3].map((i) => {
      const ph = ((t * 0.7 + i * 15) % 60) / 60;
      return <circle key={i} cx={Math.sin(ph * 5 + i) * 14} cy={10 - ph * 90} r={4 + (i % 2) * 2} fill="#fff" opacity={Math.sin(ph * Math.PI) * 0.7} />;
    })}
    <rect x={-20} y={-116} width={40} height={10} rx={4} fill="#8A8794" />
  </g>
);

// ---------- E13: medium, a lab: a scientist holds up a glowing flask, bubbles rising, sunlight from a window ----------
export const E13: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.15;
  const gy = 900;
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: gy - 140 * sc, scale: sc, yaw: 0.4, facing: 1, look: 0.5, armL: { a: 12, b: -6 }, armR: { a: 60, b: 70 } } },
    { f: 30, p: { armR: { a: 84, b: 40 }, headTilt: 3 }, ease: easeOut },
    { f: 60, p: { armR: { a: 70, b: 60 }, headTilt: -2 } },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 640, kf(t, [[0, 1.3], [len, 1.45]]))}>
      <rect x={-400} y={-300} width={2720} height={1700} fill="#3E5C66" />
      <rect x={-400} y={gy - 20} width={2720} height={500} fill="#2C3C46" />
      <rect x={1180} y={230} width={380} height={300} rx={8} fill="#BDE7F5" stroke="#1E2C34" strokeWidth={10} />
      <path d="M 1370 230 V 530 M 1180 380 H 1560" stroke="#1E2C34" strokeWidth={8} />
      <Glow x={1370} y={380} r={520} o={0.45} />
      {[0, 1, 2].map((i) => <rect key={i} x={260 + i * 120} y={300 + i * 4} width={90} height={120} rx={6} fill={['#E9654B', '#3E8C86', '#F2B33D'][i]} opacity={0.75} />)}
      <rect x={200} y={450} width={500} height={14} fill="#6B4128" />
      <rect x={400} y={gy - 150} width={1250} height={30} fill="#8B5A3C" stroke="#4A2E20" strokeWidth={4} />
      <rect x={430} y={gy - 120} width={1190} height={170} fill="#6B4128" />
      <Flask x={600} y={gy - 150} s={0.9} col="#7BE0A0" fill={0.5} t={t + 10} />
      <Flask x={1500} y={gy - 150} s={0.8} col="#FF9AB0" fill={0.6} t={t + 30} />
      <Hero look={COAT} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [30, 'happy']]) }} rimId="rimL" shadow={0.4} />
      <Flask x={hand.x + 30} y={hand.y + 20} s={0.9} col="#6FD4FF" fill={0.62} t={t} />
      <Dust t={t} seed={131} x0={900} y0={300} w={700} h={400} n={18} o={0.5} />
    </g>
  );
};

// ---------- E14: schematic: a solar panel and a water drop; the price of power and water ticks down ----------
export const E14: React.FC<ShotProps> = ({ t, len }) => {
  const dropP = 'M 1380 400 Q 1300 520 1300 590 A 80 80 0 0 0 1460 590 Q 1460 520 1380 400 Z';
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Schematic t={t} id="e14" />
      <PlantIcon x={560} y={480} kind="solar" on={t > 4 ? 1 : 0} t={t} s={2.2} />
      <SchLabel x={560} y={700} t={t - 12} text="CHEAPER POWER" size={40} />
      <Arrow x0={760} y0={400} x1={860} y1={400} t={t - 18} dur={8} bend={0} />
      <DrawOn d={dropP} t={t - 34} dur={14} color={SCH.live} width={7} fill={`${SCH.live}33`} />
      <SchLabel x={1380} y={760} t={t - 48} text="CLEANER WATER" size={40} />
      {t > 50 ? <path d="M 1360 560 q 20 40 40 0" stroke={SCH.line} strokeWidth={6} fill="none" strokeLinecap="round" /> : null}
      <Sparkle x={1480} y={420} t={t - 52} s={1.3} />
    </g>
  );
};

// ---------- E15: insert: the black card glides to the terminal, taps it slowly, the screen goes green ----------
export const E15: React.FC<ShotProps> = ({ t, len }) => {
  const glide = easeOut(clamp(t / 16));
  const press = Math.sin(clamp((t - 16) / 8) * Math.PI);
  const back = easeOut(clamp((t - 30) / 12));
  const cx = 1500 - 520 * glide + 160 * back;
  const cy = 300 + 60 * press;
  const ok = t >= 22 ? 1 : 0;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#241A30" />
      <Glow x={960} y={500} r={720} kind="cool" o={0.25} />
      <rect x={-200} y={820} width={2320} height={460} fill="#3A2A44" />
      <g filter="url(#blur6)"><rect x={1300} y={760} width={500} height={60} rx={20} fill="#6B4B7A" opacity={0.5} /></g>
      <Terminal x={960} y={560} s={2.1} ok={ok} t={t} />
      {ok ? <Glow x={960} y={400} r={420} o={0.35 * (1 - clamp((t - 22) / 22))} /> : null}
      <g transform={`translate(${cx} ${cy}) scale(${1 - 0.06 * press})`}><BlackCard x={0} y={0} s={1.15} rot={-6} glow={0.3} /></g>
      <InsertArm x={cx + 190} y={cy + 20} fx={2150} fy={cy + 260} rot={82} />
      {ok ? <Sparkle x={1230} y={300} t={t - 22} s={1.5} /> : null}
    </g>
  );
};

/** The rolling morning hills shared by E16 and E17, with Pip's spot at x = 600. */
const World: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <DayHills id={id} t={t} y0={610} sunX={1500} />
    <rect x={-400} y={830} width={3000} height={500} fill="#6DAA77" />
    <rect x={-400} y={830} width={3000} height={12} fill="#9ED08A" />
  </g>
);
const tapPose = (t: number, x: number, sc: number, taps: number[]): Pose => {
  const jab = Math.max(0, ...taps.map((k) => Math.sin(clamp((t - k) / 8) * Math.PI)));
  return { ...basePose, x, y: 830 - 140 * sc, scale: sc, yaw: 0.5, facing: 1, headTilt: 2, look: 0.6, armL: { a: 12, b: -6 }, armR: { a: 52 + 28 * jab, b: 20 - 12 * jab } };
};

// ---------- E16: Pip on the hill taps the card in the air; a school pops up where it lands ----------
export const E16: React.FC<ShotProps> = ({ t, len }) => {
  const pose = tapPose(t, 620, 1.2, [18]);
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 660, kf(t, [[0, 1.25], [len, 1.35]]))}>
      <World t={t + 40} id="e16" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <BlackCard x={hand.x + 56} y={hand.y - 6} s={0.5} rot={-8} glow={0.35} />
      <PasteIn x={1320} y={700} t={t - 20} color="#FFE27A" ring={160}><School x={1320} y={830} s={1.35} t={t} /></PasteIn>
      <Sparkle x={1130} y={640} t={t - 22} s={1.4} />
    </g>
  );
};

// ---------- E17: the camera pulls back: the school stands, and two more taps raise a well and a clinic ----------
export const E17: React.FC<ShotProps> = ({ t, len }) => {
  const pose = tapPose(t, 420, 0.9, [8, 36]);
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 1150], [len, 1250]]), 640, kf(t, [[0, 1.35], [len, 1.05]]))}>
      <World t={t + 80} id="e17" />
      <School x={1000} y={830} s={1.2} t={t + 10} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <BlackCard x={hand.x + 44} y={hand.y - 6} s={0.4} rot={-8} glow={0.35} />
      <PasteIn x={1450} y={750} t={t - 12} color="#FFE27A" ring={130}><Well x={1450} y={830} s={1.3} t={t} /></PasteIn>
      <PasteIn x={1800} y={730} t={t - 40} color="#FFE27A" ring={150}><Clinic x={1800} y={830} s={1.35} /></PasteIn>
      <Sparkle x={1330} y={680} t={t - 14} s={1.3} />
      <Sparkle x={1690} y={640} t={t - 42} s={1.3} />
    </g>
  );
};
