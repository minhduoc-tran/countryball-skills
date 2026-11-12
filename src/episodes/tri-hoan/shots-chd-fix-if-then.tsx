import React from 'react';
import {
  Hero, Pose, faceAt, kf, clamp, easeOut, backOut, camT, walkPose, Sparkle, Glow, Dust, Tabletop, shake, rnd, FONT, ShotProps,
} from '../../engine';
import { PIP, DeskWorld, typingPip, seatedPip, TimerPill, DESK, SEAT_HIP } from './chd-desk-props';
import { WarmBackdrop, Tips, StudyCard, Stamp, BigWord, MonoPill, TwoBars, CREAM, INK } from './chd-card-props';

// Chapter D, "6 fix: if then" (186.40-199.64 s): D9 tip 2 and the NẾU/THÌ card snapping together, D10 the dinner bowl is
// empty, D11 Pip sits at his desk, D12 the 15-minute timer, D13 ~100 studies (a pile of papers), D14 the source tag,
// D15 plan vs no plan, D16 "ĐÓ LÀ THẬT".

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// ---------- D9: tip 2 lights up; the NẾU half and the THÌ half slide in and snap together ----------
export const D9: React.FC<ShotProps> = ({ t, len }) => {
  const a = easeOut(clamp((t - 40) / 12));
  const snap = t >= 52 ? 1 : 0;
  const bump = snap ? 1 + 0.06 * Math.exp(-(t - 52) / 4) * Math.cos((t - 52) * 1.2) : 1;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <WarmBackdrop id="d9w" t={t} />
      <Tips x={960} y={210} t={t} active={2} s={0.78} lit={-4} />
      <g transform={`translate(960 640) scale(${bump})`}>
        <g transform={`translate(${-330 - (1 - a) * 700} 0)`} opacity={a > 0 ? 1 : 0}>
          <rect x={-250} y={-150} width={500} height={300} rx={36} fill={CREAM} stroke={INK} strokeWidth={8} />
          <text y={-6} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={132} fill={INK}>NẾU</text>
          <text y={96} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={96} fill="#B0907A">…</text>
        </g>
        <g transform={`translate(${330 + (1 - a) * 700} 0)`} opacity={a > 0 ? 1 : 0}>
          <rect x={-250} y={-150} width={500} height={300} rx={36} fill="#FFB347" stroke={INK} strokeWidth={8} />
          <text y={-6} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={132} fill={INK}>THÌ</text>
          <text y={96} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={96} fill="#8A5A2A">…</text>
        </g>
        {snap ? <path d="M -52 0 L 52 0 M 22 -28 L 52 0 L 22 28" stroke={INK} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
      </g>
      <Sparkle x={960} y={640} t={t - 52} s={1.6} />
    </g>
  );
};

// ---------- D10: top-down: dinner done, the bowl is empty, chopsticks laid down; "NẾU ăn tối xong" + tick ----------
export const D10: React.FC<ShotProps> = ({ t, len }) => {
  const eat = clamp((t - 4) / 16);
  const R = 150 * (1 - eat);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Tabletop edge={1300} wood="#9A6A44" grain="#84583A" />
      <ellipse cx={980} cy={640} rx={330} ry={310} fill="#000" opacity={0.25} />
      <circle cx={960} cy={620} r={300} fill="#F3EEE4" stroke="#CFC6B6" strokeWidth={8} />
      <circle cx={960} cy={620} r={236} fill="#E7DFD0" />
      <circle cx={960} cy={620} r={168} fill="#FBF8F1" stroke="#CFC6B6" strokeWidth={6} />
      {R > 4 ? <ellipse cx={960} cy={620} rx={R} ry={R * 0.92} fill="#FFFFFF" stroke="#E4DDCE" strokeWidth={4} /> : null}
      {R > 30 ? Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={960 + (rnd(4, i) - 0.5) * R * 1.3} cy={620 + (rnd(5, i) - 0.5) * R * 1.2} r={7} fill="#EFE7D6" />) : null}
      <g transform="rotate(-16 960 760)">
        <rect x={700} y={752} width={520} height={14} rx={7} fill="#6A3E22" />
        <rect x={700} y={786} width={520} height={14} rx={7} fill="#7A4A2A" />
      </g>
      <MonoPill x={960} y={170} t={t - 2} text="NẾU ăn tối xong" size={54} />
      <g transform={`translate(1480 620) scale(${backOut(clamp((t - 28) / 8))})`} opacity={t > 28 ? 1 : 0}>
        <circle r={92} fill="#2FBF71" stroke={INK} strokeWidth={7} />
        <path d="M -42 4 L -12 36 L 46 -34" stroke="#E9FFF2" strokeWidth={17} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Sparkle x={960} y={600} t={t - 28} s={1.4} />
      <Dust t={t} seed={9} x0={500} y0={300} w={900} h={500} n={12} o={0.3} />
    </g>
  );
};

