import React from 'react';
import {
  Hero, Pose, poseAt, faceAt, kf, camT, clamp, easeOut, easeInOut, backOut, LOOKS, Glow, ShotProps, Schematic, SCH, SchLabel, DrawOn,
  FONT, stand, BEDROOM, Tag, UI,
} from '../../engine';
import { DawnBedroom } from '../last-one/shots-cha-morning-bedroom';
import { shakeAt } from './punch-fx-kit';

// Chapter A, "1 rule" (A32-A35): the schematic of a power dial with a single position (MAX, "NHẸ" crossed out), then Pip
// staring at his own fist.
const PIP = LOOKS.pipHood;
const TRACK = { x0: 380, x1: 1540, y: 560 };

// ---------- A32: "Quy tắc chỉ có một": a big 1 inside a ring ----------
export const A32: React.FC<ShotProps> = ({ t }) => {
  const pop = backOut(clamp((t - 6) / 9));
  return (
    <g>
      <Schematic t={t} id="a32" />
      <DrawOn t={t} dur={14} d="M 710 470 a 250 250 0 1 0 500 0 a 250 250 0 1 0 -500 0" color={SCH.live} width={9} />
      <g transform={`translate(960 470) scale(${pop})`}>
        <text y={140} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={420} fill={SCH.line} stroke="#101A2A" strokeWidth={10} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 26px ${SCH.glow})` }}>1</text>
      </g>
      <SchLabel x={960} y={880} t={t - 14} text="QUY TẮC" size={64} color={SCH.glow} />
    </g>
  );
};

// ---------- A33: the dial: a slider zips from NHẸ to MAX and sticks there; every other notch is locked out ----------
const Slider: React.FC<{ t: number; knobX: number; notchesDim: number }> = ({ t, knobX, notchesDim }) => (
  <g>
    <DrawOn t={t} dur={10} d={`M ${TRACK.x0} ${TRACK.y} L ${TRACK.x1} ${TRACK.y}`} color={SCH.dim} width={18} />
    {Array.from({ length: 11 }).map((_, i) => {
      const x = TRACK.x0 + (i * (TRACK.x1 - TRACK.x0)) / 10;
      const last = i === 10;
      return (
        <g key={i} opacity={clamp((t - 4 - i * 0.6) / 4)}>
          <path d={`M ${x} ${TRACK.y - 40} L ${x} ${TRACK.y + 40}`} stroke={last ? SCH.live : SCH.dim} strokeWidth={last ? 10 : 5} opacity={last ? 1 : 1 - 0.55 * notchesDim} />
        </g>
      );
    })}
    <g transform={`translate(${knobX} ${TRACK.y})`}>
      <circle r={74} fill={SCH.live} stroke="#101A2A" strokeWidth={10} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow})` }} />
      <circle r={44} fill="#FFD6A0" opacity={0.6} />
      <path d="M -18 -8 L 0 -26 L 18 -8 M -18 12 L 0 -6 L 18 12" stroke="#101A2A" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90)" />
    </g>
  </g>
);
export const A33: React.FC<ShotProps> = ({ t }) => {
  const knobX = kf(t, [[8, TRACK.x0], [18, TRACK.x1 + 8], [21, TRACK.x1 - 6], [24, TRACK.x1]], easeInOut);
  const sk = shakeAt(t, 19, 12, 9);
  const cross = clamp((t - 24) / 6);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <Schematic t={t} id="a33" />
      <Slider t={t} knobX={knobX} notchesDim={clamp((t - 14) / 6)} />
      <SchLabel x={TRACK.x0} y={TRACK.y + 150} t={t - 4} text="NHẸ" size={64} color={SCH.dim} />
      <path d={`M ${TRACK.x0 - 90} ${TRACK.y + 100} L ${TRACK.x0 + 90} ${TRACK.y + 200}`} stroke={UI.bad} strokeWidth={14} strokeLinecap="round" strokeDasharray={220} strokeDashoffset={220 * (1 - cross)} />
      <path d={`M ${TRACK.x0 + 90} ${TRACK.y + 100} L ${TRACK.x0 - 90} ${TRACK.y + 200}`} stroke={UI.bad} strokeWidth={14} strokeLinecap="round" strokeDasharray={220} strokeDashoffset={220 * (1 - clamp((t - 27) / 5))} />
      <SchLabel x={TRACK.x1} y={TRACK.y + 150} t={t - 6} text="MAX" size={64} color={SCH.glow} />
      <SchLabel x={960} y={300} t={t - 2} text="SỨC ĐẤM" size={56} color={SCH.line} />
    </g>
  );
};

// ---------- A34: close on the knob, stuck at MAX: pulsing, shaking, 100% ----------
export const A34: React.FC<ShotProps> = ({ t, len }) => {
  const pulse = 1 + 0.06 * Math.sin(t * 0.9);
  const sk = shakeAt(t, 0, 28, 10);
  const p = (t / 12) % 1;
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(TRACK.x1 - 80, TRACK.y, kf(t, [[0, 1.9], [len, 2.2]]))}>
        <Schematic t={t + 60} id="a34" />
        <Slider t={t + 60} knobX={TRACK.x1} notchesDim={1} />
        <circle cx={TRACK.x1} cy={TRACK.y} r={74 + 180 * p} stroke={SCH.glow} strokeWidth={10} fill="none" opacity={1 - p} />
        <g transform={`translate(${TRACK.x1} ${TRACK.y - 150}) scale(${pulse})`}>
          <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={84} fill={SCH.glow} stroke="#101A2A" strokeWidth={10} paintOrder="stroke">100%</text>
        </g>
        <SchLabel x={TRACK.x1} y={TRACK.y + 150} t={t + 60} text="MAX" size={64} color={SCH.glow} />
      </g>
      <Glow x={960} y={540} r={800} kind="warm" o={0.18 + 0.1 * Math.sin(t * 0.9)} />
    </g>
  );
};

// ---------- A35: Pip looks at his own fist, worried: "no light touch", with NHẸ crossed out in a tag ----------
export const A35: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(BEDROOM, 0.62, 0.55, 0.78);
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: s.x, y: s.y, scale: s.scale, yaw: -0.25, look: -0.2, tilt: 0, armL: { a: 12, b: 8 }, armR: { a: 16, b: 10 } } },
    { f: 10, p: { armR: { a: 40, b: 120 }, headTilt: 7, look: 0.6 }, ease: easeOut },
    { f: 20, p: { armR: { a: 36, b: 126 }, headTilt: 9, look: 0.7 } },
    { f: 30, p: { armR: { a: 42, b: 118 }, headTilt: 5 } },
    { f: len, p: { armR: { a: 36, b: 126 }, headTilt: 9 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, s.x], [len, s.x - 10]]), s.y - 120, kf(t, [[0, 1.9], [len, 2.2]]))}>
      <DawnBedroom t={t + 220} id="a35" duvet />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [9, 'worried']]) }} rimId="rimR" shadow={0.6} />
      <path d={`M ${s.x - 62} ${s.y - 270} q -10 22 0 34 q 12 -12 0 -34 Z`} fill="#BFE6FF" stroke="#1A1230" strokeWidth={3} opacity={clamp((t - 14) / 4)} transform={`translate(0 ${6 * Math.sin(t / 4)})`} />
      <Tag x={s.x + 190} y={s.y - 240} t={t - 16} text="NHẸ" mark="x" markT={8} w={170} />
    </g>
  );
};
