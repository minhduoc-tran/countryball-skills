import React from 'react';
import {
  Hero, Pose, basePose, faceAt, kf, clamp, easeOut, easeIn, backOut, settle, camT, LOOKS, Glow, Bedroom, Desk, FloatLabel, SCH, ShotProps,
} from '../../engine';
import { BigStat } from '../khong-ai-ngheo/cha-number-card-props';
import { StickyNote, SavingsJar, Stubble } from './chc-note-and-object-props';
import { CardFrame } from './chc-chart-props';

// Chapter C, "5 ten years" part 1 (135.23-144.3 s), look "y10": C19 older Pip (stubble) at his desk, C20 a hand hovers a coin over an
// empty jar: THÁNG SAU note, C21 card 1 TRIỆU/THÁNG (coins drop in), C22 card 22 TUỔI (the start), C23 card 6%/NĂM (a coin stack sprouts).

const PIP = LOOKS.pipHood;
const SLEEVE = '#2E2B3D';

// ---------- C19: medium: Pip, older, stubble, tired, behind the desk; a MAI LÀM note on the laptop; the screen glow flickers ----------
export const C19: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = {
    ...basePose, x: 960, y: 712, scale: 1, yaw: 0.2, facing: 1, look: -0.2, headTilt: 5 + Math.sin(t / 16) * 2,
    armL: { a: 30, b: 70 }, armR: { a: 24 + 6 * Math.sin(t / 5), b: 80 }, ...faceAt(t, [[0, 'tired']]),
  };
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), 560, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Bedroom t={t + 200} id="c19bd" lamp={1} crossed={0} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <Stubble pose={pose} />
      <Desk x0={560} x1={1360} y={700} />
      <StickyNote x={812} y={640} lines={['MAI', 'LÀM']} s={0.36} rot={-8} />
      <Glow x={730} y={560} r={260} kind="cool" o={0.3 + 0.08 * Math.sin(t / 3)} />
    </g>
  );
};

// ---------- C20: insert: the empty jar; a hand holds a coin over the slot, hovers, pulls back; THÁNG SAU slaps on the jar ----------
export const C20: React.FC<ShotProps> = ({ t, len }) => {
  const hov = kf(t, [[0, 0], [12, 1], [42, 1], [56, 0]]);
  const cx = 1020 + 200 * (1 - hov);
  const cy = 330 - 30 * hov + Math.sin(t / 4) * 10 * hov;
  const sl = easeOut(clamp((t - 42) / 6));
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <rect x={-400} y={-400} width={2720} height={1900} fill="#2B2230" />
      <rect x={-400} y={880} width={2720} height={400} fill="#5B4038" />
      <rect x={-400} y={876} width={2720} height={8} fill="#7A5747" />
      <Glow x={900} y={520} r={760} o={0.5} />
      <SavingsJar id="c20j" x={900} y={910} s={2.5} coins={0} />
      <g>
        <path d={`M 2200 ${cy - 140} L ${cx + 20} ${cy}`} stroke={SLEEVE} strokeWidth={150} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={62} fill="#F6EFE3" />
        <ellipse cx={cx - 8} cy={cy - 6} rx={34} ry={34} fill="#F2C14E" stroke="#B88A1C" strokeWidth={5} />
      </g>
      {sl > 0 ? <StickyNote x={900} y={680 + settle(t - 48, 8, 1.7, 5)} lines={['THÁNG', 'SAU']} s={(2.0 - sl) * 1.1} rot={-6 + (1 - sl) * 14} /> : null}
    </g>
  );
};

// ---------- C21: card: 1 TRIỆU/THÁNG, a coin drops into the jar each beat ----------
export const C21: React.FC<ShotProps> = ({ t, len }) => {
  const every = 8;
  const n = Math.min(12, Math.floor((t - 6) / every) + 1);
  const phase = ((t - 6) % every) / every;
  return (
    <CardFrame t={t} len={len} id="c21cd" z0={1.0} z1={1.05}>
      <BigStat x={960} y={330} t={t} text="1 TRIỆU/THÁNG" size={150} />
      <SavingsJar id="c21j" x={960} y={960} s={2.1} coins={Math.max(0, n - (phase < 0.5 ? 1 : 0))} />
      {t >= 6 ? <ellipse cx={960} cy={440 + easeIn(phase) * 160} rx={30} ry={11} fill="#F2C14E" stroke="#B88A1C" strokeWidth={3} opacity={phase < 0.65 ? 1 : 0} /> : null}
      {t >= 6 ? <g opacity={phase > 0.5 ? 1 : 0}><FloatLabel x={1230} y={700} t={Math.round((phase - 0.5) * 2 * 18)} text="+1" size={64} /></g> : null}
    </CardFrame>
  );
};

// ---------- C22: card: age 22, a young Pip at the start of a long line ----------
export const C22: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = { ...basePose, x: 640, y: 660, scale: 1.5, yaw: 0.5, facing: 1, look: 0.5, armR: { a: 12, b: 8 }, ...faceAt(t, [[0, 'happy']]) };
  const run = easeOut(clamp((t - 6) / 24));
  return (
    <CardFrame t={t} len={len} id="c22cd" z0={1.0} z1={1.06}>
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <ellipse cx={640} cy={870} rx={120} ry={14} fill="#000" opacity={0.35} />
      <BigStat x={1270} y={560} t={t - 2} text="22 TUỔI" size={190} />
      <path d={`M 900 800 H ${900 + 800 * run}`} stroke={SCH.live} strokeWidth={10} strokeLinecap="round" strokeDasharray="2 22" />
      <circle cx={900} cy={800} r={18} fill={SCH.live} />
    </CardFrame>
  );
};

// ---------- C23: card: 6%/NĂM, a stack of coins grows a sprout and a "+6%" pops up as the year ring turns ----------
export const C23: React.FC<ShotProps> = ({ t, len }) => {
  const grow = easeOut(clamp((t - 8) / 20));
  const spin = (t * 6) % 360;
  return (
    <CardFrame t={t} len={len} id="c23cd" z0={1.0} z1={1.06}>
      <BigStat x={960} y={330} t={t} text="6%/NĂM" size={200} />
      <g transform="translate(960 820)">
        {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={0} cy={-i * 24} rx={110} ry={30} fill="#F2C14E" stroke="#B88A1C" strokeWidth={4} />)}
        <g transform={`translate(0 -120) scale(${grow})`}>
          <path d="M 0 0 Q 4 -70 0 -110" stroke="#3E8C5A" strokeWidth={12} fill="none" strokeLinecap="round" />
          <path d="M 0 -80 Q -70 -90 -80 -150 Q -10 -140 0 -80 Z" fill="#5BE08A" /><path d="M 0 -104 Q 70 -110 84 -170 Q 12 -164 0 -104 Z" fill="#3E8C5A" />
        </g>
        <circle r={190} cy={-120} fill="none" stroke={SCH.dim} strokeWidth={4} strokeDasharray="14 18" transform={`rotate(${spin} 0 -120)`} opacity={0.7} />
      </g>
      {[0, 1].map((k) => <FloatLabel key={k} x={1210 + k * 60} y={720 - k * 90} t={t - 12 - k * 12} text="+6%" size={72} />)}
    </CardFrame>
  );
};
