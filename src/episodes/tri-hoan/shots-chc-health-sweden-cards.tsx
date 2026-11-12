import React from 'react';
import {
  Hero, Pose, basePose, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, Glow, Bedroom, BEDROOM, stand, Desk, FONT, SCH, ShotProps,
} from '../../engine';
import { BigStat, Cap, GridPerson } from '../khong-ai-ngheo/cha-number-card-props';
import { StickyNote, Stubble, INK } from './chc-note-and-object-props';
import { IconStress, IconAnxiety, IconSleepless, IconLonely } from './chc-icon-props';
import { CardFrame } from './chc-chart-props';
import { C8 } from './shots-chc-tice-study-cards';

// Chapter C, "5 health" (156.19-167.5 s): C30 older Pip, tired, at the night window (y10), C31 card THỤY ĐIỂN (a waving flag),
// C32 card 3.500+ SINH VIÊN (a crowd fills in) with the JAMA tag, C33 Pip drowning in MAI LÀM notes (y10), C34 stress + anxiety icons,
// C35 sleepless (moon with open eyes) + loneliness (one apart), C36 ĐÓ LÀ THẬT. Cards use look "memory", scenes "y10".

const PIP = LOOKS.pipHood;

// ---------- C30: Pip, older, at the night window, shoulders heavy, the city lit behind him ----------
export const C30: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(BEDROOM, 0.6, 0.16);
  const pose: Pose = {
    ...basePose, x: s.x, y: s.y + Math.sin(t / 12) * 2, scale: s.scale, yaw: 0.35, facing: 1, look: 0.5, headTilt: 8 + Math.sin(t / 10) * 2, tilt: 3,
    armL: { a: 8, b: 6 }, armR: { a: 40, b: 100 }, ...faceAt(t, [[0, 'tired']]),
  };
  return (
    <g transform={camT(kf(t, [[0, 1180], [len, 1130]]), 560, kf(t, [[0, 1.45], [len, 1.6]]))}>
      <Bedroom t={t + 260} id="c30bd" lamp={0.55} crossed={0} />
      <Hero look={PIP} pose={pose} rimId="rimL" shadow={0} />
      <Stubble pose={pose} />
    </g>
  );
};

// ---------- C31: card: THỤY ĐIỂN, a waving blue-and-yellow flag ----------
export const C31: React.FC<ShotProps> = ({ t, len }) => {
  const pop = backOut(clamp(t / 9));
  const col = (i: number) => Math.sin(t / 5 + i * 0.5) * 9;
  const fw = 560;
  const fh = 350;
  const strips = 28;
  return (
    <CardFrame t={t} len={len} id="c31sw" z0={1.0} z1={1.06}>
      <Glow x={960} y={420} r={700} o={0.3} />
      <g transform={`translate(${960 - fw / 2} 160) scale(${pop})`} opacity={clamp(t / 3)}>
        <rect x={-6} y={-6} width={14} height={fh + 70} rx={5} fill="#C9CBD6" />
        {Array.from({ length: strips }).map((_, i) => {
          const x = 14 + (i * fw) / strips;
          const w = fw / strips + 1;
          const crossX = x + w / 2 > 14 + fw * 0.3 && x + w / 2 < 14 + fw * 0.46;
          return (
            <g key={i} transform={`translate(0 ${col(i)})`}>
              <rect x={x} y={0} width={w} height={fh} fill={crossX ? '#FECB00' : '#0A5EA8'} />
              <rect x={x} y={fh * 0.4} width={w} height={fh * 0.2} fill="#FECB00" />
              <rect x={x} y={0} width={w} height={fh} fill="#000" opacity={0.08 + 0.1 * Math.max(0, Math.sin(t / 5 + i * 0.5))} />
            </g>
          );
        })}
      </g>
      <BigStat x={960} y={850} t={t - 3} text="THỤY ĐIỂN" size={170} />
    </CardFrame>
  );
};

