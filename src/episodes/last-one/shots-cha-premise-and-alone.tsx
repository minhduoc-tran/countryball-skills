import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Glow, Dust, Street, streetStand, CrossroadsTop, BedDuvet, bedTop, ShotProps,
} from '../../engine';
import { PopulationCountdown } from './shots-reusable-from-short-cut';
import { DawnBedroom } from './shots-cha-morning-bedroom';

// Chapter A, the premise: "Hơn tám tỷ người, biến mất sau một đêm" (the population schematic, retimed to the line),
// "Không tiếng động, không dấu vết" (the bed with its duvet still shaped, a pair of slippers by a door), and "Chỉ còn
// mình bạn" (Pip alone in the middle of the street, the camera rising until the city is a map under him).

const PIP = LOOKS.pipHood;

// ---------- A43: the schematic: 8.200.000.000 people, then the crowd blinks out to one. Retimed: the label and the full
// number sit for "Hơn tám tỷ người", the blink-out runs through "biến mất sau một đêm" ----------
export const A43: React.FC<ShotProps> = ({ t, len }) => {
  const warp = kf(t, [[0, 0], [34, 7], [len - 4, 58], [len, 60]], (v) => v);
  return <PopulationCountdown t={warp} len={len} f={0} />;
};

// ---------- A44: the empty bed: the duvet still lying in the shape of someone's knees, the pillow dented, morning in the window ----------
export const A44: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 760], [len, 740]]), kf(t, [[0, 640], [len, 620]]), kf(t, [[0, 2.0], [len, 2.25]]))}>
    <DawnBedroom t={t + 140} id="pr44" duvet={false} clock="07:00" />
    <BedDuvet knees={1.5} kneeU={0.22} />
    {/* the dent in the pillow, and the shape of a body under the sheet's far edge */}
    {(() => {
      const p = bedTop(0.2, 0.09);
      return <ellipse cx={p.x} cy={p.y - 26} rx={74} ry={13} fill="#B8B0A0" opacity={0.7} />;
    })()}
  </g>
);

// ---------- A45: a pair of slippers by a door, a line of morning light under it, dust turning in the light ----------
export const A45: React.FC<ShotProps> = ({ t, len }) => {
  const slipper = (x: number, y: number, r: number, k: number) => (
    <g transform={`translate(${x} ${y}) rotate(${r})`} key={k}>
      <ellipse cx={8} cy={10} rx={150} ry={26} fill="#000" opacity={0.4} />
      <path d="M -140 0 Q -150 -50 -70 -64 Q 40 -78 120 -34 Q 156 -10 140 10 Q 100 26 -20 24 Q -120 24 -140 0 Z" fill="#D98A8A" />
      <path d="M -140 0 Q -120 24 -20 24 Q 100 26 140 10 Q 146 0 142 -6 Q 100 10 -20 8 Q -110 6 -140 0 Z" fill="#B96A6E" />
      <path d="M -100 -44 Q 0 -78 110 -30" stroke="#FFD9C0" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7} />
      <path d="M -60 -50 Q -10 -90 40 -56 Q -10 -34 -60 -50 Z M 40 -56 Q 80 -88 120 -46 Q 80 -30 40 -56 Z" fill="#F2C0B8" transform="translate(0 -4)" />
      <circle cx={40} cy={-58} r={11} fill="#B96A6E" />
    </g>
  );
  const shimmer = 0.5 + 0.1 * Math.sin(t / 6);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), kf(t, [[0, 600], [len, 620]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <rect x={-300} y={-300} width={2520} height={1700} fill="#2E2630" />
      {/* the door: planks, a frame, a gap along the floor with light coming under it */}
      <rect x={380} y={-60} width={1160} height={780} fill="#6A4A3A" />
      {[480, 700, 920, 1140, 1360].map((x) => <path key={x} d={`M ${x} -60 V 720`} stroke="#4E362B" strokeWidth={6} />)}
      <rect x={380} y={-60} width={1160} height={20} fill="#4E362B" />
      <rect x={380} y={-60} width={14} height={780} fill="#FFB46A" opacity={0.35} />
      <circle cx={1440} cy={360} r={22} fill="#C9A46A" />
      <rect x={1432} y={360} width={16} height={60} rx={6} fill="#C9A46A" />
      <rect x={380} y={720} width={1160} height={26} fill="#FFE2B0" opacity={shimmer + 0.4} />
      <polygon points="380,746 1540,746 1700,1000 220,1000" fill="#FFD9A0" opacity={0.22 * shimmer * 2} style={{ mixBlendMode: 'screen' }} />
      {/* floorboards */}
      <rect x={-300} y={746} width={2520} height={700} fill="#4A3636" />
      <rect x={-300} y={746} width={2520} height={8} fill="#FFB46A" opacity={0.3} />
      {[900, 800, 700].map((y, i) => <path key={i} d={`M -300 ${y + 120} H 2220`} stroke="#3A2A2A" strokeWidth={4} opacity={0.6} />)}
      {slipper(640, 900, -6, 0)}
      {slipper(930, 940, 5, 1)}
      <Glow x={960} y={760} r={700} o={0.35} />
      <Dust t={t} seed={61} x0={380} y0={480} w={1160} h={500} n={30} o={0.7} />
    </g>
  );
};

// ---------- A46: "Chỉ còn mình bạn": Pip alone in the middle of the street; the camera rises, tilts down, the street becomes a map ----------
export const A46: React.FC<ShotProps> = ({ t, len }) => {
  const s = streetStand(0, 11);
  const pose = poseAt(t, [
    { f: 0, p: { x: s.x, y: s.y, scale: s.scale, yaw: 0, look: 0, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 20, p: { yaw: -0.4, look: -0.8, headTilt: -3 }, ease: easeOut },
    { f: 40, p: { yaw: 0.4, look: 0.8, headTilt: 3 }, ease: easeOut },
  ]);
  const rise = easeOut(clamp(t / len));
  const fade = clamp((t - 14) / (len - 18));
  return (
    <g>
      <g opacity={1 - fade * 0.0}>
        <g transform={`translate(960 ${kf(t, [[0, 640], [len, 350]])}) scale(${kf(t, [[0, 1.5], [len, 0.62]])}) translate(-960 -${s.y + 210})`}>
          <Street t={t + 200} id="st46" />
          <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [24, 'worried']]) }} rimId="rimR" shadow={0} />
        </g>
      </g>
      {/* the rise: the crossing seen from straight above fades in over the street, Pip a tiny dark dot at its centre */}
      <g opacity={fade * fade}>
        <g transform={`translate(960 540) scale(${1.12 - 0.12 * rise}) translate(-960 -540)`}>
          <CrossroadsTop t={t + 60} id="xr46" />
          <Glow x={960} y={560} r={130} o={0.45} />
          <ellipse cx={986} cy={578} rx={36} ry={13} fill="#000" opacity={0.38} transform="rotate(28 986 578)" />
          <ellipse cx={960} cy={560} rx={34} ry={17} fill="#3A3660" stroke="#FFB46A" strokeWidth={3} />
          <ellipse cx={960} cy={559} rx={13} ry={11} fill="#4A4670" stroke="#14121A" strokeWidth={2.5} />
        </g>
      </g>
    </g>
  );
};
