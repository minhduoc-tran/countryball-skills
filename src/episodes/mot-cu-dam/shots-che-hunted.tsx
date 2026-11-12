import React from 'react';
import {
  Hero, Pose, basePose, kf, clamp, easeOut, camT, LEG_LEN, Street, walkPose, FONT, ShotProps, Glow, faceAt,
} from '../../engine';
import { Gate, Drone, PIP } from './che-props-suit-and-drone';

// Chapter E, beat "hunted" (E9-E14): a small black drone follows Pip to school, the market, home, every day.
// E9/E12/E14 show the drone hovering behind him; E10 is the drone close-up; E11/E13 are the drone's own camera feed
// (the "watched" look adds the REC overlay).

const GROUND = 800;
const WALK_SCALE = 0.72;

/** Pip walking side-on; `x` is the hip x. */
const PipWalk: React.FC<{ t: number; x: number; ground?: number; scale?: number; face?: 'neutral' | 'tired' | 'worried'; facing?: 1 | -1 }> = ({ t, x, ground = GROUND, scale = WALK_SCALE, face = 'neutral', facing = 1 }) => {
  const pose: Pose = { ...walkPose(x, t * 0.5, ground, scale, { look: 0.4 * facing }, facing), ...faceAt(t, [[0, face]]) };
  return <Hero look={PIP} pose={pose} rimId={facing > 0 ? 'rimR' : 'rimL'} shadow={0.5} />;
};

/** The drone's targeting brackets around a point, with a tag. */
const Lock: React.FC<{ x: number; y: number; w: number; h: number; t: number; tag: string }> = ({ x, y, w, h, t, tag }) => {
  const c = clamp(t / 6);
  const g = 18 + (1 - c) * 60;
  const arm = 46;
  const corner = (sx: number, sy: number) => <path d={`M ${x + sx * (w / 2 + g)} ${y + sy * (h / 2 + g) - sy * arm} V ${y + sy * (h / 2 + g)} H ${x + sx * (w / 2 + g) - sx * arm}`} stroke="#FF4A3A" strokeWidth={6} fill="none" />;
  return (
    <g opacity={c}>
      {corner(1, 1)}{corner(-1, 1)}{corner(1, -1)}{corner(-1, -1)}
      <rect x={x - 100} y={y - h / 2 - g - 62} width={200} height={44} rx={8} fill="#FF4A3A" />
      <text x={x} y={y - h / 2 - g - 30} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#fff" letterSpacing={3}>{tag}</text>
    </g>
  );
};

// ---------- E9: Pip walks the street; a drone slides into frame behind him and locks on ----------
export const E9: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 520], [len, 1180]], (v) => v);
  return (
    <g transform={camT(kf(t, [[0, 800], [len, 1100]]), 560, 1.35)}>
      <Street t={t + 20} id="e9s" veil={0.2} />
      <Drone x={kf(t, [[0, 100], [24, x - 330]], easeOut)} y={kf(t, [[0, 260], [24, 400]], easeOut)} s={0.55} t={t} tilt={8} />
      <PipWalk t={t} x={x} />
    </g>
  );
};

// ---------- E10: close-up of the drone: its lens turns to the camera, the red light blinks ----------
export const E10: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -200) scale(1.5)"><Street t={t} id="e10s" veil={0.2} /></g>
      </g>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#0A0A14" opacity={0.25} />
      <Glow x={960} y={600} r={620} o={0.25} />
      <Drone x={960} y={kf(t, [[0, 520], [len, 480]])} s={kf(t, [[0, 2.2], [len, 2.9]])} t={t} tilt={Math.sin(t / 14) * 3} />
    </g>
  );
};

/** A drone-camera shot of Pip walking: slight tilt and a lock-on tag (use with the "watched" look). */
const Pov: React.FC<{ t: number; len: number; id: string; tag: string; children: React.ReactNode }> = ({ t, len, id, tag, children }) => {
  const x = kf(t, [[0, 560], [len, 1040]], (v) => v);
  return (
    <g transform={`translate(960 540) rotate(${Math.sin(t / 20) * 1.2}) scale(${kf(t, [[0, 1.25], [len, 1.4]])}) translate(-960 -540)`}>
      {children}
      <PipWalk t={t} x={x} />
      <Lock x={x} y={GROUND - 150} w={150} h={300} t={t} tag={tag} />
    </g>
  );
};

