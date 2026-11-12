import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, LEG_LEN, HEAD, joints, toWorld, Kitchen, FocusRings,
  Street, Tabletop, LightVeil, Glow, Schematic, SCH, SchLabel, Arrow, UI, FONT, ShotProps,
} from '../../engine';
import { PersonIcon } from '../last-one/insert-arm-and-icons';
import { Banknote } from './chd-props-money-and-icons';
import {
  FARMER, SURGEON, BAKER, ConicalHat, SurgeonGear, Headscarf, RiceField, OperatingLamp, HeartMonitor, ClayOven, Loaf, Steam, ClockChip,
} from './chd-props-cast-and-scenes';

// Chapter D, beat "insight" (D9-D14): Pip understands; the banknote drains to paper; money as a promise between a note
// and a person's effort; then three people whose work money only promises: the farmer, the surgeon, the baker.

const PIP = LOOKS.pipHood;
const blurBg = (t: number, id: string) => (
  <g filter="url(#blur16)"><g transform="translate(-300 -260) scale(1.5)"><Kitchen t={t + 90} id={id} /></g></g>
);

// ---------- D9: close-up: Pip understands: the stare, a beat, the rings, the face softens ----------
export const D9: React.FC<ShotProps> = ({ t, len }) => {
  const sc = kf(t, [[0, 3.2], [len, 3.6]]);
  const head = { x: 930, y: 540 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.25, look: kf(t, [[0, 0.7], [16, 0.1]]), headTilt: kf(t, [[0, 3], [len, -2]]),
    armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'worried'], [14, 'neutral']]),
  };
  return (
    <g>
      {blurBg(t, 'd9k')}
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0A12" opacity={0.35} />
      <Glow x={1250} y={420} r={620} o={0.3} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <g transform={`translate(${head.x} ${head.y - 20}) scale(0.4) translate(${-head.x} ${-(head.y - 20)})`}>
        <FocusRings x={head.x} y={head.y - 20} t={t - 12} r0={140} />
      </g>
    </g>
  );
};

// ---------- D10: macro: a banknote on the table drains of colour and print until it is plain paper ----------
export const D10: React.FC<ShotProps> = ({ t, len }) => {
  const fade = easeOut(clamp((t - 6) / 34));
  const label = clamp((t - 40) / 8);
  return (
    <g transform={`translate(960 540) rotate(${-3 + t * 0.05}) scale(${kf(t, [[0, 1.0], [len, 1.12]])}) translate(-960 -540)`}>
      <Tabletop edge={1500} wood="#6B4B42" grain="#5C4038" lip="#7A5747" />
      <LightVeil id="d10veil" lights={[[960, 520, 700]]} o={0.55} />
      <Banknote x={960} y={500} w={1000} rot={-4} fade={fade} />
      <g transform={`translate(960 900) scale(${backOut(label)})`}>
        <rect x={-250} y={-44} width={500} height={84} rx={42} fill={UI.pill} opacity={0.75} />
        <text y={14} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={42} fill={UI.text} letterSpacing={3}>CHỈ LÀ GIẤY</text>
      </g>
    </g>
  );
};