// ---------- D11: Pip walks in and sits down at his desk ("thì mình ngồi vào bàn") ----------
export const D11: React.FC<ShotProps> = ({ t, len }) => {
  const walk = easeOut(clamp(t / 22));
  const sit = easeOut(clamp((t - 22) / 10));
  const stand = walkPose(600 + 330 * walk, t * 0.6 * (1 - sit), 800, 1.4, { yaw: 0.8, tilt: 4 * (1 - sit) });
  const seat = typingPip(t * 0.2, { armR: { a: 10, b: 10 }, armL: { a: -10, b: 10 } });
  const lerpN = (a: number, b: number) => a + (b - a) * sit;
  const pose: Pose = {
    ...stand,
    x: lerpN(stand.x, seat.x), y: lerpN(stand.y, SEAT_HIP), tilt: lerpN(stand.tilt, 0), yaw: 0.8,
    legL: { a: lerpN(stand.legL.a, 84), b: lerpN(stand.legL.b, -82) }, legR: { a: lerpN(stand.legR.a, 78), b: lerpN(stand.legR.b, -78) },
    armL: { a: lerpN(stand.armL.a, seat.armL.a), b: lerpN(stand.armL.b, seat.armL.b) }, armR: { a: lerpN(stand.armR.a, seat.armR.a), b: lerpN(stand.armR.b, seat.armR.b) },
    squash: sit > 0.9 ? 0.05 * Math.exp(-(t - 31) / 3) : 0,
  };
  return (
    <g>
      <g transform={camT(kf(t, [[0, 960], [len, 1060]]), 570, kf(t, [[0, 1.15], [len, 1.3]]))}>
        <DeskWorld t={t + 60} id="d11r" pose={pose} face={faceAt(t, [[0, 'neutral'], [22, 'happy']])} open={1} />
      </g>
      <MonoPill x={960} y={140} t={t - 6} text="THÌ ngồi vào bàn" size={50} />
    </g>
  );
};

