import React from 'react';
import {
  Hero, Pose, basePose, faceAt, walkPose, kf, clamp, easeOut, easeInOut, camT, Glow, Dust, Rooftop, TitleCard,   LEG_LEN, LOOKS, Haze, Foreground, rnd, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { BigPhone } from '../last-one/che-night-props';
import { SunnySidewalk } from './che-sunny-sidewalk-prop';
import { CountChip } from './che-space-and-chip-props';
import { faceBlink, PIP, SIS } from './che-home-and-door-props';

// Chapter E, the question and the ending: Pip on the golden rooftop with 08:20 on the clock (E17-E19), three warm last
// minutes (E20 walk with his sister, E21 a call with Mo, E22 a blue sky) and the end card (E23, E24).

const MO = LOOKS.mo;
const DECK = 830; // feet on the roof deck

const roofPip = (x: number, sc: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y: DECK - LEG_LEN * sc, scale: sc, armL: { a: 8, b: -6 }, armR: { a: 12, b: -6 }, sway: 3, ...extra,
});

// ---------- E17: medium: Pip on the golden rooftop, looks at us, the Sun glowing beside his head ----------
export const E17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 940]]), kf(t, [[0, 620], [len, 600]]), kf(t, [[0, 1.9], [len, 2.1]]))}>
    <Rooftop t={t + 300} sunX={1240} sunY={640} />
    <Hero look={PIP} pose={roofPip(820, 1.2, { yaw: 0.15, facing: 1, look: 0, headTilt: 3, ...faceAt(t, [[0, 'neutral'], [30, 'smug']]) })} rimId="rimR" shadow={0.5} />
  </g>
);

// ---------- E18: low-angle wide: the huge Sun over the city, Pip small, the 08:20 chip ----------
export const E18: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 960], [len, 1010]]), kf(t, [[0, 540], [len, 500]]), kf(t, [[0, 0.95], [len, 1.12]]))}>
      <Rooftop t={t + 360} sunX={1180} sunY={560} low={150} />
      <Hero look={PIP} pose={roofPip(560, 1.0, { y: DECK + 150 * 0.8 - LEG_LEN, yaw: 0.8, facing: 1, look: 0.7, headTilt: -6, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.5} />
    </g>
    <CountChip text="08:20" pulse={t < 12 ? Math.sin((t / 12) * Math.PI) : 0} />
  </g>
);

// ---------- E19: close-up: Pip gazing at the Sun, thinking: how would you spend them? ----------
export const E19: React.FC<ShotProps> = ({ t, len }) => {
  const sc = kf(t, [[0, 3.1], [len, 3.4]]);
  const head = { x: 700, y: 520 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y + 176 * sc, scale: sc, yaw: 0.6, facing: 1, headTilt: -6, look: kf(t, [[0, 0.5], [len, 0.9]]),
    armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 }, sway: 3, ...faceBlink(t, [[0, 'neutral']], 50, 45),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -100) scale(1.3)"><Rooftop t={t + 400} sunX={1300} sunY={600} /></g>
      </g>
      <Glow x={1400} y={560} r={900} o={0.45} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <CountChip x={1640} y={96} text="08:20" s={0.8} />
    </g>
  );
};

// ---------- E20: Pip and his little sister walk a sunny sidewalk, side by side (the street scrolls past) ----------
export const E20: React.FC<ShotProps> = ({ t, len }) => {
  const ground = 915;
  const ph = t * 0.5;
  const pip = walkPose(780, ph, ground, 1.15, { armR: { a: 34 * Math.sin(ph), b: 14 }, ...faceAt(t, [[0, 'happy']]) });
  const sis = walkPose(1010, ph + 1.1, ground, 0.83, { armL: { a: 30, b: 10 }, ...faceAt(t, [[0, 'happy']]) });
  return (
    <g transform={camT(960, kf(t, [[0, 640], [len, 620]]), kf(t, [[0, 1.12], [len, 1.24]]))}>
      <SunnySidewalk t={t + 20} v={5.2} />
      <Hero look={SIS} pose={sis} rimId="rimR" shadow={0.5} />
      <Hero look={PIP} pose={pip} rimId="rimR" shadow={0.5} />
      <Glow x={1500} y={300} r={700} o={0.25} />
    </g>
  );
};

