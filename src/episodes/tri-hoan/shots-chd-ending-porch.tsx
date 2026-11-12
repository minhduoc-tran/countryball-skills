import React from 'react';
import {
  Hero, Pose, basePose, faceAt, kf, clamp, easeOut, camT, Foreground, Glow, Dust, Sparkle, ShotProps, rnd,
} from '../../engine';
import { GRANDMA } from '../khong-ai-ngheo/cast-looks';
import { PIP } from './chd-desk-props';
import { Porch, Guitar, Notes, SleepySun } from './chd-country-props';
import { PorchScene } from './chd-porch-scene';
import { InsertArm } from '../last-one/insert-arm-and-icons';

// Chapter D, "7 ending", part 2 (222.90-232.00 s): D32 grandma's toothless smile on the porch, D33 she teaches Pip to strum,
// D34 the guitar is dusted clean, D35 the sunset over the porch, D36 the sleepy "tomorrow" sun does nothing.

// ---------- D32: close: grandma on her porch, a wide gummy smile, Pip's hood blurred in the foreground ----------
export const D32: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = { ...basePose, x: 1010, y: 900, scale: 2.5, yaw: 0.12, facing: 1, headTilt: 3 + Math.sin(t / 10) * 3, look: -0.3, armL: { a: 12, b: -4 }, armR: { a: 10 + 4 * Math.sin(t / 5), b: -6 }, ...faceAt(t, [[0, 'happy']]), blink: t % 60 > 56 ? 1 : 0 };
  const wave: Pose = { ...basePose, x: 110, y: 1000, scale: 3.2, yaw: 0.8, facing: 1, headTilt: 4, armL: { a: 14, b: 6 }, armR: { a: 120 + 14 * Math.sin(t / 4), b: 20 }, ...faceAt(t, [[0, 'happy']]) };
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Porch id="d32p" t={t + 30} dusk={0.1} />
      <Hero look={GRANDMA} pose={pose} rimId="rimR" shadow={0} />
      <Glow x={1000} y={380} r={500} o={0.25} />
      <Foreground blur={16}><Hero look={PIP} pose={wave} rimId="rimR" shadow={0} /></Foreground>
      <Dust t={t} seed={4} x0={500} y0={200} w={1200} h={600} n={20} o={0.4} />
    </g>
  );
};

// ---------- D33: medium: on the bench grandma guides his hand, he strums; notes drift up ----------
export const D33: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 1040]]), 610, kf(t, [[0, 1.45], [len, 1.6]]))}>
    <PorchScene t={t + 20} id="d33p" dusk={0.2} mode="teach" notes={6} />
    <Sparkle x={1130} y={500} t={t - 14} s={0.9} />
  </g>
);

// ---------- D34: insert: a cloth wipes the dust off the guitar; the wood shines, the strings hum, notes rise ----------
export const D34: React.FC<ShotProps> = ({ t, len }) => {
  const wipeX = kf(t, [[4, 680], [16, 1060], [28, 700], [40, 1060]]);
  const dust = 1 - easeOut(clamp((t - 6) / 34));
  const clean = clamp((t - 38) / 8);
  return (
    <g>
      <g filter="url(#blur16)"><Porch id="d34p" t={t} dusk={0.25} /></g>
      <rect x={0} y={0} width={1920} height={1080} fill="#2A1830" opacity={0.25} />
      <Guitar x={900} y={800} rot={38} s={1.5} dust={dust} t={t} strum={clean} shine={clean} />
      {t >= 4 && t < 44 ? (
        <g>
          <InsertArm x={wipeX + 70} y={700 + Math.sin(t / 2) * 30} fx={2100} fy={1100} rot={-30} s={4.2} width={100} />
          <g transform={`translate(${wipeX} ${700 + Math.sin(t / 2) * 30}) rotate(${Math.sin(t / 3) * 10})`}>
            <path d="M -90 -50 Q 0 -80 90 -50 L 100 50 Q 0 80 -100 50 Z" fill="#E9C46A" stroke="#7A5A1E" strokeWidth={5} />
          </g>
          {Array.from({ length: 7 }).map((_, i) => <circle key={i} cx={wipeX - 40 + (rnd(2, i) - 0.5) * 220} cy={700 + (rnd(3, i) - 0.4) * 160 - ((t * 3 + i * 9) % 60)} r={10 + rnd(4, i) * 14} fill="#D4CEC2" opacity={0.5 * dust} />)}
        </g>
      ) : null}
      <Glow x={960} y={600} r={620} o={0.3 * clean} />
      <Sparkle x={1010} y={520} t={t - 40} s={1.4} />
      <Notes x={1280} y={560} t={Math.max(0, t - 40)} n={clean > 0 ? 4 : 0} s={1.3} />
    </g>
  );
};

// ---------- D35: wide: sunset over the porch, the two of them playing, the notes floating out into the sky ----------
export const D35: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 1020]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.14]]))}>
    <PorchScene t={t + 60} id="d35p" dusk={0.55} mode="watch" notes={6} pipLook={0.7} />
    <Glow x={1560} y={470} r={900} o={0.35} />
    <rect x={-400} y={-400} width={2720} height={1900} fill="#FF9A4A" opacity={0.16} style={{ mixBlendMode: 'overlay' }} />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={((t * (2 + i) + i * 600) % 2600) - 300} cy={250 + i * 46 + Math.sin(t / 8 + i) * 8} rx={18} ry={6} fill="#3A2A44" />)}
  </g>
);

// ---------- D36: medium: grandma claps; "tomorrow" hangs on the wall as a sleepy sun, doing nothing at all ----------
export const D36: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 880], [len, 960]]), 540, kf(t, [[0, 1.15], [len, 1.32]]))}>
    <PorchScene t={t + 90} id="d36p" dusk={0.75} mode="clap" notes={4} />
    <g transform={`translate(0 ${Math.sin(t / 16) * 8})`}><SleepySun x={500} y={420} t={t} s={0.85} /></g>
    <Glow x={1560} y={440} r={900} o={0.3} />
    <rect x={-400} y={-400} width={2720} height={1900} fill="#FF9A4A" opacity={0.14} style={{ mixBlendMode: 'overlay' }} />
  </g>
);
