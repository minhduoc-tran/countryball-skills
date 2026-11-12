import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, easeInOut, backOut, camT, LOOKS, Schematic, SchLabel, SCH, FONT, UI, Sparkle, FocusRings, ShotProps,
} from '../../engine';
import { PersonIcon } from '../last-one/insert-arm-and-icons';
import { ClockIcon, CalendarIcon, BillWall, BillBrick, BigNum, dots } from './chb-math-icons';
import { Backdrop, Beard, TimePill, ParkRace, Bench } from './chb-park-and-face-props';

// Chapter B, the math (2/2): the average salary (schematic), "and you?", the clock to 2 giờ 20 phút, the stunned face,
// then one thousand billion and the park-bench wait with the growing beard. The ping look is OFF here.

const PIP = LOOKS.pipHood;

// ---------- B7: "NĂM 2025": a calendar slides in and the pages flip to the year; the source line below ----------
export const B7: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 10));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Schematic t={t} id="b7" />
      <g transform={`translate(${(1 - k) * -500} 0)`}>
        <CalendarIcon x={820} y={500} s={2.3} t={Math.min(t, 24)} rate={4} label="2025" />
      </g>
      <SchLabel x={1480} y={470} t={t - 10} text="NĂM" size={110} color={SCH.line} />
      <SchLabel x={960} y={950} t={t - 16} text="CỤC THỐNG KÊ" size={40} color={SCH.dim} />
    </g>
  );
};

// ---------- B8: the working people: a crowd of person icons lights up in a wave ----------
export const B8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <Schematic t={t} id="b8" />
    {Array.from({ length: 18 }).map((_, i) => {
      const c = i % 6;
      const r = Math.floor(i / 6);
      const on = (t - (c * 4 + r * 3 + 6)) % 40 > 0 && t > c * 4 + r * 3 + 6;
      return <PersonIcon key={i} x={400 + c * 224} y={330 + r * 190} s={2.0} on={on} o={clamp((t - i * 1.2) / 5)} glow={on} />;
    })}
    <SchLabel x={960} y={930} t={t - 20} text="NGƯỜI LAO ĐỘNG VIỆT NAM" size={46} color={SCH.line} />
  </g>
);

