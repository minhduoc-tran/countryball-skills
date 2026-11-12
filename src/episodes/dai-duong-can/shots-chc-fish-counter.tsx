import React from 'react';
import { Hero, Pose, basePose, faceAt, kf, clamp, easeOut, camT, LOOKS, Foreground, ShotProps, joints, toWorld, shake } from '../../engine';
import { FishStall, StallFront, StallSign } from './chc-fish-stall';

// Chapter C, beat "5 economy" end (149.99-154.84 s): C21 mum before the empty fish counter, C22 close on the empty ice tray as a blank
// sign drops in, C23 the sign flips: HẾT HÀNG.

const MOM = LOOKS.mom;

const Basket: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} strokeLinejoin="round">
    <path d="M -46 -56 Q 0 -120 46 -56" fill="none" stroke="#14121A" strokeWidth={9} /><path d="M -46 -56 Q 0 -120 46 -56" fill="none" stroke="#B98A4E" strokeWidth={5} />
    <path d="M -58 -50 L 58 -50 L 46 20 Q 0 32 -46 20 Z" fill="#C99A5A" stroke="#14121A" strokeWidth={5} />
    {[-30, -10, 10, 30].map((dx) => <path key={dx} d={`M ${dx} -46 V 22`} stroke="#8F6733" strokeWidth={3} opacity={0.7} />)}
  </g>
);

// ---------- C21: mum stands before the empty fish counter, basket on her arm, shoulders sag ----------
export const C21: React.FC<ShotProps> = ({ t, len }) => {
  const S = 1.55;
  const droop = easeOut(clamp((t - 8) / 26));
  const pose: Pose = { ...basePose, x: 560, y: 975 - 138 * S, scale: S, yaw: 0.6, facing: 1, look: 0.9, headTilt: 3 + droop * 8, tilt: droop * 3, armL: { a: 8, b: 4 }, armR: { a: 12, b: 6 }, ...faceAt(t, [[0, 'worried'], [30, 'tired']]) };
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 880]]), 590, kf(t, [[0, 1.0], [len, 1.14]]))}>
      <FishStall id="c21f" t={t} />
      <Hero look={MOM} pose={pose} rimId="rimR" shadow={0} />
      <Basket x={hand.x + 4} y={hand.y + 40} />
      <StallFront />
      <Foreground blur={10}><rect x={-60} y={-100} width={150} height={1300} fill="#2A1A10" opacity={0.85} /></Foreground>
    </g>
  );
};

// ---------- C22: close on the empty ice tray, meltwater drips; a blank sign swings down into frame ----------
export const C22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1400, 700, kf(t, [[0, 2.0], [len, 2.2]]))}>
    <FishStall id="c22f" t={t} />
    <StallFront />
    {[0, 1].map((i) => {
      const ph = ((t + i * 14) % 28) / 28;
      return <ellipse key={i} cx={1250 + i * 340} cy={800 + ph * 90} rx={7} ry={11} fill="#BFE6FF" opacity={1 - ph * 0.5} />;
    })}
    <StallSign x={1400} y={640} t={t} drop={t / 14} flip={0} />
  </g>
);

// ---------- C23: the sign turns over: HẾT HÀNG, it slams and the frame shudders ----------
export const C23: React.FC<ShotProps> = ({ t, len }) => {
  const sh = shake(t, 10, 10, 12);
  const flip = clamp((t - 2) / 8);
  const pulse = t > 12 ? 1 + 0.03 * Math.sin(t / 3) : 1;
  return (
    <g transform={`translate(${sh.x} ${sh.y}) ${camT(1400, 650, kf(t, [[0, 2.3], [len, 2.5]]))}`}>
      <FishStall id="c23f" t={t} />
      <StallFront />
      <g transform={`translate(1400 650) scale(${pulse}) translate(-1400 -650)`}><StallSign x={1400} y={650} t={t + 20} drop={1} flip={flip} /></g>
      {t >= 10 && t < 21 ? <circle cx={1400} cy={650} r={(t - 10) * 36} fill="none" stroke="#D9453A" strokeWidth={14 * (1 - (t - 10) / 11)} opacity={1 - (t - 10) / 11} /> : null}
    </g>
  );
};