// ---------- E21: Pip on a video call, Mo laughing on the screen ----------
export const E21: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.0;
  const head = { x: 640, y: 520 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y + 176 * sc, scale: sc, yaw: 0.45, facing: 1, headTilt: 4, look: 0.7,
    armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 }, sway: 3, ...faceBlink(t, [[0, 'happy']], 55, 50),
  };
  const bob = Math.sin(t / 7) * 5;
  const moPose: Pose = { ...basePose, x: 0, y: 128 + bob * 0.3, scale: 0.82, yaw: 0.1, headTilt: Math.sin(t / 6) * 4, armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 }, ...faceAt(t, [[0, 'happy']]) };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -100) scale(1.3)"><Rooftop t={t + 440} sunX={1300} sunY={600} /></g>
      </g>
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <BigPhone x={1330} y={520 + bob} w={340} rot={-6} lit={0.6} id="e21ph">
        <rect x={-100} y={-210} width={200} height={420} fill="#F2C07A" />
        <circle cx={40} cy={-120} r={46} fill="#FFE2A8" opacity={0.7} />
        <Hero look={MO} pose={moPose} rimId="rimR" shadow={0} />
      </BigPhone>
      <InsertArm x={1330} y={820 + bob} fx={760} fy={1250} rot={-8} s={4.2} width={120} />
    </g>
  );
};

// ---------- E22: a bright blue sky, clouds sliding, birds, the city's top edge: one last look ----------
export const E22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 640], [len, 420]]), 1.0)}>
    <defs>
      <linearGradient id="e22sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2F7BD8" />
        <stop offset="0.6" stopColor="#7DBCF0" />
        <stop offset="1" stopColor="#FFD9A0" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-600} width={2720} height={2200} fill="url(#e22sky)" />
    <Glow x={1500} y={820} r={900} o={0.55} />
    {Array.from({ length: 7 }).map((_, i) => {
      const cx = ((rnd(41, i) * 2600 + t * (0.6 + rnd(42, i)) * 0.9) % 2600) - 340;
      const cy = 100 + i * 120;
      return (
        <g key={i} opacity={0.9}>
          <ellipse cx={cx} cy={cy} rx={180 + rnd(43, i) * 120} ry={34 + rnd(44, i) * 18} fill="#FFFFFF" opacity={0.85} />
          <ellipse cx={cx + 60} cy={cy - 26} rx={110} ry={34} fill="#FFFFFF" opacity={0.85} />
          <ellipse cx={cx} cy={cy + 22} rx={170} ry={14} fill="#BFD6F0" opacity={0.5} />
        </g>
      );
    })}
    {Array.from({ length: 5 }).map((_, i) => {
      const bx = 300 + i * 160 + t * 3.5;
      const by = 260 - i * 18 + Math.sin(t / 5 + i) * 10;
      return <path key={i} d={`M ${bx - 22} ${by - 8 * Math.sin(t / 3 + i)} Q ${bx - 8} ${by - 18} ${bx} ${by} Q ${bx + 8} ${by - 18} ${bx + 22} ${by - 8 * Math.sin(t / 3 + i)}`} stroke="#1E2A44" strokeWidth={4} fill="none" strokeLinecap="round" />;
    })}
    <Haze y={900} h={300} o={0.3} />
    <path d="M -400 1700 L -400 940 L 100 940 L 100 880 L 340 880 L 340 960 L 700 960 L 700 900 L 1100 900 L 1100 980 L 1500 980 L 1500 870 L 1900 870 L 1900 940 L 2400 940 L 2400 1700 Z" fill="#2B2230" />
    <Dust t={t} seed={22} x0={0} y0={300} w={1920} h={600} n={30} o={0.5} />
  </g>
);

const endTitle = (t: number) => (
  <TitleCard t={t} lines={['HOW WOULD YOU SPEND', 'YOUR LAST 8 MINUTES?']} accent="8" accentT={46} y={150} size={86} />
);

// ---------- E23: end card: the golden rooftop, Pip watching the Sun, the question over it ----------
export const E23: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Rooftop t={t + 500} sunX={1180} sunY={640} />
      <Hero look={PIP} pose={roofPip(640, 1.25, { yaw: 0.85, facing: 1, look: 0.8, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.5} />
    </g>
    {endTitle(t)}
  </g>
);

// ---------- E24: the Sun slowly sets behind the city; the words hold; a soft fade to black ----------
export const E24: React.FC<ShotProps> = ({ t, len }) => {
  const fade = easeOut(clamp((t - (len - 48)) / 44));
  const sunY = kf(t, [[0, 640], [len, 830]], easeInOut);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 1000], [len, 1030]]), 540, kf(t, [[0, 1.06], [len, 1.12]]))}>
        <Rooftop t={t + 620} sunX={1180} sunY={sunY} />
        <Hero look={PIP} pose={roofPip(640, 1.25, { yaw: 0.85, facing: 1, look: 0.8, ...faceAt(t, [[0, 'neutral'], [40, 'tired']]) })} rimId="rimR" shadow={0.5} />
        <Foreground blur={10}><rect x={-100} y={1020} width={2200} height={200} fill="#0A0710" opacity={0.0} /></Foreground>
      </g>
      <g opacity={1 - fade}>{endTitle(t + 200)}</g>
      <rect x={-10} y={-10} width={1940} height={1100} fill="#000" opacity={fade} />
    </g>
  );
};
