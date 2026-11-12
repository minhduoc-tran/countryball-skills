import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, Classroom, SchoolDesk, Sparkle, Glow, Dust, Foreground, Kid, KIDS,
  PasteIn, ShotProps,
} from '../../engine';
import { SchoolFacade, LibraryWall, Pitch, CinemaDoors, CinemaHall } from './chb-school-and-cinema-props';
import { FreeTicket } from './chb-food-and-family-props';

// Chapter B, the fun part (3/5): the old school made new (facade wipe, a cool bright classroom, a library filling up, a
// striped pitch), then the cinema doors open for the whole school and the hall is full of laughing classmates.

const PIP = LOOKS.pipHood;

// ---------- B10: wide, the old grey school gets painted new from left to right, Pip small in front with open arms ----------
export const B10: React.FC<{ t: number; len: number }> = ({ t, len }) => {
  const wipe = kf(t, [[4, 0], [40, 1]], (v) => v);
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 770, scale: 0.72, yaw: 0.1, look: 0.3, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 10, p: { armL: { a: 110, b: 10 }, armR: { a: 110, b: 10 }, squash: -0.05 }, ease: easeOut },
    { f: 40, p: { squash: 0 } },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 600]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
      <SchoolFacade t={t} wipe={wipe} id="b10" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [12, 'happy']]) }} rimId="rimR" shadow={0} />
      {wipe >= 1 ? <Sparkle x={1500} y={430} t={t - 40} s={1} /> : null}
      <Sparkle x={660} y={500} t={t - 24} s={0.9} />
    </g>
  );
};

// ---------- B11: medium, the classroom made new and bright: a cool breeze, Pip at his desk smiling ----------
export const B11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 1060]]), 560, kf(t, [[0, 1.2], [len, 1.4]]))}>
    <Classroom t={t + 50} empty board={<g />} id="b11cls" />
    <rect x={300} y={130} width={1200} height={590} fill="#FFF3D0" opacity={0.22} style={{ mixBlendMode: 'screen' }} />
    <rect x={300} y={130} width={1200} height={590} fill="#FFFFFF" opacity={0.0} />
    {/* the new air-con on the back wall, breeze streaks and frost flakes */}
    <g transform="translate(1180 190)">
      <rect x={-110} y={-26} width={220} height={52} rx={14} fill="#F6F6F8" stroke="#9A9AA8" strokeWidth={3} />
      <rect x={-92} y={8} width={184} height={8} rx={4} fill="#B9BDC8" />
      {Array.from({ length: 7 }).map((_, i) => {
        const p = (((t * 0.03 + i / 7) % 1) + 1) % 1;
        return <path key={i} d={`M ${-80 + i * 26} ${28 + p * 150} q 8 14 0 28`} stroke="#BFE8FF" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7 * Math.sin(p * Math.PI)} />;
      })}
    </g>
    <SchoolDesk x={1000} />
    <Hero look={PIP} pose={{ ...poseAt(t, [{ f: 0, p: { x: 1180, y: 700, scale: 0.9, yaw: -0.35, look: -0.3, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: 3 } }, { f: 24, p: { headTilt: -3, look: 0.2 } }]), ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
    <Dust t={t} seed={44} x0={500} y0={200} w={900} h={400} n={20} o={0.5} />
  </g>
);

// ---------- B12: insert: the library wall, books popping onto the shelves in a rush ----------
export const B12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 900]]), 560, kf(t, [[0, 1.0], [len, 1.18]]))}>
    <LibraryWall t={t} n={t * 5} />
    <Sparkle x={1500} y={300} t={t - 14} s={1.1} />
    <Foreground blur={10}><rect x={-100} y={1000} width={2200} height={300} fill="#1A100A" /></Foreground>
  </g>
);

// ---------- B13: wide, the new striped pitch: Pip kicks, the ball sails into the goal ----------
export const B13: React.FC<ShotProps> = ({ t, len }) => {
  const kick = poseAt(t, [
    { f: 0, p: { x: 1260, y: 760, scale: 1.1, yaw: -0.6, facing: -1, look: -0.5, legL: { a: 6, b: 0 }, legR: { a: -30, b: 40 }, armL: { a: -20, b: 10 }, armR: { a: 40, b: 10 } } },
    { f: 8, p: { legR: { a: 70, b: -10 }, tilt: -6, armL: { a: 60, b: 10 }, armR: { a: -40, b: 10 } }, ease: easeOut },
    { f: 22, p: { legR: { a: 10, b: 0 }, tilt: 0, armL: { a: 150, b: 10 }, armR: { a: 150, b: 10 } } },
  ]);
  return (
    <g transform={camT(960, 620, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Pitch t={Math.max(0, t - 6)} id="b13" />
      <Hero look={PIP} pose={{ ...kick, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
      {t > 20 ? <Sparkle x={960} y={380} t={t - 20} s={1.1} /> : null}
    </g>
  );
};

// ---------- B14: the cinema doors swing open: Pip pushes them, light floods out, classmates' silhouettes behind ----------
export const B14: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 800, scale: 0.9, yaw: 0, look: 0, armL: { a: 80, b: 6 }, armR: { a: 80, b: 6 }, squash: 0.05 } },
    { f: 12, p: { armL: { a: 130, b: 10 }, armR: { a: 130, b: 10 }, squash: -0.05 }, ease: easeOut },
    { f: 36, p: { armL: { a: 150, b: 10 }, armR: { a: 150, b: 10 }, squash: 0 } },
  ]);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.2]]))}>
      <CinemaDoors t={t} open={(t - 6) / 20} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} opacity={clamp((t - 18 - i * 3) / 6)}>
          <Kid x={640 + i * 210 + (i > 1 ? 80 : 0)} y={660} s={0.5} look={KIDS[i]} turn={0} laugh={1} t={t + i * 4} />
        </g>
      ))}
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Sparkle x={960} y={330} t={t - 14} s={1.2} />
    </g>
  );
};

// ---------- B15: the hall full of classmates laughing; a MIỄN PHÍ ticket slams in over it ----------
export const B15: React.FC<ShotProps> = ({ t, len }) => {
  const k = Math.max(0, t - 32);
  const s = k <= 0 ? 0 : 1 + (1 - easeOut(clamp(k / 6))) * 0.8;
  return (
    <g>
      <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.16]]))}>
        <CinemaHall t={t} laugh={1} />
      </g>
      {k > 0 ? (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#0A0610" opacity={0.38 * clamp(k / 4)} />
          <g transform={`translate(960 560) scale(${s * 1.5})`}><FreeTicket x={0} y={0} rot={-5} /></g>
          <Sparkle x={620} y={420} t={k - 2} s={1} />
          <Sparkle x={1320} y={700} t={k - 5} s={1} />
        </g>
      ) : null}
    </g>
  );
};
