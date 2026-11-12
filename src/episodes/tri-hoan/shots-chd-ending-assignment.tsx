import React from 'react';
import {
  Hero, Pose, basePose, faceAt, kf, clamp, easeOut, backOut, camT, joints, toWorld, LOOKS, Classroom, SchoolDesk, WallCalendar, calendarDay,
  Paper, LaptopBack, Sparkle, Glow, Dust, rnd, FONT, ShotProps, Tag,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { PIP, Sticky, DeskWorld, typingPip, LaptopFront, SlideApp, TimerPill, Planet } from './chd-desk-props';
import { WarmBackdrop, MonoPill, INK } from './chd-card-props';
import { HillSky, Bus } from './chd-country-props';

// Chapter D, "7 ending", part 1 (214.29-222.90 s): D25 the teacher hands out a new task, D26 CÒN 7 NGÀY (calendar row), D27 Pip
// opens the laptop, D28 two minutes + one sentence, D29 a page, D30 he peels "MAI LÀM" off and crumples it, D31 the bus.

const TEACHER = { ...LOOKS.mom, jacket: '#4E7F8C', jacketShade: '#3F6672', accent: '#E9C46A', hair: '#2A1C18' };
const SENTENCE = 'Hệ Mặt Trời có 8 hành tinh.';

// ---------- D25: classroom: the teacher hands Pip a new task sheet; it lands on his desk ----------
export const D25: React.FC<ShotProps> = ({ t, len }) => {
  const reach = easeOut(clamp((t - 8) / 10));
  const tp: Pose = { ...basePose, x: 520, y: 560, scale: 1.35, yaw: -0.5, facing: -1, look: -0.4, armL: { a: 12 + 68 * reach, b: 8 }, armR: { a: 10, b: -6 }, ...faceAt(t, [[0, 'happy']]) };
  const hand = toWorld(tp, joints(tp).armL.end);
  const fly = easeOut(clamp((t - 22) / 12));
  const px = hand.x + (1180 - hand.x) * fly;
  const py = hand.y + (680 - hand.y) * fly;
  const pip: Pose = { ...basePose, x: 1260, y: 600, scale: 1.3, yaw: -0.35, facing: -1, look: -0.5, ...faceAt(t, [[0, 'neutral'], [38, 'happy']]) };
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), 470, kf(t, [[0, 1.6], [len, 1.72]]))}>
      <Classroom t={t + 30} id="d25c" board={<text x={880} y={300} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={46} fill="#EDE8DA">HỆ MẶT TRỜI</text>} />
      <Hero look={TEACHER} pose={tp} rimId="rimR" shadow={0} />
      <Hero look={PIP} pose={pip} rimId="rimR" shadow={0} />
      <SchoolDesk x={1260} />
      <g transform={`translate(${px} ${py}) rotate(${-20 + 20 * fly}) scale(${0.35 + 0.1 * fly})`} opacity={t > 6 ? 1 : 0}>
        <Paper x={0} y={0} w={300} done={false} grade="" fill={0} />
        <text y={-140} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={56} fill="#C0392B">BÀI MỚI</text>
      </g>
      <Sparkle x={1260} y={440} t={t - 38} s={1.0} />
    </g>
  );
};

// ---------- D26: a calendar row lights up day by day: seven days (the CÒN 7 NGÀY chip comes from the look) ----------
export const D26: React.FC<ShotProps> = ({ t, len }) => {
  const days = [5, 6, 7, 8, 9, 10, 11];
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <WarmBackdrop id="d26w" t={t} />
      <WallCalendar x={960} y={140} w={620} crossed={0} />
      {days.map((d, i) => {
        const c = calendarDay(960, 140, 620, d);
        const k = backOut(clamp((t - 3 - i * 2.2) / 6));
        return k > 0 ? <circle key={d} cx={c.x} cy={c.y} r={c.r * 1.25 * k} fill="#FFE27A" opacity={0.85} stroke={INK} strokeWidth={4} /> : null;
      })}
      <Sticky x={1460} y={820} s={1.1} rot={6} o={0.95} />
    </g>
  );
};

// ---------- D27: wide at the desk: Pip opens the laptop lid and starts ----------
export const D27: React.FC<ShotProps> = ({ t, len }) => {
  const open = easeOut(clamp((t - 4) / 12));
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1130]]), 570, kf(t, [[0, 1.25], [len, 1.4]]))}>
      <DeskWorld t={t + 10} id="d27r" pose={typingPip(t, { armR: { a: 40, b: 10 }, armL: { a: -40, b: 10 } })} face={faceAt(t, [[0, 'neutral'], [14, 'happy']])} open={open} />
      <Sparkle x={1270} y={560} t={t - 14} s={0.9} />
    </g>
  );
};

