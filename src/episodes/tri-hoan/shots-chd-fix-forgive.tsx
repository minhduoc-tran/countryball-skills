import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, shake, rnd, LOOKS, Bedroom, BedDuvet, bedSit, Sparkle, Glow, Tabletop,
  BookTower, Paper, AlarmClock, FONT, ShotProps,
} from '../../engine';
import { PIP } from './chd-desk-props';
import { WarmBackdrop, Tips, StudyCard, Stamp, BigWord, MonoPill, TwoBars, MapleLeaf, Heart, HeartsRise, CREAM, INK } from './chd-card-props';
import { StormCloud } from './chd-country-props';

// Chapter D, "6 fix: forgive" (199.64-214.29 s): D17 tip 3, D18 Pip hugs himself in the mirror, D19 the CANADA card, D20 a
// student forgives himself, D21 exam 1 (books unopened), D22 the bars drop, D23 self-blame storm + blanket, D24 "ĐÓ LÀ THẬT".

const MO = LOOKS.mo;

/** The hug: both forearms folded across the chest. `k` 0..1. */
const hug = (k: number): Partial<Pose> => ({ armL: { a: 10 + 15 * k, b: -140 * k }, armR: { a: 10 + 15 * k, b: -140 * k }, headTilt: 6 * k });

// ---------- D17: tip 3 lights up; the heart wobbles and a "?" pops ("nghe lạ nhất") ----------
export const D17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <WarmBackdrop id="d17w" t={t} />
    <Tips x={960} y={600} t={t} active={3} s={1.2} lit={-4} />
    <BigWord x={1420} y={330} t={t - 26} text="?" size={190} color="#FF8FB0" />
    <HeartsRise x={1356} y={520} t={t - 34} n={3} s={0.8} />
  </g>
);

// ---------- D18: Pip faces the mirror and gives himself a hug; the reflection hugs back; hearts rise ----------
export const D18: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 8) / 12));
  const base: Pose = { ...basePose, x: 800, y: 604, scale: 1.4, yaw: 0.15, facing: 1, ...hug(k), ...faceAt(t, [[0, 'neutral'], [8, 'happy']]) };
  const refl: Pose = { ...base, x: 1190, y: 618, scale: 1.25, yaw: -0.15, facing: -1, armL: base.armR, armR: base.armL, headTilt: -(base.headTilt ?? 0) };
  const M = { x: 1040, y: 300, w: 300, h: 540 };
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1000]]), 580, kf(t, [[0, 1.25], [len, 1.4]]))}>
      <Bedroom t={t + 70} id="d18r" veil={0.22} crossed={0} />
      <ellipse cx={1190} cy={806} rx={190} ry={16} fill="#000" opacity={0.3} />
      <rect x={M.x - 14} y={M.y - 14} width={M.w + 28} height={M.h + 28} rx={30} fill="#7A5438" stroke={INK} strokeWidth={6} />
      <defs>
        <linearGradient id="d18g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#CFE3EE" /><stop offset="1" stopColor="#8FB0C6" /></linearGradient>
        <clipPath id="d18c"><rect x={M.x} y={M.y} width={M.w} height={M.h} rx={20} /></clipPath>
      </defs>
      <rect x={M.x} y={M.y} width={M.w} height={M.h} rx={20} fill="url(#d18g)" />
      <g clipPath="url(#d18c)" opacity={0.92}>
        <Hero look={PIP} pose={refl} rimId="rimL" shadow={0} />
      </g>
      <path d={`M ${M.x + 30} ${M.y + 20} L ${M.x + 120} ${M.y + 20} L ${M.x + 30} ${M.y + 190} Z`} fill="#FFF" opacity={0.25} />
      <Hero look={PIP} pose={base} rimId="rimR" shadow={0} />
      <HeartsRise x={830} y={290} t={t - 16} n={5} s={0.9} />
      <Sparkle x={1190} y={380} t={t - 20} s={1.0} />
    </g>
  );
};

// ---------- D19: CANADA: a study card with a maple leaf and the source tag ----------
export const D19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <WarmBackdrop id="d19w" t={t} memory />
    <StudyCard x={960} y={450} w={1000} h={560} t={t} rot={-2} tag="WOHL, PYCHYL & BENNETT, 2010" tagT={20}>
      <MapleLeaf x={-330} y={0} s={1.6} rot={Math.sin(t / 14) * 4} />
      <text x={150} y={46} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={128} fill={INK}>CANADA</text>
    </StudyCard>
    <Glow x={960} y={430} r={700} o={0.16} />
  </g>
);

// ---------- D20: a student (Mo's look) hugs himself, a heart pops; "tự tha thứ" ----------
export const D20: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 6) / 12));
  const pose: Pose = { ...basePose, x: 960, y: 600, scale: 2.0, yaw: 0.1, facing: 1, ...hug(k), ...faceAt(t, [[0, 'worried'], [8, 'happy']]), blink: t % 80 > 76 ? 1 : 0 };
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <WarmBackdrop id="d20w" t={t} memory />
      <ellipse cx={960} cy={900} rx={260} ry={22} fill="#000" opacity={0.35} />
      <Hero look={MO} pose={pose} rimId="rimR" shadow={0} />
      <HeartsRise x={960} y={190} t={t - 14} n={5} s={0.9} />
      <MonoPill x={960} y={980} t={t - 18} text="TỰ THA THỨ" size={46} />
    </g>
  );
};

