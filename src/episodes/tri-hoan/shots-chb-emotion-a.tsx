import React from 'react';
import {
  poseAt, faceAt, kf, clamp, easeOut, backOut, camT, Schematic, SCH, FocusRings, Sparkle, ShotProps,
} from '../../engine';
import { LazyLabel, ClockIcon, HeartIcon, BrainIcon, Strike, SweatDrops } from './chb-notes-and-icons';
import { DeskScene, SEAT } from './chb-desk-laptop-and-chat';
import { ProgramFile, BrainChar, SmileyPhone } from './chb-science-props';

// Chapter B, science 1/2 (emotion, shots B1-B5): "you are not lazy" (LƯỜI crossed out), it is not time management but
// emotion (clock crossed, heart + brain), the file that grows a scary face, the brain running to the phone's smiley.
// Pure functions of each shot's clock t (30 fps).

// ---------- B1: medium at the desk: the LƯỜI label pops up beside Pip and is struck out; he relaxes ----------
export const B1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...SEAT, headTilt: 5, look: 0.2 } },
    { f: 16, p: { headTilt: 8, armR: { a: 74, b: -12 } } },
    { f: 22, p: { headTilt: -3, armR: { a: 66, b: -18 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1230], [len, 1200]]), 560, kf(t, [[0, 1.55], [len, 1.8]]))}>
      <DeskScene
        t={t}
        id="b1"
        clock="21:05"
        pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [22, 'happy'], [60, 'smug']]) }}
        over={
          <g>
            <LazyLabel x={1010} y={430} t={t - 6} strikeAt={14} s={0.85} />
            <FocusRings x={1130} y={560} t={t - 62} r0={40} />
            <Sparkle x={1240} y={480} t={t - 64} s={0.9} />
          </g>
        }
      />
    </g>
  );
};

// ---------- B2: the card: a clock crossed out, then a heart + brain: "an emotion problem, not a time problem" ----------
export const B2: React.FC<ShotProps> = ({ t, len }) => {
  const out = easeOut(clamp((t - 56) / 8));
  const inn = backOut(clamp((t - 62) / 9));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t} id="b2" />
      <g transform={`translate(${940 - out * 40} ${520}) scale(${(1 - 0.6 * out) * backOut(clamp((t + 2) / 8))})`} opacity={1 - out}>
        <ClockIcon x={0} y={0} r={190} t={t} />
        <Strike x={0} y={0} w={380} t={t - 44} x2 />
      </g>
      <g transform={`translate(0 ${-4 * Math.sin(t / 6)})`}>
        <HeartIcon x={720} y={520} s={1.9 * inn} t={t - 62} />
        <BrainIcon x={1230} y={510} s={1.9 * inn} glow={inn} />
      </g>
      <Sparkle x={960} y={330} t={t - 70} s={1.2} />
    </g>
  );
};

// ---------- B3: medium: the presentation file swells and grows an angry face; Pip shrinks back ----------
export const B3: React.FC<ShotProps> = ({ t, len }) => {
  const scary = easeOut(clamp((t - 20) / 50));
  const pose = poseAt(t, [
    { f: 0, p: { ...SEAT, armR: { a: 40, b: -10 }, headTilt: 2 } },
    { f: 34, p: { tilt: -2 } },
    { f: 50, p: { tilt: -8, headTilt: -8, armR: { a: 20, b: -6 }, armL: { a: 30, b: -6 } } },
    { f: 66, p: { tilt: -11, headTilt: -10 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1280], [len, 1250]]), 520, kf(t, [[0, 1.45], [len, 1.6]]))}>
      <DeskScene
        t={t}
        id="b3"
        clock="21:30"
        glow={0.8}
        pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [34, 'tired'], [48, 'shock'], [64, 'worried']]) }}
        over={
          <g>
            <ProgramFile x={1560} y={470} s={0.85} scary={scary} t={t} />
            <SweatDrops x={1170} y={500} t={t - 48} />
          </g>
        }
      />
    </g>
  );
};

// ---------- B4: wide: the brain bolts away from the scary file ----------
export const B4: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 640], [len, 1180]]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1020]]), 560, 1.05)}>
      <Schematic t={t} id="b4" />
      <ProgramFile x={300} y={540} s={1.1} scary={1} t={t} />
      <g opacity={0.5}>
        {[0, 1, 2].map((i) => <path key={i} d={`M ${x - 190 - i * 60} ${440 + i * 70} l -110 0`} stroke={SCH.dim} strokeWidth={8} strokeLinecap="round" opacity={0.7 - i * 0.2} />)}
      </g>
      <BrainChar x={x} y={540} s={1.15} phase={t * 0.75} facing={1} />
      <SmileyPhone x={1620} y={560} s={0.85} t={t} />
    </g>
  );
};

// ---------- B5: insert: the phone's smiley, the relieved brain sinks onto it ----------
export const B5: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 14));
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Schematic t={t} id="b5" />
      <SmileyPhone x={960} y={560} s={1.35} t={t} rot={-3 + Math.sin(t / 9) * 2} />
      <g transform={`translate(${1180 - 70 * k} ${340 + 60 * (1 - k) + Math.sin(t / 7) * 4}) rotate(${-14 + 8 * k})`}>
        <BrainIcon x={0} y={0} s={0.95} glow={0.5} />
        <path d="M -52 8 Q -34 -8 -16 8 M 16 8 Q 34 -8 52 8" stroke="#121019" strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M -20 38 Q 0 56 20 38" stroke="#121019" strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
      {[0, 1, 2].map((i) => <HeartIcon key={i} x={640 + i * 320} y={300 - ((t * 2 + i * 22) % 70)} s={0.28} t={t} beat={0} color="#FF8FA0" />)}
      <Sparkle x={740} y={420} t={t - 10} s={1} />
      <Sparkle x={1260} y={700} t={t - 22} s={0.8} />
    </g>
  );
};
