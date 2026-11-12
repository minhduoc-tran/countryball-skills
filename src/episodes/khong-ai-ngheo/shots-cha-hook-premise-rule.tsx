import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, walkPose, joints, toWorld, LOOKS, Look, LEG_LEN, streetStand, TitleCard, Stars, Skyline, Bokeh, Rays, Glow, Sparkle,
  FONT, ShotProps, Pose, UI,
} from '../../engine';
import { GRANDMA, DOCTOR, WORKER, VILLAGE_GIRL } from './cast-looks';
import { EarthLights, GoldPile, CrossOut, EnoughBadge, RiceBowlIcon, RoofIcon, SchoolBagIcon, DoctorCrossIcon } from './cha-earth-and-rule-props';
import { GoldFloor } from './cha-village-and-school-props';
import { DawnAlley, DawnMotes } from '../tien-vo-han/che-dawn-alley-backdrop';

// Chapter A, hook + premise + the rule (11.46-27.21 s): the Earth with a light for 8 billion, the poverty counter falling to 0,
// the title over a dawn alley, then the rule: no billionaires, everyone has enough, like a floor nobody falls below.

const GROUND = 900;
const CREAM = '#F6EFE3';
const CAST: Look[] = [DOCTOR, WORKER, VILLAGE_GIRL, GRANDMA, LOOKS.mo, LOOKS.mom, LOOKS.sis, LOOKS.pipHood, LOOKS.suit];
const dots = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const Space: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-400} y={-400} width={2720} height={1900} fill="#050A1A" />
    <Stars seed={9} x0={-200} y0={-200} w={2320} h={1500} t={t} n={90} o={0.7} />
  </g>
);

// ---------- A9: the Earth at night, a light switching on for every crowd of people: 8 TỶ ----------
export const A9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 640, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Space t={t} />
    <EarthLights t={t + 40} id="a9e" cx={960} cy={700} r={290} lit={clamp((t + 4) / 24)} warm={0.2} />
    <text x={960} y={330} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={160} fill={CREAM} stroke="#050A1A" strokeWidth={12} paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 26px rgba(255,200,120,0.6))' }}>
      {Math.round(8 * easeOut(clamp((t + 2) / 20)))} TỶ
    </text>
  </g>
);

// ---------- A10: the poverty counter runs down to 0 and gets its green tick; the Earth's lights warm up ----------
export const A10: React.FC<ShotProps> = ({ t, len }) => {
  const v = 700000000 * (1 - easeOut(clamp(t / 16)));
  const tick = backOut(clamp((t - 17) / 8));
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 560, kf(t, [[0, 1.05], [len, 1.0]]))}>
      <Space t={t + 20} />
      <EarthLights t={t + 80} id="a10e" cx={560} cy={580} r={320} lit={1} warm={clamp(t / 16)} />
      <text x={1330} y={330} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={54} fill="#A9B6CC" letterSpacing={6}>NGƯỜI NGHÈO</text>
      <text x={1330} y={600} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={v > 0 ? 118 : 260} fill={v > 0 ? '#FF8A3D' : '#5BE08A'} stroke="#050A1A" strokeWidth={8} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 22px ${v > 0 ? 'rgba(255,138,61,0.55)' : 'rgba(91,224,138,0.6)'})` }}>{dots(v)}</text>
      <g transform={`translate(1330 790) scale(${tick})`}>
        <circle r={62} fill="#2FBF71" />
        <path d="M -28 2 l 20 24 l 40 -50" stroke="#E9FFF2" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Sparkle x={1500} y={620} t={t - 16} s={1.6} />
      <Sparkle x={1150} y={560} t={t - 19} s={1.2} />
    </g>
  );
};

// ---------- A11: the title over the dawn alley (the lines pop on; NGHÈO pulses as it is spoken) ----------
export const A11: React.FC<ShotProps> = ({ t, len }) => {
  const w = streetStand(2.4, 9.5, { k: 1.6 });
  const wk = walkPose(w.x + 240 - t * 2.6, t * 0.5, w.y + LEG_LEN * w.scale, w.scale, {}, -1);
  const g = streetStand(4.9, 5.2, { k: 1.55, sidewalk: true });
  const gk = walkPose(g.x - 240 + t * 3.3, t * 0.55, g.y + LEG_LEN * g.scale, g.scale, { look: 0.2 }, 1);
  return (
    <g>
      <g transform={camT(960, 590, kf(t, [[0, 1.0], [len, 1.1]]))}>
        <DawnAlley t={t + 30} id="a11da" cart />
        <Hero look={WORKER} pose={wk} rimId="rimL" shadow={0.4} />
        <Hero look={VILLAGE_GIRL} pose={gk} rimId="rimL" shadow={0.4} />
        <DawnMotes t={t} seed={3} />
      </g>
      <TitleCard t={t} lines={['SẼ RA SAO NẾU THẾ GIỚI', 'KHÔNG CÒN AI NGHÈO?']} accent="NGHÈO" accentT={64} size={104} y={165} />
    </g>
  );
};

// ---------- stage backgrounds for the rule shots ----------
const Stage: React.FC<{ id: string; t: number; warm?: boolean }> = ({ id, t, warm = false }) => (
  <g>
    <defs>
      <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={warm ? '#7A5A9A' : '#1C1432'} />
        <stop offset="0.7" stopColor={warm ? '#F2A36E' : '#3A2448'} />
        <stop offset="1" stopColor={warm ? '#FFD59A' : '#4A2E4A'} />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={2720} height={1700} fill={`url(#${id}bg)`} />
    <Skyline y={760} seed={4} color={warm ? '#6A4A7E' : '#2A1B45'} h={200} />
    <Bokeh seed={5} n={9} x0={0} y0={120} w={1920} h={520} t={t} o={0.2} />
  </g>
);