// ---------- C32: card: 3.500+ SINH VIÊN, a crowd that fills in; the JAMA source tag ----------
export const C32: React.FC<ShotProps> = ({ t, len }) => (
  <CardFrame t={t} len={len} id="c32st" z0={1.0} z1={1.05}>
    <BigStat x={960} y={330} t={t} text="3.500+" size={230} />
    <Cap x={960} y={430} t={t - 4} text="SINH VIÊN" size={64} color={SCH.line} />
    {Array.from({ length: 48 }).map((_, i) => (
      <GridPerson key={i} x={250 + (i % 16) * 94} y={600 + Math.floor(i / 16) * 100} s={1.5} dim={0} pop={backOut(clamp((t - 6 - i * 0.35) / 7))} />
    ))}
    <Cap x={960} y={990} t={t - 14} text="JOHANSSON et al., 2023 · JAMA" size={40} color={SCH.dim} />
  </CardFrame>
);

// ---------- C33: Pip at the desk, MAI LÀM notes multiplying over the laptop, the desk, the wall ----------
export const C33: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = {
    ...basePose, x: 960, y: 712, scale: 1, yaw: -0.2, facing: -1, look: 0.2, headTilt: 4, armL: { a: 30, b: 70 }, armR: { a: 20, b: 80 }, ...faceAt(t, [[0, 'tired'], [20, 'worried']]),
  };
  const spots: [number, number, number, number][] = [[812, 640, -8, 0.36], [650, 470, 6, 0.4], [1120, 520, -10, 0.44], [1290, 420, 8, 0.4], [760, 330, -4, 0.38], [1180, 660, 12, 0.34], [920, 300, 5, 0.42], [560, 600, -12, 0.34]];
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.3], [len, 1.18]]))}>
      <Bedroom t={t + 300} id="c33bd" lamp={0.8} crossed={0} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <Stubble pose={pose} />
      <Desk x0={560} x1={1360} y={700} />
      {spots.map(([x, y, r, s], i) => {
        const k = backOut(clamp((t - 2 - i * 3.4) / 6));
        return k > 0 ? <StickyNote key={i} x={x} y={y} lines={['MAI', 'LÀM']} s={s * k} rot={r} /> : null;
      })}
    </g>
  );
};

/** An empty dashed slot waiting for an icon, so the card is never bare before its word. */
const Slot: React.FC<{ x: number; y: number; on: boolean }> = ({ x, y, on }) => (on ? null : <circle cx={x} cy={y} r={100} fill="none" stroke={SCH.dim} strokeWidth={5} strokeDasharray="10 16" opacity={0.6} />);

// ---------- C34: stress (on "căng thẳng") and anxiety (on "lo âu") ----------
export const C34: React.FC<ShotProps> = ({ t, len }) => (
  <CardFrame t={t} len={len} id="c34ic" z0={1.0} z1={1.06}>
    <Slot x={640} y={500} on={t >= 24} /><Slot x={1280} y={500} on={t >= 51} />
    <IconStress x={640} y={500} t={t - 24} s={1.9} />
    <IconAnxiety x={1280} y={500} t={t - 51} s={1.9} />
  </CardFrame>
);

// ---------- C35: sleepless (on "mất ngủ") and lonely (on "cô đơn") ----------
export const C35: React.FC<ShotProps> = ({ t, len }) => (
  <CardFrame t={t} len={len} id="c35ic" z0={1.0} z1={1.06}>
    <Slot x={640} y={500} on={t >= 3} /><Slot x={1280} y={500} on={t >= 28} />
    <IconSleepless x={640} y={500} t={t - 3} s={1.9} />
    <IconLonely x={1210} y={500} t={t - 28} s={1.9} />
  </CardFrame>
);

// ---------- C36: "ĐÓ LÀ THẬT" again ----------
export const C36: React.FC<ShotProps> = (p) => <C8 {...p} />;