// ---------- E11: drone POV: Pip walks to school (a banner over the gate) ----------
export const E11: React.FC<ShotProps> = ({ t, len }) => (
  <Pov t={t} len={len} id="e11" tag="MỤC TIÊU">
    <Street t={t + 40} id="e11s" veil={0.15} />
    <g transform="translate(960 250)">
      <rect x={-330} y={-40} width={660} height={90} rx={12} fill="#14472E" stroke="#E9E4D0" strokeWidth={6} />
      <text x={0} y={25} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={60} fill="#E9E4D0" letterSpacing={10}>TRƯỜNG</text>
      <path d="M -300 50 V 260 M 300 50 V 260" stroke="#6B7080" strokeWidth={10} />
    </g>
  </Pov>
);

// ---------- E12: the market: Pip among the stalls, the drone hovering behind and above him ----------
export const E12: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 640], [len, 1000]], (v) => v);
  return (
    <g transform={camT(kf(t, [[0, 760], [len, 960]]), 560, 1.4)}>
      <Street t={t + 60} id="e12s" market={1} veil={0.2} />
      <Drone x={x - 280 + Math.sin(t / 9) * 12} y={400} s={0.5} t={t} tilt={10} />
      <PipWalk t={t} x={x} />
    </g>
  );
};

// ---------- E13: drone POV: Pip turns into his gate and goes home ----------
export const E13: React.FC<ShotProps> = ({ t, len }) => (
  <Pov t={t} len={len} id="e13" tag="MỤC TIÊU">
    <Street t={t + 80} id="e13s" veil={0.15} />
    <Gate x={1150} y={GROUND + 6} s={0.6} />
  </Pov>
);

// ---------- E14: "every day": three panels (morning, noon, night) slide in, same walk, same drone ----------
const Panel: React.FC<{ t: number; x0: number; w: number; sky: string; tint: string; ground: string; seed: number }> = ({ t, x0, w, sky, tint, ground, seed }) => (
  <g>
    <clipPath id={`e14c${seed}`}><rect x={x0} y={0} width={w} height={1080} /></clipPath>
    <g clipPath={`url(#e14c${seed})`}>
      <rect x={x0} y={0} width={w} height={1080} fill={sky} />
      <rect x={x0} y={780} width={w} height={300} fill={ground} />
      <rect x={x0} y={0} width={w} height={1080} fill={tint} opacity={0.18} />
      <circle cx={x0 + w * 0.7} cy={seed === 2 ? 170 : 260} r={seed === 2 ? 60 : 90} fill={seed === 2 ? '#F4F1D8' : '#FFE9A8'} opacity={0.9} />
      <Drone x={x0 + w * 0.3 + Math.sin(t / 8 + seed) * 10} y={400} s={0.42} t={t + seed * 5} tilt={8} />
      <PipWalk t={t + seed * 9} x={x0 + w * 0.62} ground={900} scale={0.9} face={seed === 2 ? 'tired' : 'neutral'} />
    </g>
    <rect x={x0} y={0} width={4} height={1080} fill="#0B0816" />
  </g>
);
export const E14: React.FC<ShotProps> = ({ t, len }) => {
  const w = 640;
  const slide = (i: number) => easeOut(clamp((t - i * 12) / 14));
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B0816" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(0 ${(1 - slide(i)) * -1080})`}>
          <Panel t={t} x0={i * w} w={w} sky={['#F2C88E', '#8CC8F0', '#1A2038'][i]} tint={['#FF8A5A', '#FFFFFF', '#2A3A8A'][i]} ground={['#6B5A48', '#7A6A54', '#242838'][i]} seed={i} />
        </g>
      ))}
    </g>
  );
};