// ---------- D28: the screen: a 2:00 timer and ONE sentence typing itself ----------
export const D28: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.min(SENTENCE.length, Math.max(0, Math.floor((t - 8) * 0.8)));
  const sec = 120 - t * 0.5;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <WarmBackdrop id="d28w" t={t} memory />
      <LaptopFront x={960} y={940} w={1250} id="d28l">{(w, h) => <SlideApp w={w} h={h} t={t} text={SENTENCE.slice(0, n)} thumbs={1} />}</LaptopFront>
      <TimerPill x={960} y={110} text={`${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`} s={0.55} w={380} />
      <Tag x={1560} y={330} t={t - 34} text="1 CÂU" mark="check" markT={6} w={300} />
    </g>
  );
};

// ---------- D29: a whole page fills with writing; a planet joins it ----------
export const D29: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <WarmBackdrop id="d29w" t={t} />
    <Paper x={960} y={540} w={560} done grade="" fill={clamp(t / 24)} rot={-2} />
    <Planet x={1170} y={340} r={70 * backOut(clamp((t - 20) / 8))} c="#E9A04A" ring />
    <MonoPill x={1500} y={900} t={t - 12} text="1 TRANG ✓" size={50} />
    <Glow x={960} y={500} r={700} o={0.18} />
  </g>
);

// ---------- D30: insert: Pip peels the MAI LÀM note off the laptop, crumples it and tosses it away ----------
export const D30: React.FC<ShotProps> = ({ t, len }) => {
  const peel = easeOut(clamp((t - 4) / 6));
  const crush = easeOut(clamp((t - 12) / 7));
  const toss = easeOut(clamp((t - 19) / 9));
  const handX = kf(t, [[0, 1500], [5, 1030], [11, 1000], [18, 940], [len, 1400]]);
  const handY = kf(t, [[0, 700], [5, 470], [11, 330], [18, 330], [len, 120]]);
  const noteVisible = t < 19;
  return (
    <g transform={camT(960, 540, 1.0)}>
      <WarmBackdrop id="d30w" t={t} memory />
      <LaptopBack x={960} y={900} w={820} glow={0.8} />
      {t < 4 ? <Sticky x={1000} y={560} s={1.7} rot={-4} /> : null}
      {t >= 4 && noteVisible ? <Sticky x={handX - 40} y={handY + 70} s={1.7 * (1 - 0.55 * crush)} rot={-4 + 40 * crush} peel={peel * (1 - crush)} /> : null}
      {t >= 19 ? (
        <g transform={`translate(${940 + 520 * toss} ${330 - 160 * Math.sin(toss * Math.PI) - 120 * toss + 520 * toss * toss}) rotate(${toss * 400})`}>
          <circle r={44} fill={'#FFE27A'} stroke="#A8861E" strokeWidth={4} />
          <path d="M -30 -10 L 0 -4 L 26 -26 M 0 -4 L -8 30 M -34 14 L -10 12" stroke="#C9A02E" strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      ) : null}
      <InsertArm x={handX} y={handY} fx={2100} fy={1000} rot={-14} s={4.6} width={104} fist={crush > 0.5} />
      <Dust t={t} seed={6} x0={600} y0={200} w={800} h={600} n={10} o={0.3} />
    </g>
  );
};

// ---------- D31: the bus rolls along a country road; Pip waves from a window ----------
export const D31: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 780], [len, 1060]]), 700, 1.45)}>
    <HillSky id="d31s" t={t} dusk={0.1} sx={1500} sy={300} />
    <rect x={-400} y={800} width={2720} height={400} fill="#6E6A60" />
    <rect x={-400} y={800} width={2720} height={10} fill="#8E8A7E" />
    {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={((i * 340 - t * 22) % 2720 + 2720) % 2720 - 400} y={930} width={150} height={12} rx={5} fill="#F6EFE3" opacity={0.8} />)}
    {[0, 1, 2, 3].map((i) => {
      const x = ((i * 700 - t * 16 + 100) % 2800 + 2800) % 2800 - 500;
      return (
        <g key={i} transform={`translate(${x} 800)`}>
          <rect x={-8} y={-130} width={16} height={130} fill="#6B4B3E" />
          <circle cy={-170} r={64} fill={i % 2 ? '#4E8A52' : '#5FA05A'} />
        </g>
      );
    })}
    <Bus x={kf(t, [[0, 700], [len, 1120]])} y={880} s={1.15} t={t} />
    <g transform={`translate(${kf(t, [[0, 700], [len, 1120]]) - 170 * 1.15 + 0} ${880 - 142 * 1.15})`}>
      <circle r={30} fill="#F6EFE3" stroke={INK} strokeWidth={5} />
      <path d="M -30 -4 Q -34 -34 0 -36 Q 34 -34 30 -4 Q 20 -20 0 -20 Q -20 -20 -30 -4 Z" fill="#2E2B3D" stroke={INK} strokeWidth={4} />
      <circle cx={10} cy={-2} r={3.5} fill={INK} />
      <path d="M 4 12 Q 14 20 22 8" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  </g>
);