// ---------- D12: the 15-minute kitchen timer ticks on the desk while Pip types ----------
export const D12: React.FC<ShotProps> = ({ t, len }) => {
  const sec = 900 - t * 0.12;
  return (
    <g transform={camT(kf(t, [[0, 1240], [len, 1330]]), 540, kf(t, [[0, 1.5], [len, 1.75]]))}>
      <DeskWorld t={t + 90} id="d12r" pose={typingPip(t, { headTilt: 5 })} face={faceAt(t, [[0, 'neutral']])} open={1} />
      <g transform={`translate(1560 ${DESK.top - 62}) rotate(${Math.sin(t * 1.5) * 3})`}>
        <ellipse cy={64} rx={70} ry={10} fill="#000" opacity={0.3} />
        <circle r={72} fill="#E0452F" stroke={INK} strokeWidth={5} />
        <circle r={52} fill={CREAM} stroke={INK} strokeWidth={4} />
        <path d={`M 0 0 L ${Math.sin(t * 0.3) * 40} ${-Math.cos(t * 0.3) * 40}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <path d="M -12 -72 Q 0 -94 12 -72 Z" fill="#4E8A52" stroke={INK} strokeWidth={4} />
      </g>
      <TimerPill x={1440} y={330} text={fmt(sec)} s={0.46} w={430} />
    </g>
  );
};

// ---------- D13: a pile of papers grows: "~100 NGHIÊN CỨU" (memory look) ----------
export const D13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <WarmBackdrop id="d13w" t={t} memory />
    <ellipse cx={960} cy={900} rx={420} ry={40} fill="#000" opacity={0.35} />
    {Array.from({ length: 16 }).map((_, i) => {
      const p = backOut(clamp((t - 2 - i * 1.5) / 6));
      const y = 880 - i * 26;
      return p > 0 ? (
        <g key={i} transform={`translate(${960 + (rnd(8, i) - 0.5) * 60} ${y - (1 - p) * 220}) rotate(${(rnd(9, i) - 0.5) * 16})`} opacity={clamp(p * 2)}>
          <rect x={-230} y={-18} width={460} height={34} rx={5} fill="#000" opacity={0.25} transform="translate(8 8)" />
          <rect x={-230} y={-18} width={460} height={34} rx={5} fill={i % 2 ? '#F4EEE0' : '#E9E1CE'} stroke="#B9AE96" strokeWidth={3} />
          <rect x={-190} y={-6} width={220} height={7} rx={3} fill="#8E8670" opacity={0.7} />
        </g>
      ) : null;
    })}
    <BigWord x={960} y={300} t={t - 4} text="~100 NGHIÊN CỨU" size={128} />
    <Sparkle x={1350} y={250} t={t - 26} s={1.2} />
  </g>
);

// ---------- D14: close on a study page: the NẾU-THÌ line is highlighted, the source tag drops in ----------
export const D14: React.FC<ShotProps> = ({ t, len }) => {
  const hl = easeOut(clamp((t - 14) / 14));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <WarmBackdrop id="d14w" t={t} memory />
      <StudyCard x={960} y={450} w={1020} h={600} t={t} rot={-1.5} tag="GOLLWITZER & SHEERAN, 2006" tagT={22}>
        <rect x={-420} y={-250} width={380} height={26} rx={8} fill="#2A1830" opacity={0.75} />
        <rect x={-420} y={-200} width={620} height={14} rx={6} fill="#8E8670" opacity={0.6} />
        <rect x={-420} y={-166} width={540} height={14} rx={6} fill="#8E8670" opacity={0.6} />
        <rect x={-440} y={-96} width={880 * hl} height={110} rx={14} fill="#FFE27A" opacity={0.9} />
        <text x={-410} y={-18} fontFamily={FONT.title} fontWeight={900} fontSize={84} fill={INK}>NẾU … THÌ …</text>
        {[40, 82, 124, 166].map((y, i) => <rect key={y} x={-420} y={y + 20} width={i % 2 ? 560 : 760} height={14} rx={6} fill="#8E8670" opacity={0.6} />)}
      </StudyCard>
      <Glow x={960} y={430} r={700} o={0.18} />
    </g>
  );
};

// ---------- D15: two bars: no plan stays low, an if-then plan climbs higher, a flag on top ----------
export const D15: React.FC<ShotProps> = ({ t, len }) => {
  const up = easeOut(clamp((t - 10) / 22));
  const flag = backOut(clamp((t - 30) / 8));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <WarmBackdrop id="d15w" t={t} memory />
      <MonoPill x={960} y={140} t={t} text="HOÀN THÀNH MỤC TIÊU" size={50} />
      <TwoBars x={960} y={820} h1={0.32 * Math.min(1, t / 8)} h2={0.96 * up} maxH={440} l1="KHÔNG" l2="NẾU–THÌ" />
      <g transform={`translate(1130 ${820 - 0.96 * up * 440}) scale(${flag})`} opacity={flag > 0 ? 1 : 0}>
        <path d="M 0 0 L 0 -120" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <path d="M 4 -120 L 86 -96 L 4 -70 Z" fill="#5BE08A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      </g>
      <Sparkle x={1130} y={820 - 0.96 * 440 - 150} t={t - 32} s={1.3} />
    </g>
  );
};

// ---------- D16: the stamp ĐÓ LÀ THẬT slams onto the study page, a small shake ----------
export const D16: React.FC<ShotProps> = ({ t, len }) => {
  const sh = shake(t, 4, 8, 12);
  return (
    <g transform={`translate(${sh.x} ${sh.y})`}>
      <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
        <WarmBackdrop id="d16w" t={t} memory />
        <StudyCard x={960} y={470} w={1000} h={600} t={t + 20} rot={-1.5} flip={false}>
          <rect x={-420} y={-250} width={380} height={26} rx={8} fill="#2A1830" opacity={0.75} />
          <text x={-410} y={-60} fontFamily={FONT.title} fontWeight={900} fontSize={84} fill={INK}>NẾU … THÌ …</text>
          {[20, 62, 104, 146, 188].map((y, i) => <rect key={y} x={-420} y={y} width={i % 2 ? 560 : 780} height={14} rx={6} fill="#8E8670" opacity={0.6} />)}
        </StudyCard>
        <Stamp x={960} y={540} t={t - 3} />
      </g>
    </g>
  );
};
