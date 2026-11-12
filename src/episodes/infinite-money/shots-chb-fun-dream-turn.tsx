import React from 'react';
import { Hero, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Rooftop, Glow, Dust, rnd, DrawOn, ShotProps } from '../../engine';
import { Confetti, ConfettiHalo, BlackCard } from './chb-card-terminal-and-confetti';

// Chapter B, the turn: "the kindest person on the planet" on the golden rooftop with a halo of confetti, then the card
// on a table cracks and glitches, and Pip's smile drops as the sky goes red.

const PIP = LOOKS.pipHood;

// ---------- B27: medium: Pip on the rooftop at golden hour, arms up, confetti raining, a halo above him ----------
export const B27: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 700, scale: 1.55, yaw: 0.2, look: 0.3, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 10, p: { armL: { a: 150, b: 10 }, armR: { a: 150, b: 10 }, squash: -0.05 }, ease: easeOut },
    { f: 40, p: { armL: { a: 135, b: 16 }, armR: { a: 135, b: 16 }, squash: 0 } },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 500]]), kf(t, [[0, 1.2], [len, 1.45]]))}>
      <Rooftop t={t + 260} sunX={1290} sunY={620} />
      <Glow x={1290} y={620} r={900} o={0.4} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]), blink: t % 70 > 66 ? 1 : 0 }} rimId="rimR" shadow={0} />
      <ConfettiHalo x={960} y={pose.y - 330} r={150} t={t} />
      <Confetti t={t} x0={250} y0={-100} w={1420} h={1000} n={46} seed={5} />
      <Dust t={t} seed={71} x0={500} y0={200} w={900} h={500} n={22} o={0.6} />
    </g>
  );
};

// ---------- B28: close-up: his face, the halo of confetti circling above; he tilts his head, still smiling ----------
export const B28: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 880, scale: 2.6, yaw: 0.25, look: 0.3, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: -3 } },
    { f: 30, p: { headTilt: 6, look: -0.2 } },
    { f: 46, p: { headTilt: 9, look: -0.4 } },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 360], [len, 330]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
      <g filter="url(#blur16)"><Rooftop t={t + 300} sunX={1380} sunY={560} /></g>
      <Glow x={1380} y={560} r={900} o={0.4} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [32, 'smug']]), blink: t % 64 > 60 ? 1 : 0 }} rimId="rimR" shadow={0} />
      <ConfettiHalo x={960} y={pose.y - 600} r={280} t={t} n={22} />
      <Confetti t={t} x0={300} y0={-300} w={1300} h={1100} n={30} seed={9} o={0.9} />
    </g>
  );
};

// ---------- B29: the card lies on a dark table under one lamp: a crack runs across it, a glitch tears the picture ----------
export const B29: React.FC<ShotProps> = ({ t, len }) => {
  const gl = t >= 30 && t < 44 ? (t % 3 === 0 ? 1 : 0.5) : 0;
  const slice = (i: number) => (gl > 0 ? Math.sin(t * 7 + i * 2.1) * 34 * gl * (rnd(t, i) > 0.4 ? 1 : 0) : 0);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <rect x={-300} y={-300} width={2600} height={1700} fill="#17121E" />
      <rect x={-300} y={420} width={2600} height={900} fill="#2E2230" />
      <rect x={-300} y={420} width={2600} height={8} fill="#6A4A5A" />
      <Glow x={960} y={500} r={900} o={0.35} />
      <ellipse cx={960} cy={780} rx={560} ry={60} fill="#000" opacity={0.4} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={i} transform={`translate(${slice(i)} 0)`}>
          <clipPath id={`b29c${i}`}><rect x={0} y={150 + i * 130} width={1920} height={130} /></clipPath>
          <g clipPath={`url(#b29c${i})`}>
            <BlackCard x={960} y={560} s={2.3} rot={-4} />
            <DrawOn d="M 880 330 L 940 480 L 900 560 L 1000 700 L 960 800 M 940 480 L 1060 520 L 1040 600" t={t - 26} dur={8} color="#FFE7A0" width={7} />
          </g>
        </g>
      ))}
      {gl > 0 ? <rect x={0} y={0} width={1920} height={1080} fill="#FF4A4A" opacity={0.08 * gl} /> : null}
      {gl > 0 ? [0, 1, 2].map((i) => <rect key={`s${i}`} x={0} y={120 + rnd(t, i) * 800} width={1920} height={6 + rnd(t, i + 5) * 14} fill="#7FE8FF" opacity={0.25} />) : null}
      <rect x={-300} y={-300} width={2600} height={1700} fill="#05030A" opacity={0.25} />
    </g>
  );
};

// ---------- B30: close-up: the smile drops, the confetti stops and drifts, the sky goes red ----------
export const B30: React.FC<ShotProps> = ({ t, len }) => {
  const red = clamp((t - 14) / 40);
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 880, scale: 2.7, yaw: 0.2, look: 0.2, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: 3 } },
    { f: 26, p: { headTilt: 0, look: 0.0 } },
    { f: 48, p: { headTilt: -4, look: -0.5 } },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 360], [len, 380]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
      <g filter="url(#blur16)"><Rooftop t={t + 340} sunX={1380} sunY={kf(t, [[0, 560], [len, 700]])} red={red} /></g>
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [14, 'neutral'], [26, 'worried']]) }} rimId={red > 0.4 ? 'rimRed' : 'rimR'} shadow={0} />
      <g opacity={1 - clamp((t - 10) / 30)}><ConfettiHalo x={960} y={pose.y - 600 + t * 2} r={280} t={t * 0.4} n={22} /></g>
      <Confetti t={t * 0.35} x0={300} y0={-300} w={1300} h={1100} n={24} seed={9} o={clamp(1 - (t - 8) / 30) * 0.7 + 0.1} />
      <rect x={-300} y={-300} width={2600} height={1700} fill="#12040A" opacity={0.35 * red} />
    </g>
  );
};
