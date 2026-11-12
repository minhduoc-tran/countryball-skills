import React from 'react';
import { Hero, Pose, basePose, kf, clamp, backOut, camT, LOOKS, HEAD, Glow, Schematic, FONT, UI, ShotProps } from '../../engine';
import { MorningBedroom, MB, bedSit } from './kit-morning-bedroom';
import { FlipClock } from './kit-loop-clock';
import { RewindWave, MemoryGlow } from './kit-rewind-fx';
import { RuleTile } from './cha-screens-and-bubbles';
import { BedroomMess } from './cha-places-props';
import { SleepingPip } from './shots-cha-cold-open';
import { PAL } from './kit-palette';

// Chapter A, the rules (23.5-33.5 s): "LUẬT": the flip clock hits 00:00; the messy room snaps back tidy at the reset;
// the rules card (room, wallet, body, 8 billion people) rewinding in cyan; Pip waking with the one thing that stays
// glowing on his head.
const PIP = LOOKS.pipHood;

const Pill: React.FC<{ x: number; y: number; t: number; text: string; size?: number; cyan?: boolean }> = ({ x, y, t, text, size = 54, cyan = false }) => {
  if (t < 0) return null;
  const w = text.length * size * 0.66 + 80;
  return (
    <g transform={`translate(${x} ${y}) scale(${backOut(clamp(t / 7))})`}>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.6} rx={size * 0.8} fill={UI.pill} opacity={0.82} />
      {cyan ? <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.6} rx={size * 0.8} fill="none" stroke={PAL.cyan} strokeWidth={3} opacity={0.8} /> : null}
      <text x={0} y={size * 0.36} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={UI.text} letterSpacing={4}>{text}</text>
    </g>
  );
};

// ---------- A11: "LUẬT": the big flip clock over Pip's dark room, 23:59 flips to 00:00 on "mười hai giờ đêm" ----------
export const A11: React.FC<ShotProps> = ({ t, len }) => {
  const flip = 63;
  const hit = clamp(1 - (t - flip - 8) / 14);
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform={camT(kf(t, [[0, MB.CLOCK.x], [len, MB.CLOCK.x - 40]]), MB.CLOCK.y - 90, 2.4)}>
          <MorningBedroom t={t + 200} id="ca11bg" dawn={0} clock={t < flip + 4 ? '23:59' : '00:00'} duvet={false} />
          <SleepingPip t={t + 200} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#060818" opacity={0.42} />
      <Pill x={960} y={230} t={t - 2} text="LUẬT" size={84} />
      <g transform={`translate(960 590) scale(${kf(t, [[0, 1.0], [len, 1.08]]) * (t >= flip + 8 ? 1 + 0.06 * hit : 1)}) translate(-960 -590)`}>
        <FlipClock x={960} y={590} s={1.15} time="00:00" from="23:59" flipAt={flip} t={t} />
      </g>
      {t >= flip + 8 ? <Glow x={960} y={590} r={700} kind="cool" o={0.4 * hit} /> : null}
    </g>
  );
};

// ---------- A12: wide, the room after a messy day at 00:00, the reset wave, and it is tidy 06:00 morning again ----------
export const A12: React.FC<ShotProps> = ({ t, len }) => {
  const R = 38;
  const after = t >= R + 1;
  return (
    <g>
      <g transform={camT(kf(t, [[0, 930], [len, 900]]), kf(t, [[0, 560], [len, 550]]), kf(t, [[0, 1.04], [len, 1.0]]))}>
        <MorningBedroom t={t + 500} id="ca12" dawn={after ? 1 : 0} clock={after ? '06:00' : '00:00'} ring={after ? 1 : 0} duvet={false} veil={after ? 0.36 : 0.32} />
        <BedroomMess o={after ? 0 : 1} />
        <SleepingPip t={t + 500} />
      </g>
      <RewindWave t={t} t0={R} id="ca12rw" />
    </g>
  );
};

// ---------- A13: the rules card: room, wallet, body, 8 billion people pop in on their words, each rewinding cyan ----------
const TILES: { icon: 'room' | 'wallet' | 'body' | 'people'; label: string; at: number }[] = [
  { icon: 'room', label: 'CĂN PHÒNG', at: -8 },
  { icon: 'wallet', label: 'VÍ TIỀN', at: 1 },
  { icon: 'body', label: 'CƠ THỂ', at: 25 },
  { icon: 'people', label: '8 TỶ NGƯỜI', at: 71 },
];
export const A13: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Schematic t={t} id="ca13" />
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.05]])}) translate(-960 -540)`}>
      <Pill x={960} y={150} t={t + 8} text="00:00 → 06:00" size={50} cyan />
      {TILES.map((tl, i) => <RuleTile key={i} x={300 + i * 440} y={580} t={t - tl.at} icon={tl.icon} label={tl.label} spinT={10} />)}
    </g>
    <Glow x={960} y={580} r={900} kind="cool" o={0.18 + 0.06 * Math.sin(t / 8)} />
  </g>
);

// ---------- A14: close-up, 06:00 again: the reset wave washes over Pip in bed, and only his head keeps glowing ----------
export const A14: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.2);
  const sc = 3.4 * (1 + 0.06 * clamp(t / len));
  const head = { x: 900, y: 600 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.35, look: kf(t, [[0, 0.1], [20, 0.6]]), headTilt: kf(t, [[0, -4], [len, 2]]),
    armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, expr: t < 10 ? 'neutral' : 'worried', blink: t < 6 ? 1 : 0,
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform={camT(b.x + 60, b.y - 120, 2.2)}>
          <MorningBedroom t={t + 600} id="ca14bg" dawn={1} ring={1} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0814" opacity={0.22} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <Glow x={1700} y={300} r={600} o={0.35} />
      <MemoryGlow x={head.x + 10} y={head.y - 10} r={HEAD.r * sc * 1.25} t={t} id="ca14mg" o={clamp((t - 6) / 8)} />
      <RewindWave t={t} t0={1} id="ca14rw" cx={head.x} cy={head.y} />
    </g>
  );
};