// ---------- A12: a heap of gold with a crown: "nobody becomes a billionaire"; a red cross strikes it out ----------
export const A12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <Stage id="a12s" t={t} />
    <Rays x={960} y={600} t={t} len={900} n={12} o={0.12} />
    <Glow x={960} y={620} r={640} o={0.5} />
    <GoldPile x={960} y={880} s={1.3} t={t} />
    <Sparkle x={820} y={420} t={t - 6} s={1.5} />
    <Sparkle x={1130} y={500} t={t - 14} s={1.2} />
    <CrossOut x={960} y={600} t={t - 34} dur={9} s={1.2} />
  </g>
);

const Tick: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y}) scale(${backOut(clamp(t / 8))})`} style={{ display: t < 0 ? 'none' : undefined }}>
    <circle r={38} fill="#2FBF71" stroke="#E9FFF2" strokeWidth={5} />
    <path d="M -16 1 l 11 13 l 22 -28" stroke="#E9FFF2" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

// ---------- A13: "everyone has enough": five people in a row, a tick pops over each, one by one ----------
export const A13: React.FC<ShotProps> = ({ t, len }) => {
  const row = [DOCTOR, WORKER, VILLAGE_GIRL, GRANDMA, LOOKS.mo];
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Stage id="a13s" t={t} warm />
      <GoldFloor x0={-300} x1={2220} y={GROUND + 10} t={t} id="a13fl" th={26} />
      {row.map((look, i) => {
        const at = 4 + i * 7;
        const pose = poseAt(t, [
          { f: 0, p: { x: 330 + i * 315, y: GROUND - LEG_LEN * 1.05, scale: 1.05, yaw: i % 2 ? -0.25 : 0.25, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 } } },
          { f: at, p: { squash: 0.0 }, ease: easeOut },
          { f: at + 4, p: { squash: -0.05, armR: { a: 40, b: 10 } }, ease: easeOut },
          { f: at + 12, p: { squash: 0, armR: { a: 14, b: -6 } } },
        ]);
        return (
          <g key={i}>
            <Hero look={look} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [at, 'happy']]) }} rimId={i < 3 ? 'rimR' : 'rimL'} shadow={0.5} />
            <Tick x={330 + i * 315} y={GROUND - LEG_LEN * 1.05 - 290} t={t - at} />
          </g>
        );
      })}
    </g>
  );
};

// ---------- A14: the four things everyone has: rice, a roof, school, a doctor, popping in on their words ----------
export const A14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 930], [len, 990]]), 560, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <Stage id="a14s" t={t} warm />
    <rect x={-400} y={-400} width={2720} height={1700} fill="#1A1030" opacity={0.35} />
    <GoldFloor x0={-300} x1={2220} y={880} t={t} id="a14fl" th={22} />
    <EnoughBadge x={330} y={540} t={t - 2} label="ĐỦ ĂN"><RiceBowlIcon t={t} /></EnoughBadge>
    <EnoughBadge x={750} y={540} t={t - 28} label="MÁI NHÀ"><RoofIcon t={t} /></EnoughBadge>
    <EnoughBadge x={1170} y={540} t={t - 57} label="ĐI HỌC"><SchoolBagIcon t={t} /></EnoughBadge>
    <EnoughBadge x={1590} y={540} t={t - 81} label="KHÁM BỆNH"><DoctorCrossIcon t={t} /></EnoughBadge>
    <Sparkle x={420} y={400} t={t - 6} s={1.2} />
    <Sparkle x={840} y={390} t={t - 32} s={1.2} />
    <Sparkle x={1260} y={400} t={t - 61} s={1.2} />
    <Sparkle x={1680} y={390} t={t - 85} s={1.2} />
  </g>
);

// ---------- A15: wide, a whole crowd standing on one glowing golden floor line ----------
export const A15: React.FC<ShotProps> = ({ t, len }) => {
  const n = 13;
  const sc = 0.86;
  return (
    <g transform={camT(960, 600, kf(t, [[0, 1.2], [len, 1.0]]))}>
      <Stage id="a15s" t={t} warm />
      <Glow x={960} y={760} r={900} o={0.25} />
      <GoldFloor x0={-300} x1={2220} y={GROUND - 20} t={t} id="a15fl" th={22} />
      {Array.from({ length: n }).map((_, i) => {
        const x = 110 + i * (1700 / (n - 1));
        const pose = poseAt(t, [{ f: 0, p: { x, y: GROUND - 20 - LEG_LEN * sc + Math.sin(t / 7 + i) * 1.5, scale: sc, yaw: (i % 3 - 1) * 0.3, armL: { a: 10, b: -8 }, armR: { a: 14 + Math.sin(t / 6 + i) * 6, b: -6 } } }]);
        return <Hero key={i} look={CAST[i % CAST.length]} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId={i < n / 2 ? 'rimR' : 'rimL'} shadow={0.4} />;
      })}
    </g>
  );
};

// ---------- A16: a figure steps off a ledge, drops, and the golden floor catches him and springs him back up ----------
export const A16: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 0.95;
  const ledge = 600;
  const floor = 880;
  const land = 26;
  const dip = t < land ? 0 : 46 * Math.exp(-(t - land) / 9) * Math.cos((t - land) / 2.6);
  const fy = floor + dip;
  const x = t < 14 ? 760 + t * 10 : 900 + Math.min(1, (t - 14) / 12) * 40;
  const drop = clamp((t - 14) / 12) ** 2;
  const feet = t < 14 ? ledge : t < land ? ledge + (floor - ledge) * drop : fy;
  const walk = walkPose(x, t * 0.6, feet, sc, { yaw: 0.6, expr: 'neutral' });
  const fall = poseAt(Math.max(0, t - 14), [
    { f: 0, p: { x, y: feet - LEG_LEN * sc, scale: sc, yaw: 0.6, armL: { a: 20, b: -8 }, armR: { a: 20, b: -8 }, legL: { a: 14, b: 0 }, legR: { a: -26, b: 0 } } },
    { f: 4, p: { armL: { a: 150, b: 10 }, armR: { a: 160, b: 10 }, tilt: 8, legL: { a: 30, b: 20 }, legR: { a: -30, b: 20 } }, ease: easeOut },
    { f: 12, p: { tilt: 0, squash: 0 } },
    { f: 16, p: { squash: 0.18, armL: { a: 70, b: 10 }, armR: { a: 70, b: 10 } }, ease: easeOut },
    { f: 22, p: { squash: -0.08 } },
    { f: 30, p: { squash: 0, armL: { a: 14, b: -6 }, armR: { a: 150, b: 8 } } },
  ]);
  const pose: Pose = t < 14 ? walk : { ...fall, y: feet - LEG_LEN * sc, x };
  const face = faceAt(t, [[0, 'neutral'], [14, 'shock'], [36, 'happy']]);
  return (
    <g transform={camT(960, 640, 1.15)}>
      <Stage id="a16s" t={t} warm />
      <rect x={-400} y={ledge} width={1330} height={floor - ledge} fill="#4A3A5E" />
      <rect x={-400} y={ledge} width={1330} height={12} fill="#8A7AA6" />
      <rect x={918} y={ledge} width={12} height={floor - ledge} fill="#2E2240" />
      <GoldFloor x0={-300} x1={2220} y={floor + 6} dip={Math.max(0, dip)} dipX={940} t={t} id="a16fl" th={24} />
      {[1130, 1330, 1530].map((px, i) => (
        <Hero key={i} look={[LOOKS.mom, LOOKS.sis, WORKER][i]} pose={poseAt(t, [
          { f: 0, p: { x: px, y: floor - LEG_LEN * 0.9, scale: 0.9, yaw: -0.4, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 } } },
          { f: land, p: { armR: { a: 150, b: 8 } }, ease: easeOut },
        ])} rimId="rimL" shadow={0.4} />
      ))}
      <Hero look={LOOKS.mo} pose={{ ...pose, ...face }} rimId="rimR" shadow={0.5} />
      <Sparkle x={940} y={floor - 40} t={t - land} s={1.8} />
      <Sparkle x={1010} y={floor - 100} t={t - land - 4} s={1.1} />
      <Glow x={940} y={floor} r={320} o={t >= land ? 0.45 * clamp(1 - (t - land) / 30) : 0} />
    </g>
  );
};
