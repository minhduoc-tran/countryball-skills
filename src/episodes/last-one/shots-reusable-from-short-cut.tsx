import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeIn, rnd, camT, LOOKS, LEG_LEN, HEAD,
  Rooftop, Schematic, SCH, SchLabel, TitleCard, FONT, ShotProps,
} from '../../engine';
import { PersonIcon, CigaretteIcon } from './insert-arm-and-icons';

// "Sẽ ra sao nếu thế giới chỉ còn mình bạn?" TitleOverEmptyCity-CityBlackoutWide: the title over the empty city, the premise as a schematic
// (8.2 billion people blinking out to one), the turn (prolonged loneliness = up to 15 cigarettes a day, the US Surgeon
// General's 2023 advisory) and the cliffhanger: with nobody running the power stations, the city goes dark round him.

const PIP = LOOKS.pipHood;
const ROOF_FEET = 840;

// ---------- TitleOverEmptyCity: the title, wide on the roof at dusk: Pip tiny and alone over a silent city ----------
export const TitleOverEmptyCity: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: ROOF_FEET - LEG_LEN * 0.62, scale: 0.62, yaw: 0, look: 0, armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 } } },
    { f: 20, p: {} },
    { f: 30, p: { yaw: -0.5, look: -0.8 }, ease: easeOut },
    { f: 48, p: {} },
    { f: 58, p: { yaw: 0.5, look: 0.8 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 545]]), kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Rooftop t={t} sunX={960} sunY={690 - 40 * easeOut(clamp(t / 40))} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
      <TitleCard t={t} lines={['SẼ RA SAO NẾU', 'THẾ GIỚI CHỈ CÒN MÌNH BẠN?']} accent="BẠN" accentT={44} size={84} y={170} />
    </g>
  );
};

// ---------- PopulationCountdown: schematic: a crowd of people icons blinking out; 8.200.000.000 counts down to 1 ----------
const COLS = 16;
const ROWS = 5;
const LAST = 2 * COLS + 8; // the survivor: you, in the middle of the crowd
const CROWD = Array.from({ length: COLS * ROWS }).map((_, i) => ({
  x: 285 + (i % COLS) * 90,
  y: 330 + Math.floor(i / COLS) * 100,
  out: 10 + rnd(i, 7) * 46, // when this one disappears
}));
const dotted = (v: number) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const PopulationCountdown: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp((t - 8) / 50);
  const left = p >= 1 ? 1 : Math.max(1, 8.2e9 * (1 - easeIn(p)));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
      <Schematic t={t} id="sch10" />
      <SchLabel x={960} y={190} t={t - 2} text="DÂN SỐ THẾ GIỚI" size={50} />
      {CROWD.map((c, i) => {
        if (i === LAST) return null;
        const k = t - c.out;
        if (k > 4) return null;
        return <PersonIcon key={i} x={c.x} y={c.y} s={k > 0 ? 1 + k * 0.1 : 1} o={k > 0 ? 1 - k / 4 : 1} />;
      })}
      <PersonIcon x={CROWD[LAST].x} y={CROWD[LAST].y} s={1 + 0.25 * easeOut(clamp((t - 56) / 8))} on={t > 56} glow={t > 56} />
      <text x={960} y={920} textAnchor="middle" fontFamily={FONT.ui} fontSize={100} fill={left <= 1 ? SCH.live : SCH.line} style={{ filter: `drop-shadow(0 0 14px ${SCH.glow}66)` }}>
        {dotted(left)}
      </text>
      <SchLabel x={960} y={1000} t={t - 4} text="NGƯỜI" size={36} color={SCH.dim} />
    </g>
  );
};