// ---------- D21: exam 1: the textbooks are still shut, the phone glows, the clock says late, THI 1 waits ----------
export const D21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Tabletop edge={1500} wood="#8A5E40" grain="#6E4A32" />
    <BookTower x={420} y={920} n={4} s={2.6} />
    <AlarmClock x={760} y={800} s={1.8} text="23:50" />
    <g transform={`translate(1250 560) rotate(${4 + Math.sin(t / 12)})`}>
      <Paper x={0} y={0} w={420} done={false} grade="" fill={0} />
      <text y={-186} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={74} fill="#C0392B">THI 1</text>
      <text x={110} y={80} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={190} fill="#C0392B" opacity={0.85 * backOut(clamp((t - 8) / 8))}>?</text>
    </g>
    <Glow x={760} y={740} r={400} o={0.4} />
  </g>
);

// ---------- D22: two bars: exam 1 (a lot of procrastinating) vs exam 2: it climbs, then drops after forgiving ----------
export const D22: React.FC<ShotProps> = ({ t, len }) => {
  const h2 = kf(t, [[6, 0], [20, 0.92], [34, 0.92], [50, 0.34]]);
  const arrow = backOut(clamp((t - 44) / 8));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <WarmBackdrop id="d22w" t={t} memory />
      <MonoPill x={960} y={130} t={t} text="TRÌ HOÃN" size={54} />
      <TwoBars x={900} y={850} h1={0.92 * Math.min(1, t / 8)} h2={h2} maxH={560} l1="THI 1" l2="THI 2" c1="#E0644E" c2="#E0644E" />
      <g transform={`translate(1230 ${600}) scale(${arrow})`} opacity={arrow > 0 ? 1 : 0}>
        <path d="M 0 -120 L 0 80 M -54 30 L 0 90 L 54 30" stroke="#5BE08A" strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 20px rgba(91,224,138,0.7))' }} />
      </g>
      <Heart x={1070} y={850 - h2 * 560 - 60} s={0.9} o={t > 46 ? 1 : 0} />
    </g>
  );
};

// ---------- D23: self-blame: a storm cloud over Pip in bed; he pulls the blanket over his head and hides ----------
const BS = bedSit(0.2);
export const D23: React.FC<ShotProps> = ({ t, len }) => {
  const hide = easeOut(clamp((t - 26) / 12));
  const sh = shake(t, 20, 8, 7);
  const pose: Pose = { ...basePose, x: BS.x, y: BS.y, scale: BS.scale, yaw: 0.45, look: 0.3, legL: { a: 80, b: 4 }, legR: { a: 80, b: 4 }, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 }, headTilt: 3, ...faceAt(t, [[0, 'worried'], [14, 'tired']]) };
  const hx = BS.x;
  const top = BS.y - 250 * BS.scale * hide;
  return (
    <g transform={`translate(${sh.x} ${sh.y})`}>
      <g transform={camT(kf(t, [[0, 770], [len, 790]]), 450, kf(t, [[0, 1.6], [len, 1.8]]))}>
        <Bedroom t={t + 20} id="d23r" lamp={0.8} duvet={false} crossed={0} clock="23:58" />
        <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
        <BedDuvet knees={1} />
        {hide > 0 ? (
          <g transform={`translate(${Math.sin(t * 1.7) * 2 * hide} 0)`}>
            <path d={`M ${hx - 150 * BS.scale} ${BS.y + 40} C ${hx - 170 * BS.scale} ${top + 50} ${hx - 110 * BS.scale} ${top - 6} ${hx} ${top} C ${hx + 110 * BS.scale} ${top - 6} ${hx + 150 * BS.scale} ${top + 50} ${hx + 150 * BS.scale} ${BS.y + 40} Z`} fill="#3E5C86" stroke="#121019" strokeWidth={5} />
            <path d={`M ${hx - 40 * BS.scale} ${top + 30} Q ${hx} ${top + 90} ${hx + 60 * BS.scale} ${top + 40}`} stroke="#2E4668" strokeWidth={6} fill="none" strokeLinecap="round" />
          </g>
        ) : null}
        <StormCloud x={BS.x + 20} y={BS.y - 400 * BS.scale} t={t - 4} s={0.85} bolt={16} text="MÌNH TỆ QUÁ" />
      </g>
    </g>
  );
};

// ---------- D24: the stamp ĐÓ LÀ THẬT lands on the Canada card (leaf and the falling bars) ----------
export const D24: React.FC<ShotProps> = ({ t, len }) => {
  const sh = shake(t, 5, 8, 12);
  return (
    <g transform={`translate(${sh.x} ${sh.y})`}>
      <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
        <WarmBackdrop id="d24w" t={t} memory />
        <StudyCard x={960} y={470} w={1000} h={600} t={t + 20} rot={-1.5} flip={false}>
          <MapleLeaf x={-300} y={-130} s={0.9} />
          <text x={20} y={-100} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={84} fill={INK}>CANADA</text>
          <g transform="translate(360 -10)">
            <rect x={-110} y={-120} width={80} height={120} rx={8} fill="#E0644E" stroke={INK} strokeWidth={5} />
            <rect x={10} y={-50} width={80} height={50} rx={8} fill="#E0644E" stroke={INK} strokeWidth={5} />
          </g>
        </StudyCard>
        <Stamp x={960} y={560} t={t - 3} />
      </g>
    </g>
  );
};