// ---------- D11: schematic: the note on one side, a person's effort on the other, a promise passing between ----------
export const D11: React.FC<ShotProps> = ({ t, len }) => {
  const dots = (dir: 1 | -1, off: number) => [0, 1, 2].map((i) => {
    const p = (((t + off + i * 20) % 60) / 60);
    const x = dir === 1 ? 700 + 520 * p : 1220 - 520 * p;
    return <circle key={`${dir}${i}`} cx={x} cy={dir === 1 ? 440 : 640} r={12} fill={SCH.live} opacity={t > 56 ? Math.sin(p * Math.PI) : 0} style={{ filter: `drop-shadow(0 0 8px ${SCH.glow})` }} />;
  });
  const nIn = backOut(clamp((t + 2) / 8));
  const pIn = backOut(clamp((t - 36) / 8));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.05]])}) translate(-960 -540)`}>
      <Schematic t={t} id="d11sch" />
      <g transform={`translate(430 540) scale(${nIn})`}><Banknote x={0} y={0} w={440} rot={-5} text="TIỀN" /></g>
      <SchLabel x={430} y={760} t={t - 6} text="TỜ GIẤY" size={44} color={SCH.dim} />
      <SchLabel x={960} y={250} t={t - 14} text="LỜI HỨA" size={96} color={SCH.live} />
      <Arrow x0={700} y0={460} x1={1220} y1={460} t={t - 40} dur={10} color={SCH.live} bend={-0.06} />
      <Arrow x0={1220} y0={620} x1={700} y1={620} t={t - 50} dur={10} color={SCH.line} bend={-0.06} />
      {dots(1, 0)}{dots(-1, 30)}
      <g transform={`translate(1500 540) scale(${pIn})`}>
        <PersonIcon x={0} y={0} s={5} on glow />
      </g>
      <SchLabel x={1500} y={760} t={t - 64} text="CÔNG SỨC CỦA HỌ" size={44} color={SCH.live} />
    </g>
  );
};

// ---------- D12: dawn paddy: the farmer, bent in the water, pushes seedlings into the mud ----------
export const D12: React.FC<ShotProps> = ({ t, len }) => {
  const dip = Math.sin(t / 7) * 0.5 + 0.5;
  const pose: Pose = {
    ...basePose, x: 820, y: 800 - LEG_LEN * 0.95, scale: 0.95, yaw: 0.75, tilt: 46 + dip * 6, headTilt: -10,
    armL: { a: 34 + dip * 14, b: 8 }, armR: { a: 30 + dip * 30, b: 10 }, legL: { a: 10, b: 0 }, legR: { a: -8, b: 6 }, look: 0.7, expr: 'neutral',
  };
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 930]]), 700, kf(t, [[0, 1.6], [len, 1.85]]))}>
      <RiceField t={t} id="d12f" />
      <ellipse cx={hand.x} cy={806} rx={40 + dip * 24} ry={8 + dip * 4} fill="none" stroke="#FFE9C8" strokeWidth={3} opacity={0.5} />
      <Hero look={FARMER} pose={pose} rimId="rimR" shadow={0} />
      <ConicalHat pose={pose} />
    </g>
  );
};

// ---------- D13: the operating room: the surgeon under the lamp, the monitor drawing a steady heartbeat ----------
export const D13: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 1120, y: 690, scale: 1.0, yaw: -0.65, tilt: 6, headTilt: 4, armL: { a: 28, b: 14 }, armR: { a: 36, b: 8 }, look: -0.6 } },
    { f: 40, p: { armL: { a: 22, b: 20 }, armR: { a: 42, b: 4 }, headTilt: 7 } },
    { f: 80, p: { armL: { a: 30, b: 12 }, armR: { a: 34, b: 10 }, headTilt: 4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1040], [len, 1000]]), 560, kf(t, [[0, 1.25], [len, 1.4]]))}>
      <rect x={-300} y={-300} width={2520} height={1600} fill="#0F1D24" />
      <rect x={160} y={120} width={1600} height={620} fill="#1B3039" />
      <path d="M 160 740 H 1760" stroke="#2A4650" strokeWidth={6} />
      {[300, 600, 900, 1500].map((x) => <rect key={x} x={x} y={300} width={170} height={260} rx={10} fill="#223B45" stroke="#2F505C" strokeWidth={4} />)}
      <rect x={90} y={730} width={1740} height={500} fill="#162A31" />
      <OperatingLamp x={880} t={t} id="d13l" />
      <HeartMonitor x={1560} y={470} t={t} s={1.2} />
      <path d="M 1560 580 V 790" stroke="#4A5560" strokeWidth={10} />
      <Hero look={SURGEON} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]), blink: t % 70 > 66 ? 1 : 0 }} rimId="rimL" shadow={0} />
      <SurgeonGear pose={pose} />
      <rect x={480} y={776} width={860} height={300} fill="#6F848E" stroke="#3E505A" strokeWidth={4} />
      <rect x={470} y={742} width={880} height={36} rx={10} fill="#9FB2BA" stroke="#4A5C66" strokeWidth={4} />
      <path d="M 500 744 Q 560 676 700 700 Q 880 668 1020 690 Q 1200 678 1320 744 Z" fill="#3C8F8C" stroke="#245E5C" strokeWidth={4} />
      <Glow x={880} y={700} r={560} o={0.5} />
    </g>
  );
};

// ---------- D14: 04:00, a dark street: the baker, headscarf on, draws loaves from the glowing clay oven ----------
export const D14: React.FC<ShotProps> = ({ t, len }) => {
  const cyc = ((t % 64) / 64);
  const reach = kf(cyc * 64, [[0, 0], [20, 1], [30, 1], [50, 0], [64, 0]]);
  const pose: Pose = {
    ...basePose, x: 880 + reach * 40, y: 790 - LEG_LEN * 0.95, scale: 0.95, yaw: 0.85, tilt: 6 + reach * 10, headTilt: 3,
    armL: { a: 50 + reach * 26, b: 14 }, armR: { a: 48 + reach * 28, b: 10 }, legL: { a: 8, b: 0 }, legR: { a: -6, b: 4 }, look: 0.7,
    ...faceAt(t, [[0, 'neutral']]),
  };
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g>
    <g transform={camT(kf(t, [[0, 1000], [len, 1040]]), 600, kf(t, [[0, 1.2], [len, 1.4]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -260) scale(1.5)"><Street t={t + 30} id="d14st" night /></g>
      </g>
      <rect x={-300} y={-300} width={2520} height={1700} fill="#05060E" opacity={0.55} />
      <ClayOven x={1380} y={800} s={1.25} t={t} />
      <g transform={`translate(${hand.x - 230 * (1 - reach) - 20} ${hand.y + 30})`}>
        <rect x={0} y={-6} width={300} height={14} rx={6} fill="#B58A58" stroke="#6A4A26" strokeWidth={3} />
        <Loaf x={190} y={-24} s={1} />
        <Loaf x={96} y={-22} s={0.9} rot={4} />
      </g>
      <Hero look={BAKER} pose={pose} rimId="rimR" shadow={0.6} />
      <Headscarf pose={pose} />
      <Steam x={1000} y={680} t={t} s={0.9} n={3} o={0.35} />
      <rect x={200} y={760} width={420} height={26} rx={8} fill="#6A4A32" />
      <rect x={230} y={786} width={26} height={110} fill="#4A3222" /><rect x={560} y={786} width={26} height={110} fill="#4A3222" />
      {[0, 1, 2, 3].map((i) => <Loaf key={i} x={290 + i * 90} y={742} s={0.8} />)}
    </g>
      <ClockChip x={240} y={110} text="04:00" t={t} />
    </g>
  );
};