// ---------- RooftopLookRound: medium, low angle on the roof: he looks round the silent city; the smile goes ----------
export const RooftopLookRound: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: 790, scale: 1.8, yaw: 0.3, look: 0.8, armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 }, headTilt: 2 } },
    { f: 6, p: {} },
    { f: 14, p: { yaw: -0.3, look: -0.9, headTilt: -4 }, ease: easeOut },
    { f: 26, p: {} },
    { f: 34, p: { yaw: 0.1, look: 0.2, headTilt: 0 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Rooftop t={t + 66} sunX={1250} sunY={570} low={260} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [24, 'worried']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- LonelinessCigarettes: schematic: one lonely figure = 15 cigarettes, popping on one by one, MỖI NGÀY ----------
const CIGS = Array.from({ length: 15 }).map((_, i) => ({ x: 1060 + (i % 5) * 170, y: 330 + Math.floor(i / 5) * 140, at: 16 + i * 3 }));
export const LonelinessCigarettes: React.FC<ShotProps> = ({ t, len }) => {
  const lit = CIGS.filter((c) => t >= c.at).length;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.04]])}) translate(-960 -540)`}>
      <Schematic t={t + 70} id="sch12" />
      <PersonIcon x={420} y={480} s={4.2} on glow />
      <SchLabel x={420} y={720} t={t - 4} text="CÔ ĐƠN KÉO DÀI" size={44} />
      <SchLabel x={790} y={520} t={t - 10} text="=" size={150} color={SCH.live} />
      {CIGS.map((c, i) => {
        const k = t - c.at;
        if (k < 0) return null;
        const s = k < 6 ? 0.6 + 0.5 * easeOut(k / 6) - 0.1 * clamp((k - 3) / 3) : 1;
        return <CigaretteIcon key={i} x={c.x} y={c.y} s={s} t={t + i * 7} />;
      })}
      <text x={1400} y={790} textAnchor="middle" fontFamily={FONT.ui} fontSize={96} fill={SCH.live} style={{ filter: `drop-shadow(0 0 14px ${SCH.glow}66)` }}>
        {`${lit} ĐIẾU`}
      </text>
      <SchLabel x={1400} y={870} t={t - 64} text="MỖI NGÀY" size={56} />
      <SchLabel x={960} y={1030} t={t - 20} text="NGUỒN: HOLT-LUNSTAD 2010 · TỔNG Y SĨ HOA KỲ 2023" size={22} color={SCH.dim} />
    </g>
  );
};

// ---------- WorriedCloseUpRedLight: extreme close-up: "Đó là sự thật." Pip, worried, the light starting to turn red ----------
export const WorriedCloseUpRedLight: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 6.6 * (1 + 0.04 * clamp(t / len));
  const head = { x: 960, y: 720 };
  const red = 0.35 * clamp(t / len);
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.12, look: 0.1, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'worried']]) };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-600 -560) scale(2)">
          <Rooftop t={t + 200} sunX={980} sunY={600} red={red} low={180} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.22} />
      <Hero look={PIP} pose={pose} rimId={t > len * 0.6 ? 'rimRed' : 'rimR'} shadow={0} />
    </g>
  );
};

// ---------- CityBlackoutWide: wide, low angle: nobody runs the power stations; the city goes dark in a sweep toward him ----------
export const CityBlackoutWide: React.FC<ShotProps> = ({ t, len }) => {
  const red = easeOut(clamp(t / 14));
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 905 - LEG_LEN * 1.1, scale: 1.1, yaw: -0.15, look: -0.6, armL: { a: 14, b: 8 }, armR: { a: 14, b: 8 } } },
    { f: 30, p: { look: 0.4, headTilt: 4 } },
    { f: 56, p: { look: -0.2, headTilt: 0, armL: { a: 30, b: 50 }, armR: { a: 30, b: 50 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 520], [len, 500]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
      <Rooftop t={t + 230} sunX={1180} sunY={600} red={red} blackout={clamp((t - 8) / 40)} lightsOut={clamp((t - 48) / 20)} low={40} cityLit={2.6} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [30, 'shock']]) }} rimId="rimRed" shadow={0} />
    </g>
  );
};