// ---------- B9: one worker, "8,4 TRIỆU / THÁNG", a brick of notes beside, the source small ----------
export const B9: React.FC<ShotProps> = ({ t, len }) => {
  const v = 8.4 * easeOut(clamp((t - 8) / 36));
  return (
    <g transform={camT(kf(t, [[0, 930], [len, 980]]), 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Schematic t={t} id="b9" />
      <PersonIcon x={470} y={520} s={5.2} on glow o={clamp(t / 6)} />
      <g transform={`translate(700 700) scale(1.6) rotate(-6)`} opacity={clamp((t - 14) / 6)}><BillBrick /></g>
      <BigNum x={1300} y={470} text={v.toFixed(1).replace('.', ',') + ' TRIỆU'} size={150} pop={t / 8} />
      <SchLabel x={1300} y={590} t={t - 30} text="/ THÁNG" size={84} color={SCH.line} />
      <g transform={`translate(1560 200) scale(${backOut(clamp((t - 4) / 6))})`}>
        <rect x={-180} y={-42} width={360} height={84} rx={42} fill={UI.pill} opacity={0.75} />
        <text y={16} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} fill={UI.text} letterSpacing={3}>NĂM 2025</text>
      </g>
      <SchLabel x={960} y={950} t={t - 26} text="NGUỒN: CỤC THỐNG KÊ" size={34} color={SCH.dim} />
    </g>
  );
};

// ---------- B10: "Còn bạn?": Pip, close, one open hand out to the viewer, a question mark pops ----------
export const B10: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: 760, scale: 1, yaw: 0.25, look: 0.5, headTilt: 3, armL: { a: 12, b: -6 }, armR: { a: 20, b: 20 }, handR: 'open' } },
    { f: 8, p: { armR: { a: 88, b: 30 }, headTilt: -5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 930], [len, 950]]), 640, kf(t, [[0, 2.4], [len, 2.8]]))}>
      <Backdrop id="b10" t={t} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [7, 'happy']]) }} rimId="rimR" shadow={0} />
      <g transform={`translate(1180 560) scale(${backOut(clamp((t - 6) / 7))}) rotate(${Math.sin(t / 4) * 5})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#FFE27A" stroke="#1A1230" strokeWidth={9} paintOrder="stroke">?</text>
      </g>
    </g>
  );
};

// ---------- B11: the clock runs to 2 GIỜ 20 PHÚT while a bar fills with 8,4 triệu ----------
export const B11: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeInOut(clamp(t / 52));
  const m = Math.round(140 * p);
  const label = `${Math.floor(m / 60)} GIỜ ${String(m % 60).padStart(2, '0')} PHÚT`;
  const done = t >= 54;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Schematic t={t} id="b11" />
      <ClockIcon x={500} y={400} r={200} t={t} turns={140 / 60} dur={52} glow />
      <BigNum x={1280} y={420} text={label} size={92} pop={done ? (t - 54) / 6 : 1} />
      <g transform="translate(300 760)">
        <rect x={0} y={-36} width={1320} height={72} rx={36} fill="#0B1220" stroke={SCH.line} strokeWidth={5} />
        <rect x={6} y={-30} width={Math.max(0, 1308 * p)} height={60} rx={30} fill={SCH.live} style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }} />
      </g>
      <SchLabel x={960} y={880} t={t - 6} text={`${dots(8400000 * p)} đ`} size={56} color={SCH.line} />
      <Sparkle x={1640} y={330} t={t - 54} s={1.1} />
    </g>
  );
};

// ---------- B12: "Đó là sự thật.": Pip, close, stunned, the rings, a slow push-in ----------
export const B12: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 760, scale: 1, yaw: 0.15, look: 0.2, headTilt: 0, squash: 0.03, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 4, p: { headTilt: -4, squash: -0.04 }, ease: easeOut },
    { f: 10, p: { headTilt: 0, squash: 0 } },
  ]);
  return (
    <g transform={camT(960, 622, kf(t, [[0, 3.2], [len, 3.7]]))}>
      <Backdrop id="b12" t={t} top="#1E1A3E" bottom="#5A3A55" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
      <g transform="translate(960 580) scale(0.45)"><FocusRings x={0} y={0} t={t - 2} r0={80} /></g>
    </g>
  );
};

// ---------- B13: "1.000 TỶ": the number slams in between two walls of notes ----------
export const B13: React.FC<ShotProps> = ({ t, len }) => {
  const k = backOut(clamp((t - 10) / 8));
  const jolt = t > 10 && t < 20 ? Math.sin(t * 2.7) * 8 * (1 - (t - 10) / 10) : 0;
  return (
    <g transform={camT(960 + jolt, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Schematic t={t} id="b13" />
      <BillWall x={250} y={1020} t={t - 2} cols={2} rows={10} s={1.05} step={0.5} />
      <BillWall x={1670} y={1020} t={t - 2} cols={2} rows={10} s={1.05} step={0.5} />
      <g transform={`translate(960 440) scale(${k})`}>
        <rect x={-420} y={-150} width={840} height={220} rx={44} fill="#0B1220" opacity={0.75} />
        <BigNum x={0} y={40} text="1.000 TỶ" size={190} />
      </g>
      <SchLabel x={960} y={640} t={t - 18} text="1.000.000.000.000 đ" size={54} color={SCH.line} />
      <Sparkle x={560} y={300} t={t - 20} s={1.1} />
      <Sparkle x={1380} y={280} t={t - 25} s={1.0} />
    </g>
  );
};

// ---------- B14 / B15: the wait: Pip sits on a park bench while day and night race and the calendar flips; the beard grows ----------
const SEAT = { x: 820, y: 900, s: 1.25 }; // bench middle and ground
const waitPose = (t: number, x: number, y: number, sc: number) =>
  poseAt(t, [
    { f: 0, p: { x, y, scale: sc, facing: 1, yaw: 0.55, look: 0.3, headTilt: 2, legL: { a: 84, b: -84 }, legR: { a: 80, b: -80 }, armL: { a: 14, b: 40 }, armR: { a: 20, b: 34 } } },
    { f: 40, p: { headTilt: 6, look: -0.2 } },
    { f: 90, p: { headTilt: 10, look: 0.3 } },
  ]);

export const B14: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.1;
  const hipY = SEAT.y - 128 * SEAT.s - 4;
  const pose = waitPose(t, 660, hipY, sc);
  const tap = Math.sin(t / 2.2) * 5;
  const years = Math.floor(31 * clamp(t / 50));
  return (
    <g>
    <g transform={camT(kf(t, [[0, 900], [len, 880]]), 640, kf(t, [[0, 1.35], [len, 1.55]]))}>
      <ParkRace id="b14" t={t} period={22} />
      <Bench x={SEAT.x} y={SEAT.y} s={SEAT.s} />
      <Hero look={PIP} pose={{ ...pose, legR: { a: 80 + tap, b: -80 - tap }, ...faceAt(t, [[0, 'neutral'], [30, 'tired']]) }} rimId="rimR" shadow={0} />
      <Beard pose={pose} len={0.03 + 0.25 * clamp(t / len)} t={t} />
      <CalendarIcon x={1330} y={500} s={1.3} t={t} rate={2} label={String(2025 + Math.floor(t / 2))} />
    </g>
    <TimePill x={960} y={110} text={`${years} NĂM`} w={520} />
    </g>
  );
};

export const B15: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.1;
  const hipY = SEAT.y - 128 * SEAT.s - 4;
  const pose = waitPose(t + 60, 660, hipY, sc);
  const months = Math.min(8, Math.floor(t / 2.6));
  return (
    <g>
    <g transform={camT(kf(t, [[0, 760], [len, 740]]), kf(t, [[0, 500], [len, 540]]), kf(t, [[0, 1.8], [len, 2.1]]))}>
      <ParkRace id="b15" t={t + 20} period={46} />
      <Bench x={SEAT.x} y={SEAT.y} s={SEAT.s} dusty={0.8} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]), blink: t % 52 > 48 ? 1 : 0 }} rimId="rimR" shadow={0} />
      <Beard pose={pose} len={0.4 + 0.5 * easeOut(clamp(t / 40))} t={t} />
    </g>
    <TimePill x={960} y={90} text={`31 NĂM ${months} THÁNG`} w={900} size={60} pop={t / 6} />
    </g>
  );
};
